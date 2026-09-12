# Eto (Ètò) • Civic Opportunity & Early-Warning Reporting Ledger

> **Built for the OSF × Andela Hackathon: "Information You Can Trust"**  
> *Targeted for low-resource environments (1GB RAM Android Go, zero/patchy 2G connectivity, and high-risk security checkpoints in Northern Nigeria and the Sahel).*

---

## 🌍 Executive Summary & Challenge Alignment

In the Lake Chad Basin and Northern Nigeria (Kano, Kaduna, Borno), rural citizens and community peace monitors operate in extreme environments characterized by:
1. **Severe Information Asymmetry:** Legitimate civic subsidies, legal aid clinics, and agricultural development grants from international partners (like the Open Society Foundations and FAO) often never reach vulnerable populations due to bureaucratic friction and lack of reliable internet.
2. **Resource Disputes & Social Friction:** Tensions over communal boreholes, solar irrigation points, and farmer-herder grazing corridors frequently escalate into violence when early-warning reporting channels are absent or compromised.
3. **Physical & Digital Peril:** Field monitors carrying smartphones through military, police, or insurgent checkpoints face severe danger if sensitive reports or human rights documentation are discovered.
4. **Hardware Poverty:** Field devices are frequently ultra-low-end Android Go handsets with 1GB RAM, fluctuating power, and aggressive OEM battery killers that terminate background sync daemons.

**Eto** (Yoruba/Hausa-influenced for *Order, System, or Organization*) addresses this gap with a resilient, offline-first React Native architecture designed for physical survival and information trust.

---

## 🛡️ Core Architectural Modules

### 1. Duress Checkpoint Security (`DecoyScreen.tsx` & `LoginScreen.tsx`)
- **Tactile Keypad PIN Gate:** Evaluates incoming PIN on app boot.
- **Normal Access PIN (`1234`):** Unlocks the full Eto application (`MainDashboard`).
- **Checkpoint Duress PIN (`9999`):** Instantly triggers **Decoy Mode** (`DecoyScreen.tsx`). The app presents an authentic, harmless **"Sahel AgriWeather & Grain Market Bulletin"** showing Kano (Dawanau) and Maiduguri grain prices (Maize, Sorghum, Millet) and seasonal aridity alerts. Zero traces, tabs, or database logs of civic monitoring exist in this mode.
- **Fail-Safe Quick Lock:** A header tripwire (`🔒 LOCK`) enables field agents to immediately drop back to the PIN screen in under 200ms when approaching checkpoints.

### 2. The Offline Opportunity Engine (`OpportunityScreen.tsx`)
- **100% Offline Matching:** Bundled with verified civic opportunities (`assets/data/opportunities.json`) from OSF Africa, FAO, and local CBOs.
- **Actionable Steps Guarantee:** Rather than vague press releases, each listing presents concrete, sequential claim protocols (e.g. *Step 1: Obtain coop slip from Ward Extension Officer; Step 2: Visit Desk #4 at Dawanau Market on Tuesdays*).
- **Fast Client-Side Filtering:** Filter by Target State (Kano, Kaduna, Borno), Gender, and Category (Agriculture, Legal Aid, Peace Grant) with zero latency.

### 3. The Civic Reporting Ledger (`ReportScreen.tsx` & `db.ts`)
- **Resilient SQLite Persistence:** Powered by modern `expo-sqlite`, ensuring records survive aggressive Android Go OS memory clearing.
- **Zero-PII & Anonymity by Default:** IMEI, device serial numbers, phone numbers, and fine GPS coordinates are strictly excluded.
- **Deterministic Cryptographic ID:** Generates an isolated RFC4122 v4 hash and timestamp for auditability.
- **Intake Categories:** Conflict Indicator, Infrastructure Breakdown, Misappropriation.

### 4. Explicit Manual Sync Engine (`SyncScreen.tsx`)
- **No Background Battery Daemons:** Background tasks on low-end Android handsets are killed by aggressive Doze modes. Eto uses an explicit, user-triggered **"Sync Now"** pattern.
- **Network Awareness:** Leverages `@react-native-community/netinfo` to inspect network reachability. If offline, reports remain securely queued in local SQLite (`synced = 0`).
- **Idempotent Batch Dispatch:** When signal is detected, pending reports are batched and POSTed to the synchronization gateway. Upon confirmation, records are flagged `synced = 1`.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your physical Android device, or an Android/iOS emulator

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/eto-mobile.git
cd eto-mobile

# Install dependencies
npx expo install expo-sqlite @react-native-community/netinfo @expo/vector-icons
npm install
```

### 2. Running the App
```bash
# Start the Expo development server
npx expo start

# Run directly on Android
npm run android

# Run directly on iOS simulator (macOS)
npm run ios
```

---

## 🔑 Demo & Testing Credentials

When testing the application:
| Mode | PIN Code | Destination Screen |
| :--- | :--- | :--- |
| **Real Field Access** | `1234` | Full Eto Civic Ledger & Dashboard |
| **Checkpoint Duress** | `9999` | Decoy Sahel Grain & Weather Bulletin |
| **Invalid Attempt** | Any other | Shows tactile "Invalid PIN" shake/error |

---

## 📊 File Architecture

```text
eto-mobile/
├── assets/
│   └── data/
│       └── opportunities.json      # Pre-bundled offline verified civic programs
├── src/
│   ├── types/
│   │   └── index.ts                # Strict TypeScript schemas for reports & opportunities
│   ├── db.ts                       # SQLite database singleton, migrations & helpers
│   └── screens/
│       ├── LoginScreen.tsx         # Tactile PIN pad with duress tripwire
│       ├── DecoyScreen.tsx         # Harmless grain market & weather camouflage
│       ├── OpportunityScreen.tsx   # Offline opportunity search & claim protocol engine
│       ├── ReportScreen.tsx        # Anonymous incident intake form with zero PII
│       └── SyncScreen.tsx          # Manual network sync dashboard & queue manager
├── App.tsx                         # Root state router & security enforcer
├── app.json                        # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🏆 Hackathon Judging Criteria Alignment

- **Uniqueness:** The dual-PIN decoy architecture directly solves the real-world checkpoint search peril faced by Sahelian community monitors.
- **Scalability:** Static JSON bundling and SQLite storage allow scaling to tens of thousands of rural communities with zero hosting overhead.
- **AI Coding Usage:** Architectural patterns, strict typing, and resilient SQLite integration were authored with advanced AI pair-programming tooling.
- **Presentation:** High-contrast UI built specifically for direct sunlight legibility and rapid field use on 1GB RAM Android Go devices.
