export interface LGAOption {
  state: string;
  lgas: {
    name: string;
    wards: string[];
  }[];
}

export const NIGERIA_LOCATIONS: LGAOption[] = [
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
    ],
  },
  {
    state: 'Oyo',
    lgas: [
      {
        name: 'Ibadan North / Bodija',
        wards: ['Bodija Market Ward', 'Agbowo', 'Sango', 'Yemetu'],
      },
      {
        name: 'Saki West (Agrarian Belt)',
        wards: ['Saki Central', 'Kinnikinni', 'Agunrege', 'Sepeteri Border'],
      },
      {
        name: 'Ogbomoso North',
        wards: ['Oja-Igbo', 'Masifa', 'Isale-Afon', 'Aguodo'],
      },
    ],
  },
  {
    state: 'Enugu',
    lgas: [
      {
        name: 'Nsukka (Agro-Cooperative Hub)',
        wards: ['Nsukka Urban', 'Opi Agro-Corridor', 'Ibagwa-Ani', 'Alor-Uno'],
      },
      {
        name: 'Enugu North / Ogbete',
        wards: ['Ogbete Market Ward', 'Asata', 'Ogui Urban', 'Coal Camp'],
      },
      {
        name: 'Udi',
        wards: ['Udi Central', 'Nachi Borehole Area', 'Eke', 'Ngwo'],
      },
    ],
  },
];

// Backward-compatible alias
export const NORTHERN_NIGERIA_LOCATIONS = NIGERIA_LOCATIONS;
