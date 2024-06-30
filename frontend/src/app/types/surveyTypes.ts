export interface UserLocalStorageData {
  id: string;
  role: string;
  username: string;
  token: string;
}

export interface EventItem {
  AppointmentID?: number;
  status?: string;
  patient?: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

export interface Survey {
  AppointmentID: number;
  PatientID: number;
  VisitReason: string;
  SymptomsTime?: string;
  HighTemperature?: string;
  HaveCough?: string;
  HaveNoBreath?: string;
  HaveThroatAche?: string;
  HaveRunnyNose?: string;
  HaveStomachAche?: string;
  HaveOtherSymptoms?: string;
  TakeMedications?: string;
  MedicationsDetails?: string;
  HasAllergy?: string;
  AllergyDetails?: string;
  HasChronicDiseases?: string;
  ChronicDiseasesDetails?: string;
  NeededMedications?: string;
  CurrentMedications?: string;
  ReferralReason?: string;
  ReferralCause?: string;
  TestResults?: string;
}

export interface CombinedData extends EventItem {
  survey?: Survey;
}
