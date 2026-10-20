export const defaultLocale = "en";
export const locales = ["en", "ur"];

export function normalizeLocale(value) {
  return locales.includes(value) ? value : defaultLocale;
}

const pageCopy = {
  en: {
    announcement: { text: "A shared future starts with you.", action: "Explore membership" },
    media: {
      logo: { title: "TJP emblem", alt: "Tehreek Jawanan Pakistan emblem", description: "The emblem published on TJP’s website." },
      founder: { title: "Gen. Hamid Gul · Founder", alt: "TJP profile portrait of Lieutenant General Hamid Gul", description: "Founder portrait from TJP’s published leadership profile." },
      founderArchive: { title: "Gen. Hamid Gul · Archive portrait", alt: "Hamid Gul seated in a grey suit with a framed military portrait behind him", description: "A portrait preserved in TJP’s media archive. The photograph’s date is not specified." },
      founderBanner: { title: "The founder’s vision", alt: "TJP banner showing Hamid Gul beside a montage of infrastructure and renewable energy", description: "An illustrated banner from TJP’s website." },
      chairman: { title: "Mohammad Abdullah Gul · Chairman", alt: "TJP profile portrait of Chairman Mohammad Abdullah Gul", description: "Chairman portrait from TJP’s published leadership profile." },
      skills: { title: "Skills & technology address", alt: "Abdullah Hamid Gul speaking at the Lions Club and National Technical Institute event", description: "An address on youth skills and technology, reported by TJP on 30 January 2025." },
      sports: { title: "Islamabad schools sports festival", alt: "Abdullah Hamid Gul at Islamabad’s 500 Schools Sports Festival", description: "TJP’s report of 22 January 2025 identifies Abdullah Hamid Gul as chief guest at the festival." },
      chinaMeeting: { title: "Meeting with China’s defence attaché", alt: "Abdullah Hamid Gul shaking hands with General Wang between the Pakistan and China flags", description: "Abdullah Hamid Gul with General Wang, identified by TJP as China’s defence attaché. Report published 29 July 2024." },
      barVisit: { title: "Central Bar Association · AJK", alt: "TJP’s photograph accompanying its Central Bar Association visit in Muzaffarabad", description: "TJP’s report of 26 June 2024 records a welcome for the chairman and Tehrik Jawanan Kashmir members in Muzaffarabad." },
      school: { title: "Girls’ education · Sargodha", alt: "Abdullah Hamid Gul at the General Hamid Gul School prize ceremony for orphan girls", description: "A school prize ceremony in Sargodha, reported by TJP on 6 July 2024." },
      book: { title: "The Lost War · Book launch invitation", alt: "Archived invitation poster for the book launch of The Lost War", description: "An invitation published on 25 July 2024, preserved as an archive item." },
      islamabad: { title: "Islamabad · Faisal Mosque", alt: "Faisal Mosque framed by the Margalla Hills in Islamabad", description: "Shoaib Zafar · Heritage photography · CC BY-SA 4.0." },
      lahore: { title: "Lahore · Badshahi Mosque", alt: "The courtyard and domes of Badshahi Mosque in Lahore", description: "Ch Humayun Hanif · Heritage photography · CC BY-SA 4.0." },
      hunza: { title: "Hunza Valley", alt: "Hunza Valley surrounded by the mountains of northern Pakistan", description: "Rizwan Bhiriya (RB) · Landscape photography · CC BY-SA 4.0." },
      karachi: { title: "Karachi · Mazar-e-Quaid", alt: "The white marble Mazar-e-Quaid in Karachi", description: "Abbas jaffri.9 · Heritage photography · CC BY-SA 4.0." },
    },
    notFound: { code: "404 · PAGE NOT FOUND", title: "Let’s find your way back.", description: "This page could not be found. Return home to keep exploring TJP." },
    social: {
      platforms: { facebook: "Facebook", x: "X", instagram: "Instagram", youtube: "YouTube" },
      pending: "Channel coming soon", unavailable: "This channel’s official link will be added once confirmed. In the meantime, find us on Facebook.",
      visitFacebook: "Visit TJP on Facebook", eyebrow: "THE CONVERSATION CONTINUES", title: "Ideas worth sharing.",
      feedTitle: "From our Facebook page", feedDescription: "Updates and conversations from TJP’s Facebook page, all in one place.", feedPrivacy: "Load the latest timeline directly from Facebook. Facebook may use cookies when the feed opens.", loadFeed: "Load Facebook posts", feedFallback: "If posts do not appear, view them directly on Facebook.",
      description: "Explore our journal, then join the conversation on our social channels.", note: "Journal highlights · not a live Facebook feed", read: "Read the story", highlight: "Journal highlight",
    },
    sections: {
      journal: { eyebrow: "THE TJP JOURNAL", title: "Our people. Our work. Our story.", description: "Leadership profiles, documented activities, and perspectives from the TJP journal.", action: "Explore the journal" },
      gallery: { eyebrow: "THE TJP PHOTO ARCHIVE", title: "People. Purpose. Participation.", description: "Discover our leadership, public engagements, and the places that connect us.", action: "View the gallery" },
      participate: { eyebrow: "MAKE A CONNECTION", title: "There’s a place for your voice.", description: "Start with what matters to you. Discover a way to take part.", items: [
        { title: "Explore membership", description: "Read the membership information and prepare your interest form.", action: "Membership form" },
        { title: "Share a perspective", description: "Questions, ideas, or a conversation worth starting? Get in touch.", action: "Contact us" },
        { title: "Stay curious", description: "Read perspectives on opportunity, community, and our shared heritage.", action: "Read the journal" },
      ] },
      join: { eyebrow: "YOUR VOICE MATTERS", title: "A shared tomorrow\nstarts with us.", description: "Bring your ideas, your energy, and your hopes for Pakistan. Take the first step.", action: "Explore membership", secondary: "Let’s talk" },
    },
    journal: {
      eyebrow: "NEWS, PROFILES & PERSPECTIVES", title: "The TJP journal.", description: "Meet our leadership, explore the activity archive, and read perspectives on Pakistan’s future.",
      all: "All stories", search: "Search the journal", searchPlaceholder: "Search stories…", empty: "No stories match your search.", reset: "Clear filters", read: "Read story", minutes: "min read", back: "Back to the journal", related: "Keep exploring", editorial: "Perspective", categoryLabel: "Filter stories by topic",
      categories: { leadership: "Leadership", youth: "Youth & opportunity", diplomacy: "Meetings & dialogue", community: "Community", culture: "Culture & heritage" },
      kinds: { profile: "Leadership profile", archive: "From the archive", editorial: "Editorial example" },
      exampleNote: "Sample editorial content for this website. This article does not report an actual TJP event or announce a programme.",
      sourceNote: "Prepared from TJP’s published material.", source: "Read the original source", archiveDate: "Dates refer to the original report’s publication.",
      articles: [
        { title: "Gen. Hamid Gul: TJP’s founder", excerpt: "A biographical introduction to the founder and the ideas recorded in TJP’s published vision.", paragraphs: [
          "TJP identifies Lieutenant General Hamid Gul as its founder. Its leadership profile records that he was born in Sargodha on 20 November 1936 and studied at Government College Lahore before entering the Pakistan Military Academy at Kakul.",
          "He was commissioned into the Pakistan Army’s Armoured Corps in October 1956. He later served as Director-General of Inter-Services Intelligence from 1987 to 1989 and became a public commentator on defence and regional affairs.",
          "TJP’s account connects its founding vision with national unity, domestic development, and self-reliance. Its published philosophy and manifesto provide further context for these stated priorities.",
          "The accompanying portrait comes from TJP’s media archive. Its date is not specified. This profile introduces the founder; it does not attribute the chairman’s later engagements to him.",
        ] },
        { title: "Youth skills in a changing world", excerpt: "An archived address by Abdullah Hamid Gul on practical learning and technological change.", paragraphs: [
          "TJP’s report published on 30 January 2025 records an address by Abdullah Hamid Gul to the Lions Club and National Technical Institute. The report centres on the importance of skills as technology changes the workplace.",
          "In the published account, Gul argues that young people need practical capabilities alongside an understanding of new technology. His comments about artificial intelligence are the speaker’s views, as reported by TJP.",
          "The address offers a point of reference for the journal’s wider discussion of learning and opportunity. The photograph is the image used by the original publication, which is linked below.",
        ] },
        { title: "Dialogue with China’s defence attaché", excerpt: "A documented meeting between Abdullah Hamid Gul and General Wang, published in July 2024.", paragraphs: [
          "A TJP archive entry published on 29 July 2024 records a meeting with General Wang, identified in the report as China’s defence attaché. The accompanying photograph shows Abdullah Hamid Gul and General Wang between the two countries’ flags.",
          "The brief report describes a discussion of Pakistan–China relations and a shared interest in regional peace and prosperity. The published account is a short record of the engagement, without a detailed transcript.",
          "The image is preserved here with its original context and source as part of the chairman’s public engagement archive. Readers can follow the source link to the original report.",
        ] },
        { title: "Meet Chairman Mohammad Abdullah Gul", excerpt: "An introduction to TJP’s chairman and the priorities described in his published leadership profile.", paragraphs: [
          "TJP’s leadership page identifies Mohammad Abdullah Gul as chairman. The published profile places youth participation, self-reliance, and national development at the centre of the movement’s stated outlook.",
          "His message discusses education, entrepreneurship, technology, agriculture, and sustainable development as areas of ambition. It also describes an interest in cultural diversity, civic responsibility, and economic cooperation.",
          "These statements describe the movement’s aims. Our journal and photo gallery document individual public engagements for which TJP has published an account and images, including school activities and meetings.",
        ] },
        { title: "Sport, confidence, and young people", excerpt: "From the archive: Abdullah Hamid Gul’s appearance at Islamabad’s 500 Schools Sports Festival.", paragraphs: [
          "TJP’s report published on 22 January 2025 identifies Abdullah Hamid Gul as chief guest at Islamabad’s 500 Schools Sports Festival. Its accompanying image is included here as part of the activity archive.",
          "The report summarises his remarks on sport’s contribution to children’s physical wellbeing and a positive mindset. It provides a short record of the address, with an emphasis on young people’s development.",
          "The festival’s title follows the original publication. Readers can consult the linked source for the report and its photograph. The date above is the publication date of the archive entry.",
        ] },
        { title: "Education and care in Sargodha", excerpt: "An archived prize ceremony at the General Hamid Gul School for orphan girls.", paragraphs: [
          "A TJP report published on 6 July 2024 records an annual prize distribution ceremony at the General Hamid Gul School for orphan girls in Sargodha. The report includes a photograph of Abdullah Hamid Gul at the occasion.",
          "In the accompanying statement, he calls for a collective commitment to the girls’ future. The event connects the archive’s focus on education with the school that carries Gen. Hamid Gul’s name.",
          "This entry preserves the information and image supplied by the original report. It offers a glimpse of the occasion and its educational context; the source link below provides the published record.",
        ] },
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
      eyebrow: "LEADERSHIP, ENGAGEMENTS & HERITAGE", title: "The TJP photo gallery.", description: "Explore founder portraits, the chairman’s documented engagements, and Pakistan’s shared heritage.",
      leadership: "Leadership", meetings: "Meetings & visits", events: "Public engagements",
      all: "All photographs", heritage: "Heritage", landscapes: "Landscapes", filter: "Filter photographs", open: "Open photograph", close: "Close photograph", previous: "Previous photograph", next: "Next photograph", count: "of", credit: "Photograph", source: "View original & credits", note: "Open a photograph for its context and source. Archive dates refer to publication; undated portraits are labelled accordingly.",
    },
    form: {
      name: "Full name", email: "Email address", phone: "Phone number", city: "City / district", province: "Province / region", choose: "Select a region", topic: "Subject", message: "Your message", interest: "Area of interest", password: "Password", confirmPassword: "Confirm password", optional: "Optional",
      namePlaceholder: "Your full name", emailPlaceholder: "you@example.com", phonePlaceholder: "+92 300 1234567", cityPlaceholder: "Your city or district", messagePlaceholder: "Tell us what you have in mind…", passwordPlaceholder: "Online access coming soon", selectInterest: "Select an interest",
      regions: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir", "Overseas"],
      interests: ["Community participation", "Youth & learning", "Communications & media", "General membership"],
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
      eyebrow: "MEMBERSHIP", title: "Join TJP", description: "Prepare your membership interest form.", heading: "Your details", descriptionForm: "Complete the fields, then print your form.", action: "Print form", consent: "I understand this form is for my records and does not submit an application.", stepsTitle: "How it works", steps: [
        { title: "Add your details", description: "Enter your contact details and interests." },
        { title: "Print or save", description: "Print your form or save it as a PDF." },
        { title: "Contact TJP", description: "Ask the team about the next steps." },
      ], contact: "Contact the team", printed: "Your form is ready to print. No application has been sent.", printTitle: "TJP · Membership expression of interest",
    },
  },
  ur: {
    announcement: { text: "مشترکہ مستقبل کا آغاز آپ سے۔", action: "رکنیت کے بارے میں جانیں" },
    media: {
      logo: { title: "ٹی جے پی کا نشان", alt: "تحریکِ جوانان پاکستان کا نشان", description: "ٹی جے پی کی ویب سائٹ پر شائع شدہ نشان۔" },
      founder: { title: "جنرل حمید گل · بانی", alt: "ٹی جے پی کے تعارفی صفحے سے لیفٹیننٹ جنرل حمید گل کی تصویر", description: "ٹی جے پی کے شائع شدہ تعارفی صفحے سے بانی کی تصویر۔" },
      founderArchive: { title: "جنرل حمید گل · محفوظ تصویر", alt: "سرمئی سوٹ میں بیٹھے حمید گل، پس منظر میں ان کی فوجی تصویر", description: "ٹی جے پی کے تصویری ذخیرے سے ایک تصویر۔ اصل ذخیرے میں تصویر کی تاریخ درج نہیں۔" },
      founderBanner: { title: "بانی کا تصور", alt: "حمید گل کے ساتھ بنیادی ڈھانچے اور قابلِ تجدید توانائی کی تصاویر پر مشتمل ٹی جے پی کا بینر", description: "ٹی جے پی کی ویب سائٹ سے ایک تصویری بینر۔" },
      chairman: { title: "محمد عبداللہ گل · چیئرمین", alt: "ٹی جے پی کے تعارفی صفحے سے چیئرمین محمد عبداللہ گل کی تصویر", description: "ٹی جے پی کے شائع شدہ تعارفی صفحے سے چیئرمین کی تصویر۔" },
      skills: { title: "ہنر اور ٹیکنالوجی پر خطاب", alt: "لائنز کلب اور نیشنل ٹیکنیکل انسٹی ٹیوٹ کی تقریب سے خطاب کرتے عبداللہ حمید گل", description: "نوجوانوں کے ہنر اور ٹیکنالوجی پر خطاب، جس کی رپورٹ ۳۰ جنوری ۲۰۲۵ کو شائع ہوئی۔" },
      sports: { title: "اسلام آباد کا اسکول اسپورٹس فیسٹیول", alt: "اسلام آباد کے ۵۰۰ اسکولز اسپورٹس فیسٹیول میں عبداللہ حمید گل", description: "۲۲ جنوری ۲۰۲۵ کی ٹی جے پی رپورٹ کے مطابق عبداللہ حمید گل تقریب کے مہمانِ خصوصی تھے۔" },
      chinaMeeting: { title: "چین کے دفاعی اتاشی سے ملاقات", alt: "پاکستان اور چین کے پرچموں کے درمیان جنرل وانگ سے مصافحہ کرتے عبداللہ حمید گل", description: "عبداللہ حمید گل کی جنرل وانگ سے ملاقات، جنہیں ٹی جے پی نے چین کا دفاعی اتاشی بتایا۔ رپورٹ ۲۹ جولائی ۲۰۲۴ کو شائع ہوئی۔" },
      barVisit: { title: "سنٹرل بار ایسوسی ایشن · آزاد کشمیر", alt: "مظفرآباد میں سنٹرل بار ایسوسی ایشن کے دورے کے ساتھ ٹی جے پی کی شائع شدہ تصویر", description: "۲۶ جون ۲۰۲۴ کی رپورٹ میں مظفرآباد میں چیئرمین اور تحریکِ جوانان کشمیر کے ارکان کے استقبال کا ذکر ہے۔" },
      school: { title: "بچیوں کی تعلیم · سرگودھا", alt: "یتیم بچیوں کے جنرل حمید گل اسکول کی تقسیمِ انعامات کی تقریب میں عبداللہ حمید گل", description: "سرگودھا میں اسکول کی تقسیمِ انعامات کی تقریب، جس کی رپورٹ ۶ جولائی ۲۰۲۴ کو شائع ہوئی۔" },
      book: { title: "دی لاسٹ وار · تقریبِ رونمائی کا دعوت نامہ", alt: "کتاب دی لاسٹ وار کی رونمائی کا محفوظ دعوتی پوسٹر", description: "۲۵ جولائی ۲۰۲۴ کو شائع شدہ دعوت نامہ، ماضی کے ریکارڈ کے طور پر محفوظ۔" },
      islamabad: { title: "اسلام آباد · فیصل مسجد", alt: "اسلام آباد میں مارگلہ کی پہاڑیوں کے دامن میں فیصل مسجد", description: "شعیب ظفر کی ثقافتی تصویر · سی سی بی وائی ایس اے ۴.۰۔" },
      lahore: { title: "لاہور · بادشاہی مسجد", alt: "لاہور میں بادشاہی مسجد کا صحن اور گنبد", description: "چوہدری ہمایوں حنیف کی ثقافتی تصویر · سی سی بی وائی ایس اے ۴.۰۔" },
      hunza: { title: "وادیٔ ہنزہ", alt: "شمالی پاکستان کے پہاڑوں میں گھری وادیٔ ہنزہ", description: "رضوان بھیریا کی قدرتی منظر کی تصویر · سی سی بی وائی ایس اے ۴.۰۔" },
      karachi: { title: "کراچی · مزارِ قائد", alt: "کراچی میں سفید سنگِ مرمر سے بنا مزارِ قائد", description: "عباس جعفری کی ثقافتی تصویر · سی سی بی وائی ایس اے ۴.۰۔" },
    },
    notFound: { code: "۴۰۴ · صفحہ نہیں ملا", title: "آئیے واپس چلیں۔", description: "یہ صفحہ نہیں مل سکا۔ ٹی جے پی کے بارے میں مزید جاننے کے لیے مرکزی صفحے پر جائیں۔" },
    social: {
      platforms: { facebook: "فیس بک", x: "ایکس", instagram: "انسٹاگرام", youtube: "یوٹیوب" },
      pending: "چینل جلد دستیاب ہوگا", unavailable: "تصدیق کے بعد اس چینل کا آفیشل لنک شامل کیا جائے گا۔ اس دوران ہم سے فیس بک پر رابطے میں رہیں۔",
      visitFacebook: "فیس بک پر ٹی جے پی دیکھیں", eyebrow: "گفتگو جاری ہے", title: "وہ خیالات جو بانٹنے کے قابل ہیں۔",
      feedTitle: "ہمارے فیس بک صفحے سے", feedDescription: "ٹی جے پی کے فیس بک صفحے کی تازہ معلومات اور گفتگو ایک جگہ دیکھیں۔", feedPrivacy: "تازہ پوسٹس براہِ راست فیس بک سے لوڈ کریں۔ فیڈ کھلنے پر فیس بک کوکیز استعمال کر سکتا ہے۔", loadFeed: "فیس بک پوسٹس لوڈ کریں", feedFallback: "اگر پوسٹس نظر نہ آئیں تو براہِ راست فیس بک پر دیکھیں۔",
      description: "ہمارا جریدہ پڑھیں اور سوشل میڈیا پر گفتگو کا حصہ بنیں۔", note: "جریدے کی جھلکیاں · براہِ راست فیس بک فیڈ نہیں", read: "مضمون پڑھیں", highlight: "جریدے سے انتخاب",
    },
    sections: {
      journal: { eyebrow: "ٹی جے پی کا جریدہ", title: "ہمارے لوگ۔ ہماری کاوش۔ ہماری کہانی۔", description: "قیادت کا تعارف، شائع شدہ سرگرمیاں اور ٹی جے پی کے جریدے سے نقطۂ نظر۔", action: "جریدہ دیکھیں" },
      gallery: { eyebrow: "ٹی جے پی کا تصویری ذخیرہ", title: "لوگ۔ مقصد۔ شرکت۔", description: "ہماری قیادت، عوامی سرگرمیوں اور مشترکہ ورثے کی تصویری جھلکیاں۔", action: "گیلری دیکھیں" },
      participate: { eyebrow: "رابطہ بڑھائیں", title: "آپ کی آواز کے لیے جگہ ہے۔", description: "اپنی دلچسپی سے آغاز کریں اور شرکت کا راستہ تلاش کریں۔", items: [
        { title: "رکنیت کے بارے میں جانیں", description: "رکنیت کی معلومات پڑھیں اور اپنی دلچسپی کا فارم تیار کریں۔", action: "رکنیت کا فارم" },
        { title: "اپنا نقطۂ نظر پیش کریں", description: "کوئی سوال، خیال یا اہم گفتگو؟ ہم سے رابطہ کریں۔", action: "رابطہ کریں" },
        { title: "جستجو جاری رکھیں", description: "مواقع، برادری اور مشترکہ ورثے کے بارے میں مضامین پڑھیں۔", action: "جریدہ پڑھیں" },
      ] },
      join: { eyebrow: "آپ کی آواز اہم ہے", title: "مشترکہ کل کا آغاز\nہم سے ہوتا ہے۔", description: "پاکستان کے لیے اپنے خیالات، جذبے اور امیدوں کے ساتھ پہلا قدم اٹھائیں۔", action: "رکنیت کے بارے میں جانیں", secondary: "بات کریں" },
    },
    journal: {
      eyebrow: "خبریں، تعارف اور نقطۂ نظر", title: "ٹی جے پی کا جریدہ۔", description: "قیادت کا تعارف، محفوظ سرگرمیوں کا ریکارڈ اور پاکستان کے مستقبل پر مضامین پڑھیں۔",
      all: "تمام مضامین", search: "جریدے میں تلاش کریں", searchPlaceholder: "مضامین تلاش کریں…", empty: "آپ کی تلاش سے کوئی مضمون نہیں ملا۔", reset: "فلٹر ہٹائیں", read: "مضمون پڑھیں", minutes: "منٹ کا مطالعہ", back: "جریدے پر واپس جائیں", related: "مزید دریافت کریں", editorial: "نقطۂ نظر", categoryLabel: "موضوع کے مطابق مضامین دیکھیں",
      categories: { leadership: "قیادت", youth: "نوجوان اور مواقع", diplomacy: "ملاقاتیں اور مکالمہ", community: "برادری", culture: "ثقافت اور ورثہ" },
      kinds: { profile: "قیادت کا تعارف", archive: "محفوظ ریکارڈ سے", editorial: "نمونہ اداریہ" },
      exampleNote: "یہ ویب سائٹ کے لیے نمونہ اداریہ ہے۔ یہ کسی حقیقی ٹی جے پی تقریب کی خبر یا پروگرام کا اعلان نہیں۔",
      sourceNote: "ٹی جے پی کے شائع شدہ مواد کی بنیاد پر تیار کردہ۔", source: "اصل ماخذ پڑھیں", archiveDate: "تاریخ اصل رپورٹ کی اشاعت کی ہے۔",
      articles: [
        { title: "جنرل حمید گل: ٹی جے پی کے بانی", excerpt: "بانی کا مختصر تعارف اور ٹی جے پی کے شائع شدہ تصور میں درج خیالات۔", paragraphs: [
          "ٹی جے پی لیفٹیننٹ جنرل حمید گل کو اپنا بانی قرار دیتی ہے۔ اس کے تعارفی صفحے کے مطابق وہ ۲۰ نومبر ۱۹۳۶ کو سرگودھا میں پیدا ہوئے۔ پاکستان ملٹری اکیڈمی کاکول میں داخلے سے پہلے انہوں نے گورنمنٹ کالج لاہور میں تعلیم حاصل کی۔",
          "اکتوبر ۱۹۵۶ میں انہیں پاکستان آرمی کی آرمرڈ کور میں کمیشن ملا۔ وہ ۱۹۸۷ سے ۱۹۸۹ تک انٹر سروسز انٹیلی جنس کے ڈائریکٹر جنرل رہے اور بعد میں دفاع اور علاقائی امور پر اظہارِ خیال کرتے رہے۔",
          "ٹی جے پی کا بیان اپنے بنیادی تصور کو قومی یکجہتی، مقامی ترقی اور خود انحصاری سے منسلک کرتا ہے۔ شائع شدہ فلسفہ اور منشور ان ترجیحات کی مزید وضاحت کرتے ہیں۔",
          "ساتھ دی گئی تصویر ٹی جے پی کے تصویری ذخیرے سے ہے اور اس کی تاریخ درج نہیں۔ یہ تحریر بانی کا تعارف پیش کرتی ہے؛ چیئرمین کی بعد کی سرگرمیوں کو ان سے منسوب نہیں کرتی۔",
        ] },
        { title: "بدلتی دنیا میں نوجوانوں کے ہنر", excerpt: "عملی تعلیم اور ٹیکنالوجی میں تبدیلی پر عبداللہ حمید گل کے خطاب کا محفوظ ریکارڈ۔", paragraphs: [
          "۳۰ جنوری ۲۰۲۵ کو شائع شدہ ٹی جے پی رپورٹ میں لائنز کلب اور نیشنل ٹیکنیکل انسٹی ٹیوٹ سے عبداللہ حمید گل کے خطاب کا ذکر ہے۔ رپورٹ میں کام کی دنیا پر ٹیکنالوجی کے اثرات اور ہنر کی اہمیت پر توجہ دی گئی ہے۔",
          "شائع شدہ بیان میں انہوں نے نوجوانوں کے لیے نئی ٹیکنالوجی کی سمجھ کے ساتھ عملی مہارتوں کو ضروری قرار دیا۔ مصنوعی ذہانت سے متعلق تبصرے مقرر کے خیالات ہیں جنہیں ٹی جے پی نے رپورٹ کیا۔",
          "یہ خطاب جریدے میں تعلیم اور مواقع کی وسیع گفتگو کا ایک حوالہ ہے۔ تصویر اصل اشاعت سے لی گئی ہے، جس کا لنک نیچے موجود ہے۔",
        ] },
        { title: "چین کے دفاعی اتاشی سے مکالمہ", excerpt: "جولائی ۲۰۲۴ میں شائع شدہ عبداللہ حمید گل اور جنرل وانگ کی ملاقات کا ریکارڈ۔", paragraphs: [
          "۲۹ جولائی ۲۰۲۴ کی ٹی جے پی اشاعت میں جنرل وانگ سے ملاقات کا ذکر ہے، جنہیں رپورٹ میں چین کا دفاعی اتاشی بتایا گیا ہے۔ تصویر میں عبداللہ حمید گل اور جنرل وانگ دونوں ملکوں کے پرچموں کے درمیان کھڑے ہیں۔",
          "مختصر رپورٹ میں پاکستان اور چین کے تعلقات اور خطے میں امن و خوشحالی کے مشترکہ مفاد پر گفتگو کا ذکر ہے۔ شائع شدہ بیان ملاقات کا مختصر ریکارڈ پیش کرتا ہے۔",
          "تصویر چیئرمین کی عوامی سرگرمیوں کے محفوظ ریکارڈ میں اپنے اصل سیاق اور ماخذ کے ساتھ پیش کی گئی ہے۔ قارئین اصل رپورٹ پڑھنے کے لیے ماخذ کا لنک کھول سکتے ہیں۔",
        ] },
        { title: "چیئرمین محمد عبداللہ گل کا تعارف", excerpt: "ٹی جے پی کے چیئرمین اور ان کے شائع شدہ تعارف میں بیان کردہ ترجیحات۔", paragraphs: [
          "ٹی جے پی کے قیادت کے صفحے پر محمد عبداللہ گل کو چیئرمین بتایا گیا ہے۔ شائع شدہ تعارف میں نوجوانوں کی شرکت، خود انحصاری اور قومی ترقی کو تحریک کی سوچ کا مرکزی حصہ قرار دیا گیا ہے۔",
          "ان کے پیغام میں تعلیم، کاروباری صلاحیت، ٹیکنالوجی، زراعت اور پائیدار ترقی کا ذکر ہے۔ ثقافتی تنوع، شہری ذمہ داری اور معاشی تعاون بھی بیان کردہ ترجیحات میں شامل ہیں۔",
          "یہ بیانات تحریک کے مقاصد کی وضاحت کرتے ہیں۔ جریدے اور تصویری گیلری میں ان عوامی سرگرمیوں کو پیش کیا گیا ہے جن کی رپورٹ اور تصاویر ٹی جے پی نے شائع کی ہیں، جن میں اسکول کی تقریبات اور ملاقاتیں شامل ہیں۔",
        ] },
        { title: "کھیل، اعتماد اور نوجوان", excerpt: "محفوظ ریکارڈ سے: اسلام آباد کے ۵۰۰ اسکولز اسپورٹس فیسٹیول میں عبداللہ حمید گل کی شرکت۔", paragraphs: [
          "۲۲ جنوری ۲۰۲۵ کو شائع شدہ ٹی جے پی رپورٹ میں عبداللہ حمید گل کو اسلام آباد کے ۵۰۰ اسکولز اسپورٹس فیسٹیول کا مہمانِ خصوصی بتایا گیا ہے۔ اصل تصویر یہاں سرگرمیوں کے ریکارڈ کے طور پر شامل ہے۔",
          "رپورٹ میں بچوں کی جسمانی تندرستی اور مثبت سوچ میں کھیلوں کے کردار پر ان کے خیالات کا خلاصہ ہے۔ یہ خطاب کا مختصر ریکارڈ ہے جس میں نوجوانوں کی نشوونما پر زور دیا گیا ہے۔",
          "فیسٹیول کا نام اصل اشاعت کے مطابق درج ہے۔ قارئین رپورٹ اور تصویر دیکھنے کے لیے اصل ماخذ کھول سکتے ہیں۔ اوپر درج تاریخ اصل رپورٹ کی اشاعت کی ہے۔",
        ] },
        { title: "سرگودھا میں تعلیم اور نگہداشت", excerpt: "یتیم بچیوں کے جنرل حمید گل اسکول کی تقسیمِ انعامات کی تقریب کا محفوظ ریکارڈ۔", paragraphs: [
          "۶ جولائی ۲۰۲۴ کو شائع شدہ ٹی جے پی رپورٹ میں سرگودھا کے جنرل حمید گل اسکول برائے یتیم بچیاں کی سالانہ تقسیمِ انعامات کا ذکر ہے۔ رپورٹ میں عبداللہ حمید گل کی تقریب میں شرکت کی تصویر بھی شامل ہے۔",
          "ساتھ دیے گئے بیان میں انہوں نے بچیوں کے بہتر مستقبل کے لیے مشترکہ کوشش پر زور دیا۔ یہ تقریب تعلیم کی اہمیت کو جنرل حمید گل کے نام سے منسوب اسکول سے جوڑتی ہے۔",
          "یہ تحریر اصل رپورٹ کی معلومات اور تصویر محفوظ کرتی ہے۔ اس سے تقریب اور اس کے تعلیمی پس منظر کی جھلک ملتی ہے۔ شائع شدہ ریکارڈ کے لیے نیچے اصل ماخذ کا لنک موجود ہے۔",
        ] },
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
      eyebrow: "قیادت، سرگرمیاں اور ورثہ", title: "ٹی جے پی کی تصویری گیلری۔", description: "بانی کی تصاویر، چیئرمین کی شائع شدہ سرگرمیاں اور پاکستان کا مشترکہ ورثہ دیکھیں۔",
      leadership: "قیادت", meetings: "ملاقاتیں اور دورے", events: "عوامی سرگرمیاں",
      all: "تمام تصاویر", heritage: "تاریخی ورثہ", landscapes: "قدرتی مناظر", filter: "تصاویر چھانٹیں", open: "تصویر کھولیں", close: "تصویر بند کریں", previous: "پچھلی تصویر", next: "اگلی تصویر", count: "از", credit: "تصویر", source: "اصل تصویر اور حوالہ", note: "سیاق اور ماخذ دیکھنے کے لیے تصویر کھولیں۔ محفوظ تاریخیں اشاعت کی ہیں؛ بغیر تاریخ کی تصاویر کی نشاندہی کی گئی ہے۔",
    },
    form: {
      name: "پورا نام", email: "ای میل ایڈریس", phone: "فون نمبر", city: "شہر / ضلع", province: "صوبہ / علاقہ", choose: "علاقہ منتخب کریں", topic: "موضوع", message: "آپ کا پیغام", interest: "دلچسپی کا شعبہ", password: "پاس ورڈ", confirmPassword: "پاس ورڈ دوبارہ لکھیں", optional: "اختیاری", required: "ستارے * والے خانے لازمی ہیں۔",
      namePlaceholder: "آپ کا پورا نام", emailPlaceholder: "you@example.com", phonePlaceholder: "+92 300 1234567", cityPlaceholder: "آپ کا شہر یا ضلع", messagePlaceholder: "اپنی بات یہاں لکھیں…", passwordPlaceholder: "آن لائن رسائی جلد دستیاب ہوگی", selectInterest: "دلچسپی منتخب کریں",
      regions: ["پنجاب", "سندھ", "خیبر پختونخوا", "بلوچستان", "اسلام آباد", "گلگت بلتستان", "آزاد جموں و کشمیر", "بیرونِ ملک"],
      interests: ["سماجی شرکت", "نوجوان اور تعلیم", "ابلاغ اور میڈیا", "عام رکنیت"],
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
      eyebrow: "رکنیت", title: "ٹی جے پی میں شامل ہوں", description: "رکنیت میں دلچسپی کا فارم تیار کریں۔", heading: "آپ کی تفصیلات", descriptionForm: "خانے مکمل کریں، پھر فارم پرنٹ کریں۔", action: "فارم پرنٹ کریں", consent: "میں سمجھتا ہوں کہ یہ فارم میرے ریکارڈ کے لیے ہے اور درخواست جمع نہیں کرتا۔", stepsTitle: "آسان مراحل", steps: [
        { title: "تفصیلات درج کریں", description: "رابطے کی معلومات اور دلچسپی شامل کریں۔" },
        { title: "نقل محفوظ کریں", description: "فارم پرنٹ کریں یا پی ڈی ایف محفوظ کریں۔" },
        { title: "ٹیم سے رابطہ کریں", description: "اگلے مراحل کے لیے ٹیم سے پوچھیں۔" },
      ], contact: "ٹیم سے رابطہ کریں", printed: "آپ کا فارم پرنٹ کے لیے تیار ہے۔ کوئی درخواست بھیجی نہیں گئی۔", printTitle: "ٹی جے پی · رکنیت میں دلچسپی کا اظہار",
    },
  },
};

export const translations = {
  en: {
    ...pageCopy.en,
    brand: { name: "Tehreek Jawanan Pakistan", wordmark: "Tehrik Jawanan Pakistan", short: "TJP", country: "PAKISTAN", home: "TJP home" },
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
        label: "Discover TJP", role: "carousel", slide: "slide", previous: "Previous slide", next: "Next slide",
        pause: "Pause slideshow", play: "Play slideshow", goTo: "Go to slide", hint: "Swipe or scroll sideways to explore",
      },
      slides: [
        { location: "OUR FOUNDER", title: "A shared vision.", accent: "A stronger Pakistan.", description: "Discover Gen. Hamid Gul’s founding vision of unity and self-reliance.", alt: "TJP’s published founder banner featuring Gen. Hamid Gul" },
        { location: "MEETINGS & DIALOGUE", title: "Building connections.", accent: "Opening dialogue.", description: "Explore the chairman’s meetings and public engagements in our archive.", alt: "Abdullah Hamid Gul meeting General Wang, China’s defence attaché" },
        { location: "EDUCATION & COMMUNITY", title: "Learning today.", accent: "Possibilities tomorrow.", description: "A look at educational activities and community engagement.", alt: "A school prize ceremony in Sargodha attended by Abdullah Hamid Gul" },
        { location: "OUR PAKISTAN", title: "Many voices.", accent: "One Pakistan.", description: "Youth participation, civic responsibility, and a shared future.", alt: "Faisal Mosque framed by the Margalla Hills in Islamabad" },
      ],
      about: {
        eyebrow: "ABOUT US", title: "A shared purpose.\nA stronger Pakistan.",
        description: "Founded by Gen. Hamid Gul, Tehreek Jawanan Pakistan is a youth-focused political movement. Its published vision centres on national unity, self-reliance, and development through peaceful, lawful participation.",
        leadership: "Chairman Mohammad Abdullah Gul’s published message highlights education, entrepreneurship, and civic responsibility. Explore our leadership profiles and documented activities in the TJP journal.",
        note: "Unity. Prosperity. Progress.", name: "Gen. Hamid Gul", role: "Founder · Tehreek Jawanan Pakistan", imageAlt: "Portrait of Gen. Hamid Gul", link: "Meet our leadership",
      },
      focus: {
        eyebrow: "LOOKING AHEAD", title: "Ideas that bring us together.",
        description: "Priorities drawn from TJP’s published vision for a self-reliant Pakistan.",
        items: [
          { number: "01", title: "Education & skills", description: "A stated focus on learning, practical skills, and opportunities for young people." },
          { number: "02", title: "National unity", description: "Respect for cultural diversity, civic responsibility, and peaceful participation." },
          { number: "03", title: "Self-reliance & progress", description: "A vision for local enterprise, innovation, and sustainable national development." },
        ],
      },
    },
    login: { eyebrow: "MEMBER ACCESS", title: "Member login", description: "Online sign-in is currently unavailable.", note: "Please check back for updates." },
    footer: {
      title: "Our Pakistan. Our shared future.", description: "Tehreek Jawanan Pakistan · Unity, Prosperity, Progress.",
      explore: "Explore", language: "Stay connected", languageDescription: "Your language. Your voice.",
      rights: "TJP. All rights reserved.", madeFor: "For Pakistan. For tomorrow.", credits: "Photo credits",
      photoLicense: "CC BY-SA 4.0", tjpArchive: "TJP website archive · rights retained by their owners", photoChanges: "Images are hosted locally, resized, and cropped for display. Landscape photographs retain their listed CC BY-SA 4.0 credits. TJP archive images and the emblem retain their original rights; no third-party endorsement is implied.",
    },
  },
  ur: {
    ...pageCopy.ur,
    brand: { name: "تحریکِ جوانان پاکستان", wordmark: "Tehrik Jawanan Pakistan", short: "ٹی جے پی", country: "پاکستان", home: "ٹی جے پی کا مرکزی صفحہ" },
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
        label: "ٹی جے پی کو جانیں", role: "تصویری سلسلہ", slide: "تصویر", previous: "پچھلی تصویر", next: "اگلی تصویر",
        pause: "تصاویر کی خودکار تبدیلی روکیں", play: "تصاویر کی خودکار تبدیلی چلائیں", goTo: "تصویر پر جائیں", hint: "دریافت کرنے کے لیے دائیں یا بائیں سوائپ کریں",
      },
      slides: [
        { location: "ہمارے بانی", title: "مشترکہ تصور۔", accent: "مضبوط پاکستان۔", description: "قومی یکجہتی اور خود انحصاری پر جنرل حمید گل کے بنیادی تصور کو جانیں۔", alt: "جنرل حمید گل کی تصویر پر مشتمل ٹی جے پی کا شائع شدہ بینر" },
        { location: "ملاقاتیں اور مکالمہ", title: "تعلقات کی تعمیر۔", accent: "مکالمے کا آغاز۔", description: "چیئرمین کی ملاقاتیں اور عوامی سرگرمیاں ہمارے محفوظ ریکارڈ میں دیکھیں۔", alt: "چین کے دفاعی اتاشی جنرل وانگ سے ملاقات کرتے عبداللہ حمید گل" },
        { location: "تعلیم اور برادری", title: "آج کی تعلیم۔", accent: "کل کے امکانات۔", description: "تعلیمی سرگرمیوں اور سماجی شرکت کی ایک جھلک۔", alt: "سرگودھا میں تقسیمِ انعامات کی تقریب میں عبداللہ حمید گل کی شرکت" },
        { location: "ہمارا پاکستان", title: "مختلف آوازیں۔", accent: "ایک پاکستان۔", description: "نوجوانوں کی شرکت، شہری ذمہ داری اور ایک مشترکہ مستقبل۔", alt: "اسلام آباد میں مارگلہ کی پہاڑیوں کے دامن میں فیصل مسجد" },
      ],
      about: {
        eyebrow: "ہمارا تعارف", title: "مشترکہ مقصد۔\nمضبوط پاکستان۔",
        description: "جنرل حمید گل کی قائم کردہ تحریکِ جوانان پاکستان نوجوانوں پر توجہ دینے والی سیاسی تحریک ہے۔ اس کے شائع شدہ تصور میں قومی یکجہتی، خود انحصاری اور پُرامن قانونی شرکت کے ذریعے ترقی کو اہمیت دی گئی ہے۔",
        leadership: "چیئرمین محمد عبداللہ گل کے شائع شدہ پیغام میں تعلیم، کاروباری صلاحیت اور شہری ذمہ داری نمایاں ہیں۔ قیادت کا تعارف اور شائع شدہ سرگرمیاں ٹی جے پی کے جریدے میں دیکھیں۔",
        note: "اتحاد۔ خوشحالی۔ ترقی۔", name: "جنرل حمید گل", role: "بانی · تحریکِ جوانان پاکستان", imageAlt: "جنرل حمید گل کی تصویر", link: "ہماری قیادت کو جانیں",
      },
      focus: {
        eyebrow: "مستقبل کی جانب", title: "وہ خیالات جو ہمیں یکجا کریں۔",
        description: "خود انحصار پاکستان کے لیے ٹی جے پی کے شائع شدہ تصور سے اخذ کردہ ترجیحات۔",
        items: [
          { number: "۰۱", title: "تعلیم اور ہنر", description: "تعلیم، عملی مہارتوں اور نوجوانوں کے لیے مواقع پر توجہ۔" },
          { number: "۰۲", title: "قومی یکجہتی", description: "ثقافتی تنوع کا احترام، شہری ذمہ داری اور پُرامن شرکت۔" },
          { number: "۰۳", title: "خود انحصاری اور ترقی", description: "مقامی کاروبار، جدت اور پائیدار قومی ترقی کا تصور۔" },
        ],
      },
    },
    login: { eyebrow: "اراکین کے لیے", title: "اراکین کا لاگ اِن", description: "آن لائن لاگ اِن فی الحال دستیاب نہیں ہے۔", note: "تازہ معلومات کے لیے دوبارہ ملاحظہ کریں۔" },
    footer: {
      title: "ہمارا پاکستان۔ ہمارا مشترکہ مستقبل۔", description: "تحریکِ جوانان پاکستان · اتحاد، خوشحالی، ترقی۔",
      explore: "دریافت کریں", language: "رابطے میں رہیں", languageDescription: "آپ کی زبان۔ آپ کی آواز۔",
      rights: "ٹی جے پی۔ جملہ حقوق محفوظ ہیں۔", madeFor: "پاکستان کے لیے۔ آنے والے کل کے لیے۔", credits: "تصاویر کے حوالہ جات",
      photoLicense: "CC BY-SA 4.0", tjpArchive: "ٹی جے پی کا ویب ذخیرہ · حقوق اصل مالکان کے پاس محفوظ", photoChanges: "تصاویر مقامی طور پر محفوظ، حجم تبدیل اور نمائش کے لیے تراشی گئی ہیں۔ قدرتی مناظر کی تصاویر کے سی سی بی وائی ایس اے ۴.۰ حوالے برقرار ہیں۔ ٹی جے پی کی تصاویر اور نشان کے اصل حقوق برقرار ہیں؛ کسی تیسرے فریق کی تائید مراد نہیں۔",
    },
  },
};
