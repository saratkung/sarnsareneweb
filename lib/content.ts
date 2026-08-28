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
  message: "",
};

export const nav = {
  links: [
    { label: "The meaning behind the name", href: "#philosophy" },
    { label: "Our Roots", href: "#story" },
    // Opens the standalone brand-film page at /journey.
    { label: "Our Journey", href: "/journey" },
  ],
};

export const hero = {
  eyebrow: "",
  title: "WOVEN SERENITY",
  subtitle: "สัมผัสแห่งความสงบอันปราณีต",
  ctaPrimary: { label: "", href: "#collection" },
  ctaSecondary: { label: "", href: "#philosophy" },
  image: "/images/hero.jpg",
};

export const philosophy = {
  eyebrow: "",
  title: "The meaning behind the name",
  items: [
    { icon: "weave" as const, title: "SARN", description: "รากจากภาษาไทย \"สาน\" สะท้อนศิลปะแห่งการเชื่อมโยงผู้คนและวัฒนธรรม ให้ก่อกำเนิดคุณค่าที่ยั่งยืน" },
    { icon: "drop" as const, title: "SARENE", description: "รากจากภาษาละติน serēnus สะท้อนความสงบอันบริสุทธิ์ ความแจ่มใส และความมั่นคงจากภายใน" },
  ],
};

export const ourStory = {
  eyebrow: "",
  title: "Brand Philosophy & Story",
  rootHeading: "Our Roots",
  bannerSubtitle: "",
  paragraphs: [
    "SARNSARENE ก่อตั้งขึ้นบนความหลงใหลในขุมทรัพย์วัตถุดิบและภูมิปัญญาไทย มุ่งมั่นที่จะเปลี่ยนผ่านวัฒนธรรมอันทรงคุณค่า ให้กลายเป็นสัมผัสแห่งความสงบและความยั่งยืนภายในกายและใจ",
    "เรื่องราวเริ่มต้นจากความทรงจำอันงดงามของการมองเห็นเส้นใยธรรมชาติถูกถักทอทีละเส้นบนกี่ทอผ้าโบราณ ควบคู่ไปกับกลิ่นหอมอ่อนๆ ของธรรมชาติที่ลอยมาตามลม ช่วงเวลาแห่งความสมดุลนี้ได้จุดประกายความหลงใหลในพลังของการเยียวยา ผ่านสัมผัสที่ละเมียดละไม กลิ่นหอมอันเงียบสงบ และจังหวะที่เรียบง่ายของงานฝีมือแบบ Slow Craftsmanship",
    "ในโลกที่เร่งรีบและเต็มไปด้วยความวุ่นวาย SARNSARENE จึงถูกสร้างขึ้นเพื่อให้ทุกคนได้กลับมารับรู้ถึงความสงบ คืนความสมดุลให้กับกาย จิตใจ และพื้นที่รอบตัว ผ่านความหรูหราที่เรียบง่ายและเหนือกาลเวลา",
  ],
  image: "/images/story.jpg",
  bannerImage: "/images/story-banner.jpg",
};

export const easternInspiration = {
  eyebrow: "บริสุทธิ์ เรียบง่าย และจริงใจต่อการใช้งานจริง",
  title: "Natural Integrity",
  sections: [
    { title: " Thai Botanical & Textile Wealth", description: "คัดสรรและรวบรวมวัตถุดิบธรรมชาติ รวมถึงสิ่งทออันทรงคุณค่าจากทั่วทุกภูมิภาคของไทย นำมาเป็นหัวใจหลักในการรังสรรค์ เพื่อส่งมอบสัมผัสและกลิ่นไออันเป็นเอกลักษณ์ของท้องถิ่นอย่างแท้จริง", image: "/images/eastern-1.jpg", reverse: false },
    { title: " Thoughtful Blend for Everyday Comfort", description: "นำเสน่ห์ของสิ่งทอไทยมาผสมผสานและพัฒนาโครงสร้างเส้นใยให้เข้ากับชีวิตยุคใหม่ เพื่อเพิ่มความทนทาน ดูแลรักษาง่าย เบาสบาย และตอบโจทย์การใช้งานในชีวิตประจำวันได้อย่างลงตัวที่สุด", image: "/images/eastern-2.jpg", reverse: true },
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
    { title: "Follow Us", items: ["Instagram", "Facebook", "Pinterest", "TikTok"] },
  ],
  copyright: "© 2026 SARNSARENE. All rights reserved.",
  legal: "Privacy Policy · Terms of Service",
};
