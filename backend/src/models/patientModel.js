const db = require("../config/database");

const Patient = {
  getPatientDetails: function (patientId, callback) {
    const query = `
            SELECT 
            P.FirstName,
            P.LastName,
            P.DateOfBirth,
            P.ContactInfo,
            P.Address,
            A.AppointmentDate,
            A.Status,
            A.Diagnosis,
            A.Treatment,
            PR.Medicine,
            PR.Dosage,
            PR.Instructions
        FROM 
            Profiles P
        JOIN 
            Appointments A ON P.ProfileID = A.PatientID
        LEFT JOIN 
            Prescriptions PR ON A.AppointmentID = PR.AppointmentID
        WHERE 
            P.UserID = 1
        ORDER BY 
            A.AppointmentDate DESC;
        `;
    return db.query(query, [patientId], callback);
  },
};

module.exports = Patient;
