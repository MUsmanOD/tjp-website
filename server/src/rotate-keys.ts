import mongoose from "mongoose";
import { config } from "./config.js";
import { Membership, Admin, audit } from "./infrastructure/models.js";
import { ContactMessage } from "./infrastructure/website-models.js";
import { seal, unseal } from "./infrastructure/crypto.js";
await mongoose.connect(config.MONGODB_URI);
try {
  for await (const row of Membership.find().cursor()) {
    if (row.privateData.startsWith(config.CURRENT_KEY + ".")) continue;
    const encrypted = seal(
      unseal(row.privateData, String(row._id)),
      String(row._id),
    );
    await Membership.updateOne(
      { _id: row._id, privateData: row.privateData },
      { $set: { privateData: encrypted } },
      { timestamps: false },
    );
  }
  for await (const message of ContactMessage.find().cursor()) {
    if (message.privateData.startsWith(config.CURRENT_KEY + ".")) continue;
    const context = "contact:" + message._id;
    await ContactMessage.updateOne(
      { _id: message._id, privateData: message.privateData },
      { $set: { privateData: seal(unseal(message.privateData, context), context) } },
    );
  }
  for await (const admin of Admin.find().cursor()) {
    for (const field of ["email", "totp"] as const) {
      const value = admin[field];
      if (!value || value.startsWith(config.CURRENT_KEY + ".")) continue;
      await Admin.updateOne(
        { _id: admin._id, [field]: value },
        {
          $set: {
            [field]: seal(
              unseal(value, field === "email" ? "admin-email" : "admin-totp"),
              field === "email" ? "admin-email" : "admin-totp",
            ),
          },
        },
        { timestamps: false },
      );
    }
  }
  await audit("host", "data-key-rotation");
  console.info(
    "Key rotation completed; retain old keys until backups expire and all records are verified.",
  );
} finally {
  await mongoose.disconnect();
}
