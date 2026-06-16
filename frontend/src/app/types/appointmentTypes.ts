// Kanoniczny kontrakt szwu FE↔BE dla umawiania wizyty (K2).
// Naśladuje wzorzec katalogu typów (zob. surveyTypes.ts).
// Backend to CommonJS JS — typu nie da się literalnie współdzielić; BE trzyma lustrzany walidator.

export type AppointmentStatus = 'zaplanowana' | 'zakończona';

/**
 * Payload wysyłany przy umawianiu wizyty (POST /appointment/add).
 * ScheduleID jest polem transportowym (zajęcie slotu w DoctorSchedule) — NIE jest częścią
 * encji Appointment w modelu; pełne rozplecenie należy do agregatu (context/domain/02-...).
 */
export interface BookAppointmentPayload {
  PatientID: number;
  DoctorID: number;
  AppointmentDate: string;
  Status: AppointmentStatus;
  Diagnosis: string | null;
  Treatment: string | null;
  SurveyID: string | null;
  ScheduleID: number; // transport-only: zajęcie slotu, nie pole encji Appointment
}

/**
 * Kształt pojedynczej wizyty zwracanej przez GET /appointment/patient/:patientId.
 * Odpowiada include w appointmentService.getPatientAppointments (Doctor + DoctorProfile,
 * DoctorSchedule, Prescriptions). Aliasy zgodne z asocjacjami w doctorModel.js.
 */
export interface PatientAppointment {
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  AppointmentDate: string;
  Status: AppointmentStatus;
  Diagnosis: string | null;
  Treatment: string | null;
  Doctor?: {
    Specialization: string;
    DoctorProfile?: { FirstName: string; LastName: string };
  };
  DoctorSchedule?: {
    AvailableDate: string;
    TimeSlotFrom: string;
    TimeSlotTill: string;
  } | null;
  Prescriptions?: { Medicine: string; Dosage: string; Instructions: string }[];
}
