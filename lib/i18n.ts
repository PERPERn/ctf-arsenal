import type { Lang } from "./types";

export const ui = {
  brand: { th: "CTF Arsenal", en: "CTF Arsenal" },
  tagline: {
    th: "คลังเครื่องมือ Cybersecurity & CTF พร้อมคู่มือสองภาษาและเดโมสด",
    en: "A curated arsenal of cybersecurity & CTF tools with bilingual guides and live demos",
  },
  heroTitle: { th: "เครื่องมือแฮ็กที่ดีที่สุด รวมไว้ที่เดียว", en: "Every hacking tool you need, in one place" },
  heroSub: {
    th: "ค้นหาเครื่องมือตามหมวด อ่านคู่มือไทย/อังกฤษ ดูคำสั่งจริงเล่นเป็นเทอร์มินัลสด แล้วลงมือได้ทันที",
    en: "Search by category, read Thai/English guides, watch real commands replay in a live terminal, and get to work.",
  },
  searchPlaceholder: { th: "ค้นหาเครื่องมือ เช่น nmap, xor, hash…", en: "Search tools e.g. nmap, xor, hash…" },
  allTools: { th: "ทั้งหมด", en: "All" },
  featured: { th: "แนะนำ", en: "Featured" },
  installed: { th: "ลงในเครื่องแล้ว", en: "Installed" },
  tools: { th: "เครื่องมือ", en: "tools" },
  categories: { th: "หมวดหมู่", en: "Categories" },
  noResults: { th: "ไม่พบเครื่องมือที่ตรงกับคำค้น", en: "No tools match your search" },
  // detail page
  overview: { th: "ภาพรวม", en: "Overview" },
  install: { th: "ติดตั้ง", en: "Install" },
  usage: { th: "การใช้งาน", en: "Usage" },
  cheatsheet: { th: "ชีตสรุป", en: "Cheatsheet" },
  demo: { th: "เดโม", en: "Demo" },
  notes: { th: "โน้ตจากเรา", en: "Our notes" },
  officialDocs: { th: "เอกสารต้นฉบับ", en: "Official docs" },
  sourceRepo: { th: "ซอร์สโค้ด", en: "Source repo" },
  copy: { th: "คัดลอก", en: "Copy" },
  copied: { th: "คัดลอกแล้ว", en: "Copied" },
  back: { th: "กลับ", en: "Back" },
  difficulty: { th: "ระดับ", en: "Difficulty" },
  play: { th: "เล่น", en: "Play" },
  replay: { th: "เล่นซ้ำ", en: "Replay" },
  pause: { th: "หยุด", en: "Pause" },
  speed: { th: "ความเร็ว", en: "Speed" },
  relatedIn: { th: "เครื่องมืออื่นในหมวด", en: "More in" },
  home: { th: "หน้าแรก", en: "Home" },
  guidesNav: { th: "คู่มือ", en: "Guides" },
  aboutNav: { th: "เกี่ยวกับ", en: "About" },
  deployTitle: { th: "นำไปรันเอง", en: "Deploy your own" },
  builtWith: { th: "สร้างด้วย", en: "Built with" },
  disclaimer: {
    th: "ใช้เพื่อการศึกษาและการทดสอบที่ได้รับอนุญาตเท่านั้น",
    en: "For education and authorised testing only.",
  },
  jumpCategory: { th: "ไปยังหมวด", en: "Jump to category" },
} as const;

export type UIKey = keyof typeof ui;
export const t = (key: UIKey, lang: Lang) => ui[key][lang];
