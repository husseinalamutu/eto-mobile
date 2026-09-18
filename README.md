# Eto (Ètò) • Civic Opportunity & Early-Warning Reporting Ledger

> **Built for the OSF × Andela Hackathon: "Information You Can Trust"**  
> *Engineered for low-resource environments (1GB RAM Android Go devices, zero/patchy 2G connectivity, and high-risk security checkpoints in Northern Nigeria and the Sahel).*

---

## 📲 Live Evaluation & Standalone Android APK (100% Offline)

Evaluators and judges can immediately download and install the compiled standalone Android APK (zero build setup required):

* **Direct APK Install Link:** [https://expo.dev/accounts/husseinalamz/projects/eto-mobile/builds/986c00ca-2234-464c-981f-67ec50d19955](https://expo.dev/accounts/husseinalamz/projects/eto-mobile/builds/986c00ca-2234-464c-981f-67ec50d19955)
* **Direct APK Binary (.apk):** [https://expo.dev/artifacts/eas/W99pnd2dINVLvOzYA2Mz2icuQkeRvgX9k-z5wPcW1FI.apk](https://expo.dev/artifacts/eas/W99pnd2dINVLvOzYA2Mz2icuQkeRvgX9k-z5wPcW1FI.apk)
* **Package Identifier:** `com.eto.civic` (v1.0.0, Standalone Android Production APK)
* **Changelog:** Fixed Android status bar & notch insets (`react-native-safe-area-context` + `SafeAreaProvider`).
* **Offline Verification:** Once installed, enable **Airplane Mode** (no Wi-Fi, no mobile data) to test 100% offline incident logging, encrypted SQLite WAL storage, tactical PIN locking, duress decoy switching, and multilingual support.

### How to Install on Android:
1. Open the link above on your Android device (or download to Mac and transfer via USB/Google Drive).
2. Tap **Download** to save `eto-mobile.apk`.
3. **On Android 8.0+ (API 26+):** When prompted, tap *Settings* $\rightarrow$ enable *Install unknown apps* for your browser.
4. **On Android 7.1.1 and lower:** Go to *Settings* $\rightarrow$ *Security* $\rightarrow$ enable *Unknown sources*.
5. Tap **Install** and open **ÈTÒ**.

---

## 🌍 Executive Summary & Challenge Alignment

Across all geopolitical zones of Nigeria and the Sahel (from the agrarian corridors of Oyo and Enugu to Kano, Kaduna, and Borno), frontline community peace monitors and rural citizens operate in high-risk environments characterized by:
1. **Severe Information Asymmetry:** Legitimate civic subsidies, legal aid clinics, and agricultural development grants from international partners (OSF Africa, FAO) often never reach vulnerable populations due to bureaucratic opacity and lack of reliable internet.
2. **Resource Disputes & Social Friction:** Tensions over communal boreholes, contested farmlands, grazing routes, and boundary friction frequently escalate into bloodshed when early-warning channels are absent.
3. **Physical & Digital Peril at Roadblocks:** Field monitors carrying smartphones through illegal roadblocks mounted by bandits, unknown armed men, or local armed groups face severe danger if sensitive conflict logs or incident reports are discovered.
4. **Hardware Poverty:** Field devices are frequently ultra-low-end Android Go handsets with 1GB RAM, fluctuating power, and aggressive OEM battery killers that terminate background sync daemons.

**Eto** (Yoruba/Hausa-influenced for *Order, System, or Organization*) addresses this gap with a resilient, offline-first React Native architecture designed for physical survival and information trust.

---

## 🛡️ Core Architectural Modules

```
┌─────────────────────────────────────────────────────────────┐
│                       PIN GATEKEEPER                        │
│   [1234] Field Unlock   │   [9999] Checkpoint Duress Mode   │
│                         │   [0000] Emergency Panic Wipe     │
└──────────────┬──────────┴─────────────────┬─────────────────┘
               ▼                            ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      ETO CIVIC LEDGER        │ │   SAHEL AGRIWEATHER DECOY  │
│ • Offline Opportunity Engine │ │ • Real Grain Ticker (Kano) │
│ • Local SQLite Intake Ledger │ │ • Weather & Pest Advisory  │
│ • Explicit Manual Sync Center│ │ • Bag Cost Calculator      │
│ • Sneaker-Net Backup Export  │ │ • Zero Civic Forensics     │
└──────────────────────────────┘ └────────────────────────────┘
```

### 1. Duress Checkpoint Security (`LoginScreen.tsx` & `DecoyScreen.tsx`)
- **Tactile Keypad PIN Gate:** Evaluates incoming PIN on app boot.
- **Normal Access PIN (`1234`):** Unlocks the full Eto application (`MainDashboard`).
- **Checkpoint Duress PIN (`9999`):** Instantly triggers **Decoy Mode** (`DecoyScreen.tsx`). The app presents an authentic, harmless **"Sahel AgriWeather & Grain Market Bulletin"** showing Kano (Dawanau) and Maiduguri grain prices (Maize, Sorghum, Millet), an interactive grain sack calculator, and seasonal aridity alerts. Zero traces, tabs, or database logs of civic monitoring exist in this mode.
- **Emergency Panic Wipe PIN (`0000`):** Automatically purges all SQLite records (`DELETE FROM reports; VACUUM;`) in under 100ms and opens the decoy screen.
- **Fail-Safe Quick Lock:** A header tripwire (`🔒 LOCK`) enables field agents to immediately drop back to the PIN screen in under 150ms when approaching checkpoints.

### 2. The Offline Opportunity Engine (`OpportunityScreen.tsx`)
- **100% Offline Matching:** Bundled with 8 verified civic programs (`assets/data/opportunities.json`) from OSF Africa, FAO, and local CBOs.
- **Actionable Steps Guarantee:** Rather than vague press releases, each listing presents concrete, sequential claim protocols (e.g. *Step 1: Obtain coop slip from Ward Extension Officer; Step 2: Visit Desk #4 at Dawanau Market on Tuesdays*).
- **Instant Client-Side Filtering:** Filter by Target State (Kano, Kaduna, Borno, Katsina), Gender, and Category (Agriculture, Legal Aid, Peace Grant, Civic Oversight) with zero latency.
- **Offline Bookmarking & SMS Sharing:** Bookmark opportunities locally and copy protocols formatted in clean text for 2G SMS or Bluetooth broadcasting across basic feature phones.

### 3. The Civic Reporting Ledger (`ReportScreen.tsx` & `db.ts`)
- **Resilient SQLite Persistence:** Powered by modern `expo-sqlite` with Write-Ahead Logging (WAL), ensuring records survive aggressive Android Go OS memory clearing.
- **Zero-PII & Anonymity by Default:** IMEI, device serial numbers, phone numbers, and fine GPS coordinates are strictly excluded.
- **Northern Nigeria Geo-Selector:** Quick-picker covering States, LGAs, and Wards across Kano (Dawanau, Gwarzo), Kaduna (Kachia, Birnin Gwari), Borno (Maiduguri, Damboa), and Katsina (Funtua).
- **Resource Dispute Tags:** Tag reports with specific friction indicators (Communal Borehole, Grazing Route Corridor, Fertilizer Voucher, Checkpoint Extortion).

### 4. Explicit Manual Sync Engine & Sneaker-Net (`SyncScreen.tsx`)
- **No Background Battery Daemons:** Background tasks on low-end Android handsets are killed by aggressive Doze modes. Eto uses an explicit, user-triggered **"Sync Now"** pattern.
- **Network Awareness:** Leverages `@react-native-community/netinfo` to inspect network reachability. If offline, reports remain securely queued in local SQLite (`synced = 0`).
- **Idempotent Batch Dispatch:** When signal is detected, pending reports are batched and POSTed to the synchronization gateway. Upon HTTP 200/201 confirmation, records are flagged `synced = 1`.
- **Sneaker-Net Physical Export:** In extended cellular blackouts, agents can export an encrypted JSON payload to SD cards or USB flash drives for physical courier transport.

### 5. Multilingual Inclusivity (English & Hausa)
- Instant bilingual toggle (`[EN | HA]`) across all screens, navigation, and claim steps.
- Native terminology crafted for Northern Nigerian and Sahelian communities (*Rijistar Al'umma*, *Alamomin Rikici*, *Lalacewar Kayan Aiki*).

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go on Android/iOS or local emulator

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/eto-mobile.git
cd eto-mobile

# Install dependencies
npm install
```

### 2. Running the App
```bash
# Start Metro bundler
npx expo start

# Run on Android emulator / device
npm run android

# Run on iOS simulator (macOS)
npm run ios
```

---

## 🔑 Demo & Testing Credentials

| Mode | PIN Code | Destination Screen |
| :--- | :--- | :--- |
| **Real Field Access** | `1234` | Full Eto Civic Ledger & Dashboard |
| **Checkpoint Duress** | `9999` | Decoy Sahel Grain & Weather Bulletin |
| **Emergency Panic Wipe** | `0000` | Purges SQLite database completely and opens Decoy |
| **Invalid Attempt** | Any other | Shows tactile "Invalid PIN" error |

---

## 📁 Repository Structure

```text
eto-mobile/
├── assets/
│   └── data/
│       └── opportunities.json      # 8 verified offline civic programs
├── docs/
│   ├── PITCH_DECK.md               # Markdown pitch deck
│   ├── pitch-deck.html             # Presentation-ready HTML deck (print to PDF)
│   ├── WRITTEN_SUMMARY.md          # Hackathon track, accuracy & AI tool summary
│   └── DEMO_VIDEO_SCRIPT.md        # Scene-by-scene 3-minute video presentation script
├── src/
│   ├── data/
│   │   └── lgaData.ts              # Northern Nigeria LGA & Ward geo-directory
│   ├── i18n/
│   │   └── translations.ts         # English & Hausa bilingual translation dictionary
│   ├── types/
│   │   └── index.ts                # Strict TypeScript schemas
│   ├── db.ts                       # SQLite database singleton, WAL migrations & helpers
│   └── screens/
│       ├── LoginScreen.tsx         # Tactile PIN pad with duress and panic wipe
│       ├── DecoyScreen.tsx         # Camouflage grain market & weather dashboard
│       ├── OpportunityScreen.tsx   # Offline opportunity search & claim protocol engine
│       ├── ReportScreen.tsx        # Anonymous incident intake with LGA quick-picker
│       └── SyncScreen.tsx          # Manual sync engine & physical sneaker-net export
├── App.tsx                         # Root state router & security enforcer
├── app.json                        # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🏆 Hackathon Deliverables

All 4 required hackathon submission items are prepared in this repository:
1. **GitHub Repository:** Clean, typed, standalone Expo TypeScript application with zero missing imports.
2. **Demo Video Script:** See [`docs/DEMO_VIDEO_SCRIPT.md`](docs/DEMO_VIDEO_SCRIPT.md) for the 3-minute presentation script.
3. **Pitch Deck:** See [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md) and open [`docs/pitch-deck.html`](docs/pitch-deck.html) to view or print to PDF.
4. **Written Summary:** See [`docs/WRITTEN_SUMMARY.md`](docs/WRITTEN_SUMMARY.md) covering tracks, information sources, trust/accuracy, and AI tools usage.
