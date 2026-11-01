import type { Lang } from "@/i18n";

/** Five equal chapters of the uploaded film; narration follows decoded video time. */
export const annunciationNarration: Record<Lang, { title: string; reference: string; passages: string[] }> = {
  en: {
    title: "The Annunciation",
    reference: "Adapted from Luke 1:26–38",
    passages: [
      "In Nazareth, God sent the angel Gabriel to a virgin named Mary.",
      "Gabriel greeted her: “Hail, full of grace. The Lord is with you.”",
      "“Do not be afraid, Mary. You will bear a son and name him Jesus.”",
      "“The Holy Spirit will come upon you. The child will be called the Son of God.”",
      "Mary answered: “I am the servant of the Lord. Let it be done to me according to your word.”",
    ],
  },
  fr: {
    title: "L’Annonciation",
    reference: "D’après Luc 1, 26–38",
    passages: [
      "À Nazareth, Dieu envoya l’ange Gabriel auprès d’une vierge appelée Marie.",
      "Gabriel la salua : « Je te salue, comblée de grâce. Le Seigneur est avec toi. »",
      "« Sois sans crainte, Marie. Tu enfanteras un fils et tu lui donneras le nom de Jésus. »",
      "« L’Esprit Saint viendra sur toi. L’enfant sera appelé Fils de Dieu. »",
      "Marie répondit : « Je suis la servante du Seigneur. Que tout m’advienne selon ta parole. »",
    ],
  },
};

export function narrationChapter(progress: number, count: number): number {
  if (count <= 0) return -1;
  const safe = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return Math.min(count - 1, Math.floor(safe * count));
}