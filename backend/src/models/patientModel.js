const db = require("../config/dbmysql");

class Patient {
  constructor(profile) {
    this.profileID = profile.ProfileID;
    this.userID = profile.UserID;
    this.firstName = profile.FirstName;
    this.lastName = profile.LastName;
    this.dateOfBirth = profile.DateOfBirth;
    this.contactInfo = profile.ContactInfo;
    this.address = profile.Address;
  }

  static getPatientProfileWithDetails(patientId) {
    const sql = `
      SELECT 
        Profiles.FirstName,
        Profiles.LastName,
        Profiles.DateOfBirth,
        Profiles.ContactInfo,
        Profiles.Address,
        Appointments.AppointmentDate,
        Appointments.Status,
        Appointments.Diagnosis,
        Appointments.Treatment,
        Prescriptions.Medicine,
        Prescriptions.Dosage,
        Prescriptions.Instructions
      FROM Profiles
      LEFT JOIN Appointments ON Profiles.ProfileID = Appointments.PatientID
      LEFT JOIN Prescriptions ON Appointments.AppointmentID = Prescriptions.AppointmentID
      WHERE Profiles.UserID = ?
      ORDER BY Appointments.AppointmentDate DESC
    `;
    return db.execute(sql, [patientId]);
  }

  static findByUserId(userId) {
    return db.execute("SELECT * FROM Profiles WHERE UserID = ?", [userId]);
  }

  static findAll() {
    return db.execute("SELECT * FROM Profiles");
  }

  static updateByUserId(
    userId,
    firstName,
    lastName,
    dateOfBirth,
    contactInfo,
    address
  ) {
    return db.execute(
      "UPDATE Profiles SET FirstName = ?, LastName = ?, DateOfBirth = ?, ContactInfo = ?, Address = ? WHERE UserID = ?",
      [firstName, lastName, dateOfBirth, contactInfo, address, userId]
    );
  }

  static create(
    userId,
    firstName,
    lastName,
    dateOfBirth,
    contactInfo,
    address
  ) {
    return db.execute(
      "INSERT INTO Profiles (UserID, FirstName, LastName, DateOfBirth, ContactInfo, Address) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, firstName, lastName, dateOfBirth, contactInfo, address]
    );
  }

  static deleteByUserId(userId) {
    return db.execute("DELETE FROM Profiles WHERE UserID = ?", [userId]);
  }
}

module.exports = Patient;
