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
  {
    state: 'Benue',
    lgas: [
      {
        name: 'Makurdi',
        wards: ['Modern Market Ward', 'North Bank I', 'Fiidi Grazing Zone', 'Wurukum'],
      },
      {
        name: 'Guma (Agro-Buffer Zone)',
        wards: ['Agasha', 'Daudu Agro-Cluster', 'Nzorov', 'Gbajimba'],
      },
      {
        name: 'Otukpo',
        wards: ['Otukpo Town East', 'Otukpo Town West', 'Upu', 'Adoka'],
      },
    ],
  },
  {
    state: 'Plateau',
    lgas: [
      {
        name: 'Jos North',
        wards: ['Tudun Wada', 'Ali Kazaure', 'Vwang', 'Nasarawa Gwong'],
      },
      {
        name: 'Bokkos (Farmer-Herder Interface)',
        wards: ['Bokkos Central', 'Daffo Grazing Area', 'Richa', 'Mushere'],
      },
      {
        name: 'Barkin Ladi',
        wards: ['Heipang', 'Gwol', 'Fan', 'Ropp Mining Corridor'],
      },
    ],
  },
  {
    state: 'Rivers',
    lgas: [
      {
        name: 'Port Harcourt',
        wards: ['Mile 1 Market', 'Diobu Mile 3', 'Old GRA', 'Borokiri Waterfront'],
      },
      {
        name: 'Eleme (Petrochemical & Pipeline Belt)',
        wards: ['Alesa Refinery Zone', 'Alode', 'Ogale', 'Ebubu Pipeline Corridor'],
      },
      {
        name: 'Khana / Bori (Ogoni)',
        wards: ['Bori Urban I', 'Bori Urban II', 'Kono Coastal Ward', 'Zaakpon'],
      },
    ],
  },
];

// Backward-compatible alias
export const NORTHERN_NIGERIA_LOCATIONS = NIGERIA_LOCATIONS;
