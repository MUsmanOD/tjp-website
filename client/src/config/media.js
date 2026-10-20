// TJP assets were downloaded from its published website on 20 October 2026.
// Publication on tjp.org.pk does not place these assets under a Creative Commons license.
// Original URLs, source pages, and transformations are recorded in images/CREDITS.md.
const tjpPhoto = (src, original, source, position = "50% 35%") => ({
  src: `/images/${src}`,
  original: `https://tjp.org.pk/wp-content/uploads/${original}`,
  source: `https://tjp.org.pk/${source}`,
  credit: "tjp",
  position,
});

export const media = {
  logo: tjpPhoto("brand/tjp-logo.png", "2024/06/logo-tjp1-mini-1.png", ""),
  founder: tjpPhoto("leadership/hamid-gul.webp", "2024/06/HAMID-gul.jpg", "founder-lt-gen-hamid-gul/", "50% 20%"),
  founderArchive: tjpPhoto("leadership/hamid-gul-archive.webp", "2024/06/Wright-Hamid-Gul.jpg", "founder-lt-gen-hamid-gul/", "50% 28%"),
  founderBanner: tjpPhoto("archive/founder-banner.webp", "2024/06/banner02.jpg", "", "75% 50%"),
  chairman: tjpPhoto("leadership/abdullah-gul.webp", "2024/06/abdullah-gul.jpg", "chairman-abdullah-gul/", "50% 20%"),
  skills: tjpPhoto("archive/skills-address.webp", "2025/01/30-01-2025-Copy.jpg", "artificial-intelligence-cant-compete-human-intelligence/"),
  sports: tjpPhoto("archive/schools-sports-festival.webp", "2025/01/22jan25-2.jpg", "sports-instills-an-energetic-and-positive-mindset-along-with-health-in-children/"),
  chinaMeeting: tjpPhoto("archive/china-defence-attache-meeting.webp", "2024/07/b2de3522-14b3-45be-8226-2e40117f65ee.jpg", "china-and-pakistan-as-iron-brothers-share-common-vision-to-bring-peace-prosperity-and-happiness-in-this-region-detailed-meeting-with-gen-wang-defence-attache-of-china/"),
  barVisit: tjpPhoto("archive/central-bar-association-visit.webp", "2024/06/d1251764-39c7-45af-a766-ba1e12a8f113.jpg", "visit-to-central-bar-association-ajk/"),
  school: tjpPhoto("archive/girls-school-prize-ceremony.webp", "2024/07/060720241-t.jpg", "annual-prize-distribution-ceremony-at-mujahid-islam-general-hamid-gul-ra-school-for-orphan-girls-sargodha/"),
  book: tjpPhoto("archive/the-lost-war-invitation.webp", "2024/07/invitation-poster.jpg", "book-launch-ceremony-the-lost-war/", "50% 50%"),
  islamabad: { src: "/images/home/islamabad.webp", source: "https://commons.wikimedia.org/wiki/File:Faisal_Mosque_nestled_in_Margalla_Hills.jpg", photographer: "Shoaib Zafar", credit: "commons", position: "50% 50%" },
  lahore: { src: "/images/home/lahore.webp", source: "https://commons.wikimedia.org/wiki/File:Badshahi_Mosque_(Front_View).jpg", photographer: "Ch Humayun Hanif", credit: "commons", position: "50% 50%" },
  hunza: { src: "/images/home/hunza.webp", source: "https://commons.wikimedia.org/wiki/File:Hunza_Valley_,_The_land_of_the_Angels.jpg", photographer: "Rizwan Bhiriya (RB)", credit: "commons", position: "50% 50%" },
  karachi: { src: "/images/home/karachi.webp", source: "https://commons.wikimedia.org/wiki/File:MAZAR_E_QUAID.jpg", photographer: "Abbas jaffri.9", credit: "commons", position: "50% 50%" },
};

export const mediaCredits = Object.entries(media).map(([key, photo]) => ({ key, ...photo }));
