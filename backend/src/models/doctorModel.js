const db = require("../config/dbmysql");

class Doctor {
  constructor(doctorId, specialization, cities) {
    this.doctorId = doctorId;
    this.specialization = specialization;
    this.cities = cities;
  }

  static findAll() {
    return db.execute("SELECT * FROM Doctors");
  }

  static findById(doctorId) {
    return db.execute("SELECT * FROM Doctors WHERE DoctorID = ?", [doctorId]);
  }

  static findScheduleByDoctorId(doctorId) {
    return db.execute(
      `
      SELECT s.ScheduleID, s.AvailableDate, s.TimeSlotFrom, s.TimeSlotTill, s.Duration
      FROM Schedules s
      WHERE s.DoctorID = ?`,
      [doctorId]
    );
  }

  static getDataFilters() {
    return db.execute(
      `
      SELECT DISTINCT Specialization, Cities
      FROM Doctors;
      `,
    );
  }

  static getVisits(params) {
    return db.execute(
      `
      SELECT
          ds.ScheduleID,
          ds.DoctorID,
          ds.AvailableDate,
          ds.TimeSlotFrom,
          ds.TimeSlotTill,
          ds.Duration,
          p.FirstName,
          p.LastName,
          p.ContactInfo,
          d.Specialization,
          d.Cities
      FROM DoctorSchedules ds
      JOIN Doctors d ON ds.DoctorID = d.DoctorID
      JOIN Profiles p ON d.DoctorID = p.ProfileID
      WHERE d.Specialization = ? AND
            d.Cities LIKE ? AND
            (ds.AvailableDate = ? OR ds.AvailableDate >= ?)
      ORDER BY ds.AvailableDate, ds.TimeSlotFrom;
      `,
      [params.specialization, `%${params.location}%`, params.date, params.date]
    );
  }
  
}

module.exports = Doctor;
