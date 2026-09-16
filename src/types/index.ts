export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'Legal Aid' | 'Agriculture' | 'Peace Grant' | 'Civic Oversight' | string;
  target_state: 'Kano' | 'Kaduna' | 'Borno' | 'Katsina' | 'Oyo' | 'Enugu' | 'All' | string;
  target_gender: 'All' | 'Female' | 'Male' | string;
  verification_date: string;
  source_url: string;
  actionable_steps: string[];
}

export type ReportCategory = 'Conflict Indicator' | 'Infrastructure Breakdown' | 'Misappropriation';
export type ReportSeverity = 'Low' | 'Medium' | 'Critical';

export interface Report {
  id: string;
  category: ReportCategory;
  location: string;
  description: string;
  severity: ReportSeverity;
  created_at: string;
  synced: number; // 0 = unsynced, 1 = synced
}

export type NewReportInput = Omit<Report, 'id' | 'created_at' | 'synced'>;

export type AppSecurityMode = 'LOCKED' | 'DECOY' | 'AUTHENTICATED';
export type AppScreen = 'language' | 'onboarding' | 'secure' | 'decoy' | 'locked';
export type MainTab = 'ledger' | 'opportunities' | 'sync' | 'settings';
export type Language = 'en' | 'ha' | 'yo' | 'ig' | 'fr';
