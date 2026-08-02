// ============================================================
// SARNSARENE — single source of truth for all landing page copy
// and image paths. Edit values here; every section reads from
// this file, so there is only ever one place to change text
// or swap an image.
// ============================================================

export const brand = {
  name: "SARNSARENE",
  legalName: "SARNSARENE",
};

export const announcement = {
  message: "SARNSARENE — Contemporary Thai Craft · หรูอย่างสงบ",
};

export const nav = {
  links: [
    { label: "Philosophy", href: "#philosophy" },
    { label: "Our Roots", href: "#story" },
    { label: "The Tote", href: "#collection" },
    { label: "Journal", href: "#sustainability" },
  ],
};

export const hero = {
  eyebrow: "SARNSARENE — Est. Bangkok",
  title: "หรูอย่างสงบ",
  subtitle:
    "แบรนด์ดีไซน์ไทยร่วมสมัยที่ยกระดับวัสดุและงานทอไทย ให้เป็นผลิตภัณฑ์ที่ใช้งานได้จริง แข็งแรง และหรูแบบสงบในทุกวัน",
  ctaPrimary: { label: "Explore The Tote", href: "#collection" },
  ctaSecondary: { label: "Our Philosophy", href: "#philosophy" },
  image: "/images/hero.jpg",
};

export const philosophy = {
  eyebrow: "Core Values",
  title: "Our Philosophy",
  items: [
    { icon: "circle" as const, title: "Balance", description: "นุ่มนวล แต่มั่นคง — ความสมดุลระหว่างความอ่อนโยนของงานทอกับความแข็งแรงที่ใช้งานได้จริงในทุกวัน" },
    { icon: "weave" as const, title: "Contemporary Thai Craft", description: "งานทอไทยที่ถูกยกระดับด้วยดีไซน์ร่วมสมัย ผสานภูมิปัญญาดั้งเดิมเข้ากับรูปทรงที่ใช้งานได้จริง" },
    { icon: "drop" as const, title: "Quiet Luxury", description: "ความหรูหราที่ไม่ต้องตะโกน สื่อสารผ่านรายละเอียด วัสดุ และงานฝีมือที่ประณีต" },
    { icon: "leaf" as const, title: "Considered Living", description: "ใช้ชีวิตอย่างตั้งใจ เลือกสิ่งที่มีความหมาย และอยู่กับของที่ดีไปได้นาน" },
  ],
};

export const ourStory = {
  eyebrow: "Where It Began",
  title: "Our Roots",
  paragraphs: [
    "ชื่อ SARNSARENE มาจากคำว่า “สาน” — การถักทอเส้นด้ายให้กลายเป็นผืนผ้า และ “Serene” ความสงบนิ่ง สองความหมายที่ประกอบกันเป็นหัวใจของแบรนด์ นั่นคือการสานความสงบเข้าไว้ในทุกชิ้นงาน",
    "เราเกิดขึ้นเพื่อเปลี่ยนมุมมองต่อวัสดุและงานทอไทย ให้ก้าวออกจากภาพจำของความดั้งเดิมหรือของที่ระลึก สู่การเป็นส่วนหนึ่งของชีวิตร่วมสมัยที่ผู้คนใช้ได้จริง ภูมิใจได้ และสัมผัสได้ถึงความหรูอย่างสงบในทุกวัน",
    "ทุกใบผ่านมือช่างทอไทยที่สืบทอดฝีมือจากรุ่นสู่รุ่น ก่อนถูกยกระดับด้วยโครงสร้างและดีไซน์ที่ตอบโจทย์จังหวะชีวิตในเมือง",
  ],
  image: "/images/story.jpg",
};

export const easternInspiration = {
  eyebrow: "Rooted in Thai Craft",
  title: "Contemporary Thai Weaving",
  sections: [
    { title: "The Art of Thai Weaving", description: "จากกี่ทอโบราณสู่ผืนผ้าที่แข็งแรงและงดงาม เราคัดสรรวัสดุและงานทอไทยที่มีคุณภาพ เพื่อนำมาออกแบบใหม่ให้เข้ากับจังหวะชีวิตสมัยใหม่", image: "/images/eastern-1.jpg", reverse: false },
    { title: "Detail in Every Stitch", description: "ตะขอทองเหลืองรูปหยดน้ำ อักษร SARNSARENE ที่สลักอย่างประณีต และหูหิ้วที่ขึ้นรูปด้วยมือ คือรายละเอียดที่บอกเล่าความใส่ใจในทุกขั้นตอน", image: "/images/eastern-2.jpg", reverse: true },
  ],
};

export const signatureExperience = {
  eyebrow: "Made To Live With",
  title: "Signature Details",
  cards: [
    { title: "Woven Texture", description: "พื้นผิวทอลายพิเศษเฉพาะของแบรนด์ ผสานความทนทานเข้ากับสัมผัสที่นุ่มนวลราวกับผ้าไหม" },
    { title: "Gold-Finish Hardware", description: "ตะขอและอุปกรณ์ตกแต่งชุบทองอย่างประณีต ทนทานต่อการใช้งานในทุกวัน" },
    { title: "Considered Silhouette", description: "ทรงถือที่จุของกว้างขวาง สมดุลระหว่างความจุใช้งานจริงกับเส้นสายที่เรียบหรู" },
  ],
};

export const highlightQuote = {
  quote: "เราเชื่อในพลังของการสาน — การนำเส้นด้ายเล็ก ๆ มาถักทอจนกลายเป็นสิ่งที่แข็งแรงและงดงาม เช่นเดียวกับที่เราสานความตั้งใจลงในทุกชิ้นงาน",
  attribution: "— SARNSARENE",
};

export const brandManifesto = {
  eyebrow: "Our Manifesto",
  title: "หรูอย่างสงบ ไม่ต้องตะโกน",
  paragraphs: [
    "เราเชื่อว่าความหรูหราที่แท้จริงไม่จำเป็นต้องส่งเสียงดัง ในโลกที่หมุนไปอย่างรวดเร็ว เราเลือกเดินช้าลง ให้ความสำคัญกับรายละเอียด วัสดุ และฝีมือมากกว่าความหวือหวา",
    "เราเชื่อว่างานฝีมือไทยกับความร่วมสมัยไม่ใช่สิ่งตรงข้ามกัน งานทอที่ดีที่สุดคืองานทอที่เก่าแก่ที่สุด เพียงแต่ถูกเล่าใหม่ผ่านความใส่ใจ การออกแบบ และความเคารพในภูมิปัญญาดั้งเดิม",
    "นี่คือคำมั่นของเรา สร้างสรรค์อย่างซื่อตรง ออกแบบโดยไม่ประนีประนอม และรักษาคุณค่าของงานฝีมือไทยไว้ในทุกชิ้นที่ส่งต่อถึงคุณ",
  ],
};

export const featuredCollection = {
  eyebrow: "Shop The Edit",
  title: "The Signature Tote",
  viewAll: "Enquire",
  products: [
    { name: "Champagne Gold", description: "เฉดสีทองชิมเมอร์ ซิกเนเจอร์ของแบรนด์", detail: "Signature Colorway", image: "/images/product-4.jpg" },
    { name: "Onyx Black", description: "เรียบหรู เข้ากับทุกการแต่งกาย", detail: "All-Season Black", image: "/images/product-1.jpg" },
    { name: "Warm Sand", description: "โทนสีที่สะท้อนตัวตนของ SARNSARENE", detail: "Brand Signature Tone", image: "/images/product-2.jpg" },
    { name: "Ivory Cream", description: "นวลตา อ่อนโยน เหมาะกับทุกวัน", detail: "Everyday Neutral", image: "/images/product-3.jpg" },
    { name: "Dove Grey", description: "เรียบง่ายแต่ยังคงมีสไตล์", detail: "Modern Neutral", image: "/images/product-5-grey.jpg" },
  ],
};

export const journeyForward = {
  eyebrow: "What Comes Next",
  title: "Woven For What's Next",
  description: "เรายังคงเดินหน้าต่อไปด้วยความตั้งใจเดิม ยกระดับวัสดุและงานทอไทยให้กลายเป็นผลิตภัณฑ์ร่วมสมัยที่ใช้งานได้จริง แข็งแรง และหรูอย่างสงบ เพื่อพางานฝีมือไทยให้เป็นที่ยอมรับในระดับสากล",
  image: "/images/journey.jpg",
};

export const complimentaryServices = {
  items: [
    { icon: "box" as const, label: "Complimentary Shipping" },
    { icon: "gift" as const, label: "Signature Gift Wrapping" },
    { icon: "chat" as const, label: "Personal Consultation" },
    { icon: "globe" as const, label: "Worldwide Delivery" },
  ],
};

export const sustainability = {
  eyebrow: "Our Responsibility",
  title: "Woven With Care",
  description: "ทุกการตัดสินใจของเราถูกชั่งน้ำหนักจากผลกระทบที่มีต่อช่างฝีมือผู้สร้างสรรค์งานทอ และคุณค่าของภูมิปัญญาไทยที่เราตั้งใจสืบสาน",
  bullets: ["Local Thai Artisans", "Small-Batch Production", "Considered Materials", "Made To Last"],
  cta: { label: "Learn More", href: "#" },
  image: "/images/sustainability.jpg",
};

export const newsletter = {
  title: "Join The Journey",
  subtitle: "สมัครรับข่าวสารเพื่อเป็นคนแรกที่ได้พบกับคอลเลกชันใหม่ เรื่องราวเบื้องหลังงานฝีมือ และการเปิดตัวพิเศษจาก SARNSARENE",
  placeholder: "your@email.com",
  button: "Subscribe",
};

export const footer = {
  tagline: "งานทอไทยร่วมสมัย หรูอย่างสงบ\nBangkok, Thailand",
  columns: [
    { title: "Explore", items: ["The Signature Tote", "Colorways", "Care Guide", "Journal"] },
    { title: "About", items: ["Our Philosophy", "Our Roots", "Sustainability", "Journal"] },
    { title: "Support", items: ["Contact Us", "Shipping & Returns", "FAQs", "Care Guide"] },
    { title: "Follow Us", items: ["Instagram", "Facebook", "Pinterest", "TikTok"] },
  ],
  copyright: "© 2026 SARNSARENE. All rights reserved.",
  legal: "Privacy Policy · Terms of Service",
};
