/** @future Symptom Tracking — log symptoms without judgment */

export interface SymptomEntry {
  id: string;
  userId: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  loggedAt: string;
}
