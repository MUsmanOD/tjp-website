export const defaultLocale = "en";
export const locales = ["en", "ur"];

export function normalizeLocale(value) {
  return locales.includes(value) ? value : defaultLocale;
}

const pageCopy = {
  en: {
    announcement: { text: "A shared future starts with you.", action: "Explore membership" },
    notFound: { code: "404 · PAGE NOT FOUND", title: "Let’s find your way back.", description: "This page could not be found. Return home to keep exploring TJP." },
    social: {
      platforms: { facebook: "Facebook", x: "X", instagram: "Instagram", youtube: "YouTube" },
      pending: "Channel coming soon", unavailable: "This channel’s official link will be added once confirmed. In the meantime, find us on Facebook.",
      visitFacebook: "Visit TJP on Facebook", eyebrow: "THE CONVERSATION CONTINUES", title: "Ideas worth sharing.",
      feedTitle: "From our Facebook page", feedDescription: "Updates and conversations from TJP’s Facebook page, all in one place.", feedPrivacy: "Load the latest timeline directly from Facebook. Facebook may use cookies when the feed opens.", loadFeed: "Load Facebook posts", feedFallback: "If posts do not appear, view them directly on Facebook.",
      description: "Explore our journal, then join the conversation on our social channels.", note: "Journal highlights · not a live Facebook feed", read: "Read the story", highlight: "Journal highlight",
    },
    sections: {
      journal: { eyebrow: "THE TJP JOURNAL", title: "Fresh perspectives. Shared possibilities.", description: "Thoughts on the people, places, and ideas that connect us.", action: "Explore the journal" },
      gallery: { eyebrow: "OUR PAKISTAN, IN FOCUS", title: "One country. Countless stories.", description: "A glimpse of the places we call home, from mountain valleys to city landmarks.", action: "View the gallery" },
      participate: { eyebrow: "MAKE A CONNECTION", title: "There’s a place for your voice.", description: "Start with what matters to you. Discover a way to take part.", items: [
        { title: "Explore membership", description: "Read the membership information and prepare your interest form.", action: "Membership form" },
        { title: "Share a perspective", description: "Questions, ideas, or a conversation worth starting? Get in touch.", action: "Contact us" },
        { title: "Stay curious", description: "Read perspectives on opportunity, community, and our shared heritage.", action: "Read the journal" },
      ] },
      join: { eyebrow: "YOUR VOICE MATTERS", title: "A shared tomorrow\nstarts with us.", description: "Bring your ideas, your energy, and your hopes for Pakistan. Take the first step.", action: "Explore membership", secondary: "Let’s talk" },
    },
    journal: {
      eyebrow: "IDEAS & PERSPECTIVES", title: "The TJP journal.", description: "Room for reflection. Space for a new conversation about Pakistan.",
      all: "All stories", search: "Search the journal", searchPlaceholder: "Search stories…", empty: "No stories match your search.", reset: "Clear filters", read: "Read story", minutes: "min read", back: "Back to the journal", related: "Keep exploring", editorial: "Perspective", categoryLabel: "Filter stories by topic",
      categories: { youth: "Youth & opportunity", community: "Community", culture: "Culture & heritage" },
      articles: [
        { title: "A generation of possibility", excerpt: "Learning, listening, and making room for young people to shape the conversation.", paragraphs: [
          "A conversation about Pakistan’s future begins with the people who will live it. Young people bring questions, creativity, and an instinct to see familiar challenges from a different angle.",
          "Opportunity starts with access to learning. A practical skill, a good teacher, or a space to exchange ideas can open a door. Listening matters just as much: young people need room to explain what they experience and what they hope to change.",
          "Participation can begin close to home. Read widely, ask thoughtful questions, share a skill, or take part in a respectful discussion. Small acts of curiosity build confidence and help turn ideas into something useful.",
          "There is no single story of being young in Pakistan. Across cities, towns, and villages, different experiences deserve to be heard. Making room for those perspectives is a meaningful place to start.",
        ] },
        { title: "Community starts with us", excerpt: "The everyday connections that make a neighbourhood feel like a shared home.", paragraphs: [
          "Community is often built through ordinary moments: a neighbour checking in, someone sharing what they know, or a group making time to listen. These connections give a place its character.",
          "Before offering a solution, it helps to understand the question. What do people in a neighbourhood need? Who has not been included in the conversation? Listening carefully can reveal opportunities that a distant plan might miss.",
          "A reading circle, a shared learning session, or a conversation across generations can bring people together without requiring a grand beginning. The aim is to create space where people feel welcome to contribute.",
          "Stronger connections grow with consistency. Showing up, following through, and treating different perspectives with respect are simple habits with lasting value.",
        ] },
        { title: "The places that connect us", excerpt: "From Hunza’s mountain valleys to Lahore’s landmarks, a heritage we share.", paragraphs: [
          "Pakistan’s landscapes tell many stories. Mountain valleys, busy streets, historic courtyards, and coastal cities each offer a different view of the place we call home.",
          "Heritage is more than a landmark. It lives in languages, crafts, food, music, and the memories people pass to one another. Paying attention to those everyday expressions helps us understand one another more fully.",
          "Exploring a place begins with respect for the people who live there. Learn its history, listen to local voices, and leave the spaces you visit with care. Curiosity and consideration belong together.",
          "Our gallery is a small introduction to this variety. Each photograph offers a reason to look a little closer and discover another part of our shared home.",
        ] },
      ],
    },
    gallery: {
      eyebrow: "THE VISUAL JOURNAL", title: "A closer look at Pakistan.", description: "Places that inspire us. A shared heritage that connects us. Explore the collection.",
      all: "All photographs", heritage: "Heritage", landscapes: "Landscapes", filter: "Filter photographs", open: "Open photograph", close: "Close photograph", previous: "Previous photograph", next: "Next photograph", count: "of", credit: "Photograph", source: "View original & credits", note: "Landscape and heritage photography. Event photographs will be added when available.",
    },
    form: {
      name: "Full name", email: "Email address", phone: "Phone number", city: "City / district", province: "Province / region", choose: "Select a region", topic: "Subject", message: "Your message", interest: "Area of interest", password: "Password", confirmPassword: "Confirm password", optional: "Optional", required: "Fields marked * are required.",
      namePlaceholder: "Your full name", emailPlaceholder: "you@example.com", phonePlaceholder: "+92 300 1234567", cityPlaceholder: "Your city or district", messagePlaceholder: "Tell us what you have in mind…", passwordPlaceholder: "Online access coming soon", selectInterest: "Select an interest",
      regions: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir", "Overseas"],
      interests: ["Community participation", "Youth & learning", "Communications & media", "General membership"],
      privacy: "Your information stays on this page and is cleared when you leave. Nothing is sent or saved online.",
      selectTopic: "Select a subject", requiredError: "Please complete this field.", emailError: "Please enter a valid email address.", invalidError: "Please enter a valid value.", consentError: "Please confirm that you understand how this form works.",
    },
    contact: {
      downloadHint: "Saves a copy to your device. Nothing is sent online.",
      eyebrow: "LET’S CONNECT", title: "Let’s start a conversation.", description: "Ask a question, share an idea, or find your next step with TJP.",
      heading: "How can we help?", formDescription: "Prepare your enquiry and download a copy to keep.", addressTitle: "Visit the head office", address: "House No. 4, Lane 1, Park Road, Chak Shehzad, Islamabad, Pakistan", phoneTitle: "General enquiries", phone: "+92 300 5221884", source: "Contact details on TJP’s website", channels: "Find us online", topics: ["General enquiry", "Membership information", "Media enquiry", "Share an idea"],
      action: "Download message", note: "Online message delivery is not connected. Download a copy, then use the published contact details to reach the team.", saved: "Your message was downloaded. It has not been sent to TJP.",
      faqTitle: "A little more information", faqs: [
        { question: "How do I enquire about membership?", answer: "Open the membership page to prepare and print an interest form. Contact the team using the published details to ask about the next steps." },
        { question: "Can I browse in Urdu?", answer: "Yes. Select اردو in the header to switch the whole website, including forms and navigation, to Urdu." },
        { question: "Is my message sent through this website?", answer: "No. The form downloads a copy to your device. You can then contact the team directly. Nothing is submitted online." },
      ],
    },
    auth: {
      eyebrow: "THE TJP COMMUNITY", title: "Your voice.\nOur shared future.", description: "A place for ideas, connection, and a conversation about tomorrow.", signupTitle: "Create your account", signupDescription: "Member registration will be available here when online access opens.", loginDescription: "Welcome back. Your member space will be available here.", notice: "Online account access is not available yet. These fields are disabled and no credentials are collected.", loginAction: "Sign in · coming soon", signupAction: "Create account · coming soon", noAccount: "New here?", hasAccount: "Already have an account?", signupLink: "Explore sign up", loginLink: "Go to login", membership: "Looking for the membership form?", membershipAction: "Prepare your form", benefit: "Explore today", benefitText: "Read the journal, discover the gallery, or prepare a membership interest form.",
    },
    membership: {
      eyebrow: "TAKE THE FIRST STEP", title: "Your ideas belong\nin the conversation.", description: "Explore membership and prepare your expression of interest.", heading: "Membership interest form", descriptionForm: "Complete your details and print a copy for your records.", action: "Print completed form", notice: "This is an expression of interest, not a confirmed membership. Online applications are not open; contact the team for submission guidance.", consent: "I understand that this form is for my records and does not submit an online membership application.", stepsTitle: "A simple place to start", steps: [
        { title: "Tell us about yourself", description: "Add your contact details and the area you are interested in." },
        { title: "Keep a copy", description: "Print your completed form or save it as a PDF from the print dialog." },
        { title: "Connect with the team", description: "Use the contact page to ask how to submit your expression of interest." },
      ], contact: "Contact the team", printed: "Your form is ready to print. No application has been sent.", printTitle: "TJP · Membership expression of interest",
    },
  },
  ur: {
    announcement: { text: "مشترکہ مستقبل کا آغاز آپ سے۔", action: "رکنیت کے بارے میں جانیں" },
    notFound: { code: "۴۰۴ · صفحہ نہیں ملا", title: "آئیے واپس چلیں۔", description: "یہ صفحہ نہیں مل سکا۔ ٹی جے پی کے بارے میں مزید جاننے کے لیے مرکزی صفحے پر جائیں۔" },
    social: {
      platforms: { facebook: "فیس بک", x: "ایکس", instagram: "انسٹاگرام", youtube: "یوٹیوب" },
      pending: "چینل جلد دستیاب ہوگا", unavailable: "تصدیق کے بعد اس چینل کا آفیشل لنک شامل کیا جائے گا۔ اس دوران ہم سے فیس بک پر رابطے میں رہیں۔",
      visitFacebook: "فیس بک پر ٹی جے پی دیکھیں", eyebrow: "گفتگو جاری ہے", title: "وہ خیالات جو بانٹنے کے قابل ہیں۔",
      feedTitle: "ہمارے فیس بک صفحے سے", feedDescription: "ٹی جے پی کے فیس بک صفحے کی تازہ معلومات اور گفتگو ایک جگہ دیکھیں۔", feedPrivacy: "تازہ پوسٹس براہِ راست فیس بک سے لوڈ کریں۔ فیڈ کھلنے پر فیس بک کوکیز استعمال کر سکتا ہے۔", loadFeed: "فیس بک پوسٹس لوڈ کریں", feedFallback: "اگر پوسٹس نظر نہ آئیں تو براہِ راست فیس بک پر دیکھیں۔",
      description: "ہمارا جریدہ پڑھیں اور سوشل میڈیا پر گفتگو کا حصہ بنیں۔", note: "جریدے کی جھلکیاں · براہِ راست فیس بک فیڈ نہیں", read: "مضمون پڑھیں", highlight: "جریدے سے انتخاب",
    },
    sections: {
      journal: { eyebrow: "ٹی جے پی کا جریدہ", title: "نئے زاویے۔ مشترکہ امکانات۔", description: "ان لوگوں، جگہوں اور خیالات پر غور جو ہمیں یکجا کرتے ہیں۔", action: "جریدہ دیکھیں" },
      gallery: { eyebrow: "ہمارا پاکستان، تصویروں میں", title: "ایک وطن۔ ان گنت کہانیاں۔", description: "پہاڑی وادیوں سے شہری یادگاروں تک، اپنے وطن کی ایک جھلک۔", action: "گیلری دیکھیں" },
      participate: { eyebrow: "رابطہ بڑھائیں", title: "آپ کی آواز کے لیے جگہ ہے۔", description: "اپنی دلچسپی سے آغاز کریں اور شرکت کا راستہ تلاش کریں۔", items: [
        { title: "رکنیت کے بارے میں جانیں", description: "رکنیت کی معلومات پڑھیں اور اپنی دلچسپی کا فارم تیار کریں۔", action: "رکنیت کا فارم" },
        { title: "اپنا نقطۂ نظر پیش کریں", description: "کوئی سوال، خیال یا اہم گفتگو؟ ہم سے رابطہ کریں۔", action: "رابطہ کریں" },
        { title: "جستجو جاری رکھیں", description: "مواقع، برادری اور مشترکہ ورثے کے بارے میں مضامین پڑھیں۔", action: "جریدہ پڑھیں" },
      ] },
      join: { eyebrow: "آپ کی آواز اہم ہے", title: "مشترکہ کل کا آغاز\nہم سے ہوتا ہے۔", description: "پاکستان کے لیے اپنے خیالات، جذبے اور امیدوں کے ساتھ پہلا قدم اٹھائیں۔", action: "رکنیت کے بارے میں جانیں", secondary: "بات کریں" },
    },
    journal: {
      eyebrow: "خیالات اور نقطۂ نظر", title: "ٹی جے پی کا جریدہ۔", description: "غور و فکر کی جگہ۔ پاکستان کے بارے میں ایک نئی گفتگو کا موقع۔",
      all: "تمام مضامین", search: "جریدے میں تلاش کریں", searchPlaceholder: "مضامین تلاش کریں…", empty: "آپ کی تلاش سے کوئی مضمون نہیں ملا۔", reset: "فلٹر ہٹائیں", read: "مضمون پڑھیں", minutes: "منٹ کا مطالعہ", back: "جریدے پر واپس جائیں", related: "مزید دریافت کریں", editorial: "نقطۂ نظر", categoryLabel: "موضوع کے مطابق مضامین دیکھیں",
      categories: { youth: "نوجوان اور مواقع", community: "برادری", culture: "ثقافت اور ورثہ" },
      articles: [
        { title: "امکانات سے بھرپور نسل", excerpt: "سیکھنے، سننے اور نوجوانوں کو گفتگو میں اپنا کردار ادا کرنے کا موقع دینا۔", paragraphs: [
          "پاکستان کے مستقبل کی گفتگو ان لوگوں سے شروع ہوتی ہے جنہوں نے اس مستقبل میں جینا ہے۔ نوجوان سوال، تخلیقی سوچ اور مانوس مسائل کو نئے زاویے سے دیکھنے کی صلاحیت لے کر آتے ہیں۔",
          "مواقع کی ابتدا سیکھنے تک رسائی سے ہوتی ہے۔ کوئی عملی ہنر، اچھا استاد یا خیالات کے تبادلے کی جگہ نئے راستے کھول سکتی ہے۔ سننا بھی اتنا ہی ضروری ہے تاکہ نوجوان اپنے تجربات اور امیدیں بیان کر سکیں۔",
          "شرکت کا آغاز اپنے اردگرد سے ہو سکتا ہے۔ مطالعہ کریں، سوچ سمجھ کر سوال پوچھیں، اپنا ہنر بانٹیں یا بااحترام گفتگو میں حصہ لیں۔ جستجو کے چھوٹے قدم اعتماد پیدا کرتے ہیں اور خیالات کو مفید عمل میں بدلتے ہیں۔",
          "پاکستان کے نوجوانوں کی کہانی ایک جیسی نہیں۔ شہروں، قصبوں اور دیہات کے مختلف تجربات سنے جانے کے مستحق ہیں۔ ان آوازوں کے لیے جگہ بنانا ایک بامعنی آغاز ہے۔",
        ] },
        { title: "برادری کی ابتدا ہم سے", excerpt: "روزمرہ کے تعلقات جو محلے کو مشترکہ گھر کا احساس دیتے ہیں۔", paragraphs: [
          "برادری اکثر عام لمحوں سے بنتی ہے: پڑوسی کی خیریت پوچھنا، اپنا علم بانٹنا یا مل بیٹھ کر ایک دوسرے کی بات سننا۔ یہی تعلقات کسی جگہ کو اس کی پہچان دیتے ہیں۔",
          "حل پیش کرنے سے پہلے سوال کو سمجھنا ضروری ہے۔ محلے کے لوگوں کو کس چیز کی ضرورت ہے؟ کون ابھی گفتگو میں شامل نہیں؟ توجہ سے سننے پر ایسے مواقع سامنے آ سکتے ہیں جو دور بیٹھ کر بنائے گئے منصوبے میں نظر نہ آئیں۔",
          "مطالعے کی نشست، سیکھنے کا مشترکہ موقع یا نسلوں کے درمیان گفتگو لوگوں کو قریب لا سکتی ہے۔ مقصد ایسی جگہ پیدا کرنا ہے جہاں ہر شخص اپنا حصہ ڈالنے میں سہولت محسوس کرے۔",
          "مضبوط تعلقات مستقل مزاجی سے بڑھتے ہیں۔ وقت دینا، وعدہ نبھانا اور مختلف خیالات کا احترام کرنا سادہ عادتیں ہیں جن کی قدر دیرپا ہے۔",
        ] },
        { title: "وہ جگہیں جو ہمیں جوڑتی ہیں", excerpt: "ہنزہ کی وادیوں سے لاہور کی یادگاروں تک، ہمارا مشترکہ ورثہ۔", paragraphs: [
          "پاکستان کے مناظر بہت سی کہانیاں بیان کرتے ہیں۔ پہاڑی وادیاں، مصروف سڑکیں، تاریخی صحن اور ساحلی شہر ہمارے وطن کا ایک الگ روپ دکھاتے ہیں۔",
          "ورثہ صرف کسی یادگار کا نام نہیں۔ یہ زبانوں، دستکاری، کھانوں، موسیقی اور ان یادوں میں زندہ رہتا ہے جو لوگ ایک دوسرے تک پہنچاتے ہیں۔ ان روزمرہ اظہاروں پر توجہ ہمیں ایک دوسرے کو بہتر سمجھنے میں مدد دیتی ہے۔",
          "کسی جگہ کی دریافت وہاں کے لوگوں کے احترام سے شروع ہوتی ہے۔ اس کی تاریخ جانیں، مقامی آوازیں سنیں اور جن جگہوں پر جائیں ان کا خیال رکھیں۔ جستجو اور لحاظ ایک ساتھ چلتے ہیں۔",
          "ہماری گیلری اس تنوع کا ایک مختصر تعارف ہے۔ ہر تصویر قریب سے دیکھنے اور اپنے مشترکہ وطن کا ایک اور پہلو جاننے کی دعوت دیتی ہے۔",
        ] },
      ],
    },
    gallery: {
      eyebrow: "تصویری جریدہ", title: "پاکستان کو قریب سے دیکھیں۔", description: "وہ جگہیں جو ہمیں متاثر کرتی ہیں۔ وہ مشترکہ ورثہ جو ہمیں جوڑتا ہے۔ تصاویر دریافت کریں۔",
      all: "تمام تصاویر", heritage: "تاریخی ورثہ", landscapes: "قدرتی مناظر", filter: "تصاویر چھانٹیں", open: "تصویر کھولیں", close: "تصویر بند کریں", previous: "پچھلی تصویر", next: "اگلی تصویر", count: "از", credit: "تصویر", source: "اصل تصویر اور حوالہ", note: "قدرتی مناظر اور تاریخی ورثے کی تصاویر۔ تقریبات کی تصاویر دستیاب ہونے پر شامل کی جائیں گی۔",
    },
    form: {
      name: "پورا نام", email: "ای میل ایڈریس", phone: "فون نمبر", city: "شہر / ضلع", province: "صوبہ / علاقہ", choose: "علاقہ منتخب کریں", topic: "موضوع", message: "آپ کا پیغام", interest: "دلچسپی کا شعبہ", password: "پاس ورڈ", confirmPassword: "پاس ورڈ دوبارہ لکھیں", optional: "اختیاری", required: "ستارے * والے خانے لازمی ہیں۔",
      namePlaceholder: "آپ کا پورا نام", emailPlaceholder: "you@example.com", phonePlaceholder: "+92 300 1234567", cityPlaceholder: "آپ کا شہر یا ضلع", messagePlaceholder: "اپنی بات یہاں لکھیں…", passwordPlaceholder: "آن لائن رسائی جلد دستیاب ہوگی", selectInterest: "دلچسپی منتخب کریں",
      regions: ["پنجاب", "سندھ", "خیبر پختونخوا", "بلوچستان", "اسلام آباد", "گلگت بلتستان", "آزاد جموں و کشمیر", "بیرونِ ملک"],
      interests: ["سماجی شرکت", "نوجوان اور تعلیم", "ابلاغ اور میڈیا", "عام رکنیت"],
      privacy: "آپ کی معلومات صرف اس صفحے پر رہتی ہیں اور صفحہ چھوڑنے پر ختم ہو جاتی ہیں۔ کچھ بھی آن لائن بھیجا یا محفوظ نہیں کیا جاتا۔",
      selectTopic: "موضوع منتخب کریں", requiredError: "براہِ کرم یہ خانہ مکمل کریں۔", emailError: "درست ای میل ایڈریس درج کریں۔", invalidError: "براہِ کرم درست معلومات درج کریں۔", consentError: "براہِ کرم فارم کے طریقۂ کار کو سمجھنے کی تصدیق کریں۔",
    },
    contact: {
      downloadHint: "نقل آپ کے آلے پر محفوظ ہوگی۔ کچھ بھی آن لائن نہیں بھیجا جاتا۔",
      eyebrow: "آئیے رابطہ کریں", title: "آئیے گفتگو کا آغاز کریں۔", description: "کوئی سوال پوچھیں، خیال پیش کریں یا ٹی جے پی کے ساتھ اگلا قدم جانیں۔",
      heading: "ہم کیسے مدد کر سکتے ہیں؟", formDescription: "اپنا پیغام لکھیں اور اپنے پاس رکھنے کے لیے نقل ڈاؤن لوڈ کریں۔", addressTitle: "مرکزی دفتر", address: "مکان نمبر ۴، لین ۱، پارک روڈ، چک شہزاد، اسلام آباد، پاکستان", phoneTitle: "عام معلومات", phone: "+92 300 5221884", source: "ٹی جے پی کی ویب سائٹ پر رابطے کی تفصیلات", channels: "آن لائن رابطے", topics: ["عام معلومات", "رکنیت کی معلومات", "میڈیا سے متعلق سوال", "کوئی خیال پیش کریں"],
      action: "پیغام ڈاؤن لوڈ کریں", note: "آن لائن پیغام بھیجنے کی سہولت منسلک نہیں ہے۔ نقل ڈاؤن لوڈ کریں اور شائع شدہ رابطے کی تفصیلات سے ٹیم تک پہنچیں۔", saved: "آپ کا پیغام ڈاؤن لوڈ ہو گیا ہے۔ یہ ٹی جے پی کو بھیجا نہیں گیا۔",
      faqTitle: "کچھ مزید معلومات", faqs: [
        { question: "رکنیت کے بارے میں کیسے پوچھوں؟", answer: "رکنیت کے صفحے پر دلچسپی کا فارم تیار کرکے پرنٹ کریں۔ اگلے مراحل جاننے کے لیے شائع شدہ تفصیلات سے ٹیم سے رابطہ کریں۔" },
        { question: "کیا ویب سائٹ اردو میں دیکھ سکتا ہوں؟", answer: "جی ہاں۔ ہیڈر میں اردو منتخب کریں۔ فارم اور نیویگیشن سمیت پوری ویب سائٹ اردو میں بدل جائے گی۔" },
        { question: "کیا میرا پیغام ویب سائٹ سے بھیجا جاتا ہے؟", answer: "نہیں۔ فارم آپ کے آلے پر پیغام کی نقل ڈاؤن لوڈ کرتا ہے۔ اس کے بعد آپ براہِ راست ٹیم سے رابطہ کر سکتے ہیں۔ کچھ بھی آن لائن جمع نہیں ہوتا۔" },
      ],
    },
    auth: {
      eyebrow: "ٹی جے پی برادری", title: "آپ کی آواز۔\nہمارا مشترکہ مستقبل۔", description: "خیالات، تعلق اور آنے والے کل پر گفتگو کی جگہ۔", signupTitle: "اپنا اکاؤنٹ بنائیں", signupDescription: "آن لائن رسائی کھلنے پر اراکین کی رجسٹریشن یہاں دستیاب ہوگی۔", loginDescription: "خوش آمدید۔ اراکین کی آن لائن سہولت یہاں دستیاب ہوگی۔", notice: "آن لائن اکاؤنٹ کی سہولت ابھی دستیاب نہیں۔ یہ خانے غیر فعال ہیں اور کوئی اسناد جمع نہیں کی جاتیں۔", loginAction: "لاگ اِن · جلد دستیاب", signupAction: "اکاؤنٹ بنائیں · جلد دستیاب", noAccount: "پہلی بار آئے ہیں؟", hasAccount: "پہلے سے اکاؤنٹ ہے؟", signupLink: "رجسٹریشن دیکھیں", loginLink: "لاگ اِن پر جائیں", membership: "رکنیت کا فارم تلاش کر رہے ہیں؟", membershipAction: "اپنا فارم تیار کریں", benefit: "آج ہی دریافت کریں", benefitText: "جریدہ پڑھیں، گیلری دیکھیں یا رکنیت میں دلچسپی کا فارم تیار کریں۔",
    },
    membership: {
      eyebrow: "پہلا قدم اٹھائیں", title: "آپ کے خیالات\nگفتگو کا حصہ ہیں۔", description: "رکنیت کے بارے میں جانیں اور اپنی دلچسپی کا اظہار تیار کریں۔", heading: "رکنیت میں دلچسپی کا فارم", descriptionForm: "اپنی تفصیلات مکمل کریں اور اپنے ریکارڈ کے لیے نقل پرنٹ کریں۔", action: "مکمل فارم پرنٹ کریں", notice: "یہ دلچسپی کا اظہار ہے، تصدیق شدہ رکنیت نہیں۔ آن لائن درخواستیں کھلی نہیں ہیں؛ جمع کروانے کی رہنمائی کے لیے ٹیم سے رابطہ کریں۔", consent: "میں سمجھتا ہوں کہ یہ فارم میرے ریکارڈ کے لیے ہے اور آن لائن رکنیت کی درخواست جمع نہیں کرتا۔", stepsTitle: "آغاز کے آسان قدم", steps: [
        { title: "اپنا تعارف دیں", description: "رابطے کی تفصیلات اور اپنی دلچسپی کا شعبہ شامل کریں۔" },
        { title: "نقل محفوظ رکھیں", description: "مکمل فارم پرنٹ کریں یا پرنٹ ڈائیلاگ سے پی ڈی ایف محفوظ کریں۔" },
        { title: "ٹیم سے رابطہ کریں", description: "رابطے کے صفحے سے جانیں کہ دلچسپی کا اظہار کیسے جمع کروایا جائے۔" },
      ], contact: "ٹیم سے رابطہ کریں", printed: "آپ کا فارم پرنٹ کے لیے تیار ہے۔ کوئی درخواست بھیجی نہیں گئی۔", printTitle: "ٹی جے پی · رکنیت میں دلچسپی کا اظہار",
    },
  },
};

export const translations = {
  en: {
    ...pageCopy.en,
    brand: { name: "Tehreek Jawanan Pakistan", short: "TJP", country: "PAKISTAN", home: "TJP home" },
    navigation: { home: "Home", about: "About us", focus: "Our focus", gallery: "Gallery", blogs: "Blogs", contact: "Contact us" },
    common: {
      skip: "Skip to content", mainNavigation: "Main navigation", footerNavigation: "Footer navigation",
      mobileNavigation: "Mobile navigation", openMenu: "Open navigation", closeMenu: "Close navigation",
      menuDescription: "Explore Tehreek Jawanan Pakistan.", language: "Choose language",
      english: "English", urdu: "اردو", switchToUrdu: "Switch to Urdu", switchToEnglish: "Switch to English",
      explore: "Discover TJP", backToTop: "Back to top", login: "Login", backHome: "Back to home",
      join: "Join TJP", membership: "Membership form", signup: "Sign up", close: "Close", newTab: "Opens in a new tab",
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
    ...pageCopy.ur,
    brand: { name: "تحریکِ جوانان پاکستان", short: "ٹی جے پی", country: "پاکستان", home: "ٹی جے پی کا مرکزی صفحہ" },
    navigation: { home: "مرکزی صفحہ", about: "ہمارا تعارف", focus: "ہماری توجہ", gallery: "گیلری", blogs: "بلاگ", contact: "رابطہ کریں" },
    common: {
      skip: "مرکزی مواد پر جائیں", mainNavigation: "مرکزی نیویگیشن", footerNavigation: "فوٹر نیویگیشن",
      mobileNavigation: "موبائل نیویگیشن", openMenu: "مینو کھولیں", closeMenu: "مینو بند کریں",
      menuDescription: "تحریکِ جوانان پاکستان کے بارے میں جانیں۔", language: "زبان منتخب کریں",
      english: "English", urdu: "اردو", switchToUrdu: "اردو میں دیکھیں", switchToEnglish: "انگریزی میں دیکھیں",
      explore: "ٹی جے پی کو جانیں", backToTop: "صفحے کے آغاز پر جائیں", login: "لاگ اِن", backHome: "مرکزی صفحے پر جائیں",
      join: "شامل ہوں", membership: "رکنیت کا فارم", signup: "رجسٹریشن", close: "بند کریں", newTab: "نئے ٹیب میں کھلتا ہے",
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
