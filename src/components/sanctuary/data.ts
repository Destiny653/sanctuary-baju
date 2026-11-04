import { art } from "./art";
export type Intention = {
  id: string;
  name: string;
  text: string;
  at: number;
};

export type Visit = {
  id: string;
  name: string;
  day: string;
  party: string;
  note: string;
  at: number;
};

export const hours = [
  { time: "6:00", name: "First light", note: "The church is unlocked" },
  { time: "7:15", name: "Mass", note: "The morning office follows" },
  { time: "12:10", name: "None", note: "Twenty quiet minutes" },
  { time: "18:00", name: "Vespers", note: "The pool goes dark" },
  { time: "21:00", name: "Night prayer", note: "Then the house is silent" },
];

export const places = [
  {
    n: "01",
    name: "The Chapel",
    text: "The white nave. A still pool lies to the south and keeps the morning.",
    image: art.worship,
    alt: "The congregation standing in the sky-blue nave in white and blue wax-print cloth",
  },
  {
    n: "02",
    name: "The Mount of Mary",
    text: "The female mountain. Twenty shrines for the mysteries of the rosary, and her statue at the summit.",
    image: art.mountOfMary,
    alt: "Mount of Mary rising above the sanctuary hills",
  },
  {
    n: "03",
    name: "The Mount of Calvary",
    text: "The male mountain. Fourteen stations of the Passion climb the red-earth path to the cross.",
    image: art.mountOfJesus,
    alt: "Mount of Jesus Christ — the Way of the Cross mountain",
  },
  {
    n: "04",
    name: "The Gate House",
    text: "Where you are met. Leave a name if you wish. Nothing is taken at the door.",
    image: art.mountaintopOfMary,
    alt: "View from the summit of the Mount of Mary",
  },
];

export const corpus = [
  {
    id: "home",
    title: "Home",
    text: "She remains. The opening sequence of the house.",
  },
  {
    id: "gallery",
    title: "Gallery",
    text: "Albums of the house: the passion, the rosary, the people at prayer.",
  },
  {
    id: "news",
    title: "News",
    text: "What is happening on the hill and at the gate house.",
  },
  {
    id: "events",
    title: "Events calendar",
    text: "Vigils, feasts and pilgrimages, day by day.",
  },
  {
    id: "way",
    title: "The way",
    text: "Christ carries the cross along the north garden. Pilgrims may stand or kneel.",
  },
  {
    id: "company",
    title: "The company",
    text: "Marble angels keep the north wall in adoration.",
  },
  {
    id: "descent",
    title: "The descent",
    text: "On the feast the figure of Mary is brought down to the floor.",
  },
  {
    id: "locations",
    title: "Locations",
    text: "Chapel, garden oratory, upper room, and the gate house at Stillwater.",
  },
  {
    id: "intentions",
    title: "The book",
    text: "Leave an intention. It stays on this device, in your notebook.",
  },
  {
    id: "contact",
    title: "Contact us",
    text: "Tell the gate house the day you are coming. There is no charge and no ticket.",
  },
  {
    id: "leadership",
    title: "Administration",
    text: "Priests, sisters and lay people who keep the sanctuary.",
  },
];

export const parties = ["1", "2", "3–5", "6–12", "A parish"];
