export type LocalGalleryImage = {
  id: string;
  img: string;
  alt: string;
  title_en: string;
  title_fr: string;
};

export type LocalGallerySegment = {
  id: string;
  year: number | null;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  images: LocalGalleryImage[];
};

const MYSTERIES = [
  { file: "01_Annunciation.png", en: "Annunciation", fr: "Annonciation" },
  { file: "02_Visitation.png", en: "Visitation", fr: "Visitation" },
  { file: "03_Nativity.png", en: "Nativity", fr: "Nativité" },
  { file: "04_Presentation_in_the_Temple.png", en: "Presentation in the Temple", fr: "Présentation au Temple" },
  { file: "05_Finding_of_Jesus_in_the_Temple.png", en: "Finding of Jesus in the Temple", fr: "Recouvrement de Jésus au Temple" },
  { file: "06_Baptism_of_Jesus.png", en: "Baptism of Jesus", fr: "Baptême de Jésus" },
  { file: "07_Wedding_at_Cana.png", en: "Wedding at Cana", fr: "Noces de Cana" },
  { file: "08_Proclamation_of_the_Kingdom.png", en: "Proclamation of the Kingdom", fr: "Proclamation du Royaume" },
  { file: "09_Transfiguration.png", en: "Transfiguration", fr: "Transfiguration" },
  { file: "10_Institution_of_the_Eucharist.png", en: "Institution of the Eucharist", fr: "Institution de l'Eucharistie" },
  { file: "11_Agony_in_the_Garden.png", en: "Agony in the Garden", fr: "Agonie au jardin" },
  { file: "12_Scourging_at_the_Pillar.png", en: "Scourging at the Pillar", fr: "Flagellation" },
  { file: "13_Crowning_with_Thorns.png", en: "Crowning with Thorns", fr: "Couronnement d'épines" },
  { file: "14_Carrying_of_the_Cross.png", en: "Carrying of the Cross", fr: "Portement de croix" },
  { file: "15_Crucifixion.png", en: "Crucifixion", fr: "Crucifixion" },
  { file: "16_Resurrection.png", en: "Resurrection", fr: "Résurrection" },
  { file: "17_Ascension.png", en: "Ascension", fr: "Ascension" },
  { file: "18_Descent_of_the_Holy_Spirit.png", en: "Descent of the Holy Spirit", fr: "Descente de l'Esprit Saint" },
  { file: "19_Assumption_of_Mary.png", en: "Assumption of Mary", fr: "Assomption de Marie" },
  { file: "20_Coronation_of_Mary.png", en: "Coronation of Mary", fr: "Couronnement de Marie" },
] as const;

const STATIONS = [
  { file: "Station_01.png", en: "Jesus is condemned to death", fr: "Jésus est condamné à mort" },
  { file: "Station_02.png", en: "Jesus takes up his cross", fr: "Jésus est chargé de sa croix" },
  { file: "Station_03.png", en: "Jesus falls the first time", fr: "Jésus tombe pour la première fois" },
  { file: "Station_04.png", en: "Jesus meets his mother", fr: "Jésus rencontre sa mère" },
  { file: "Station_05.png", en: "Simon of Cyrene helps Jesus", fr: "Simon de Cyrène aide Jésus" },
  { file: "Station_06a.png", en: "Veronica wipes the face of Jesus", fr: "Véronique essuie le visage de Jésus" },
  { file: "Station_06b.png", en: "The face of Jesus", fr: "Le visage de Jésus" },
  { file: "Station_07.png", en: "Jesus falls the second time", fr: "Jésus tombe pour la deuxième fois" },
  { file: "Station_08.png", en: "Jesus meets the women of Jerusalem", fr: "Jésus console les femmes de Jérusalem" },
  { file: "Station_09.png", en: "Jesus falls the third time", fr: "Jésus tombe pour la troisième fois" },
  { file: "Station_10.png", en: "Jesus is stripped of his garments", fr: "Jésus est dépouillé de ses vêtements" },
  { file: "Station_11.png", en: "Jesus is nailed to the cross", fr: "Jésus est cloué sur la croix" },
  { file: "Station_12.png", en: "Jesus dies on the cross", fr: "Jésus meurt sur la croix" },
  { file: "Station_13.png", en: "Jesus is taken down from the cross", fr: "Jésus est descendu de la croix" },
  { file: "Station_14.png", en: "Jesus is laid in the tomb", fr: "Jésus est mis au tombeau" },
] as const;

/** Built from files under public/assets — always available offline. */
export const LOCAL_GALLERY_SEGMENTS: LocalGallerySegment[] = [
  {
    id: "place",
    year: null,
    title_en: "The house and the mountains",
    title_fr: "La maison et les monts",
    description_en: "Stillwater, Our Lady, and the sky above the waterfall.",
    description_fr: "Stillwater, Notre-Dame, et le ciel au-dessus de la cascade.",
    images: [
      { id: "place-1", img: "/assets/imgs/heaven.jpg", alt: "Heaven", title_en: "Above the waterfall", title_fr: "Au-dessus de la cascade" },
      { id: "place-2", img: "/assets/imgs/mary-af.png", alt: "Our Lady", title_en: "Our Lady", title_fr: "Notre-Dame" },
      { id: "place-3", img: "/assets/imgs/angels-af.png", alt: "Angels", title_en: "Angels", title_fr: "Anges" },
      { id: "place-4", img: "/assets/mysteries/03_Nativity.png", alt: "Nativity", title_en: "Nativity", title_fr: "Nativité" },
      { id: "place-5", img: "/assets/mysteries/19_Assumption_of_Mary.png", alt: "Assumption", title_en: "Assumption", title_fr: "Assomption" },
      { id: "place-6", img: "/assets/mysteries/20_Coronation_of_Mary.png", alt: "Coronation", title_en: "Coronation", title_fr: "Couronnement" },
    ],
  },
  {
    id: "stations",
    year: null,
    title_en: "Stations of the Cross",
    title_fr: "Chemin de croix",
    description_en: "Fourteen stations on the Mount of Calvary.",
    description_fr: "Quatorze stations sur le mont du Calvaire.",
    images: STATIONS.map((s, i) => ({
      id: `station-${i + 1}`,
      img: `/assets/stations-cross/${s.file}`,
      alt: s.en,
      title_en: s.en,
      title_fr: s.fr,
    })),
  },
  {
    id: "mysteries",
    year: null,
    title_en: "The Mysteries of the Rosary",
    title_fr: "Les mystères du Rosaire",
    description_en: "Joyful, luminous, sorrowful and glorious mysteries on the Mount of Mary.",
    description_fr: "Mystères joyeux, lumineux, douloureux et glorieux sur le mont de Marie.",
    images: MYSTERIES.map((m, i) => ({
      id: `mystery-${i + 1}`,
      img: `/assets/mysteries/${m.file}`,
      alt: m.en,
      title_en: m.en,
      title_fr: m.fr,
    })),
  },
];

/** First six stations for the gallery hero reel. */
export const GALLERY_HERO_STATIONS = STATIONS.slice(0, 6).map((s, i) => ({
  src: `/assets/stations-cross/${s.file}`,
  alt: s.en,
  title_en: s.en,
  title_fr: s.fr,
  subtitle_en: `Station ${String(i + 1).padStart(2, "0")}`,
  subtitle_fr: `Station ${String(i + 1).padStart(2, "0")}`,
  focus: 0.42 + i * 0.04,
}));
