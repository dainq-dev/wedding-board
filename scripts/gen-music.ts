// bun scripts/gen-music.ts <slug> [--bpm 70] [--mode pad|pluck|folk|jazz] [--base 220]
// Sinh WAV nền loop-able cho mẫu thiệp: mono 16-bit 22050Hz, ~24s, ≤3MB.
// Loop kín bằng cách: render dài thêm một đoạn crossfade rồi trộn đuôi vào đầu —
// khi tua lặp lại không nghe thấy "mối nối".

const SR = 22050;
const CF = 1.5; // giây crossfade — đủ dài để lệch pha oscillator không thành tiếng
const BARS = 8; // I–V–vi–IV, mỗi hợp âm 2 nhịp → đúng một vòng hòa âm khi lặp

type Mode = "pad" | "pluck" | "folk" | "jazz";

const argv = process.argv.slice(2);
const slug = argv[0];
const flag = (name: string, def: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};
if (!slug || slug.startsWith("--")) {
  console.error(
    "Usage: bun scripts/gen-music.ts <slug> [--bpm 70] [--mode pad|pluck|folk|jazz] [--base 220]",
  );
  process.exit(1);
}
const bpm = Number(flag("bpm", "70"));
const base = Number(flag("base", "220"));
const mode = flag("mode", "pad") as Mode;
if (!["pad", "pluck", "folk", "jazz"].includes(mode)) {
  console.error(`mode không biết: ${mode} (pad|pluck|folk|jazz)`);
  process.exit(1);
}

const beatsPerBar = mode === "folk" ? 3 : 4; // folk viết nhịp 3/4
const beat = 60 / bpm;
const bar = beatsPerBar * beat;
const D = BARS * bar;
const total = Math.ceil((D + CF) * SR);
const s = new Float32Array(total);

// Bán cung so với âm chủ (base) cho I–V–vi–IV; vi thứ, còn lại trưởng.
const CHORDS = [
  [0, 4, 7],
  [7, 11, 14],
  [9, 12, 16],
  [5, 9, 12],
];
// jazz: thêm quãng 7 (dom7/min7 = +10, maj7 = +11) vào từng hợp âm
const JAZZ_7 = [11, 10, 10, 11];

type Note = {
  t: number;
  f: number;
  d: number;
  g: number;
  a: number;
  k: number; // tốc độ suy giảm (exp) — pad nhỏ, pluck lớn
  tri: boolean;
};
const notes: Note[] = [];
const hz = (semi: number, oct = 0) => base * 2 ** ((semi + oct * 12) / 12);

for (let b = 0; b < BARS; b++) {
  const ci = Math.floor(b / 2) % 4;
  let tones = CHORDS[ci];
  if (mode === "jazz") tones = [...tones, tones[0] + JAZZ_7[ci]];
  const t0 = b * bar;
  if (mode === "pad" || mode === "jazz") {
    // hợp âm ngân tràn sang nhịp sau → liền mạch, không hở khi lặp
    notes.push({
      t: t0,
      f: hz(tones[0], -1),
      d: bar * 1.4,
      g: 0.22,
      a: 0.5,
      k: 0.35,
      tri: false,
    });
    for (const semi of tones)
      notes.push({
        t: t0,
        f: hz(semi),
        d: bar * 1.4,
        g: 0.09,
        a: 0.6,
        k: 0.25,
        tri: mode === "jazz",
      });
    if (mode === "jazz")
      for (let e = 0; e < beatsPerBar * 2; e++)
        notes.push({
          t: t0 + (e * bar) / (beatsPerBar * 2),
          f: hz(tones[e % tones.length], e % 2 ? 1 : 0),
          d: bar * 0.4,
          g: 0.06,
          a: 0.01,
          k: 7,
          tri: false,
        });
  } else if (mode === "pluck") {
    const seq = [0, 1, 2, 3, 2, 1, 0, 1]; // hình arpeggio lặp trong nhịp
    for (let e = 0; e < beatsPerBar * 2; e++) {
      const tone = tones[seq[e % seq.length] % tones.length];
      notes.push({
        t: t0 + (e * bar) / (beatsPerBar * 2),
        f: hz(tone, e % 4 === 0 ? -1 : e % 6 === 3 ? 1 : 0),
        d: bar,
        g: 0.28,
        a: 0.004,
        k: 6,
        tri: true,
      });
    }
  } else {
    // folk: nhịp 1 rải trầm, nhịp 2–3 hợp âm sáng kiểu "oom-pah-pah"
    notes.push({
      t: t0,
      f: hz(tones[0], -1),
      d: bar * 0.9,
      g: 0.3,
      a: 0.006,
      k: 3,
      tri: true,
    });
    for (let i = 1; i < beatsPerBar; i++)
      for (const semi of tones)
        notes.push({
          t: t0 + i * beat,
          f: hz(semi, 1),
          d: beat * 0.9,
          g: 0.1,
          a: 0.004,
          k: 6,
          tri: false,
        });
  }
}

for (const n of notes) {
  const i0 = Math.floor(n.t * SR);
  const len = Math.min(Math.floor(n.d * SR), total - i0);
  const atk = Math.max(2, Math.floor(n.a * SR));
  const rel = Math.floor(0.04 * SR); // nhả 40ms để nốt dứt không phát tiếng "tách"
  for (let i = 0; i < len; i++) {
    const tp = i / SR;
    const env =
      Math.min(1, i / atk) * Math.exp(-n.k * tp) * Math.min(1, (len - i) / rel);
    const ph = 2 * Math.PI * n.f * tp;
    const w = n.tri ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph);
    s[i0 + i] += w * n.g * env;
  }
}

const N = Math.floor(D * SR);
const fade = Math.floor(CF * SR);
const pcm = new Float32Array(N);
for (let i = 0; i < N; i++) pcm[i] = s[fade + i];
for (let j = 0; j < fade; j++) {
  const k = j / fade;
  pcm[N - fade + j] = s[N + j] * (1 - k) + s[j] * k;
}

let peak = 0;
for (const v of pcm) peak = Math.max(peak, Math.abs(v));
if (peak === 0) {
  console.error("Hỗn âm ra im lặng — kiểm tra lại --bpm/--base");
  process.exit(1);
}
const norm = 0.85 / peak;

const buf = new ArrayBuffer(44 + N * 2);
const dv = new DataView(buf);
const str = (o: number, v: string) => {
  for (let i = 0; i < v.length; i++) dv.setUint8(o + i, v.charCodeAt(i));
};
str(0, "RIFF");
dv.setUint32(4, 36 + N * 2, true);
str(8, "WAVE");
str(12, "fmt ");
dv.setUint32(16, 16, true);
dv.setUint16(20, 1, true); // PCM
dv.setUint16(22, 1, true); // mono
dv.setUint32(24, SR, true);
dv.setUint32(28, SR * 2, true);
dv.setUint16(32, 2, true);
dv.setUint16(34, 16, true);
str(36, "data");
dv.setUint32(40, N * 2, true);
for (let i = 0; i < N; i++)
  dv.setInt16(
    44 + i * 2,
    Math.max(-32768, Math.min(32767, Math.round(pcm[i] * norm * 32767))),
    true,
  );

const path = `public/templates/${slug}/music.wav`;
await Bun.write(path, buf); // Bun.write tự tạo thư mục cha
console.log(
  `${path}: ${(N / SR).toFixed(1)}s · ${bpm} BPM · mode=${mode} · ${(buf.byteLength / 1e6).toFixed(2)} MB`,
);

export {};
