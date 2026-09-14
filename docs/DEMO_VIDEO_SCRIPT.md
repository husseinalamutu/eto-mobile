# ETO (ÈTÒ) • DEMO VIDEO PRESENTATION SCRIPT
### 3-Minute Presentation & Walkthrough for Hackathon Judges

---

### [0:00 - 0:30] INTRODUCTION & THE HIGH-RISK CONTEXT
- **Visual:** Open on the Eto Lock Screen (`LoginScreen.tsx`). Show high-contrast tactile PIN pad.
- **Narrator Audio:**
  > "Welcome to Eto. In Northern Nigeria and across the Sahel, community peace monitors and rural citizens face an impossible dilemma. Millions in civic grants and agricultural relief go unclaimed due to zero connectivity and information blackouts. Meanwhile, field monitors reporting on borehole disputes or diverted aid risk their lives if stopped by bandits, unknown armed groups, or illegal roadblocks.
  > Eto is an offline-first, local-ledger mobile app built to solve this—designed specifically for 1GB RAM Android Go devices and high-risk security environments."

---

### [0:30 - 1:00] THE DURESS DECOY & EMERGENCY PANIC WIPE
- **Visual:** Enter Duress PIN `9999` on the keypad.
- **Action:** App immediately transitions to the **Sahel AgriWeather & Grain Market Bulletin** (`DecoyScreen.tsx`).
- **Narrator Audio:**
  > "Imagine you are stopped at an illegal roadblock by armed men and ordered to unlock your phone. Instead of entering your real PIN, you enter duress PIN 9-9-9-9. Instantly, without a second's delay, Eto transforms into a harmless rural weather and grain market monitor.
  > Any hostile interrogator sees live wholesale grain prices for Dawanau Market in Kano, dry haze weather advisories, and an interactive grain sack calculator. There is zero trace in memory, DOM, or storage of any civic reporting.
  > If danger is imminent, typing panic PIN 0-0-0-0 nukes the local SQLite database completely in 100 milliseconds."

---

### [1:00 - 1:45] THE OFFLINE OPPORTUNITY ENGINE & BILINGUAL ACCESS
- **Visual:** Tap Lock, return to PIN screen, enter real PIN `1234`. The full Eto Civic Ledger unlocks.
- **Action:** Toggle language from `EN` to `HA` (Hausa). Show instantaneous translation. Filter by state (Kano / Borno) and expand the "Sahel Agro-Pastoral Drought Resilience Input Subsidy".
- **Narrator Audio:**
  > "Now let's enter real PIN 1-2-3-4. We are inside the authenticated Eto Civic Ledger.
  > Notice the language switch at the top. With one tap, the entire application switches between English and Hausa—the lingua franca of 70 million Sahelian citizens.
  > The Opportunity Engine runs 100% offline. Rather than vague announcements, each opportunity displays concrete, verified claim steps: the exact desk at Dawanau Market, required physical documents, and waivers for biometrics. Users can bookmark programs or tap 'Copy for SMS' to broadcast protocols across 2G feature phones."

---

### [1:45 - 2:20] THE CIVIC REPORTING LEDGER (OFFLINE INTAKE)
- **Visual:** Tap 'File Incident' tab (`ReportScreen.tsx`).
- **Action:** Pick category 'Conflict Indicator'. Use the quick Northern Nigeria location selector: Select State 'Kaduna' -> LGA 'Kachia' -> Ward 'Awon Grazing Corridor'. Select Resource Tag 'Grazing Route Corridor'. Type a brief report: "Pastoralist transit corridor obstructed by newly erected trench. Tensions rising at watering point." Tap 'Save to Offline Ledger'.
- **Narrator Audio:**
  > "Next, our Civic Reporting Ledger. Field agents can document localized tensions, infrastructure breakdowns, or diverted food supplies without an internet connection.
  > Rather than struggling with slow mobile keyboards, the agent uses our Northern Nigeria quick-picker—selecting Kaduna, Kachia LGA, Awon Grazing Corridor.
  > Our zero-PII policy strictly excludes device IMEIs, phone numbers, and fine GPS coordinates. When I tap 'Save', the report writes directly to an ACID-compliant local SQLite database with Write-Ahead Logging, immune to Android Go memory purges."

---

### [2:20 - 2:50] THE MANUAL SYNC ENGINE & SNEAKER-NET BACKUPS
- **Visual:** Switch to 'Sync Engine' tab (`SyncScreen.tsx`).
- **Action:** Show the pending badge count (1). Show the network status indicator. Tap 'Sync Now'. Show simulated network batch dispatch and successful sync alert. Then tap 'Export Sneaker-Net Backup' to display the encrypted JSON export.
- **Narrator Audio:**
  > "On ultra-low-end Android Go phones, background sync daemons get killed by aggressive battery managers. Eto uses an explicit, user-controlled Sync Engine.
  > The app checks NetInfo. If offline, reports stay securely queued. When a safe cellular connection is detected, one click batches all pending records and dispatches them to central monitors, updating our ledger in real time.
  > If a rural blackout lasts for weeks, agents can tap 'Export Sneaker-Net Backup' to offload encrypted payloads to an SD card or USB flash drive for physical courier transport."

---

### [2:50 - 3:00] CONCLUSION & CALL TO ACTION
- **Visual:** Quick tap on the red header button `🔒 LOCK` to return instantly to the secure PIN screen.
- **Narrator Audio:**
  > "And when approaching a checkpoint, one touch on the header locks the device in 100 milliseconds.
  > Eto puts trusted, actionable information into the hands of communities that need it most—protecting those who protect their communities. Thank you."
