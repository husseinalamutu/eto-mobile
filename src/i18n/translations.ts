export type Language = 'en' | 'ha';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  quickLock: string;
  
  // Navigation Tabs
  tabOpportunities: string;
  tabReport: string;
  tabSync: string;
  
  // Login Screen
  loginTitle: string;
  loginSubtitle: string;
  loginHelper: string;
  loginInvalid: string;
  loginNotice: string;
  loginRealPin: string;
  loginDuressPin: string;
  loginWipePin: string;
  
  // Opportunity Screen
  oppHeading: string;
  oppSubheading: string;
  searchPlaceholder: string;
  filterState: string;
  filterType: string;
  verifiedTag: string;
  offlineTag: string;
  claimProtocol: string;
  viewAll: string;
  collapse: string;
  bookmark: string;
  bookmarked: string;
  shareSMS: string;
  noOppTitle: string;
  noOppSub: string;

  // Report Screen
  reportHeading: string;
  reportSubheading: string;
  anonymityBannerTitle: string;
  anonymityBannerText: string;
  fieldCategory: string;
  fieldLocation: string;
  fieldSeverity: string;
  fieldDescription: string;
  descPlaceholder: string;
  submitButton: string;
  submittingText: string;
  storedModalTitle: string;
  storedModalBody: string;
  ledgerId: string;
  timestamp: string;
  syncStatusPending: string;
  done: string;

  // Sync Screen
  syncHeading: string;
  syncSubheading: string;
  onlineSignal: string;
  offlineSignal: string;
  pendingQueue: string;
  totalRecorded: string;
  syncedLabel: string;
  syncNow: string;
  allSynced: string;
  transmittingText: string;
  tabPending: string;
  tabDispatched: string;
  exportBackup: string;
  exportNotice: string;

  // Categories
  catConflict: string;
  catConflictDesc: string;
  catInfra: string;
  catInfraDesc: string;
  catMisappr: string;
  catMisapprDesc: string;

  // Severities
  sevLow: string;
  sevMed: string;
  sevCrit: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'ETO • CIVIC LEDGER',
    appSubtitle: 'Information You Can Trust • OSF Africa',
    quickLock: '🔒 LOCK',
    
    tabOpportunities: 'Opportunities',
    tabReport: 'File Incident',
    tabSync: 'Sync Engine',
    
    loginTitle: 'System Security Access',
    loginSubtitle: 'Enter terminal PIN to authenticate device session',
    loginHelper: 'Protected by Local Cryptographic Enclave',
    loginInvalid: 'Invalid PIN. Please try again.',
    loginNotice: 'FIELD SECURITY PROTOCOLS',
    loginRealPin: '• Real Access PIN: 1234 (Full Ledger)',
    loginDuressPin: '• Duress Checkpoint PIN: 9999 (Decoy Screen)',
    loginWipePin: '• Emergency Panic Wipe: 0000 (Purges SQLite & Closes)',

    oppHeading: 'Offline Opportunity Engine',
    oppSubheading: 'Pre-cached civic grants, input subsidies & legal aid for the Sahel',
    searchPlaceholder: 'Search by keyword, ward, or resource...',
    filterState: 'STATE:',
    filterType: 'TYPE:',
    verifiedTag: '✓ Verified:',
    offlineTag: 'Offline Validated',
    claimProtocol: 'ACTIONABLE CLAIM PROTOCOL',
    viewAll: 'View All',
    collapse: 'Collapse',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    shareSMS: 'Copy for SMS',
    noOppTitle: 'No matching opportunities',
    noOppSub: 'Adjust your filters or clear your search term to see cached listings.',

    reportHeading: 'Civic Incident Intake',
    reportSubheading: 'Zero-PII local SQLite ledger. Immune to network outages and checkpoint searches.',
    anonymityBannerTitle: '🛡️ ZERO-TRACE CIVIC ANONYMITY',
    anonymityBannerText: 'IMEI, phone numbers, GPS coordinates, and personal identifiers are strictly excluded. Reports are identified solely by a decentralized cryptographic hash.',
    fieldCategory: 'INCIDENT CATEGORY',
    fieldLocation: 'WARD & LGA LOCATION',
    fieldSeverity: 'SEVERITY LEVEL',
    fieldDescription: 'FACTUAL INCIDENT REPORT',
    descPlaceholder: 'Detail what occurred, parties involved (e.g. farmer group / borehole committee), and tension level...',
    submitButton: 'Save to Offline Ledger',
    submittingText: 'Recording to SQLite...',
    storedModalTitle: 'Stored in Offline Ledger',
    storedModalBody: 'Your incident report has been written directly to the local SQLite database. No network was required.',
    ledgerId: 'LEDGER ENTRY ID:',
    timestamp: 'TIMESTAMP:',
    syncStatusPending: 'Pending Field Synchronization (synced = 0)',
    done: 'Done',

    syncHeading: 'Manual Sync Engine',
    syncSubheading: 'Zero-background daemon. Explicit manual transmission center.',
    onlineSignal: 'Online Signal Available',
    offlineSignal: 'Offline / Patchy 2G',
    pendingQueue: 'PENDING QUEUE',
    totalRecorded: 'Total Recorded',
    syncedLabel: 'Synced',
    syncNow: 'Sync Now',
    allSynced: '✓ All Reports Synced',
    transmittingText: 'Transmitting Encrypted Batch...',
    tabPending: 'Pending Queue',
    tabDispatched: 'Dispatched',
    exportBackup: '📦 Export Sneaker-Net Backup',
    exportNotice: 'Export encrypted JSON payload to physical storage for remote offline courier transport.',

    catConflict: 'Conflict Indicator',
    catConflictDesc: 'Pastoralist-farmer boundary disputes, grazing friction, or vigilante tensions.',
    catInfra: 'Infrastructure Breakdown',
    catInfraDesc: 'Borehole/solar pump failure, bridge washout, or damaged public clinic.',
    catMisappr: 'Misappropriation',
    catMisapprDesc: 'Diverted relief food/seed supplies, extortion at checkpoints, or ghost projects.',

    sevLow: 'Low (Observation)',
    sevMed: 'Medium (Active Friction)',
    sevCrit: 'Critical (Danger)',
  },
  ha: {
    appName: 'ETO • RIJISTAR AL\'UMMA',
    appSubtitle: 'Ingantattun Bayanai Abun Dogaro • OSF Africa',
    quickLock: '🔒 KULLE',
    
    tabOpportunities: 'Damarmaki',
    tabReport: 'Bada Rahoto',
    tabSync: 'Aika Bayanai',
    
    loginTitle: 'Shigar da Lambar Sirri',
    loginSubtitle: 'Shigar da lambar sirri ta wayar domin bude manhaja',
    loginHelper: 'Bayanai suna nan a tsare a cikin waya',
    loginInvalid: 'Lambar sirri ba daidai ba ce. Sake gwadawa.',
    loginNotice: 'DOKOKIN TSARO A SHINGEN DUBAWA',
    loginRealPin: '• Lambar Shiga: 1234 (Rijistar Manhaja)',
    loginDuressPin: '• Lambar Tsaro a Shinge: 9999 (Boyayyen Allon Noma)',
    loginWipePin: '• Lambar Goge Duka: 0000 (Goge bayanan sirri gaba daya)',

    oppHeading: 'Injin Nemo Damarmaki na Karkara',
    oppSubheading: 'Tallafin noma, kariya ta shari\'a da tallafin matasa a yankin Sahel',
    searchPlaceholder: 'Bincika da kalma, gunduma ko tallafi...',
    filterState: 'JIHA:',
    filterType: 'NAU\'I:',
    verifiedTag: '✓ An Tabbatar:',
    offlineTag: 'Yana Aiki Ba Tare Da Yanar Gizo Ba',
    claimProtocol: 'HANYOYIN NEMAN TALLAFI MATAKI-MATAKI',
    viewAll: 'Duba Duka',
    collapse: 'Takaita',
    bookmark: 'Ajiye',
    bookmarked: 'An Ajiye',
    shareSMS: 'Kwafa don SMS',
    noOppTitle: 'Babu damar da ta dace',
    noOppSub: 'Sake duba bincikenka ko sauya zabin jiha ko nau\'in tallafi.',

    reportHeading: 'Shigar da Rahoton Matsalar Al\'umma',
    reportSubheading: 'Adana rahoto ba tare da bayyana sunanka ko lambar waya ba a cikin SQLite.',
    anonymityBannerTitle: '🛡️ CIKAKKEN TSARON SIRRIN MAI RAHOTO',
    anonymityBannerText: 'Ba a karbar lambar waya, IMEI, ko adireshin gida. Kowane rahoto yana samun lambar sirri ta musamman domin tsaronka.',
    fieldCategory: 'NAU\'IN MATSALA',
    fieldLocation: 'GUNDUMA DA KARAMAR HUKUMA',
    fieldSeverity: 'MATAKIN TSANANI',
    fieldDescription: 'BAYANIN ABUNDA YA FARU',
    descPlaceholder: 'Bayyana cikakken abinda ya faru tsakanin bangarori (misali: manoma da makiyaya a kusa da rijiyar burtsatse)...',
    submitButton: 'Ajiye a Rijistar Waya',
    submittingText: 'Ana rubutawa a rumbun waya...',
    storedModalTitle: 'An Ajiye a Rumbun Waya',
    storedModalBody: 'An ajiye rahotonka lafiya a cikin wayar ba tare da bukatar intanet ba.',
    ledgerId: 'LAMBAR SIRRI TA RAHOTO:',
    timestamp: 'LOKACI:',
    syncStatusPending: 'Yana jiran tura bayani zuwa cibiya (synced = 0)',
    done: 'An Gama',

    syncHeading: 'Cibiyar Tura Bayanai',
    syncSubheading: 'Tura bayanai da kanka domin adana batir a wayoyin Android marasa karfi.',
    onlineSignal: 'Akwai Hanyar Sadarwa',
    offlineSignal: 'Babu Hanyar Sadarwa (2G / Kashe)',
    pendingQueue: 'RAHOTON DA KE JIRA',
    totalRecorded: 'Jimillar Rahotanni',
    syncedLabel: 'Wadanda Aka Tura',
    syncNow: 'Tura Bayanai Yanzu',
    allSynced: '✓ An Tura Dukkan Rahotanni',
    transmittingText: 'Ana tura bayanan da aka sirranta...',
    tabPending: 'Wadanda ke Jira',
    tabDispatched: 'Wadanda aka Tura',
    exportBackup: '📦 Ajiye Bayanai a Waje (Sneaker-Net)',
    exportNotice: 'Sauke bayanan sirri zuwa katin ƙwaƙwalwa (Memory Card) domin kaiwa cibiya da kafa.',

    catConflict: 'Alamomin Rikici',
    catConflictDesc: 'Rikicin manoma da makiyaya kan hanyar kiwo ko mashayar ruwa.',
    catInfra: 'Lalacewar Kayan Aiki',
    catInfraDesc: 'Lalacewar rijiyar sola, titin mota, ko karamar asibiti.',
    catMisappr: 'Handama da Badakala',
    catMisapprDesc: 'Karkatar da tallafin abinci ko taki, ko karbar kudin haram a shinge.',

    sevLow: 'Kadan (Lura kawai)',
    sevMed: 'Matsakaici (Akwai Tashin Hankali)',
    sevCrit: 'Mai Tsanani (Hatsari na Nan Take)',
  },
};
