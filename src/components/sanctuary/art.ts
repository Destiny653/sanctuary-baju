/**
 * Site artwork — all paths are local under /public so the site works offline.
 * Lovable Cloud asset pointers are intentionally not used here.
 */
const M = "/assets/mysteries";
const S = "/assets/stations-cross";
const I = "/assets/imgs";

export const art = {
  angels: `${I}/angels-af.png`,
  christ: `${M}/15_Crucifixion.png`,
  dawn: `${I}/heaven.jpg`,
  face: `${M}/06_Baptism_of_Jesus.png`,
  hands: `${M}/10_Institution_of_the_Eucharist.png`,
  heaven: `${I}/heaven.jpg`,
  hills: `${M}/03_Nativity.png`,
  mary: `${I}/mary-af.png`,
  sanctuary: `${M}/19_Assumption_of_Mary.png`,
  worship: `${M}/20_Coronation_of_Mary.png`,
  mountains: `${M}/14_Carrying_of_the_Cross.png`,
  passionAgony: `${M}/11_Agony_in_the_Garden.png`,
  passionThorns: `${M}/13_Crowning_with_Thorns.png`,
  passionWay: `${S}/Station_02.png`,
  passionSimon: `${S}/Station_05.png`,
  passionCross: `${M}/15_Crucifixion.png`,
  passionPieta: `${S}/Station_13.png`,
  passionTomb: `${S}/Station_14.png`,
  evangelSermon: `${M}/08_Proclamation_of_the_Kingdom.png`,
  evangelCall: `${M}/06_Baptism_of_Jesus.png`,
  evangelHeal: `${M}/07_Wedding_at_Cana.png`,
  rosaryJoyful: `${M}/01_Annunciation.png`,
  rosaryLuminous: `${M}/09_Transfiguration.png`,
  rosaryGlorious: `${M}/16_Resurrection.png`,
};

export const passion = [
  { src: art.passionAgony, title: "The Agony in the Garden", n: "I" },
  { src: art.passionThorns, title: "The Crowning with Thorns", n: "II" },
  { src: art.passionWay, title: "The Way of the Cross", n: "III" },
  { src: art.passionSimon, title: "Simon Helps Carry the Cross", n: "IV" },
  { src: art.passionCross, title: "The Crucifixion", n: "V" },
  { src: art.passionPieta, title: "Mary Receives Her Son", n: "VI" },
  { src: art.passionTomb, title: "Laid in the Tomb", n: "VII" },
];

export const evangel = [
  {
    src: art.evangelSermon,
    title: "The Sermon on the Mount",
    text: "Blessed are the poor in spirit. He sat on the hill and the people sat with him.",
  },
  {
    src: art.evangelCall,
    title: "The Call by the Lake",
    text: "Come, follow me. The nets were left on the shore at dawn.",
  },
  {
    src: art.evangelHeal,
    title: "He Blesses the Children",
    text: "Let the little ones come to me. The village gathered at the red-earth road.",
  },
];
