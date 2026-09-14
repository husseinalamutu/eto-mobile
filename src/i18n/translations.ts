export type Language = 'en' | 'ha' | 'yo' | 'ig' | 'fr';

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

  // New Clarity & Onboarding Keys
  logIncidentBtn: string;
  reportBanner: string;
  decoyBannerTitle: string;
  decoyBannerAction: string;
  oppBanner: string;
  syncBanner: string;
  onboardingBtn: string;
  onboardingTitle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'ETO • CIVIC LEDGER',
    appSubtitle: 'Information You Can Trust • OSF Africa',
    quickLock: '🔒 LOCK',
    
    tabOpportunities: 'Opportunities',
    tabReport: 'Incident Ledger',
    tabSync: 'Sync Engine',
    
    loginTitle: 'System Security Access',
    loginSubtitle: 'Enter terminal PIN to authenticate device session',
    loginHelper: 'Default PIN: 1234 (Unlock) · 9999 (Decoy) · 0000 (Wipe)',
    loginInvalid: 'Invalid PIN. Please try again.',
    loginNotice: 'FIELD SECURITY PROTOCOLS',
    loginRealPin: '• Real Access PIN: 1234 (Full Ledger)',
    loginDuressPin: '• Duress Checkpoint PIN: 9999 (Decoy Screen)',
    loginWipePin: '• Emergency Panic Wipe: 0000 (Purges SQLite & Closes)',

    oppHeading: 'Peace & Civic Opportunities',
    oppSubheading: 'Pre-cached civic grants, input subsidies & legal aid across Nigeria',
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

    reportHeading: 'National Incident Ledger',
    reportSubheading: 'Zero-PII local SQLite ledger for early warning and conflict mitigation across Nigeria.',
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

    logIncidentBtn: '+ LOG INCIDENT',
    reportBanner: '📋 Incident Ledger: A secure offline record book for logging security complaints, armed threats, extortion, and early warning alerts across Nigeria. Tap "+ LOG INCIDENT" to record a complaint.',
    decoyBannerTitle: '🛡️ STEALTH DECOY ACTIVE (Checkpoint Camouflage)',
    decoyBannerAction: 'Disguised as market grain prices. Tap here or hold bottom-left 2s to return to Incident Ledger.',
    oppBanner: '🤝 Community Opportunities: Verified peacebuilding grants, legal aid, agricultural subsidies, and youth vocational programs across Nigerian communities.',
    syncBanner: '📡 Offline Sync Terminal: Reports recorded in the field remain encrypted on your phone. Tap "Sync Now" when connected to cellular data or Wi-Fi.',
    onboardingBtn: '📖 GUIDE',
    onboardingTitle: 'ÈTÒ Field Guide & Tutorial',
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
    oppSubheading: 'Tallafin noma, kariya ta shari\'a da tallafin matasa a yankunan karkara',
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

    logIncidentBtn: '+ BADA RAHOTO',
    reportBanner: '📋 Rijistar Al\'umma: Wurin rubuta rahoton tsaro, barazana, da alamun rikici ba tare da intanet ba. Danna "+ BADA RAHOTO" domin aikawa.',
    decoyBannerTitle: '🛡️ BOYAYYEN ALLON NOMA (Kariya a Shinge)',
    decoyBannerAction: 'Kariyar shinge da allon farashin hatsi. Danna nan ko danna kusurwa kasa na daƙiƙa 2 domin komawa rijistar tsaro.',
    oppBanner: '🤝 Damarmakin Al\'umma: Tabbatar da tallafin zaman lafiya, agajin lauyoyi, da koyon sana\'o\'in matasa a fadin Najeriya.',
    syncBanner: '📡 Cibiyar Tura Bayanai: Rahotannin da aka rubuta suna ajiye a wayarka. Danna "Tura Bayanai Yanzu" idan ka samu intanet.',
    onboardingBtn: '📖 JAGORA',
    onboardingTitle: 'Jagoran Manhajar ÈTÒ',
  },

  yo: {
    appName: 'ÈTÒ • ÀKỌỌ́LẸ̀ ÌLÚ',
    appSubtitle: 'Ìròyìn Tí O Lè Gbẹ́kẹ̀lé • OSF Africa',
    quickLock: '🔒 TI DE',

    tabOpportunities: 'Àwọn Àǹfààní',
    tabReport: 'Fi Ẹsun Ranṣẹ',
    tabSync: 'Ẹrọ Ìmuṣiṣẹpọ̀',

    loginTitle: 'Àbò Àṣẹ Ètò Wọlé',
    loginSubtitle: 'Tẹ nọmba PIN rẹ láti ṣí àkọọ́lẹ̀ ẹ̀rọ rẹ',
    loginHelper: 'Àbò Cryptographic Enclave lórí ẹ̀rọ rẹ',
    loginInvalid: 'Nọmba PIN kò tọ̀nà. Gbìyànjú lẹ́ẹ̀kan síi.',
    loginNotice: 'ÀWỌN ILANA ÀBÒ LÁWÙJỌ',
    loginRealPin: '• PIN Wọlé Gidi: 1234 (Àkọọ́lẹ̀ Ìlú)',
    loginDuressPin: '• PIN Àbò Ní Checkpoint: 9999 (Ojú Ètò Àgbẹ̀ & Ojú-ọjọ́)',
    loginWipePin: '• PIN Pàjáwìrì Láti Pa Gbogbo Rẹ Rẹ́: 0000 (Nu gbogbo data kúrò)',

    oppHeading: 'Ẹrọ Àwárí Àǹfààní Láìsí Íńtánẹ́ẹ̀tì',
    oppSubheading: 'Àwọn owó ìrànwọ́ ìjọba, ètò àgbẹ̀, àti àbò òfin fún àwọn ará ìlú',
    searchPlaceholder: 'Ṣe àwárí pẹ̀lú ọ̀rọ̀, agbègbè, tàbí ohun àmúṣọrọ̀...',
    filterState: 'ÌPINLẸ̀:',
    filterType: 'IRÚFẸ́:',
    verifiedTag: '✓ Ìfọwọ́sí:',
    offlineTag: 'Láìsí Íńtánẹ́ẹ̀tì',
    claimProtocol: 'ÀWỌN ÌGBÉSẸ̀ GIDI LÁTI GBA TÀLLAFÌ',
    viewAll: 'Wo Gbogbo Rẹ̀',
    collapse: 'Kékèké',
    bookmark: 'Fi Pamọ́',
    bookmarked: 'Ti Pamọ́',
    shareSMS: 'Daakọ fún SMS',
    noOppTitle: 'Kò sí àǹfààní tó bá a mu',
    noOppSub: 'Ṣàtúnṣe àwárí rẹ tàbí yí ìpínlẹ̀ padà láti rí àwọn àkọọ́lẹ̀.',

    reportHeading: 'Àkọọ́lẹ̀ Ìròyìn Ẹsun Láwùjọ',
    reportSubheading: 'Àkọọ́lẹ̀ SQLite láìsí orúkọ tàbí nọmba foonu rẹ. Kò sí ewu lórí checkpoint.',
    anonymityBannerTitle: '🛡️ ÀBÒ ÀṢÍRÍ GIDIGIDI FÚN OLÙRÒYÌN',
    anonymityBannerText: 'A kò gba IMEI, nọmba tẹlifóònù, tàbí àdírẹ́sì ilé rẹ. A ń dá nọmba àṣírí cryptographic hash sílẹ̀ fún ààbò ẹ̀mí rẹ.',
    fieldCategory: 'Ẹ̀KA ÌṢẸ̀LẸ̀',
    fieldLocation: 'AGBÈGBÈ WARD & LGA',
    fieldSeverity: 'BÍ Ọ̀RỌ̀ ṢE LE TÓ',
    fieldDescription: 'ÌRÒYÌN ÒTÍTỌ́ OHUN TÍ Ó ṢẸLẸ̀',
    descPlaceholder: 'Ṣàlàyé kúlẹ̀kúlẹ̀ ohun tí ó ṣẹlẹ̀ láàrin àwọn ẹgbẹ́ (àpẹẹrẹ: rogbodiyan lórí omi kànga tàbí ilẹ̀ ọ̀gbìn)...',
    submitButton: 'Fi Pamọ́ Sínú Àkọọ́lẹ̀ Wáyà',
    submittingText: 'Ń kọ ọ́ sínú SQLite...',
    storedModalTitle: 'Ti Wà Ní Àkọọ́lẹ̀ Wáyà Láfíyà',
    storedModalBody: 'A ti fi ìròyìn rẹ pamọ́ sínú rumbun wáyà rẹ láìnílò íńtánẹ́ẹ̀tì rárá.',
    ledgerId: 'NỌMBA ÌRÒYÌN (HASH):',
    timestamp: 'ÀKÓKÒ:',
    syncStatusPending: 'Ń dúró de ìgbà tí a ó fi ránṣẹ́ (synced = 0)',
    done: 'Ó Ti Parí',

    syncHeading: 'Ẹ̀rọ Ìfiránṣẹ́ Fúnra Ẹni',
    syncSubheading: 'Fi ọwọ́ rẹ ránṣẹ́ nígbà tó o bá fẹ́ láti dábò bo bátìrì Android Go rẹ.',
    onlineSignal: 'Íńtánẹ́ẹ̀tì Wà',
    offlineSignal: 'Kò Sí Íńtánẹ́ẹ̀tì (2G / Pa)',
    pendingQueue: 'ÀWỌN TÓ Ń DÚRÓ',
    totalRecorded: 'Àpapọ̀ Ìròyìn',
    syncedLabel: 'Ti Ránṣẹ́',
    syncNow: 'Ránṣẹ́ Nísinsìnyí',
    allSynced: '✓ Gbogbo Rẹ̀ Ti Ránṣẹ́',
    transmittingText: 'Ń rán àwọn àkọọ́lẹ̀ tí a dábò bo...',
    tabPending: 'Àwọn Tó Ń Dúró',
    tabDispatched: 'Àwọn Tí A Ti Ránṣẹ́',
    exportBackup: '📦 Ṣíṣe Àdàkọ Sínú Káàdì Ìpamọ́ (Sneaker-Net)',
    exportNotice: 'Gbé data tí a dábò bo jáde sínú USB tàbí Memory Card láti gbé e fún ara rẹ lọ sí olú ilé-iṣẹ́.',

    catConflict: 'Àfihàn Rogbodiyan',
    catConflictDesc: 'Èdèkoyédè àwọn àgbẹ̀ àti darandaran lórí ilẹ̀ tàbí omi.',
    catInfra: 'Ìbàjẹ́ Ohun Amáyédérùn',
    catInfraDesc: 'Kànga solar tó bàjẹ́, afárá tó já, tàbí ilé-ìwòsàn tí kò sí oògùn.',
    catMisappr: 'Jibiti & Handama Ìjọba',
    catMisapprDesc: 'Kíkó oúnjẹ ìrànwọ́ pamọ́, gbígba owó àbẹ̀tẹ́lẹ̀ ní checkpoint.',

    sevLow: 'Kékeré (Wíwo lásán)',
    sevMed: 'Alábọ́dé (Inú ń ru)',
    sevCrit: 'Pàjáwìrì (Ewu wà lẹ́sẹ̀kẹsẹ̀)',

    logIncidentBtn: '+ FI ẸSUN RANṢẸ',
    reportBanner: '📋 Àkọọ́lẹ̀ Ìlú: Ìwé àpamọ́ tí kò lo íńtánẹ́ẹ̀tì láti kọ ẹsun àbò, ìhalẹ̀mọ́ni, àti àwọn àfihàn rogbodiyan ní Nàìjíríà. Tẹ "+ FI ẸSUN RANṢẸ" láti kọ ọ́ sílẹ̀.',
    decoyBannerTitle: '🛡️ OJÚ ÈTÒ ÀGBẸ̀ AṢỌ̀RỌ̀ (Àbò ní Checkpoint)',
    decoyBannerAction: 'Ojú ewe yìí fi ara pamọ́ bí iye oúnjẹ ọjà. Tẹ ibí yìí tàbí tẹ igun ìsàlẹ̀ fún ìṣẹ́jú-àáyá 2 láti padà sí Àkọọ́lẹ̀ Ẹsun.',
    oppBanner: '🤝 Àwọn Àǹfààní Àwùjọ: Àwọn ètò ìrànwọ́ àlàáfíà, àbò ti òfin, àti ẹ̀kọ́ iṣẹ́-ọwọ́ fún àwọn ọ̀dọ́ káàkiri Nàìjíríà.',
    syncBanner: '📡 Ẹ̀rọ Ìfiránṣẹ́ Fúnra Ẹni: Àwọn ẹsun tí a kọ sílẹ̀ wà ní dídábòbò lórí foonu rẹ. Tẹ "Ránṣẹ́ Nísinsìnyí" nígbà tí íńtánẹ́ẹ̀tì bá wà.',
    onboardingBtn: '📖 ÌTỌ́NI',
    onboardingTitle: 'Ìtọ́ni & Ìkẹ́kọ̀ọ́ ÈTÒ',
  },

  ig: {
    appName: 'ÈTÒ • AKWỤKWỌ NDEKỌ OBODO',
    appSubtitle: 'Ozi Ị Pụrụ Ikwere • OSF Africa',
    quickLock: '🔒 KPOCHIE',

    tabOpportunities: 'Ohere Dịgasị',
    tabReport: 'Ziga Mkpesa',
    tabSync: 'Ngwa Mmekọrịta',

    loginTitle: 'Nchekwa Ngwa Ètò',
    loginSubtitle: 'Tinye nọmba PIN gị iji banye na ngwa',
    loginHelper: 'Echekwara site na Cryptographic Enclave',
    loginInvalid: 'Nọmba PIN ezighi ezi. Nwaa ọzọ.',
    loginNotice: 'IHE NDỊ E KWESỊRỊ IMATA MA Ị NỌ NA CHECKPOINT',
    loginRealPin: '• Ezigbo PIN Ọrụ: 1234 (Akwụkwọ Ndekọ Obodo)',
    loginDuressPin: '• PIN Nchekwa Checkpoint: 9999 (Ihu Ahịa Ọrụ Ugbo & Ihu Igwe)',
    loginWipePin: '• PIN Nhichapụ Mberede: 0000 (Hichapụ data niile ozugbo)',

    oppHeading: 'Ngwa Nchọpụta Ohere Maka Obodo',
    oppSubheading: 'Enyemaka gọọmentị, mmemme ọrụ ugbo, na nchekwa iwu enweghị mkpa ịntanetị',
    searchPlaceholder: 'Chọọ site na mkpụrụokwu, ngalaba ma ọ bụ enyemaka...',
    filterState: 'STEETI:',
    filterType: 'ỤDỊ:',
    verifiedTag: '✓ E Kwenyere Ya:',
    offlineTag: 'Na-arụ Ọrụ Na-enweghị Ịntanetị',
    claimProtocol: 'ỤZỌ KWESỊRỊ ISI NWETA ENYEMAKA NKE A',
    viewAll: 'Lee Ha Niile',
    collapse: 'Kpokọta',
    bookmark: 'Chekwaa',
    bookmarked: 'Echekwara Ya',
    shareSMS: 'Depụtaghachi maka SMS',
    noOppTitle: 'Enweghị ohere kwekọrọ',
    noOppSub: 'Gbanwee ihe ị na-achọ ma ọ bụ họrọ steeti ọzọ ka ị hụ ohere dịnụ.',

    reportHeading: 'Ntinye Mkpesa Maka Nsogbu Obodo',
    reportSubheading: 'Ndekọ SQLite na-anaghị ewere aha gị ma ọ bụ nọmba ekwentị gị.',
    anonymityBannerTitle: '🛡️ EZIGBO NCHEKWA ONYE ZITERE OZI',
    anonymityBannerText: 'Anyị anaghị ewere IMEI, nọmba ekwentị, ma ọ bụ adresị ụlọ gị. A na-enye mkpesa ọ bụla koodu nzuzo pụrụ iche maka nchekwa gị.',
    fieldCategory: 'ỤDỊ NSOGBU',
    fieldLocation: 'WARD NA LGA GỊ',
    fieldSeverity: 'ỌKWA NSOGBU A',
    fieldDescription: 'NKỌWA IHE DỊ MMA BANYERE NSOGBU A',
    descPlaceholder: 'Kọwaa ihe merenụ n\'ụzọ doro anya (ọmụmaatụ: esemokwu banyere mmiri pọmpụ ma ọ bụ ala ubi)...',
    submitButton: 'Chekwaa n\'Akwụkwọ Ndekọ Ekwentị',
    submittingText: 'Na-ede na SQLite...',
    storedModalTitle: 'Echekwara Ya na Nchekwa Ekwentị',
    storedModalBody: 'Edere mkpesa gị n\'akwụkwọ ndekọ SQLite nke ekwentị na-enweghị mkpa ịntanetị.',
    ledgerId: 'NỌMBA MKPESA (HASH):',
    timestamp: 'OGE:',
    syncStatusPending: 'Na-eche nzipu gaa n\'isi ụlọ ọrụ (synced = 0)',
    done: 'Emechaala',

    syncHeading: 'Ebe Nzipu Ozi Eji Aka Mee',
    syncSubheading: 'Ziga ozi n\'onwe gị iji chekwaa batrị ekwentị Android Go gị.',
    onlineSignal: 'Ịntanetị Dị',
    offlineSignal: 'Enweghị Ịntanetị (2G / Gbanyụrụ)',
    pendingQueue: 'NDỊ NA-ECHE NZIPU',
    totalRecorded: 'Mkpesa Niile',
    syncedLabel: 'Ndị E Zigara',
    syncNow: 'Ziga Ugbu A',
    allSynced: '✓ E Zigala Mkpesa Niile',
    transmittingText: 'Na-eziga ozi echekwara echekwa...',
    tabPending: 'Ndị Na-eche',
    tabDispatched: 'Ndị E Zigara',
    exportBackup: '📦 Mbufe na Kaadị Ekwentị (Sneaker-Net)',
    exportNotice: 'Wepụta data a echekwara na USB ma ọ bụ Memory Card iji were aka gị buru ya gaa.',

    catConflict: 'Ihe Ngosi Esemokwu',
    catConflictDesc: 'Esemokwu dị n\'etiti ndị ọrụ ugbo na ndị na-azụ anụ maka ụzọ anụ ma ọ bụ mmiri.',
    catInfra: 'Mmebi Akụrụngwa Obodo',
    catInfraDesc: 'Mmiri pọmpụ solar mebiri emebi, àkwà mmiri kụrụ afọ n\'ala, ma ọ bụ ụlọ ọgwụ na-enweghị ọgwụ.',
    catMisappr: 'Irigbu Ego & Ihe Ndị Enyemaka',
    catMisapprDesc: 'Izochi nri enyemaka ma ọ bụ fatịlaịza, ịnata ngarị n\'ebe a na-enyocha ndị mmadụ (checkpoint).',

    sevLow: 'Dị Ala (Nlele nkịtị)',
    sevMed: 'Ọkara (Esemokwu na-amalite)',
    sevCrit: 'Dị Oké Mkpa (Ihe ize ndụ ozugbo)',

    logIncidentBtn: '+ TINYE MKPESA',
    reportBanner: '📋 Akwụkwọ Ndekọ Obodo: Ebe echekwara enweghị mkpa ịntanetị maka idekọ mkpesa nchekwa, egwu, na esemokwu na Naịjirịa. Pịa "+ TINYE MKPESA" iji zipu.',
    decoyBannerTitle: '🛡️ IHU AHỊA NCHEKWA (Mkpuchi na Checkpoint)',
    decoyBannerAction: 'Ihu a na-egosipụta ọnụ ahịa ọka. Pịa ebe a ma ọ bụ jide akụkụ ala maka sekọnd 2 iji laghachi na Ndekọ Mkpesa.',
    oppBanner: '🤝 Ohere Obodo: Enyemaka udo obodo, nchekwa iwu, mmemme ọrụ ugbo, na ọzụzụ nka ndị ntorobịa na Naịjirịa.',
    syncBanner: '📡 Ebe Nzipu Ozi: A na-echekwa mkpesa niile na ekwentị gị. Pịa "Ziga Ugbu A" mgbe ịntanetị dị.',
    onboardingBtn: '📖 NDỤMỌDỤ',
    onboardingTitle: 'Ntuziaka & Ọzụzụ ÈTÒ',
  },

  fr: {
    appName: 'ÈTÒ CIVIQUE',
    appSubtitle: 'Registre Décentralisé & Alerte Précoce',
    quickLock: 'VERROU',

    tabOpportunities: 'Opportunités',
    tabReport: 'Registre Terrain',
    tabSync: 'File Synchro',

    loginTitle: 'Accès Sécurisé au Registre',
    loginSubtitle: 'Enclave chiffrée hors-ligne · Terminal civique du Sahel',
    loginHelper: 'PIN par défaut: 1234 (Déverrouiller) · 9999 (Leurre) · 0000 (Purge)',
    loginInvalid: 'Code PIN invalide. Réessayez.',
    loginNotice: 'AVIS DE SÉCURITÉ AU POINT DE CONTRÔLE',
    loginRealPin: 'PIN Réel (1234): Ouvre le registre citoyen complet',
    loginDuressPin: 'PIN Contrainte (9999): Affiche le bulletin agricole leurre',
    loginWipePin: 'PIN Purge (0000): Efface toutes les données SQLite instantanément',

    oppHeading: 'Opportunités Citoyennes',
    oppSubheading: 'Subventions & programmes vérifiés · Mises à jour hors-ligne',
    searchPlaceholder: 'Rechercher subventions, aides juridiques, mot-clé...',
    filterState: 'ÉTAT / RÉGION',
    filterType: 'DOMAINE',
    verifiedTag: '✓ Vérifié:',
    offlineTag: 'Accessible Hors-Ligne',
    claimProtocol: 'PROTOCOLE DE RÉCLAMATION',
    viewAll: 'Voir Tout',
    collapse: 'Réduire',
    bookmark: 'Favori',
    bookmarked: 'Enregistré',
    shareSMS: 'Copier pour SMS',
    noOppTitle: 'Aucune opportunité trouvée',
    noOppSub: 'Modifiez vos filtres ou vos termes de recherche.',

    reportHeading: 'Registre National des Incidents',
    reportSubheading: 'Registre local SQLite · Alerte précoce et prévention des conflits au Nigéria.',
    anonymityBannerTitle: '🛡️ PROTECTION TOTALE DE L\'ANONYMAT',
    anonymityBannerText: 'Aucun identifiant d\'appareil (IMEI), numéro ou métadonnée personnelle n\'est capturé. Chaque rapport reçoit un identifiant cryptographique aléatoire.',
    fieldCategory: 'CATÉGORIE D\'INCIDENT',
    fieldLocation: 'COMMUNE & QUARTIER (LGA / WARD)',
    fieldSeverity: 'NIVEAU DE GRAVITÉ',
    fieldDescription: 'OBSERVATION DE TERRAIN',
    descPlaceholder: 'Décrivez précisément l\'incident (ex: détournement de vivres, panne de forage solaire, litige foncier)...',
    submitButton: 'Enregistrer dans le Registre Local',
    submittingText: 'Écriture dans SQLite...',
    storedModalTitle: 'Enregistré Hors-Ligne dans SQLite',
    storedModalBody: 'Rapport consigné dans la base locale chiffrée sans nécessiter de connexion réseau.',
    ledgerId: 'IDENTIFIANT UNIQUE (HASH):',
    timestamp: 'HORODATEUR:',
    syncStatusPending: 'En attente de transmission manuelle (synced = 0)',
    done: 'Terminer',

    syncHeading: 'Centre de Synchronisation Manuelle',
    syncSubheading: 'Transmission manuelle pour préserver la batterie et la sécurité.',
    onlineSignal: 'Connecté au Réseau',
    offlineSignal: 'Hors-Ligne (2G / Données Coupées)',
    pendingQueue: 'FILE D\'ATTENTE HORS-LIGNE',
    totalRecorded: 'Total Enregistré',
    syncedLabel: 'Transmis',
    syncNow: 'Transmettre Maintenant',
    allSynced: '✓ Tout est Synchronisé',
    transmittingText: 'Transmission sécurisée du lot...',
    tabPending: 'En Attente',
    tabDispatched: 'Transmis',
    exportBackup: '📦 Export Physique (Sneaker-Net)',
    exportNotice: 'Générez un fichier chiffré JSON pour transfert par clé USB ou carte SD.',

    catConflict: 'Indicateur de Conflit',
    catConflictDesc: 'Litiges éleveurs-agriculteurs sur couloirs de transhumance ou points d\'eau.',
    catInfra: 'Panne d\'Infrastructure Critique',
    catInfraDesc: 'Forages solaires en panne, ponts détruits, centres de santé sans fournitures.',
    catMisappr: 'Détournement d\'Aide & Tracasseries',
    catMisapprDesc: 'Détournement de vivres humanitaires, engrais subventionnés, extorsion aux barrages.',

    sevLow: 'Faible (Observation de routine)',
    sevMed: 'Moyen (Tension naissante)',
    sevCrit: 'Critique (Risque violent immédiat)',

    logIncidentBtn: '+ SIGNALER INCIDENT',
    reportBanner: '📋 Registre des Incidents: Registre local hors-ligne pour consigner les plaintes sécuritaires et alertes précoces au Nigéria. Appuyez sur "+ SIGNALER INCIDENT".',
    decoyBannerTitle: '🛡️ LEURRE DE SÉCURITÉ ACTIF (Camouflage aux barrages)',
    decoyBannerAction: 'Camouflé en mercuriale agricole. Appuyez ici ou maintenez le coin inférieur gauche pendant 2s pour revenir au Registre.',
    oppBanner: '🤝 Opportunités Communautaires: Subventions vérifiées pour la paix, aide juridique et formation professionnelle des jeunes au Nigéria.',
    syncBanner: '📡 File de Synchronisation: Les rapports consignés sur le terrain restent chiffrés sur votre appareil. Appuyez sur "Transmettre Maintenant" lorsque le réseau est disponible.',
    onboardingBtn: '📖 GUIDE',
    onboardingTitle: 'Guide d\'Utilisation & Tutoriel ÈTÒ',
  },
};
