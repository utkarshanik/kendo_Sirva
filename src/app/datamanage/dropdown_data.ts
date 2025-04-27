export type AreaData = {
  text: string;
  id: number;
  areas: Area[];
};

export type Area = {
  text: string;
  id: number;
};

export const listItems: Array<string> = [
  "lead 1",
  "lead 2",
  "lead 3"
];
export const listItems2: Array<string> = [
  "Pref 1",
  "Pref 2",
  "Pref 3"
];

export const areaData: AreaData[] = [
  {
    text: "View Lead",
    id: 1,
    areas: [
      { text: "Chicago", id: 4 },
      { text: "Los Angeles", id: 3 },
      { text: "New York", id: 2 },
      { text: "San Francisco", id: 5 },
    ],
  },
  {
    text: "Edit Lead",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Assigned to Sales Rep",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Schedule Appoitment",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Possible Matches",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Possible Matches",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Possible Matches",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Possible Matches",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
];

