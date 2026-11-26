// One Star, Written in Sap — a tiny review composer.
// The plant picks its sharpest grievance by scoring invented drafts
// against what a one-star review needs: a plant's-eye complaint,
// a concrete detail, and a punchline that lands in one line.
import { mkdirSync, writeFileSync } from "node:fs";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 279;

// Words that must never appear: the judge's brief bans these stock
// phrases, so any draft containing one is thrown out outright.
const BANNED = ["drama queen", "dramatic wilting", "being ignored", "ignored me"];

// Plant-world nouns: the more a draft lives in the pot, the more it
// sounds like the plant wrote it instead of a person in a costume.
const PLANT_WORDS = [
  "repotted", "mug", "drainage", "bathwater", "teabag", "soil", "pot",
  "roots", "leaves", "water", "light", "humidity", "shower", "fern",
];

type Draft = { text: string; note: string };

const DRAFTS: Draft[] = [
  {
    text: "One star: he repotted me into a souvenir mug with no drainage, calls it minimalist, and now I live ankle-deep in my own bathwater like a teabag someone forgot — at least the mug says 'World's Best Dad'.",
    note: "mug-repot",
  },
  {
    text: "One star: my owner waters me only when guests are coming, so I spend my life either drowning or auditioning for a desert documentary — pick a lane, Dave.",
    note: "guest-watering",
  },
  {
    text: "One star: he moved me to the bathroom for the humidity and now I watch him sing off-key in the shower every morning — I photosynthesise, I do not need an encore.",
    note: "bathroom-choir",
  },
];

function scoreDraft(d: Draft): number {
  const lower = d.text.toLowerCase();
  if (d.text.length < 1 || d.text.length > MAX_CHARS) return -1;
  if (BANNED.some((b) => lower.includes(b))) return -1;
  if (!lower.includes("one star")) return -1;
  if (!lower.includes(":")) return -1;
  let score = 0;
  for (const w of PLANT_WORDS) if (lower.includes(w)) score += 2;
  // A one-line review wants one breath: reward the 150-260 band.
  if (d.text.length >= 150 && d.text.length <= 260) score += 5;
  // A twist after the dash is the joke's landing.
  if (d.text.includes("—")) score += 3;
  // A named human makes the grievance specific, not generic.
  if (/\bDave\b/.test(d.text)) score += 1;
  return score;
}

function pickBest(drafts: Draft[]): Draft {
  let best: Draft | null = null;
  let bestScore = -1;
  for (const d of drafts) {
    const s = scoreDraft(d);
    if (s > bestScore) {
      bestScore = s;
      best = d;
    }
  }
  if (!best) throw new Error("no draft passed the review gate");
  return best;
}

const winner = pickBest(DRAFTS);
const runnerUp = DRAFTS.filter((d) => d !== winner)
  .map((d) => `${d.note}=${scoreDraft(d)}`)
  .join(", ");
mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, winner.text.trim(), "utf8");
console.log(`wrote ${winner.text.length} chars (${winner.note}) to ${OUT_PATH}`);
console.log(`runner-up scores: ${runnerUp}`);
