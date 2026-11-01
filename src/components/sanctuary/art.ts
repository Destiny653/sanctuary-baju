import angels from "@/assets/art/angels-af.webp.asset.json";
import christ from "@/assets/art/christ-af.webp.asset.json";
import dawn from "@/assets/art/dawn.jpg.asset.json";
import evangelCall from "@/assets/art/evangel-call.jpg.asset.json";
import evangelHeal from "@/assets/art/evangel-heal.jpg.asset.json";
import evangelSermon from "@/assets/art/evangel-sermon.jpg.asset.json";
import face from "@/assets/art/face-af.webp.asset.json";
import hands from "@/assets/art/hands-af.webp.asset.json";
import heaven from "@/assets/art/heaven.jpg.asset.json";
import hills from "@/assets/art/hills-af.webp.asset.json";
import mary from "@/assets/art/mary-af.webp.asset.json";
import passionAgony from "@/assets/art/passion-agony.webp.asset.json";
import passionCross from "@/assets/art/passion-cross.webp.asset.json";
import passionPieta from "@/assets/art/passion-pieta.webp.asset.json";
import passionSimon from "@/assets/art/passion-simon.webp.asset.json";
import passionThorns from "@/assets/art/passion-thorns.webp.asset.json";
import passionTomb from "@/assets/art/passion-tomb.webp.asset.json";
import passionWay from "@/assets/art/passion-way.webp.asset.json";
import rosaryGlorious from "@/assets/art/rosary-glorious.webp.asset.json";
import rosaryJoyful from "@/assets/art/rosary-joyful.webp.asset.json";
import rosaryLuminous from "@/assets/art/rosary-luminous.webp.asset.json";
import sanctuary from "@/assets/art/sanctuary-af.webp.asset.json";
import mountains from "@/assets/art/twin-mountains.webp.asset.json";
import worship from "@/assets/art/worship-af.webp.asset.json";

/**
 * Site artwork. Figures (mary, christ, angels) are transparent cut-outs so they
 * float over the glass layers; the rest are full-bleed paintings.
 */
export const art = {
  angels: "/assets/imgs/angels-af.png",
  christ: christ.url,
  dawn: dawn.url,
  face: face.url,
  hands: hands.url,
  heaven: "/assets/imgs/heaven.jpg",
  hills: hills.url,
  mary: "/assets/imgs/mary-af.png",
  sanctuary: sanctuary.url,
  worship: worship.url,
  mountains: mountains.url,
  passionAgony: passionAgony.url,
  passionThorns: passionThorns.url,
  passionWay: passionWay.url,
  passionSimon: passionSimon.url,
  passionCross: passionCross.url,
  passionPieta: passionPieta.url,
  passionTomb: passionTomb.url,
  evangelSermon: evangelSermon.url,
  evangelCall: evangelCall.url,
  evangelHeal: evangelHeal.url,
  rosaryJoyful: rosaryJoyful.url,
  rosaryLuminous: rosaryLuminous.url,
  rosaryGlorious: rosaryGlorious.url,
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
  { src: art.evangelSermon, title: "The Sermon on the Mount", text: "Blessed are the poor in spirit. He sat on the hill and the people sat with him." },
  { src: art.evangelCall, title: "The Call by the Lake", text: "Come, follow me. The nets were left on the shore at dawn." },
  { src: art.evangelHeal, title: "He Blesses the Children", text: "Let the little ones come to me. The village gathered at the red-earth road." },
];
