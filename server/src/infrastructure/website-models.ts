import mongoose, { Schema } from "mongoose";

export const WebsiteEntry = mongoose.model("WebsiteEntry", new Schema({
  _id: { type: String, required: true },
  kind: { type: String, required: true, enum: ["settings", "contact", "leaders", "gallery", "menu", "pages", "favicon"] },
  data: { type: Schema.Types.Mixed, required: true },
  image: { type: Buffer, select: false },
  imageVersion: String,
  imageStorage: { type: String, enum: ["cloudinary"] },
}, { strict: "throw" }).index({ kind: 1 }));

export const ContactMessage = mongoose.model("ContactMessage", new Schema({
  _id: { type: String, required: true },
  topic: { type: String, required: true },
  privateData: { type: String, required: true },
  payloadHash: { type: String, required: true, select: false },
  createdAt: { type: Date, required: true },
  readAt: Date,
}, { strict: "throw" }).index({ createdAt: -1, _id: -1 }));
