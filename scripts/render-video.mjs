import { dependencyRequire } from "./dependencies.mjs";
import { writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { once } from "node:events";
const sharp = dependencyRequire("sharp");
const W = 1120,
  H = 760;
const frog = (
  x,
  y,
  s,
  phase,
  flip = false,
) => `<g transform="translate(${x} ${y + Math.sin(phase) * 3}) scale(${flip ? -s : s} ${s})" stroke="#0a251c" stroke-width="5" stroke-linejoin="round">
 <path d="M-104 242 Q-111 123 -65 101 Q0 77 67 103 Q113 129 106 242Z" fill="#233e38"/>
 <path d="M-58 106 L0 143 L56 106 L43 216 L-43 216Z" fill="#142d26"/><path d="M-58 108 L-30 166 L0 142 L31 166 L58 108" fill="none" stroke="#536751"/>
 <path d="M-104 211 Q-119 164 -85 150 L-54 193 L13 204 L5 234 L-57 232Z" fill="#314e42"/><path d="M101 211 Q111 161 83 152 L52 193 L15 204 L19 234 L62 232Z" fill="#314e42"/>
 <path d="M-4 199 Q14 192 29 204 L49 216 Q53 232 34 234 L1 227Z" fill="#79ac4d"/><path d="M-42 199 Q-29 191 -17 203 L8 216 Q11 231 -4 235 L-45 226Z" fill="#91bc5f"/>
 <path d="M-80 25 Q-77 -20 -30 -22 Q21 -32 65 -4 Q89 18 82 74 Q74 111 19 117 Q-47 117 -75 91 Q-94 64 -80 25Z" fill="#82b856"/>
 <path d="M-66 67 Q-46 93 5 91 Q51 91 72 70 Q70 105 26 111 Q-36 115 -67 90Z" fill="#659746" stroke="none"/>
 <path d="M-69 26 Q-82 -16 -49 -27 Q-17 -34 -6 7 L-4 43 L-63 43Z" fill="#e7edcb"/>
 <path d="M-3 27 Q-5 -14 28 -19 Q62 -22 64 24 L61 46 L-1 46Z" fill="#e7edcb"/>
 <ellipse cx="-30" cy="21" rx="7" ry="13" fill="#15271a" stroke="none"/><ellipse cx="32" cy="24" rx="7" ry="13" fill="#15271a" stroke="none"/>
 <path d="M-71 9 Q-43 -4 -8 12 L-9 -1 Q-25 -32 -49 -27 Q-77 -21 -71 9Z" fill="#7aac51"/><path d="M-3 14 Q28 3 62 18 Q60 -20 29 -19 Q4 -16 -3 14Z" fill="#91bb5e"/>
 <path d="M-73 44 Q-36 37 -6 47 M0 47 Q35 38 63 48" fill="none" stroke-width="3"/>
 <path d="M-58 69 Q-32 60 10 67 Q38 71 66 62 Q75 62 72 72 Q54 84 18 82 Q-17 74 -51 81 Q-66 81 -58 69Z" fill="#bd7962"/>
 <path d="M-54 72 Q-24 67 12 74 Q39 79 65 70" fill="none" stroke="#593e33" stroke-width="3"/>
 <path d="M-87 23 Q-98 -43 -27 -44 Q65 -49 79 18" fill="none" stroke="#153c31" stroke-width="11"/>
 <rect x="-96" y="18" width="18" height="42" rx="8" fill="#283e34"/><rect x="72" y="18" width="18" height="42" rx="8" fill="#283e34"/>
 <path d="M80 55 Q88 96 56 94" fill="none" stroke-width="4"/><rect x="43" y="89" width="20" height="10" rx="5" fill="#c2f970" stroke-width="3"/>
 <rect x="-60" y="158" width="24" height="26" rx="5" fill="#bde978" stroke-width="2"/><path d="M-53 169h10m-5 -5v11" stroke-width="2"/>
 </g>`;
function scene(t) {
  let dots = "";
  for (let i = 0; i < 22; i++) {
    const x = 90 + ((i * 127) % 920),
      y = 50 + ((i * 79) % 610);
    dots += `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 2 : 1}" fill="#b9f57f" opacity="${0.15 + 0.2 * Math.sin(t + i) ** 2}"/>`;
  }
  let flows = "";
  for (let i = 0; i < 8; i++) {
    const a = t + (i * Math.PI) / 4;
    flows += `<circle cx="${570 + Math.cos(a) * 132}" cy="${254 + Math.sin(a) * 48}" r="3" fill="#ddff9f"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
 <defs><radialGradient id="glow"><stop stop-color="#4d783a" stop-opacity=".6"/><stop offset="1" stop-color="#0b2018" stop-opacity="0"/></radialGradient><linearGradient id="desk" x2=".5" y2="1"><stop stop-color="#37523c"/><stop offset="1" stop-color="#132d22"/></linearGradient><linearGradient id="screen" x2="1" y2="1"><stop stop-color="#203d30"/><stop offset="1" stop-color="#0b211b"/></linearGradient><pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#8bb96b" stroke-opacity=".07"/></pattern></defs>
 <rect width="1120" height="760" fill="#0b2018"/><rect width="1120" height="760" fill="url(#grid)"/><ellipse cx="580" cy="350" rx="570" ry="390" fill="url(#glow)"/>${dots}
 <g fill="none" stroke="#477043" stroke-width="1"><path d="M135 354V184l94-54h171M810 111h90l61 63v179M936 508v85l-110 62H285l-89-51v-83"/><path d="M142 357h-14m13-166h-14m835 165h-14"/></g>
 <g transform="translate(670 95) rotate(8)"><rect width="201" height="120" rx="9" fill="#163324" stroke="#476b3b"/><text x="18" y="28" font-family="monospace" font-size="11" fill="#a9d883">SWARM / COLLABORATE</text><path d="M17 46h164" stroke="#395637"/><path d="M20 98l22-22 22 8 25-30 20 15 33-8 31-28" fill="none" stroke="#b4eb71" stroke-width="2"/><circle cx="173" cy="33" r="4" fill="#c2f970"/></g>
 <g transform="translate(226 113) rotate(-7)"><rect width="163" height="108" rx="9" fill="#173125" stroke="#476b3b"/><text x="16" y="25" font-family="monospace" font-size="11" fill="#a9d883">AGENT_001</text><g stroke="#82aa69" stroke-width="4"><path d="M17 47h69m-69 16h124m-124 16h93"/></g><circle cx="140" cy="22" r="4" fill="#c2f970"/></g>
 <ellipse cx="569" cy="664" rx="398" ry="56" fill="#081c15"/>
 ${frog(570, 312, 0.86, t + 2)}
 <g fill="none" stroke="#9de26c"><ellipse cx="570" cy="254" rx="132" ry="48" opacity=".5"/><ellipse cx="570" cy="254" rx="77" ry="91" transform="rotate(35 570 254)" opacity=".2"/><ellipse cx="570" cy="254" rx="77" ry="91" transform="rotate(-35 570 254)" opacity=".2"/></g>${flows}
 <g transform="translate(570 ${247 + Math.sin(t) * 6})"><path d="M0-50L45-25V25L0 50L-45 25V-25Z" fill="#9fe464" fill-opacity=".12" stroke="#b7f281" stroke-width="2"/><path d="M0-50V0L45-25M0 0L-45-25M0 0V50" fill="none" stroke="#b7f281" opacity=".6"/><text x="0" y="8" text-anchor="middle" font-family="monospace" font-size="22" font-weight="bold" fill="#e0ffc8">AI</text></g>
 <path d="M552 343L389 426m199-83 162 83" fill="none" stroke="#aad97d" stroke-dasharray="5 10" stroke-dashoffset="${t * 15}" opacity=".7"/>
 <path d="M238 475L567 411L923 477V534L573 662L238 546Z" fill="#152d23" stroke="#476145" stroke-width="3"/>
 <path d="M238 475L567 403L923 477L573 601Z" fill="url(#desk)" stroke="#628051" stroke-width="2"/>
 <path d="M274 554V652l24 10V563M866 555V639l-24 13V567" fill="#243e2a" stroke="#506b45" stroke-width="2"/>
 ${frog(342, 371, 1.06, t)}${frog(805, 366, 1.08, t + Math.PI, true)}
 <g transform="translate(310 518) rotate(12)"><path d="M-15 65L123 71L164 51L22 37Z" fill="#587552" stroke="#102a20" stroke-width="4"/><path d="M-15 65L-34-23L104-17L123 71Z" fill="url(#screen)" stroke="#718964" stroke-width="3"/><path d="M-16-8L88-3L101 51L-4 47Z" fill="#122b22"/><path d="M-6 6l12 9-9 7m18-11h27m-25 16h58m-52 13h37" fill="none" stroke="#b0e976" stroke-width="3"/><circle cx="111" cy="63" r="2" fill="#d9ffaa"/></g>
 <g transform="translate(790 510) rotate(-10)"><path d="M-110 63L25 67L61 43L-69 32Z" fill="#587552" stroke="#102a20" stroke-width="4"/><path d="M-110 63L-95-22L43-28L25 67Z" fill="#345344" stroke="#718964" stroke-width="3"/><path d="M-34-4L-9 12V35L-34 50L-59 35V12Z" fill="none" stroke="#b5ef80" stroke-width="2"/><text x="-34" y="30" text-anchor="middle" font-family="monospace" font-size="17" fill="#b5ef80">AI</text></g>
 <ellipse cx="573" cy="561" rx="43" ry="13" fill="#0c251a" stroke="#89b767"/><path d="M556 550v-31l18-11 18 11v31l-18 11Z" fill="#a8df70" fill-opacity=".3" stroke="#baef82"/><path d="M556 519l18 11 18-11m-18 11v31" fill="none" stroke="#baef82"/>
 <g font-family="monospace" font-size="10" letter-spacing="2" fill="#829d72"><text x="180" y="701">THINK. BUILD. VERIFY.</text><text x="833" y="701">IMD / 007</text></g></svg>`;
}
writeFileSync("artifacts/swarm-scene.svg", scene(0));
await sharp(Buffer.from(scene(0)))
  .webp({ quality: 86 })
  .toFile("public/media/swarm-poster.webp");
const ff = spawn(
  "ffmpeg",
  [
    "-y",
    "-f",
    "image2pipe",
    "-vcodec",
    "png",
    "-framerate",
    "24",
    "-i",
    "pipe:0",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "27",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "public/media/swarm.mp4",
  ],
  { stdio: ["pipe", "ignore", "pipe"] },
);
let errors = "";
ff.stderr.on("data", (x) => (errors += x));
const done = once(ff, "close");
for (let i = 0; i < 144; i++) {
  const frame = await sharp(Buffer.from(scene((i / 144) * Math.PI * 2)))
    .resize(1008, 684)
    .png()
    .toBuffer();
  if (!ff.stdin.write(frame)) await once(ff.stdin, "drain");
}
ff.stdin.end();
const [code] = await done;
if (code !== 0) throw new Error(errors);
console.log("Rendered 6-second, silent H.264 collaboration loop and poster.");
