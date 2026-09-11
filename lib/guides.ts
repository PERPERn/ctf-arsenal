import type { Localized } from "./types";

export interface Guide {
  id: string; icon: string; title: Localized; summary: Localized;
  steps: { title: Localized; body: Localized; tools: string[] }[];
}

export const guides: Guide[] = [
  {
    id: "first-blood", icon: "🩸",
    title: { th: "เริ่มโจทย์ยังไงดี — playbook คร่าว ๆ", en: "How to start any challenge — a quick playbook" },
    summary: { th: "ลำดับการคิดเวลาเจอโจทย์ใหม่ ไม่ว่าหมวดไหน", en: "A thinking order for any new challenge, whatever the category." },
    steps: [
      { title: { th: "ดูก่อนว่าได้อะไรมา", en: "See what you were given" },
        body: { th: "ไฟล์? URL? host:port? ข้อความ? รันไฟล์ผ่าน `file` และโยนเข้า ctfid/Identify ก่อนเสมอ เพื่อรู้ว่ากำลังเจอกับอะไร", en: "A file? URL? host:port? text? Run files through `file` and drop them into ctfid/Identify first to learn what you're dealing with." },
        tools: ["ctfid", "exiftool", "binwalk"] },
      { title: { th: "เก็บผลเบื้องต้น", en: "Grab the low-hanging fruit" },
        body: { th: "`strings`, metadata, comment ใน HTML, robots.txt, ไฟล์ที่ฝัง — flag ง่าย ๆ มักอยู่ตรงนี้", en: "`strings`, metadata, HTML comments, robots.txt, embedded files — easy flags often hide here." },
        tools: ["ctfid", "exiftool", "binwalk"] },
      { title: { th: "เลือกเครื่องมือตามหมวด", en: "Pick tools by category" },
        body: { th: "web → ffuf/sqlmap, crypto → RsaCtfTool/ctfid, forensic → volatility/wireshark, rev → ghidra/r2, stego → zsteg/stegseek", en: "web → ffuf/sqlmap, crypto → RsaCtfTool/ctfid, forensics → volatility/wireshark, rev → ghidra/r2, stego → zsteg/stegseek." },
        tools: ["ffuf", "ghidra", "wireshark"] },
    ],
  },
  {
    id: "decode-anything", icon: "🔗",
    title: { th: "ถอดข้อความอะไรก็ได้ให้เป็น flag", en: "Turn any garbled string into a flag" },
    summary: { th: "ลำดับการลองถอด encoding และ cipher", en: "The order to try encodings and ciphers." },
    steps: [
      { title: { th: "ให้ Identify เดาให้ก่อน", en: "Let Identify guess first" },
        body: { th: "วางลงกล่อง Identify มันไล่ base64/hex/base32/url/rot/xor/morse ให้เป็นชั้น ๆ อัตโนมัติ", en: "Paste into the Identify box; it chains base64/hex/base32/url/rot/xor/morse automatically." },
        tools: ["ctfid"] },
      { title: { th: "ถ้ายังไม่ออก ลอง CyberChef", en: "Still stuck? Try CyberChef" },
        body: { th: "ต่อ recipe เอง หรือกด Magic ให้มันเดา เหมาะกับ encoding แปลก ๆ ที่ซ้อนกันหลายชั้น", en: "Build a recipe by hand or hit Magic. Great for exotic, multi-layered encodings." },
        tools: ["cyberchef", "chepy"] },
      { title: { th: "XOR ที่ไม่รู้ key", en: "XOR with an unknown key" },
        body: { th: "single-byte ให้ Identify/`ctfid -x` จัดการ; repeating-key ใช้ xortool เดาความยาว key", en: "Single-byte: let Identify/`ctfid -x` handle it. Repeating-key: use xortool to guess the length." },
        tools: ["xortool", "ctfid"] },
    ],
  },
  {
    id: "hash-crack", icon: "🔑",
    title: { th: "เจอแฮช ทำยังไงต่อ", en: "You found a hash — now what" },
    summary: { th: "ตั้งแต่ระบุชนิดจนแครกสำเร็จ", en: "From identifying the type to a successful crack." },
    steps: [
      { title: { th: "ระบุชนิดแฮช", en: "Identify the hash type" },
        body: { th: "ให้ ctfid/name-that-hash บอกชนิดและโหมด hashcat/John ที่ตรงกัน", en: "Let ctfid/name-that-hash tell you the type and the matching hashcat/John modes." },
        tools: ["name-that-hash", "hashid", "ctfid"] },
      { title: { th: "ลอง lookup ก่อนแครก", en: "Look it up before cracking" },
        body: { th: "แฮชยอดนิยมมักถูกแครกไว้แล้วบน crackstation.net ประหยัดเวล", en: "Common hashes are often already cracked on crackstation.net — saves time." },
        tools: [] },
      { title: { th: "แครกด้วย wordlist + rules", en: "Crack with a wordlist + rules" },
        body: { th: "`hashcat -m <mode> hash.txt rockyou.txt -r best64.rule` หรือ `john --wordlist`; ไฟล์ล็อกใช้ *2john", en: "`hashcat -m <mode> hash.txt rockyou.txt -r best64.rule` or `john --wordlist`; locked files use *2john." },
        tools: ["hashcat", "john"] },
    ],
  },
  {
    id: "stego-hunt", icon: "🖼️",
    title: { th: "ล่าข้อมูลที่ซ่อนในรูป/ไฟล์", en: "Hunt data hidden in images / files" },
    summary: { th: "ลำดับตรวจ steganography", en: "The order to check for steganography." },
    steps: [
      { title: { th: "metadata + ไฟล์ฝัง", en: "Metadata + embedded files" },
        body: { th: "`exiftool` ดูฟิลด์ comment/GPS แล้ว `binwalk -e` แกะไฟล์ที่ต่อท้าย", en: "`exiftool` for comment/GPS fields, then `binwalk -e` to carve appended files." },
        tools: ["exiftool", "binwalk"] },
      { title: { th: "PNG/BMP → LSB", en: "PNG/BMP → LSB" },
        body: { th: "`zsteg -a` ไล่ทุก channel/บิต; หรือ stegoveritas ยิงทุกเทคนิค", en: "`zsteg -a` sweeps every channel/bit; or stegoveritas throws everything at once." },
        tools: ["zsteg", "stegoveritas"] },
      { title: { th: "JPEG → steghide", en: "JPEG → steghide" },
        body: { th: "`stegseek pic.jpg rockyou.txt` แครก passphrase; ไม่มีรหัสลอง `--seed`", en: "`stegseek pic.jpg rockyou.txt` cracks the passphrase; no password? try `--seed`." },
        tools: ["stegseek"] },
      { title: { th: "เสียง → spectrogram", en: "Audio → spectrogram" },
        body: { th: "เปิดใน Sonic Visualiser/Audacity ดู spectrogram — flag มักเป็นตัวหนังสือในสเปกตรัม", en: "Open in Sonic Visualiser/Audacity and read the spectrogram — flags are often text in the spectrum." },
        tools: ["sonic-visualiser"] },
    ],
  },
];
