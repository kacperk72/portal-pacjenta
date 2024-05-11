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
}

module.exports = Doctor;
