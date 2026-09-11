# CTF toolkit (macOS, installed 2026-09-10)

## ctf-helper.sh — encode/decode multitool

`ctf-helper.sh` (alias `ctfh`) at `~/.local/bin`. Wrapper around the installed
tools with one-shot encode/decode modes. Input may be literal text, a file
path, or `-` for stdin.

```sh
ctf-helper.sh help                       # banner + full mode list
ctf-helper.sh id   "Q1RUe2h9"            # auto-identify + decode (ctfid)
ctf-helper.sh hash 5d41402a...           # name-that-hash + hashid
ctf-helper.sh file suspicious.png        # magic / exif / binwalk / strings
ctf-helper.sh enc-b64 "text"             # encode: b64 b64url b32 hex url html
ctf-helper.sh dec-b64 "Q1RU..."          #   bin dec rot13 rot(N) morse rev xor
ctf-helper.sh enc-xor "text" secretkey   # xor -> hex ; dec-xor reverses it
ctf-helper.sh enc-rot "text" 7           # caesar shift N ; dec-rot to reverse
ctf-helper.sh crack-hash hash.txt [wl]   # john --wordlist
ctf-helper.sh rsa pub.pem                # RsaCtfTool --private
ctf-helper.sh steg-png img.png           # zsteg -a
ctf-helper.sh qr img.png                 # zbarimg    ocr img.png -> tesseract
```

Morse table lives at `~/.local/lib/ctf-helper/morse.py`. For deep/chained
decoding use `ctfid` directly; `ctf-helper.sh` is for known single transforms.

## ctfid — paste anything, get an identification

`ctfid` lives at `~/.local/bin/ctfid` (pure Python 3, no dependencies). It
identifies a string or file and then tries to decode it, chaining decoders
until the result looks like plaintext or matches a flag format.

```sh
ctfid "VGhpcyBpcyBhIHRlc3Q="      # identify + decode a string
ctfid suspicious.png              # file mode: magic, exiftool, binwalk, strings
cat blob.bin | ctfid              # read from stdin
ctfid                             # interactive REPL: paste a line, get an answer
ctfid -q <input>                  # answer only, good for scripting
ctfid -x <input>                  # also run repeating-key XOR analysis
ctfid -d 8 <input>                # deeper decoder chain (default depth 6)
```

REPL commands: `:h` help, `:d N` set depth, `:x <text>` deep XOR,
`:f <path>` analyse a file, `:zw <text>` dump zero-width characters, `:q` quit.

For each thing it recognises, `ctfid` also prints a **how to solve** block naming the tool or method to use next (crack a hash, `zsteg` a PNG, `RsaCtfTool` a modulus, `r2`/ghidra an ELF, wireshark a pcap, …); a `✓` means that tool is already installed here, `○` that it is not.

What it recognises: MD5/SHA/NTLM and other hashes (cross-checked with
name-that-hash when installed), Unix crypt hashes, JWT (flags `alg:none`),
UUID, MAC, IPv4, Unix timestamps, PEM blocks, JSON, 40+ file magic signatures,
zero-width steganography, and high-entropy blobs.

What it decodes, alone or chained: base64/base64url/base32/base16/base58/
base62/base85/ascii85/base91, hex and spaced hex, decimal, binary, octal,
URL-encoding, HTML entities, unicode escapes, quoted-printable, ROT13, ROT47,
Atbash, Caesar (best shift), reverse, Morse, Brainfuck, Ook!, gzip, zlib,
bzip2, and single-byte XOR.

Flag prefixes it treats as a confirmed hit: CTT, THCTT, flag, ctf, delta,
tjctf, SIT, ITCLASH, ITOPENHOUSE, picoCTF, HTB, and anything containing "ctf".

## Installed tools

Crypto and hashes: `nth` (name-that-hash), `hashid`, `xortool`, `RsaCtfTool`
(`rsacrack`), `john` (jumbo), `hashcat`, `openssl`.

Web: `ffuf`, `feroxbuster`, `gobuster`, `sqlmap`, `nuclei`, `httpx`, `wget`,
`curl`.

Reverse engineering and pwn: `ghidra` (`ghidraRun`), `r2` (radare2), `gdb`,
`pwntools` (`pwn`, `checksec`, `cyclic`, `shellcraft`, `disasm`), `ROPgadget`, `upx`, `capstone`, `jadx`, `apktool`, `d2j-dex2jar`, `qemu`.

Forensics and steganography: `binwalk`, `exiftool`, `foremost`, `zsteg`
(PNG/BMP LSB), `stegseek` (JPEG steghide crack/extract), `stegoveritas`, `sleuthkit`, `vol` (Volatility 3), `pngcheck`, `zbarimg`
(QR/barcode), `tesseract` (OCR), `p7zip`, `cabextract`, `chepy` (CyberChef
in Python).

Network: `nmap`, `wireshark`/`tshark`, `tcpflow`, `masscan`, `socat`,
`aircrack-ng`, `hydra`, `yara`.

Notes:
- `gdb` on macOS needs code-signing to attach to processes; `lldb` works out
  of the box, and `qemu` covers non-arm64 binaries.
- `stegseek` was built from source (no Homebrew formula) into `~/.local/bin`;
  it replaces `steghide` for JPEG work — extract with a known passphrase
  (`stegseek --extract -sf f.jpg -p PASS -xf out`), brute-force
  (`stegseek f.jpg rockyou.txt`), or try the default seed (`stegseek --seed
  f.jpg`). It links `libmcrypt` from `~/.local/ctf-deps` (also built from
  source). `stegoveritas` covers other image steganography;
  run `stegoveritas_install_deps` once first.
- Python CLI tools are installed as isolated `uv` tools; upgrade them with
  `uv tool upgrade --all`.

## Disk

The Homebrew cache was cleared during install (`brew cleanup --prune=all`,
3.6 GB freed) because the volume had hit 100%. Free space is tight — check
`df -h /System/Volumes/Data` before large installs.
