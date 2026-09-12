export interface LGAOption {
  state: string;
  lgas: {
    name: string;
    wards: string[];
  }[];
}

export const NORTHERN_NIGERIA_LOCATIONS: LGAOption[] = [
  {
    state: 'Kano',
    lgas: [
      {
        name: 'Dawanau / Dawakin Tofa',
        wards: ['Dawanau Grain Center Ward', 'Kwa Ward', 'Danguguwa Ward', 'Ganduje Ward'],
      },
      {
        name: 'Gwarzo',
        wards: ['Gwarzo Central', 'Sabon Birni', 'Getso', 'Kutama'],
      },
      {
        name: 'Dambatta',
        wards: ['Dambatta East', 'Dambatta West', 'Fagwalawa', 'Sansan'],
      },
      {
        name: 'Kano Municipal',
        wards: ['Kankarofi', 'Shahuchi', 'Zango', 'Yakazai'],
      },
    ],
  },
  {
    state: 'Kaduna',
    lgas: [
      {
        name: 'Kachia',
        wards: ['Kachia Urban', 'Awon Grazing Corridor', 'Gumel', 'Sabon Sarki'],
      },
      {
        name: 'Birnin Gwari',
        wards: ['Birnin Gwari Central', 'Tabanni', 'Kuyello', 'Randagi'],
      },
      {
        name: 'Chikun',
        wards: ['Kujama', 'Sabon Tasha', 'Gwagwada', 'Kakau'],
      },
      {
        name: 'Zaria',
        wards: ['Zaria City', 'Tudun Wada', 'Gyallesu', 'Dambo'],
      },
    ],
  },
  {
    state: 'Borno',
    lgas: [
      {
        name: 'Maiduguri Municipal (MMC)',
        wards: ['Shehuri North', 'Monday Market Area', 'Bolori II', 'Gwange I'],
      },
      {
        name: 'Jere',
        wards: ['Old Maiduguri', 'Khaddamari', 'Maimusari', 'Dusuman'],
      },
      {
        name: 'Damboa',
        wards: ['Damboa Central', 'Gumsuri', 'Wawa', 'Korede'],
      },
      {
        name: 'Bama',
        wards: ['Bama Central', 'Shehuri', 'Kasugula', 'Sabsabwa'],
      },
    ],
  },
  {
    state: 'Katsina',
    lgas: [
      {
        name: 'Funtua',
        wards: ['Funtua Central', 'Dandutse', 'Makera', 'Tudun Iya'],
      },
      {
        name: 'Katsina Urban',
        wards: ['Wakilin Kudu', 'Wakilin Arewa', 'Shinkafi', 'Kofar Sauri'],
      },
    ],
  },
  {
    state: 'Sokoto',
    lgas: [
      {
        name: 'Wamakko',
        wards: ['Wamakko Town', 'Arkilla', 'Gidan Bubu', 'Dundaye'],
      },
      {
        name: 'Goronyo',
        wards: ['Goronyo Central', 'Shinaka', 'Takakume', 'Kagara'],
      },
    ],
  },
];
