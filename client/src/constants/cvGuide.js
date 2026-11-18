// client/src/constants/cvGuide.js
// All content of the Campus Hub /cv-guide page (Bangla + English).
// All example names, numbers and results are made up. Readers must use only their own true facts.

export const GUIDE = {
  title: 'Campus Hub CV Guide',
  subtitle: 'Write a strong CV before your first job',
  tagline: 'চাকরির অভিজ্ঞতা না থাকলেও তোমার CV হতে পারে শক্ত।',
  audience: 'For students and fresh graduates',
};

export const HERO_FEATURES = [
  { value: '20', title: 'ছোট কাজ CV-তে কীভাবে লিখবে', text: 'টিউশনি, CR, ক্লাব, ফেসবুক পেজে বিক্রি, volunteering আরও অনেক কিছু' },
  { value: '1', title: 'Claude prompt', text: 'একটা একটা করে প্রশ্ন করে পুরো CV বানায়, নিজে থেকে কিছু বানায় না' },
  { value: '22', title: 'CV template', text: 'CSE থেকে Law, Pharmacy থেকে Architecture' },
];

export const SECTION_LINKS = [
  { id: 'start', label: '৪টা ধাপ' },
  { id: 'rule', label: 'মূল নিয়ম' },
  { id: 'sections', label: 'কোন কাজ কোথায়' },
  { id: 'bullets', label: 'Bullet formula' },
  { id: 'ideas', label: '20 ছোট কাজ' },
  { id: 'prompt', label: 'Claude prompt' },
  { id: 'templates', label: 'Templates' },
  { id: 'checklist', label: 'Checklist' },
];

// ---------- 1. How to use ----------
export const HOW_TO = {
  title: 'এই গাইড কীভাবে ব্যবহার করবে',
  subtitle: '৪টা ধাপ। প্রথমবার পুরোটা পড়তে ২০ মিনিটের মতো লাগবে।',
  steps: [
    { no: '01', title: 'নিয়মটা আগে বুঝে নাও', text: 'Work Experience আর Experience and Activities-এর পার্থক্য, আর একটা ভালো bullet কীভাবে লিখবে।' },
    { no: '02', title: 'তোমার ছোট কাজগুলো খুঁজে বের করো', text: '২০টা উদাহরণ দেখো। যেগুলো তুমি করেছ, সেগুলো দাগিয়ে রাখো আর পাশে নিজের সত্যি সংখ্যাগুলো লিখে নাও।' },
    { no: '03', title: 'Claude দিয়ে CV বানাও', text: 'Prompt-টা কপি করে Claude-এ দাও। Claude একটা একটা করে প্রশ্ন করবে, তুমি সত্যি উত্তর দেবে।' },
    { no: '04', title: 'Template বেছে নাও, তারপর পাঠাও', text: '২২টা template থেকে নিজের বিষয়ের কাছাকাছি একটা নাও। পাঠানোর আগে checklist মিলিয়ে নাও।' },
  ],
  remember: {
    title: 'একটা কথা মনে রাখো',
    text: 'এই গাইডের সব নাম, সংখ্যা আর ফলাফল উদাহরণ। তোমার CV-তে যাবে শুধু তোমার নিজের সত্যি তথ্য।',
  },
};

// ---------- 2. The rule ----------
export const RULE = {
  kicker: 'The rule',
  title: 'Work Experience না, Experience and Activities',
  subtitle: 'টিউশনি, CR, ক্লাব, অনলাইনে বিক্রি, সবই কাজ। শুধু ঠিক heading-এর নিচে লেখো।',
  wrong: {
    label: 'এভাবে না',
    heading: 'WORK EXPERIENCE',
    entries: [
      { role: 'Sales Manager', dates: '2024', org: 'Online T-shirt store (Facebook page)' },
      { role: 'Private Tutor', dates: '2021 – Present', org: 'Self-employed' },
    ],
    notes: [
      'টিউশনি বা পেজে বিক্রি অফিসের চাকরি না। Work Experience-এর নিচে রাখলে মনে হয় তুমি এগুলোকে চাকরি হিসেবে দেখাতে চাইছ।',
      'পদবি বাড়িয়ে লেখা: বন্ধুর পেজে বিক্রি করে তুমি Sales Manager না। Interview-এ এক প্রশ্নেই ধরা পড়বে।',
    ],
  },
  right: {
    label: 'এভাবে',
    heading: 'EXPERIENCE AND ACTIVITIES',
    entries: [
      { role: 'Class Representative', dates: 'Jan 2022 – Dec 2025', org: 'BBA Batch 2021, Department of Marketing, University of Dhaka' },
      { role: 'Private Tutor', dates: 'Jan 2021 – Present', org: 'Self-employed, Dhaka' },
      { role: 'Sales and Marketing Associate (Part-time)', dates: 'Jun 2024 – Dec 2024', org: 'Online T-shirt store run with friends (Facebook page)' },
    ],
    notes: [
      'Heading নিজেই বলে দিচ্ছে এগুলো চাকরি না, কিন্তু কাজ। কিছু লুকানো নেই, কিছু বাড়ানো নেই।',
      'পদবি সত্যি, সাথে প্রতিষ্ঠান বা প্রেক্ষাপট আর তারিখ। নিচে bullet-এ থাকবে সংখ্যা আর ফলাফল।',
    ],
  },
};

// ---------- 3. What goes where ----------
export const PLACEMENT = {
  kicker: 'What goes where',
  title: 'কোন কাজ কোন section-এ',
  items: [
    {
      heading: 'Work Experience',
      badge: 'এখন সম্ভবত দরকার নেই',
      tone: 'warn',
      text: 'শুধু চাকরি বা internship, যেখানে কোনো প্রতিষ্ঠান তোমাকে নিয়োগ দিয়েছে। এমন কিছু না থাকলে এই section রাখবেই না।',
    },
    {
      heading: 'Experience and Activities',
      badge: 'তোমার মূল section',
      tone: 'main',
      text: 'টিউশনি, CR, ক্লাব, volunteering, event, competition, ফেসবুক পেজে বিক্রি, পারিবারিক ব্যবসা, ছোট freelancing, কোচিং-এ ক্লাস নেওয়া, survey-র কাজ।',
    },
    {
      heading: 'Projects',
      badge: '',
      tone: 'plain',
      text: 'Thesis, research, course-এর group project। Engineering, CSE, architecture-এ এটা আলাদা section হিসেবে রাখতে পারো।',
    },
    { heading: 'Achievements', badge: '', tone: 'plain', text: 'Competition-এ পুরস্কার, scholarship, certificate, ভালো রেজাল্ট।' },
    {
      heading: 'Skills',
      badge: '',
      tone: 'plain',
      text: 'যে software, ভাষা আর কাজ তুমি সত্যি পারো। Interview-এ করে দেখাতে বললে পারবে, এমন।',
    },
  ],
  why: [
    {
      title: 'কেন এটা সৎ',
      text: 'তুমি কোনো পদবি বা প্রতিষ্ঠান বানাচ্ছ না। যা করেছ, সেটাই লিখছ, ঠিক নামের section-এ। Heading দেখেই recruiter বোঝে এগুলো অফিসের চাকরি না।',
    },
    {
      title: 'Recruiter কেন মেনে নেয়',
      text: 'Fresh graduate-এর কাছে কেউ চাকরির অভিজ্ঞতা আশা করে না। তারা দেখে তুমি দায়িত্ব নিতে পারো কি না, মানুষের সাথে কাজ করতে পারো কি না, শুরু করা কাজ শেষ করো কি না।',
    },
  ],
  never: {
    title: 'কখনো না',
    items: ['ভুয়া চাকরি বা internship লেখা', 'পদবি বাড়ানো: Manager, Head, CEO, যা তুমি ছিলে না', 'এমন সংখ্যা, যেটা তুমি interview-এ ব্যাখ্যা করতে পারবে না'],
  },
};

// ---------- 4. The bullet formula ----------
export const BULLET = {
  kicker: 'The bullet formula',
  title: 'একটা ভালো bullet-এর ৪টা অংশ',
  parts: [
    { no: 1, title: 'Action verb', text: 'কাজের শব্দ দিয়ে শুরু', style: 'bg-lime-300 text-slate-900' },
    { no: 2, title: 'কী করেছ', text: 'কী, কার জন্য', style: 'bg-white text-slate-900 border-2 border-slate-900' },
    { no: 3, title: 'সংখ্যা', text: 'কতজন, কত টাকা, কতদিন', style: 'bg-slate-900 text-white' },
    { no: 4, title: 'ফলাফল', text: 'শেষে কী হলো', style: 'bg-white text-slate-900 border-2 border-dashed border-slate-900' },
  ],
  example: {
    verb: 'Taught',
    work: 'Mathematics and Physics to',
    number: '6 students (Class 9–10), 4 days a week;',
    result: '5 got GPA 5.00 in SSC',
  },
  note: 'সব bullet-এ ৪টা অংশ লাগবে না। ফলাফল না থাকলে verb, কাজ আর সংখ্যা দিলেই চলে। (সংখ্যাগুলো উদাহরণ।)',
  whereNumbers: {
    title: 'সংখ্যা কোথায় পাবে',
    items: [
      { label: 'কতজন', text: 'ছাত্র, member, কাস্টমার, অংশগ্রহণকারী' },
      { label: 'কত টাকা', text: 'বিক্রি, ফান্ড, বাজেট' },
      { label: 'কতদিন, কতবার', text: 'মাস, সপ্তাহে কয়দিন, কয়টা event' },
      { label: 'কী হলো', text: 'GPA, পুরস্কার, follower, order, rank' },
    ],
  },
  verbsTitle: 'Action verb, শুরু করার জন্য',
  badStarts: {
    title: 'এভাবে শুরু করবে না',
    items: [
      { phrase: 'Responsible for…', why: 'দায়িত্ব ছিল বলছে, কিন্তু কী করেছ বলছে না।' },
      { phrase: 'Helped with various tasks', why: 'কোন কাজ? কতটা? কিছুই বোঝা যায় না।' },
      { phrase: 'Hard-working and passionate', why: 'সবাই লেখে, কেউ বিশ্বাস করে না। কাজ দিয়ে দেখাও।' },
    ],
  },
};

export const ACTION_VERBS = [
  'Taught', 'Organized', 'Led', 'Sold', 'Managed', 'Coordinated', 'Raised', 'Built', 'Designed', 'Wrote',
  'Analyzed', 'Surveyed', 'Represented', 'Handled', 'Prepared', 'Presented', 'Tracked', 'Delivered',
];

export const WEAK_STRONG = {
  kicker: 'Weak vs strong',
  title: 'দুর্বল bullet, শক্ত bullet',
  subtitle: 'একই কাজ, দুইভাবে লেখা। সংখ্যাগুলো উদাহরণ; তুমি বসাবে নিজেরটা।',
  pairs: [
    {
      weak: 'Did tuition.',
      strong: 'Taught Mathematics to 6 students (Class 9–10); 5 got GPA 5.00 in SSC',
      note: 'কতজন? কোন ক্লাস? কী ফল? দুর্বল লাইনটা কিছুই বলছে না।',
    },
    {
      weak: 'Was the class CR.',
      strong: 'Represented 64 classmates in meetings with faculty; rescheduled 5 clashing exams',
      note: 'পদবির সাথে কাজটা যোগ করো: কাদের হয়ে কথা বলেছ, কী মিটিয়েছ।',
    },
    {
      weak: 'Responsible for social media of the club.',
      strong: 'Wrote 3 posts a week for the club page; followers grew from 1,200 to 3,400 in a year',
      note: '“Responsible for” বাদ দাও। কয়টা পোস্ট, কী বদলেছে, সেটা লেখো।',
    },
    {
      weak: 'Helped in family business.',
      strong: 'Kept credit records for 45 regular customers and collected dues every month',
      note: 'পরিবারের দোকানেও নির্দিষ্ট কাজ থাকে। সেই কাজটার নাম দাও।',
    },
    {
      weak: 'Participated in a business competition.',
      strong: 'Built the Excel financial model for a 3-member team; placed 2nd of 36 teams',
      note: 'অংশ নেওয়া সবাই করে। তুমি নিজে কী করেছ আর দল কোথায় পৌঁছেছে, সেটা লেখো।',
    },
  ],
};

// ---------- 5. 20 small experiences (from the guide, pages 8 to 17) ----------
export const EXPERIENCES = {
  kicker: '20 small experiences',
  title: '২০টা ছোট কাজ, CV-র ভাষায়',
  subtitle: 'প্রতিটায়: একটা সহজ প্রশ্ন, CV-তে কীভাবে লিখবে, আর কোন সংখ্যা খুঁজবে।',
  importantTitle: 'সংখ্যা নিয়ে জরুরি কথা',
  important: 'উদাহরণের সব সংখ্যা বানানো, শুধু বোঝানোর জন্য। তোমার CV-তে লিখবে শুধু তোমার নিজের সত্যি সংখ্যা। Interview-এ যেকোনো সংখ্যা নিয়ে প্রশ্ন আসতে পারে।',
  dateTip: 'তারিখ: মাস আর বছর দাও (Jan 2023 – Present)। প্রতিষ্ঠান না থাকলে: Self-employed, Facebook page বা Family business লেখো।',
  howTo: 'CV-তে এভাবে',
  findLabel: 'তোমার সংখ্যা খোঁজো',
  items: [
  {
    "no": "01",
    "title": "ক্লাসের CR ছিলা?",
    "why": "CR মানে তুমি পুরো ব্যাচের হয়ে স্যারদের সাথে কথা বলেছ, খবর পৌঁছে দিয়েছ, ঝামেলা মিটিয়েছ। এটা leadership আর communication-এর সরাসরি প্রমাণ।",
    "role": "Class Representative",
    "dates": "Jan 2023 – Present",
    "org": "BSc in Physics, Batch 2022, University of Rajshahi",
    "bullets": [
      "Represented 64 classmates in meetings with the department chairman and course teachers",
      "Shared class routines, exam dates and notes through a 70-member Messenger group",
      "Rescheduled 5 clashing mid-term exams by collecting votes and presenting options to faculty"
    ],
    "find": "কতজন ছাত্রছাত্রী, কতদিন CR ছিলে, কয়টা event বা meeting, কোন সমস্যার সমাধান করেছ"
  },
  {
    "no": "02",
    "title": "টিউশনি করাইছো?",
    "why": "টিউশনি মানে তুমি নিয়মিত কাজ করেছ, অভিভাবকের কাছে জবাবদিহি করেছ, আর ফলাফল এনেছ। চাকরিতে ঠিক এটাই লাগে।",
    "role": "Private Tutor",
    "dates": "Mar 2021 – Present",
    "org": "Self-employed, Mirpur, Dhaka",
    "bullets": [
      "Taught Mathematics and Physics to 6 students (Class 9–10), 4 days a week",
      "Gave a written test every month and shared the marks with parents",
      "5 of 6 students got GPA 5.00 in SSC 2024"
    ],
    "find": "কতজন ছাত্র, কোন ক্লাস আর বিষয়, সপ্তাহে কয়দিন, কতজন ভালো রেজাল্ট করেছে"
  },
  {
    "no": "03",
    "title": "ফেসবুক পেজে টি-শার্ট বা জামা বিক্রি করছো?",
    "why": "বন্ধুর পেজ হোক বা নিজের, তুমি বিক্রি করেছ, কাস্টমার সামলেছ, ডেলিভারি মিলিয়েছ। এটা sales আর customer service-এর অভিজ্ঞতা।",
    "role": "Sales and Customer Support (Part-time)",
    "dates": "Jan 2024 – Aug 2024",
    "org": "Facebook clothing page run by a friend, Dhaka",
    "bullets": [
      "Sold 250+ T-shirts and panjabis in 8 months through posts and Messenger",
      "Replied to 30–40 customer messages a day and confirmed orders by phone",
      "Booked home deliveries with 2 courier services; kept returns under 5%"
    ],
    "find": "কয়টা বিক্রি, কত টাকার, দিনে কয়টা message, কত মাস, return কত কম ছিল"
  },
  {
    "no": "04",
    "title": "ভার্সিটির কোনো ক্লাবে ছিলা?",
    "why": "শুধু ‘member’ লিখলে কিছু বোঝা যায় না। ক্লাবে তুমি নিজে কী করেছ, কোন event-এ কী দায়িত্ব ছিল, সেটা লেখো।",
    "role": "Event Secretary",
    "dates": "Jan 2024 – Dec 2024",
    "org": "Photography Club, Khulna University",
    "bullets": [
      "Organized 3 photo walks and a 2-day exhibition of 85 photos by 40 members",
      "Got 2 local sponsors to cover BDT 35,000 of the exhibition cost",
      "Brought 600+ visitors through Facebook posts and class-to-class visits"
    ],
    "find": "কয়টা event, কতজন member, কত টাকার sponsor বা বাজেট, কতজন এসেছিল"
  },
  {
    "no": "05",
    "title": "কোনো event-এ volunteer করছো?",
    "why": "একদিনের volunteer কাজও লেখার মতো, যদি দায়িত্বটা পরিষ্কার হয়: কতজনকে সামলেছ, কোন সমস্যা মিটিয়েছ।",
    "role": "Registration Volunteer",
    "dates": "Mar 2024",
    "org": "Inter-university tech festival, Dhaka",
    "bullets": [
      "Checked in 1,200 participants over 2 days with a team of 10 volunteers",
      "Solved registration problems at the help desk, such as missing names and team changes",
      "Picked as team lead for the second day by the organizing committee"
    ],
    "find": "কতজন অংশগ্রহণকারী, কতজনের টিম, কয়দিন, তোমার নির্দিষ্ট দায়িত্ব"
  },
  {
    "no": "06",
    "title": "Debate বা business competition-এ অংশ নিছো?",
    "why": "জিতলে তো ভালোই। না জিতলেও লেখো তুমি নিজে কী করেছ: research, Excel model, presentation।",
    "role": "Team Member, Business Case Competition",
    "dates": "Oct 2024",
    "org": "Inter-university competition, team of 3",
    "bullets": [
      "Analyzed a case on taking a dairy brand to 2 new districts within 48 hours",
      "Built the financial model in Excel and presented the pricing plan to 4 judges",
      "Team placed 2nd of 36 teams"
    ],
    "find": "কতগুলো টিম ছিল, তোমাদের অবস্থান, তুমি নিজে কোন অংশটা করেছ"
  },
  {
    "no": "07",
    "title": "রক্তদান ক্যাম্প বা সমাজসেবার কাজ করছো?",
    "why": "সমাজসেবার কাজে দেখা যায় তুমি সময় দাও, মানুষ সামলাও, চাপের মধ্যে কাজ করো। ক্যাম্প, donor list, emergency call, সবই লেখার মতো।",
    "role": "Volunteer, Blood Donation Campaign",
    "dates": "2022 – 2024",
    "org": "Voluntary blood donors’ club, University of Barishal",
    "bullets": [
      "Organized 4 campus donation camps with a hospital blood bank",
      "Registered 350+ donors and kept the donor list sorted by blood group",
      "Arranged blood for 60+ emergency requests through the donor list"
    ],
    "find": "কয়টা ক্যাম্প, কতজন donor, কতগুলো request সামলেছ"
  },
  {
    "no": "08",
    "title": "বন্যায় ত্রাণের টাকা তুলছো?",
    "why": "টাকা তোলা, কেনাকাটা, প্যাকিং, হিসাব দেওয়া: এটা fundraising, logistics আর সততার প্রমাণ। হিসাব প্রকাশ করে থাকলে সেটাও লেখো।",
    "role": "Fundraising Coordinator, Flood Relief",
    "dates": "Jun – Jul 2024",
    "org": "Student-led initiative, Sylhet",
    "bullets": [
      "Raised BDT 2.4 lakh from 320 donors through Facebook and bKash in 10 days",
      "Bought and packed food for 500 families with 18 volunteers",
      "Posted a full expense list with receipts on the group page"
    ],
    "find": "কত টাকা উঠেছে, কতজন donor, কত পরিবার পেয়েছে, কতজন volunteer"
  },
  {
    "no": "09",
    "title": "বাবার দোকানে বা পারিবারিক ব্যবসায় বসছো?",
    "why": "পরিবারের ব্যবসা বলে লজ্জার কিছু নেই। ক্যাশ সামলানো, বাকির হিসাব, স্টক রাখা, এগুলো আসল কাজ।",
    "role": "Shop Assistant (Family Business)",
    "dates": "2019 – 2024, holidays",
    "org": "Wholesale grocery shop, Bogura",
    "bullets": [
      "Handled cash sales of BDT 15,000–25,000 a day in the Eid seasons",
      "Kept the credit list (baki khata) for 45 regular customers and collected dues every month",
      "Moved the stock list from a notebook to Excel, which made monthly ordering faster"
    ],
    "find": "দিনে কত টাকার বিক্রি, কতজন নিয়মিত কাস্টমার, কোন কাজটা তুমি সহজ বা ভালো করেছ"
  },
  {
    "no": "10",
    "title": "ছোটখাটো freelancing করছো?",
    "why": "Fiverr হোক বা পরিচিত মানুষের কাজ, টাকা নিয়ে সময়মতো কাজ দিয়েছ মানে তুমি client সামলাতে পারো।",
    "role": "Freelance Graphic Designer",
    "dates": "Jun 2023 – Present",
    "org": "Fiverr and local clients",
    "bullets": [
      "Completed 35 small orders: logos, Facebook covers and product posts",
      "Kept a 4.9 out of 5 rating from 28 reviews",
      "Delivered every order within the agreed 2–3 days"
    ],
    "find": "কয়টা order, কতজন client, rating, কত দিনে ডেলিভারি"
  },
  {
    "no": "11",
    "title": "ফেসবুক পেজ বা YouTube চ্যানেল চালাও?",
    "why": "নিয়মিত content বানানো মানে planning, লেখা, editing আর audience বোঝা। Marketing আর media-র চাকরিতে এটা কাজে লাগে।",
    "role": "Creator, Bangla Accounting Lessons",
    "dates": "2022 – Present",
    "org": "Own YouTube channel",
    "bullets": [
      "Made 48 videos explaining HSC accounting chapters in Bangla",
      "Grew the channel to 8,500 subscribers and 600,000 total views",
      "Answered 20+ student questions a week in the comments"
    ],
    "find": "কয়টা ভিডিও বা পোস্ট, কতজন follower বা subscriber, মোট view, কতদিন ধরে চালাচ্ছ"
  },
  {
    "no": "12",
    "title": "কোচিং সেন্টারে ক্লাস নিসো বা খাতা দেখছো?",
    "why": "কোচিং-এ পড়ানো মানে একসাথে অনেক ছাত্র সামলানো, সময়মতো খাতা দেখা আর রেকর্ড রাখা।",
    "role": "Assistant Teacher (Part-time)",
    "dates": "Jan 2023 – Dec 2024",
    "org": "Neighborhood coaching center, Chattogram",
    "bullets": [
      "Took weekly English grammar classes for 2 batches of 30 students (Class 8)",
      "Checked 150+ test scripts a month and recorded the marks in a sheet",
      "Ran extra question-and-answer sessions before exams, 2 hours a week"
    ],
    "find": "কয়টা ব্যাচ, প্রতি ব্যাচে কতজন, মাসে কতগুলো খাতা, কতদিন"
  },
  {
    "no": "13",
    "title": "Data entry বা survey-র কাজ করছো?",
    "why": "Survey বা data entry মানে নির্ভুলভাবে তথ্য তোলা আর মানুষের সাথে কথা বলা। Research, NGO আর ব্যাংকে এটা দরকারি।",
    "role": "Survey Enumerator (Short-term)",
    "dates": "Aug – Sep 2024",
    "org": "Household survey for a research firm, Rangpur",
    "bullets": [
      "Interviewed 140 households in 6 villages using KoboToolbox on a tablet",
      "Checked every form the same evening; 98% passed the supervisor’s quality check",
      "Explained the purpose of the survey and took consent before each interview"
    ],
    "find": "কতগুলো household বা form, কয়টা এলাকা, কয়দিন, কোন software"
  },
  {
    "no": "14",
    "title": "Thesis বা research করছো?",
    "why": "Thesis মানে তুমি নিজে একটা প্রশ্ন ধরে data তুলেছ, বিশ্লেষণ করেছ আর উপস্থাপন করেছ। চাইলে এটা আলাদা Projects section-এ রাখো।",
    "role": "Undergraduate Thesis",
    "dates": "2024 – 2025",
    "org": "Rooftop rainwater harvesting for Dhaka homes, Jahangirnagar University",
    "bullets": [
      "Surveyed 60 households in Mirpur on water use and roof size",
      "Estimated that a typical 1,200 sq ft roof can collect about 150,000 liters of rain a year",
      "Presented the findings to a 3-member faculty panel; graded A"
    ],
    "find": "কত sample বা data, কোন method বা software, মূল ফলাফল, grade"
  },
  {
    "no": "15",
    "title": "Course-এর group project করছো?",
    "why": "Group project-এ সবাই কাজ করে, তাই তুমি নিজে কোন অংশটা করেছ, সেটা স্পষ্ট করে লেখো।",
    "role": "Course Project: Marketing Plan for a Local Bakery",
    "dates": "Spring 2024",
    "org": "Principles of Marketing, team of 5",
    "bullets": [
      "Surveyed 120 customers on price and taste with Google Forms",
      "Wrote the pricing and social media sections of a 25-page plan",
      "The bakery owner used 2 of our ideas, including a weekday combo offer"
    ],
    "find": "কতজনের টিম, তোমার নিজের অংশ, কত data, প্রজেক্ট থেকে কী হলো"
  },
  {
    "no": "16",
    "title": "খেলার টিমের captain ছিলা?",
    "why": "Captain মানে দল চালানো, practice ঠিক রাখা, হারজিতের দায় নেওয়া। এটা teamwork আর leadership।",
    "role": "Captain, Department Cricket Team",
    "dates": "2023 – 2024",
    "org": "Department of Civil Engineering, RUET",
    "bullets": [
      "Led a squad of 15 players and planned practice 3 days a week",
      "Team reached the final of the inter-department tournament (12 teams)",
      "Managed the team fund of BDT 18,000 for kits and transport"
    ],
    "find": "কতজন খেলোয়াড়, কয়টা টিমের মধ্যে কোথায় ছিলে, সপ্তাহে কয়দিন practice, টাকা সামলেছ কি না"
  },
  {
    "no": "17",
    "title": "স্যারের lab-এ বা TA হিসেবে হেল্প করছো?",
    "why": "Lab বা TA-র কাজ দেখায় শিক্ষকরা তোমাকে বিশ্বাস করেন। Equipment, ছাত্রদের সাহায্য, report দেখা, সব লেখো।",
    "role": "Lab Assistant (Student Volunteer)",
    "dates": "Jan – Dec 2024",
    "org": "Physics teaching lab, University of Chittagong",
    "bullets": [
      "Set up equipment for 8 practical sessions a week, 30 students each",
      "Helped first-year students with 12 experiments and checked their lab reports",
      "Kept the equipment list and reported 15 broken items for repair"
    ],
    "find": "সপ্তাহে কয়টা class, কতজন ছাত্র, কোন কোন দায়িত্ব, কতদিন"
  },
  {
    "no": "18",
    "title": "Online course করে certificate পাইছো?",
    "why": "শুধু certificate-এর নাম না, কী শিখেছ আর কী বানিয়েছ সেটা লেখো। যে course শেষ করোনি, সেটা লিখবে না।",
    "role": "Data Analysis with Excel (Certificate)",
    "dates": "2024",
    "org": "Online course, 6 weeks",
    "bullets": [
      "Practiced pivot tables, XLOOKUP and charts on 30+ exercise files",
      "Built a sales dashboard from 1,000 rows of sample data as the final project"
    ],
    "find": "কোর্সের নাম, কোন platform, কতদিনের, শেষে কী বানিয়েছ"
  },
  {
    "no": "19",
    "title": "স্কুল-কলেজে prefect বা house captain ছিলা?",
    "why": "Fresh graduate হলে স্কুল-কলেজের দায়িত্বও লেখা যায়। তবে university-র কাজগুলোর নিচে রাখো আর ছোট করে লেখো।",
    "role": "House Captain",
    "dates": "2018 – 2019",
    "org": "Jamuna House, [School name], Rajshahi",
    "bullets": [
      "Led a house of 120 students in sports, debate and cultural competitions",
      "Coordinated 30 students for the annual sports day; the house finished 1st of 4"
    ],
    "find": "কতজন ছাত্র, কয়টা প্রতিযোগিতা, ফলাফল"
  },
  {
    "no": "20",
    "title": "বাসা থেকে খাবার বা হাতের কাজ বিক্রি করছো?",
    "why": "ছোট ব্যবসা চালানো মানে অর্ডার, খরচের হিসাব, দাম ঠিক করা, ডেলিভারি, সব একসাথে। নিজের ব্যবসা হলে পদবি লেখো ‘Owner’, ‘CEO’ না।",
    "role": "Owner, Home Food Business",
    "dates": "2022 – Present",
    "org": "Pitha and frozen snacks sold through a Facebook page, Cumilla",
    "bullets": [
      "Took and delivered 90+ orders a month",
      "Kept a cost sheet for every item and priced for a 30% margin",
      "Grew the page to 4,200 followers with food photos and customer reviews"
    ],
    "find": "মাসে কয়টা অর্ডার, লাভ কত শতাংশ, কতজন follower, কতদিন ধরে চালাচ্ছ"
  }
],
};

// ---------- 6. The Claude prompt ----------
export const PROMPT = {
  kicker: 'The Claude prompt',
  title: 'পুরো prompt, কপি করার জন্য',
  subtitle: 'বক্সের পুরো লেখাটা কপি করে Claude-এ পেস্ট করো। কিছু বদলাতে হবে না, শুধু শেষ লাইনের [ ] অংশে job post বা job title দেবে।',
  boxLabel: 'Prompt: copy everything inside this box',
  text: `I'm a student / fresh graduate in Bangladesh with no formal work experience. Help me build a strong one-page CV for entry-level jobs and internships.

First, interview me. Ask one question at a time, in simple Bangla, and wait for my answer before asking the next. Start with my education, then ask about everything I've done outside class: class CR, tuition, clubs, volunteering, events, competitions, online courses, freelancing, selling online, helping in a family business.

For every activity, ask for specifics: what exactly I did, for how long, how many people or how much money was involved, and what the result was.

Never make up or exaggerate anything. Use only the facts I give you. If a number or detail is missing, ask me instead of guessing.

When you have enough, write the CV in English:
- One page, simple single-column layout that ATS software can read
- Sections: Contact, Summary, Education, Experience and Activities, Skills, Achievements
- Put tuition, CR, part-time and informal work under "Experience and Activities", not "Work Experience"
- Start every bullet with an action verb, and include the numbers and results I gave you
- Tailor the summary and skills to this job: [paste the job post, or write the job title]`,
  phoneTip: 'ফোনে কপি করতে: লেখার উপর আঙুল চেপে ধরো, তারপর সিলেক্টের দাগ টেনে বক্সের শেষ লাইন পর্যন্ত নাও। কোনো লাইন বাদ পড়লে আবার কপি করো।',
};

export const NEVER_SKIP = {
  kicker: 'Never skip this line',
  title: 'এই লাইনটা কখনো বাদ দেবে না',
  line: 'Never make up or exaggerate anything. Use only the facts I give you. If a number or detail is missing, ask me instead of guessing.',
  reasons: [
    {
      title: 'Interviewer প্রতিটা লাইন নিয়ে প্রশ্ন করতে পারে',
      text: '“৪০% sales বাড়িয়েছ? কীভাবে মাপলে?” উত্তর না থাকলে পুরো CV-টাই সন্দেহজনক লাগে।',
    },
    {
      title: 'AI ফাঁকা জায়গা ভরাট করে',
      text: 'তথ্য কম পেলে AI এমন সংখ্যা বসায় যেটা শুনতে ঠিক লাগে, কিন্তু সত্যি না। এই লাইন সেটা বন্ধ করে।',
    },
    {
      title: 'সংখ্যা না জানলে Claude জিজ্ঞেস করবে',
      text: 'তখন আন্দাজে বলো না। গুনে নাও, পুরোনো message বা খাতা দেখো, তারপর সত্যি উত্তর দাও।',
    },
  ],
  checkTitle: 'CV পাওয়ার পর এগুলো খুঁজে দেখো',
  checkItems: ['এমন সংখ্যা, যেটা তুমি বলোনি', 'বড় পদবি, যা তুমি ছিলে না: Manager, Head', 'যে software তুমি চালাতে পারো না', '“Increased”, “Boosted”, কিন্তু কতটা জানো না'],
  followUpTitle: 'পেলে Claude-কে এটা পাঠাও',
  followUp: 'Remove anything I did not tell you, and list what you removed.',
};

export const PROMPT_STEPS = {
  kicker: 'Step by step',
  title: 'Prompt দিয়ে CV বানানোর ধাপ',
  steps: [
    { title: 'Claude খোলো, নতুন chat শুরু করো', text: 'claude.ai বা Claude app। পুরোনো chat-এ না, নতুন chat-এ।' },
    { title: 'Prompt পেস্ট করো, শেষ লাইনে job দাও', text: '[ ] অংশটা মুছে সেখানে পুরো job post পেস্ট করো। Job post না থাকলে শুধু পদের নাম লেখো, যেমন Sales Executive। তারপর send।' },
    { title: 'একটা একটা করে উত্তর দাও', text: 'Claude বাংলায় প্রশ্ন করবে। ছোট, সত্যি উত্তর দাও। কোনো সংখ্যা জানা না থাকলে বলো “জানি না”, বা গুনে নিয়ে বলো।' },
    { title: 'প্রতিটা লাইন মিলিয়ে দেখো', text: 'CV পেলে প্রতিটা লাইন পড়ো। ভুল থাকলে লেখো: Change [this] to [that]. যা বলোনি এমন কিছু থাকলে আগের পাতার লাইনটা পাঠাও।' },
    { title: 'আরেকটা version চাও', text: '', code: 'Write a second version with a different summary. Keep every fact the same.' },
    {
      title: 'অন্য চাকরির জন্য মিলিয়ে নাও',
      text: 'তারপর নতুন job post-টা পেস্ট করো।',
      code: 'Here is another job post. Tailor my summary and skills to it. Do not add anything new.',
    },
    {
      title: 'Google Docs বা Word-এ নিয়ে PDF বানাও',
      text: 'লেখাটা কপি করে Google Docs বা Word-এ পেস্ট করো। নিচের একটা template দেখে font, heading আর ফাঁকা জায়গা ঠিক করো। Google Docs: File → Download → PDF Document। Word: File → Save As → PDF।',
      code: 'Give me the final CV as plain text, with each section heading on its own line.',
    },
  ],
};

// ---------- 7. Templates ----------
// The 22 template PDFs are in client/public/cv-guide/templates. There are no images: the page draws a live preview from each PDF.
export const TEMPLATE_PATH = '/cv-guide/templates';

// The page finds the PDFs by trying common file names (01.pdf, template-01.pdf, cv-template-01.pdf ...).
// If your files have other names, write them here, for example: { 1: 'marketing-sales.pdf', 2: 'software-intern.pdf' }
export const TEMPLATE_FILES = {
  "1": "01-marketing-sales-hero.pdf",
  "2": "02-cse-software-intern.pdf",
  "3": "03-eee-graduate-engineer.pdf",
  "4": "04-civil-site-engineer.pdf",
  "5": "05-textile-apparel-trainee.pdf",
  "6": "06-pharmacy-qc-trainee.pdf",
  "7": "07-microbiology-lab.pdf",
  "8": "08-english-content-writer.pdf",
  "9": "09-economics-research-analyst.pdf",
  "10": "10-accounting-finance-entry.pdf",
  "11": "11-hrm-recruitment-trainee.pdf",
  "12": "12-sales-territory-officer.pdf",
  "13": "13-bank-management-trainee.pdf",
  "14": "14-journalism-media-reporter.pdf",
  "15": "15-law-junior-associate.pdf",
  "16": "16-statistics-data-analyst.pdf",
  "17": "17-ngo-field-officer.pdf",
  "18": "18-graphic-designer.pdf",
  "19": "19-math-school-teacher.pdf",
  "20": "20-customer-service-executive.pdf",
  "21": "21-supply-chain-trainee.pdf",
  "22": "22-architecture-junior-architect.pdf"
};

export const TEMPLATES_INTRO = {
  kicker: '22 CV templates',
  title: '২২টা CV template',
  subtitle: 'সবগুলো fresh graduate-এর, কারও চাকরির অভিজ্ঞতা নেই। সব নাম, নম্বর আর ফলাফল কাল্পনিক। ATS-friendly = single column, অনলাইন portal-এর জন্য নিরাপদ।',
};

export const TEMPLATES = [
  { id: 1, role: 'Marketing / Sales', degree: 'BBA, Marketing', layout: 'Classic', ats: true },
  { id: 2, role: 'Software Intern', degree: 'BSc, CSE', layout: 'Compact', ats: true, featured: true },
  { id: 3, role: 'Graduate Engineer', degree: 'BSc, EEE', layout: 'Left sidebar', ats: false },
  { id: 4, role: 'Site Engineer', degree: 'BSc, Civil', layout: 'Accent header', ats: true },
  { id: 5, role: 'Apparel / IE Trainee', degree: 'BSc, Textile Eng.', layout: 'Side labels', ats: false },
  { id: 6, role: 'Pharma QC Trainee', degree: 'B.Pharm', layout: 'Minimal serif', ats: true },
  { id: 7, role: 'Lab / QC Officer', degree: 'BSc, Microbiology', layout: 'Classic', ats: true },
  { id: 8, role: 'Content Writer', degree: 'BA, English', layout: 'Minimal serif', ats: true },
  { id: 9, role: 'Research Assistant', degree: 'BSS, Economics', layout: 'Compact', ats: true },
  { id: 10, role: 'Accounts Officer', degree: 'BBA, Accounting', layout: 'Accent header', ats: true },
  { id: 11, role: 'HR Trainee', degree: 'BBA, HRM', layout: 'Left sidebar', ats: false },
  { id: 12, role: 'Sales Officer (FMCG)', degree: 'BBA, Marketing', layout: 'Classic', ats: true },
  { id: 13, role: 'Bank MTO', degree: 'BBA, Finance', layout: 'Minimal serif', ats: true },
  { id: 14, role: 'Junior Reporter', degree: 'BSS, Journalism', layout: 'Right sidebar', ats: false },
  { id: 15, role: 'Legal Associate', degree: 'LLB', layout: 'Minimal serif', ats: true },
  { id: 16, role: 'Junior Data Analyst', degree: 'BSc, Statistics', layout: 'Side labels', ats: false },
  { id: 17, role: 'NGO Field Officer', degree: 'BSS, Development Studies', layout: 'Accent header', ats: true },
  { id: 18, role: 'Junior Graphic Designer', degree: 'BFA, Graphic Design', layout: 'Right sidebar', ats: false },
  { id: 19, role: 'Math Teacher', degree: 'BSc, Mathematics', layout: 'Left sidebar', ats: false },
  { id: 20, role: 'Customer Service', degree: 'BBS', layout: 'Compact', ats: true },
  { id: 21, role: 'Supply Chain Trainee', degree: 'BBA, SCM', layout: 'Side labels', ats: false },
  { id: 22, role: 'Junior Architect', degree: 'B.Arch', layout: 'Right sidebar', ats: false },
];

export const TEMPLATE_TABS = [
  { id: 'ats', label: 'ATS-Friendly', hint: 'Single column. অনলাইন portal-এ apply করলে এগুলো নাও।' },
  { id: 'two-column', label: 'Two-Column', hint: 'Email-এ পাঠালে বা হাতে দিলে চলবে।' },
];

export const TEMPLATE_ADVICE = {
  title: 'কোনটা নেবে?',
  items: [
    'নিজের বিষয় বা চাকরির কাছাকাছি template নাও, ডিজাইন দেখে না।',
    'অনলাইন portal-এ apply করলে ATS-friendly। অনেক কোম্পানি software দিয়ে CV পড়ে, আর software single column সবচেয়ে ভালো পড়ে।',
    'Email-এ পাঠালে বা হাতে দিলে two-column-ও চলবে।',
  ],
};

export const TEMPLATE_LAYOUTS = {
  title: '৭ রকম layout',
  items: [
    { name: 'Classic', ats: true, text: 'Single column, rules under headings', numbers: '01 07 12' },
    { name: 'Compact', ats: true, text: 'Single column, dense, fits a lot', numbers: '02 09 20' },
    { name: 'Accent header', ats: true, text: 'Single column under a colored header', numbers: '04 10 17' },
    { name: 'Minimal serif', ats: true, text: 'Single column, formal serif type', numbers: '06 08 13 15' },
    { name: 'Left sidebar', ats: false, text: 'Two columns, details on the left', numbers: '03 11 19' },
    { name: 'Side labels', ats: false, text: 'Section names in a left column', numbers: '05 16 21' },
    { name: 'Right sidebar', ats: false, text: 'Two columns, skills on the right', numbers: '14 18 22' },
  ],
};

// ---------- 8. Checklist ----------
export const CHECKLIST = {
  kicker: 'Before you send',
  title: 'পাঠানোর আগে checklist',
  items: [
    { title: 'এক পাতা', text: 'Fresh graduate-এর জন্য এক পাতাই যথেষ্ট।' },
    { title: 'PDF ফাইল', text: 'Word ফাইল অন্য কম্পিউটারে খুললে layout ভেঙে যেতে পারে। PDF সব জায়গায় একই রকম দেখায়।' },
    { title: 'ফাইলের নাম: Name_CV.pdf', text: 'যেমন Tahsin_Rahman_CV.pdf। “cv final new (2).pdf” না।' },
    { title: 'এই চাকরির জন্য মিলিয়ে নেওয়া', text: 'Summary আর Skills job post-এর সাথে মেলে। প্রতিটা চাকরির জন্য একটু করে বদলাও।' },
    { title: 'সব সংখ্যা সত্যি', text: 'প্রতিটা লাইন interview-এ নিজের মুখে ব্যাখ্যা করতে পারবে।' },
    { title: 'বানান আর grammar দেখা', text: 'জোরে একবার পড়ো, তারপর একজন বন্ধুকে দেখাও।' },
    { title: 'Phone আর email ঠিক আছে', text: 'Email-টা নাম দিয়ে বানানো, যেমন firstname.lastname@…, কোনো ডাকনাম না।' },
    { title: 'Experience and Activities, Work Experience না', text: 'চাকরি না থাকলে Work Experience section রাখবেই না।' },
  ],
  closingTitle: 'তোমার কাজগুলো ছোট না।',
  closing: 'এতদিন শুধু ঠিকভাবে লেখা হয়নি। এবার লেখো, মিলিয়ে নাও, পাঠাও। Interview-এর জন্য শুভকামনা।',
};