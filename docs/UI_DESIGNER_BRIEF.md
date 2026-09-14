# PRODUCT DESIGN BRIEF: ETO (ÈTÒ) MOBILE
**Platform:** React Native (Expo) • Android Go (1GB RAM Target)  
**Initiative:** OSF × Andela Hackathon ("Information You Can Trust")  
**Target Region:** Northern Nigeria & Sahelian / Emerging African Communities  

---

## 1. EXECUTIVE SUMMARY & PRODUCT VISION
**Eto** (Yoruba/Hausa for *Order, System, or Organization*) is a local-first, offline-ledger mobile application built for frontline civic monitors, rural farmers, and grassroots community leaders.

It addresses two life-or-death challenges in emerging and conflict-affected markets:
1. **The Information Blackout:** Millions in verified public grants, agricultural subsidies, and free legal aid go unclaimed because announcements are fragmented, complex, or require internet connectivity.
2. **The Armed Roadblock Peril:** Community monitors who record resource conflicts (e.g. borehole disputes, grazing land friction, diverted relief aid) face harassment, phone confiscation, or physical violence at illegal roadblocks mounted by bandits, unknown armed men, or insurgents.

Eto solves this with a **Dual-State Identity**: a secure civic ledger for safe environments, and an instantaneous, completely harmless **Decoy Camouflage Screen** (an authentic grain price and weather monitor) if forced to unlock the device under duress.

---

## 2. EXTREME OPERATING CONSTRAINTS (DESIGN FOR THE SAHEL)
The designer must design for real conditions on the ground:
- **Display Hardware:** Low-end 5.0" to 6.0" LCD screens (often scratched or cracked) with poor viewing angles and low brightness.
- **Lighting:** Intense, blinding direct sunlight (glare-heavy Sahelian outdoors).
- **Network:** 90% offline; patchy 2G/EDGE when connectivity exists.
- **Performance:** 1GB RAM Android Go devices. Zero heavy blur filters (backdrop-filter), zero bloated animations, zero multi-layer shadows that cause frame drops.
- **Languages:** Quad-lingual support: **English**, **Hausa**, **Yorùbá**, and **Igbo**. Layouts must accommodate 20–30% text expansion in native African languages without clipping.
- **Ergonomics & Touch Targets:** Large, tactile buttons (minimum 48×48dp; 68dp+ on keypad) for one-handed operation and trembling fingers under stress.

---

## 3. CORE DESIGN PRINCIPLES
1. **High Contrast First:** Deep off-black backgrounds (`#0F172A`), high-visibility text (`#F8FAFC`), and stark contrast borders (`#334155`). Never use subtle light-gray text on white.
2. **Muscle Memory Over Precision:** Critical safety actions (like the emergency lock button or tactile PIN pad) must be accessible within 100 milliseconds without requiring precise motor skills.
3. **Sequential Clarity (Actionable Steps):** Do not show walls of text. Show numbered, modular badges (Step 1, Step 2, Step 3) so low-literacy users can follow instructions or have them read aloud.
4. **Camouflage Authenticity:** The decoy mode cannot look like a generic placeholder. It must look 100% authentic to any armed group, bandit, or hostile interrogator demanding to inspect the device.

---

## 4. SCREEN-BY-SCREEN SPECIFICATIONS

### SCREEN 1: Tactical PIN Lock Screen (`LoginScreen`)
*The gatekeeper. Acts as the primary security tripwire.*
- **Top Utility Bar:**
  - Status pill: "SECURE TERMINAL"
  - Language cycle pill: `[🇬🇧 EN | 🇳🇬 HA | 🇳🇬 YO | 🇳🇬 IG]`
- **Header:** Minimalist shield icon, clean title ("System Security Access"), and reassuring status ("Protected by Local Cryptographic Enclave").
- **PIN Dot Indicator:** 4 clean circular indicators (hollow when empty, high-contrast cyan `#38BDF8` when filled).
- **Tactile Numeric Keypad:**
  - 10 circular/rounded numeric keys (0–9), plus "CLR" (Clear) and "DEL" (Backspace).
  - Minimum button dimensions: 68×68dp.
  - Large, bold numbers (24sp–26sp).
- **Tri-State PIN Logic (Visual Cues):**
  - Entering `1234` -> Unlocks full Civic Ledger.
  - Entering `9999` -> Instantly launches Decoy Screen (zero latency, zero transition animation that hints at a switch).
  - Entering `0000` -> Emergency Panic Wipe (wipes local SQLite ledger and opens decoy screen).
  - Invalid PIN -> Subtle red shake / "Invalid PIN" error.

---

### SCREEN 2: The Decoy Camouflage Screen (`DecoyScreen`)
*The life-saving camouflage. Completely disguises the app as a rural extension bulletin.*
- **Visual Theme:** Earthy, agricultural greens (`#14532D`, `#064E3B`, `#22C55E`)—completely distinct from Eto's dark blue civic palette.
- **Top Navigation Bar:**
  - Title: "🌾 Sahel AgriWeather & Grain Bulletin"
  - Subtitle: "Northern Agricultural Extension & Commodity Index"
  - Subtle lock button ("Lock Bulletin") to return safely to PIN screen.
- **Weather Advisory Card:**
  - Region selector pills (Kano, Maiduguri, Sokoto, Kaduna).
  - Large temperature display (e.g., 39°C, Dry Haze).
  - Key agricultural metrics: Humidity (14%), Wind Vector (19 km/h NE), Soil Moisture (Critical Low).
  - Agronomy alert banner: "Storage beetle advisory: use triple hermetic bags for cowpeas."
- **Wholesale Grain Market Ticker:**
  - List of realistic commodity cards (White Maize ₦78,500, Brown Sorghum ₦82,000, Millet ₦75,000, Cowpeas ₦118,000).
  - Market tags: Dawanau Market Kano, Monday Market Maiduguri, Bodija Market Ibadan.
  - Percentage changes with green/red indicator pills.
- **Interactive Batch Calculator:**
  - Simple calculator: Select crop -> input number of 100kg bags -> shows calculated total market value in Naira (`₦`).
- **Market Schedule & Silo Storage Tips:**
  - Realistic extension tips for grain fumigation and weekly market days.
- **Rule:** ZERO civic tabs, zero reporting buttons, zero human rights terminology anywhere on this screen or in memory.

---

### SCREEN 3: The Offline Opportunity Engine (`OpportunityScreen`)
*A 100% offline directory of verified grants, legal aid, and subsidies.*
- **Header:** Title ("Offline Opportunity Engine"), bookmark counter pill (`⭐ Bookmarked (2)`), and search input with instant clear (`✕`) button.
- **Horizontal Filter Chips:**
  - State Chips: `All`, `Kano`, `Kaduna`, `Borno`, `Oyo`, `Enugu`.
  - Category Chips: `All`, `Agriculture`, `Legal Aid`, `Peace Grant`, `Civic Oversight`.
- **Opportunity Card Design:**
  - **Badge Row:** Category badge (e.g., blue `#0369A1` for Agriculture, purple `#701A75` for Women/Gender), State pin badge (`📍 Kano`), and Star bookmark icon button.
  - **Title & Issuer:** Bold opportunity title, verified organization (e.g. `🏛️ OSF Africa × Kaduna Legal Aid`).
  - **Verification Metadata:** Green checkmark badge (`✓ Verified: 2026-09-02`) and `Offline Validated` status.
  - **Actionable Steps Container (The Key Feature):**
    - High-contrast nested container.
    - Numbered circular badges (`1`, `2`, `3`, `4`) with clear, high-contrast instructions.
    - "View All" / "Collapse" toggle.
  - **Action Bar:** "📲 Copy for SMS" button (formats protocol into clean 160-character plain text for sharing via basic 2G feature phones).

---

### SCREEN 4: The Civic Reporting Ledger (`ReportScreen`)
*Offline intake form for documenting localized resource disputes, early warnings, or diverted aid.*
- **Header & Anonymity Banner:**
  - Prominent banner: "🛡️ ZERO-TRACE CIVIC ANONYMITY"
  - Explanatory copy: "No phone numbers, IMEI, or GPS coordinates are stored. Identified strictly by decentralized cryptographic hash."
- **Form Components:**
  1. **Category Selector:** 3 radio cards with descriptive helper text:
     - *Conflict Indicator* (Pastoralist-farmer grazing corridor friction, borehole disputes)
     - *Infrastructure Breakdown* (Broken solar pump, washed-out bridge)
     - *Misappropriation* (Diverted fertilizer vouchers, extortion at checkpoints)
  2. **Geo-Location Quick-Picker (Crucial for Low-End Keyboards):**
     - 3 horizontal scrolling chip rows: **1. State** -> **2. LGA** -> **3. Ward**.
     - Eliminates tedious typing on cracked/laggy touchscreens.
     - Optional text field: "Specific Landmark (e.g. Near Solar Pump #2)".
  3. **Dispute Tag Grid:** Selectable pill chips (Communal Borehole, Grazing Route Corridor, Fertilizer Voucher, Checkpoint Extortion).
  4. **Severity Matrix:** 3 segmented buttons with visual color dots:
     - Green dot: Low (Observation)
     - Amber dot: Medium (Active Tension)
     - Red dot: Critical (Imminent Danger)
  5. **Description Area:** High-contrast multi-line text input (minimum 15 characters).
  6. **Submit Button:** Prominent, full-width button ("Save to Offline Ledger").
- **Offline Success Modal:**
  - Floats over screen upon submit.
  - Shows green disk/check icon, confirmation copy, auto-generated Cryptographic Ledger Hash (e.g. `c7a18f9d...`), timestamp, and status: `Pending Field Synchronization (synced = 0)`.

---

### SCREEN 5: The Manual Sync Engine (`SyncScreen`)
*Zero-background battery drain. Explicit user-triggered synchronization hub.*
- **Network Status Banner:**
  - Online state: Dark green container with glowing green dot ("Online Signal Available • CELLULAR").
  - Offline state: Dark red container with red dot ("Offline / Patchy 2G • NO SIGNAL").
- **Sync Summary Card:**
  - Massive numeric counter: Large cyan number displaying pending unsynced records (e.g., `3`).
  - Total recorded vs synced breakdown.
  - **"⚡ Sync Now" Button:**
    - Active state: Bright blue (`#0284C7`), bold white text.
    - Disabled state (when 0 pending): Muted gray/slate.
    - Loading state: Inline spinner + "Transmitting Encrypted Batch...".
- **Sneaker-Net Physical Export Button:**
  - "📦 Export Sneaker-Net Backup" button.
  - Triggers modal with full encrypted JSON payload and batch checksum for physical SD-card or USB courier dispatch during prolonged cellular blackouts.
- **Queue Segmented Toggle:**
  - Two tabs: `Pending Queue (3)` vs `Dispatched (8)`.
  - Report cards showing category badge, location, timestamp, and status badge (`⏳ Pending` in amber, `✓ Synced` in green).

---

### GLOBAL SHELL (HEADER & BOTTOM TAB BAR)
- **Top App Header:**
  - Left: "ETO • CIVIC LEDGER" + subtitle ("Information You Can Trust • OSF Africa").
  - Center/Right: Language pill cycling `[🇬🇧 EN | 🇳🇬 HA | 🇳🇬 YO | 🇳🇬 IG]`.
  - Far Right: High-priority tactical **`🔒 LOCK`** button with red border/text. Tapping it returns immediately to the PIN screen in <150ms.
- **Bottom Navigation Tab Bar:**
  - 3 items:
    1. 📋 `Opportunities`
    2. ✍️ `File Incident`
    3. ⚡ `Sync Engine` (Features a red numerical badge counter when pending reports > 0).

---

## 5. DESIGN SYSTEM & VISUAL TOKENS

### Color Palette (WCAG AAA Contrast on Dark Mode)
```
Primary Background:      #0F172A (Deep Slate Black)
Card & Surface Layer:    #1E293B (Dark Navy Slate)
Card Borders:            #334155 (Crisp Contrast Border)
Brand / Primary Accent:  #0284C7 / #38BDF8 (Vibrant Civic Sky Blue)
Emergency / Lock Red:    #EF4444 / #DC2626 (Checkpoint Alert Red)
Pending / Warning Amber: #F59E0B / #D97706 (Field Advisory Gold)
Success / Verified Green:#22C55E / #16A34A (Verified Protocol Green)
Decoy Screen Background: #052E16 (Deep Agriculture Forest)
Decoy Screen Surface:    #14532D / #166534 (Farm Green)
Decoy Weather Gold:      #FEF08A (Sunlight Harvest Gold)
```

### Typography Scale
```
Display / Headings:  20sp–24sp, Extra Bold (800/900)
Subheadings:         15sp–17sp, Bold (700)
Body Text:           13sp–14sp, Regular/Semi-Bold (400/600), Line height: 20sp
Badges & Metadata:   10sp–11sp, Bold (700/800), Uppercase
Keypad Numerics:     24sp–28sp, Bold (700)
```

---

## 6. FIGMA DELIVERABLES EXPECTED
1. **Component Library & Design Tokens:**
   - Buttons (Default, Active, Disabled, Tactical Lock).
   - Badges & Tags (Category, Location, Severity, Sync Status).
   - Form Inputs (Single-line, Textarea, Radio Cards, Horizontal Chip Selectors).
   - Keypad Number Key (68dp minimum touch target).
2. **High-Fidelity Screens (360×800dp baseline - Standard Android Go):**
   - Screen 1: `01_Login_PIN_Screen`
   - Screen 2: `02_Decoy_AgriWeather_Screen`
   - Screen 3: `03_Opportunity_Directory_Screen`
   - Screen 4: `04_Opportunity_Expanded_Step_View`
   - Screen 5: `05_Civic_Report_Intake_Form`
   - Screen 6: `06_Report_Submitted_Modal`
   - Screen 7: `07_Sync_Engine_Online_State`
   - Screen 8: `08_Sync_Engine_Offline_State`
   - Screen 9: `09_SneakerNet_Export_Modal`
3. **Language Variant Frame:**
   - At least 1 screen shown in **Hausa** and **Yorùbá** to validate text expansion.
4. **Interactive Prototype Flow:**
   - Path A: Enter `1234` -> Browse Opportunities -> File Report -> View Sync Queue.
   - Path B: Enter `9999` -> Jump to Decoy Weather Screen -> Calculate crop price -> Tap Lock.
