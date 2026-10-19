export const defaultLocale = "en";
export const locales = ["en", "ur"];

export function normalizeLocale(value) {
  return locales.includes(value) ? value : defaultLocale;
}

export const translations = {
  en: {
    brand: { name: "Tehreek Jawanan Pakistan", short: "TJP", country: "PAKISTAN", home: "TJP home" },
    navigation: { home: "Home", about: "About us", focus: "Our focus" },
    common: {
      skip: "Skip to content", mainNavigation: "Main navigation", footerNavigation: "Footer navigation",
      mobileNavigation: "Mobile navigation", openMenu: "Open navigation", closeMenu: "Close navigation",
      menuDescription: "Explore Tehreek Jawanan Pakistan.", language: "Choose language",
      english: "English", urdu: "اردو", switchToUrdu: "Switch to Urdu", switchToEnglish: "Switch to English",
      explore: "Discover TJP", backToTop: "Back to top", login: "Login", backHome: "Back to home",
    },
    home: {
      eyebrow: "TEHREEK JAWANAN PAKISTAN",
      secondaryAction: "Our focus", scroll: "Discover our story",
      carousel: {
        label: "Discover Pakistan", role: "carousel", slide: "slide", previous: "Previous slide", next: "Next slide",
        pause: "Pause slideshow", play: "Play slideshow", goTo: "Go to slide", hint: "Swipe or scroll sideways to explore",
      },
      slides: [
        { location: "ISLAMABAD", title: "Our Pakistan.", accent: "Our shared future.", description: "A shared home. A new conversation. A future we shape together.", alt: "Faisal Mosque framed by the Margalla Hills in Islamabad" },
        { location: "LAHORE", title: "Rooted in heritage.", accent: "Looking ahead.", description: "Honouring where we come from. Exploring where we go next.", alt: "The courtyard and domes of Badshahi Mosque in Lahore" },
        { location: "HUNZA", title: "A land of possibility.", accent: "A future to shape.", description: "From our valleys to our cities, every voice has a place.", alt: "Hunza Valley surrounded by the mountains of northern Pakistan" },
        { location: "KARACHI", title: "Many voices.", accent: "One Pakistan.", description: "Different stories. Shared hopes. One country to call home.", alt: "The white marble Mazar-e-Quaid in Karachi" },
      ],
      about: {
        eyebrow: "ABOUT US", title: "A shared purpose.\nA stronger Pakistan.",
        description: "Tehreek Jawanan Pakistan brings Pakistan’s voices and aspirations into one conversation. Explore ideas, community, and the possibilities of a shared tomorrow.",
        note: "Our country. Our responsibility.", name: "Abdullah Gul", imageAlt: "Portrait of Abdullah Gul", link: "Explore our focus",
      },
      focus: {
        eyebrow: "LOOKING AHEAD", title: "Ideas that bring us together.",
        description: "A conversation about opportunity, community, and our shared future.",
        items: [
          { number: "01", title: "Youth & opportunity", description: "Space to learn, contribute, and shape the future." },
          { number: "02", title: "Stronger communities", description: "People connecting through participation and shared purpose." },
          { number: "03", title: "A shared tomorrow", description: "Ideas for our country and the generations to come." },
        ],
      },
    },
    login: { eyebrow: "MEMBER ACCESS", title: "Member login", description: "Online sign-in is currently unavailable.", note: "Please check back for updates." },
    footer: {
      title: "Our Pakistan. Our shared future.", description: "A shared home. A shared responsibility.",
      explore: "Explore", language: "Stay connected", languageDescription: "Your language. Your voice.",
      rights: "TJP. All rights reserved.", madeFor: "For Pakistan. For tomorrow.", credits: "Photo credits",
      photoLicense: "CC BY-SA 4.0", photoChanges: "Resized, converted to WebP, and cropped for display. No endorsement implied.",
    },
  },
  ur: {
    brand: { name: "تحریکِ جوانان پاکستان", short: "ٹی جے پی", country: "پاکستان", home: "ٹی جے پی کا مرکزی صفحہ" },
    navigation: { home: "مرکزی صفحہ", about: "ہمارا تعارف", focus: "ہماری توجہ" },
    common: {
      skip: "مرکزی مواد پر جائیں", mainNavigation: "مرکزی نیویگیشن", footerNavigation: "فوٹر نیویگیشن",
      mobileNavigation: "موبائل نیویگیشن", openMenu: "مینو کھولیں", closeMenu: "مینو بند کریں",
      menuDescription: "تحریکِ جوانان پاکستان کے بارے میں جانیں۔", language: "زبان منتخب کریں",
      english: "English", urdu: "اردو", switchToUrdu: "اردو میں دیکھیں", switchToEnglish: "انگریزی میں دیکھیں",
      explore: "ٹی جے پی کو جانیں", backToTop: "صفحے کے آغاز پر جائیں", login: "لاگ اِن", backHome: "مرکزی صفحے پر جائیں",
    },
    home: {
      eyebrow: "تحریکِ جوانان پاکستان", secondaryAction: "ہماری توجہ", scroll: "ہماری کہانی جانیں",
      carousel: {
        label: "پاکستان کو جانیں", role: "تصویری سلسلہ", slide: "تصویر", previous: "پچھلی تصویر", next: "اگلی تصویر",
        pause: "تصاویر کی خودکار تبدیلی روکیں", play: "تصاویر کی خودکار تبدیلی چلائیں", goTo: "تصویر پر جائیں", hint: "دریافت کرنے کے لیے دائیں یا بائیں سوائپ کریں",
      },
      slides: [
        { location: "اسلام آباد", title: "ہمارا پاکستان۔", accent: "ہمارا مشترکہ مستقبل۔", description: "مشترکہ وطن۔ نئی گفتگو۔ ایک مستقبل جسے ہم مل کر سنواریں۔", alt: "اسلام آباد میں مارگلہ کی پہاڑیوں کے دامن میں فیصل مسجد" },
        { location: "لاہور", title: "ورثے سے وابستہ۔", accent: "مستقبل کی جانب۔", description: "اپنی پہچان کا احترام۔ آنے والے کل کے نئے امکانات۔", alt: "لاہور میں بادشاہی مسجد کا صحن اور گنبد" },
        { location: "ہنزہ", title: "امکانات کی سرزمین۔", accent: "مستقبل کی تعمیر۔", description: "وادیوں سے شہروں تک، ہر آواز کی اپنی جگہ ہے۔", alt: "شمالی پاکستان کے پہاڑوں میں گھری وادیٔ ہنزہ" },
        { location: "کراچی", title: "مختلف آوازیں۔", accent: "ایک پاکستان۔", description: "مختلف کہانیاں۔ مشترکہ امیدیں۔ ایک وطن، ہمارا گھر۔", alt: "کراچی میں سفید سنگِ مرمر سے بنا مزارِ قائد" },
      ],
      about: {
        eyebrow: "ہمارا تعارف", title: "مشترکہ مقصد۔\nمضبوط پاکستان۔",
        description: "تحریکِ جوانان پاکستان، پاکستان کی آوازوں اور امنگوں کو ایک گفتگو میں یکجا کرتی ہے۔ خیالات، برادری اور مشترکہ مستقبل کے امکانات کو جانیں۔",
        note: "ہمارا وطن۔ ہماری ذمہ داری۔", name: "عبداللہ گل", imageAlt: "عبداللہ گل کی تصویر", link: "ہماری توجہ کے بارے میں جانیں",
      },
      focus: {
        eyebrow: "مستقبل کی جانب", title: "وہ خیالات جو ہمیں یکجا کریں۔",
        description: "مواقع، برادری اور مشترکہ مستقبل پر ایک گفتگو۔",
        items: [
          { number: "۰۱", title: "نوجوان اور مواقع", description: "سیکھنے، کردار ادا کرنے اور مستقبل سنوارنے کی جگہ۔" },
          { number: "۰۲", title: "مضبوط برادریاں", description: "شرکت اور مشترکہ مقصد سے جڑتے لوگ۔" },
          { number: "۰۳", title: "ایک مشترکہ کل", description: "وطن اور آنے والی نسلوں کے لیے خیالات۔" },
        ],
      },
    },
    login: { eyebrow: "اراکین کے لیے", title: "اراکین کا لاگ اِن", description: "آن لائن لاگ اِن فی الحال دستیاب نہیں ہے۔", note: "تازہ معلومات کے لیے دوبارہ ملاحظہ کریں۔" },
    footer: {
      title: "ہمارا پاکستان۔ ہمارا مشترکہ مستقبل۔", description: "مشترکہ وطن۔ مشترکہ ذمہ داری۔",
      explore: "دریافت کریں", language: "رابطے میں رہیں", languageDescription: "آپ کی زبان۔ آپ کی آواز۔",
      rights: "ٹی جے پی۔ جملہ حقوق محفوظ ہیں۔", madeFor: "پاکستان کے لیے۔ آنے والے کل کے لیے۔", credits: "تصاویر کے حوالہ جات",
      photoLicense: "CC BY-SA 4.0", photoChanges: "حجم تبدیل کیا گیا، ویب پی میں محفوظ کیا گیا اور نمائش کے لیے تراشا گیا۔ کسی تائید کا اظہار نہیں۔",
    },
  },
};
