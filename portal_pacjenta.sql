-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 16 Wrz 2024, 21:21
-- Wersja serwera: 10.4.25-MariaDB
-- Wersja PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `portal_pacjenta`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `adminactions`
--

CREATE TABLE `adminactions` (
  `ActionID` int(11) NOT NULL,
  `AdminID` int(11) DEFAULT NULL,
  `ActionType` varchar(50) DEFAULT NULL,
  `TargetUserID` int(11) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `appointments`
--

CREATE TABLE `appointments` (
  `AppointmentID` int(11) NOT NULL,
  `PatientID` int(11) DEFAULT NULL,
  `DoctorID` int(11) DEFAULT NULL,
  `AppointmentDate` datetime DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `Diagnosis` text DEFAULT NULL,
  `Treatment` text DEFAULT NULL,
  `SurveyID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `appointments`
--

INSERT INTO `appointments` (`AppointmentID`, `PatientID`, `DoctorID`, `AppointmentDate`, `Status`, `Diagnosis`, `Treatment`, `SurveyID`) VALUES
(1, 1, 2, '2023-12-15 08:00:00', 'zaplanowana', NULL, NULL, NULL),
(2, 1, 2, '2023-10-10 10:00:00', 'zakończona', 'Przeziębienie', 'Odpoczynek i leki przeciwwirusowe', NULL),
(3, 1, 2, '2023-11-12 11:00:00', 'zakończona', 'Alergia', 'Leki antyhistaminowe', NULL),
(4, 1, 3, '2023-12-20 14:00:00', 'zaplanowana', NULL, NULL, NULL),
(16, 2, 2, '2024-12-15 07:30:00', 'zaplanowana', NULL, NULL, NULL),
(17, 2, 2, '2024-12-15 10:30:00', 'zaplanowana', NULL, NULL, NULL),
(18, 2, 1, '2024-07-15 12:00:00', 'zakończona', 'Covid', 'teraflu 2x1, witamina C 1x1', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `doctors`
--

CREATE TABLE `doctors` (
  `DoctorID` int(11) DEFAULT NULL,
  `Specialization` varchar(100) DEFAULT NULL,
  `Cities` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `doctors`
--

INSERT INTO `doctors` (`DoctorID`, `Specialization`, `Cities`) VALUES
(2, 'Kardiolog', 'Warszawa, Kraków'),
(3, 'Dermatolog', 'Gdańsk, Gdynia');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `doctorschedules`
--

CREATE TABLE `doctorschedules` (
  `ScheduleID` int(11) NOT NULL,
  `DoctorID` int(11) DEFAULT NULL,
  `AvailableDate` date DEFAULT NULL,
  `TimeSlotFrom` time DEFAULT NULL,
  `TimeSlotTill` time DEFAULT NULL,
  `Duration` int(11) DEFAULT NULL,
  `AppointmentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `doctorschedules`
--

INSERT INTO `doctorschedules` (`ScheduleID`, `DoctorID`, `AvailableDate`, `TimeSlotFrom`, `TimeSlotTill`, `Duration`, `AppointmentID`) VALUES
(5, 2, '2024-12-15', '08:00:00', '08:30:00', 30, NULL),
(6, 2, '2024-12-16', '09:00:00', '09:15:00', 15, NULL),
(7, 2, '2024-12-15', '08:30:00', '09:00:00', 30, 16),
(8, 2, '2024-12-15', '09:00:00', '09:30:00', 30, NULL),
(9, 2, '2024-12-15', '09:30:00', '10:00:00', 30, NULL),
(10, 2, '2024-12-15', '10:00:00', '10:30:00', 30, NULL),
(11, 2, '2024-12-15', '10:30:00', '11:00:00', 30, NULL),
(12, 2, '2024-12-15', '11:00:00', '11:30:00', 30, NULL),
(13, 2, '2024-12-15', '11:30:00', '12:00:00', 30, 17),
(14, 2, '2024-12-16', '09:15:00', '09:30:00', 15, NULL),
(15, 2, '2024-12-16', '09:30:00', '09:45:00', 15, NULL),
(16, 2, '2024-12-16', '09:45:00', '10:00:00', 15, NULL),
(17, 2, '2024-12-16', '10:00:00', '10:15:00', 15, NULL),
(18, 2, '2024-12-16', '10:15:00', '10:30:00', 15, NULL),
(19, 2, '2024-12-16', '10:30:00', '10:45:00', 15, NULL),
(20, 2, '2024-12-16', '10:45:00', '11:00:00', 15, NULL),
(32, 2, '2024-05-26', '00:05:00', '00:35:00', 30, NULL),
(33, 2, '2024-05-26', '00:35:00', '01:05:00', 30, NULL),
(34, 2, '2024-05-26', '01:05:00', '01:35:00', 30, NULL),
(35, 2, '2024-05-26', '01:35:00', '02:05:00', 30, NULL),
(36, 2, '2024-05-26', '02:05:00', '02:35:00', 30, NULL),
(37, 2, '2024-05-26', '02:35:00', '03:05:00', 30, NULL),
(38, 2, '2024-05-25', '00:41:00', '01:11:00', 30, NULL),
(39, 2, '2024-05-25', '01:11:00', '01:41:00', 30, NULL),
(40, 2, '2024-05-25', '00:41:00', '01:11:00', 30, NULL),
(41, 2, '2024-05-25', '01:11:00', '01:41:00', 30, NULL),
(42, 2, '2024-05-26', '00:41:00', '01:11:00', 30, NULL),
(43, 2, '2024-05-26', '00:41:00', '01:11:00', 30, NULL),
(44, 2, '2024-05-26', '00:41:00', '01:11:00', 30, NULL),
(45, 2, '2024-05-26', '01:11:00', '01:41:00', 30, NULL),
(46, 2, '2024-05-26', '01:41:00', '02:11:00', 30, NULL),
(47, 2, '2024-05-26', '00:41:00', '01:11:00', 30, NULL),
(48, 2, '2024-05-26', '01:11:00', '01:41:00', 30, NULL),
(49, 2, '2024-05-26', '01:41:00', '02:11:00', 30, NULL),
(50, 2, '2024-07-15', '12:00:00', '12:30:00', 30, 18);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `prescriptions`
--

CREATE TABLE `prescriptions` (
  `PrescriptionID` int(11) NOT NULL,
  `AppointmentID` int(11) DEFAULT NULL,
  `Medicine` varchar(100) DEFAULT NULL,
  `Dosage` varchar(50) DEFAULT NULL,
  `Instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `prescriptions`
--

INSERT INTO `prescriptions` (`PrescriptionID`, `AppointmentID`, `Medicine`, `Dosage`, `Instructions`) VALUES
(1, 1, 'Aspiryna', '1 tabletka', 'Raz dziennie po posiłku'),
(2, 2, 'Tamiflu', '1 tabletka', 'Dwa razy dziennie przez 5 dni'),
(3, 3, 'Cetirizine', '10 mg', 'Raz dziennie'),
(4, 16, 'test', 'test', 'test');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `profiles`
--

CREATE TABLE `profiles` (
  `ProfileID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `ContactInfo` varchar(100) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `profiles`
--

INSERT INTO `profiles` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `DateOfBirth`, `ContactInfo`, `Address`) VALUES
(1, 1, 'Jan', 'Kowalski', '1990-01-01', '123-456-789', 'Warszawa, ul. Słoneczna 1'),
(2, 2, 'Anna', 'Nowak', '1980-05-15', '987-654-321', 'Kraków, ul. Leśna 2'),
(3, 3, 'Marek', 'Zieliński', '1975-03-22', '123-987-654', 'Gdańsk, ul. Morska 3');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Role` enum('patient','doctor','admin') NOT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `Role`, `Email`) VALUES
(1, 'patient1', 'password1', 'patient', 'patient1@example.com'),
(2, 'doctor1', 'password2', 'doctor', 'doctor1@example.com'),
(3, 'admin1', 'password3', 'admin', 'admin1@example.com'),
(4, 'doctor2', 'password4', 'doctor', 'doctor2@example.com'),
(5, 'test6', '$2a$12$VxSq4ZK72aBnPgAH6fBXC.S55EPNkIVgdxYKzA2WIEN', 'patient', 'test6@test.pl'),
(6, 'aaa', '$2a$12$oOq/ggfU1JSTSSquTjGj9.l1dEbxEEPNpTt7mXACpnL', 'patient', 'aaa@aaa.pl'),
(7, 'test11', '$2a$12$HGUiFx1tCctZju5bxrZxveTlylvo23A5f/Vh6buOGm7', 'patient', 'test11@test.pl'),
(9, 'bbbb', '$2a$12$5NOwdKmQ7r76BiHIGiHlV.sU68iRmS/2AR/6u5DiaRo', 'patient', 'bbbb@bbbb.pl'),
(56, 'test3', '$2a$12$TCRjvVvTeTGCSJo5M3m6x.OV3JcL8N32zlK.E9GITkf', 'patient', 'test3@test.pl'),
(90, 'aatest321', '$2a$12$Ks3i7fgqw0/bYdmR.mp87OG4ApUuTVvUyAzNN/etNQL', 'patient', 'aatest3214@test.pl'),
(583, 'test2', '$2a$12$Zq8H9XpSUQtXN64LrGVn5OZ5kzZaCpDfB/lX9SN7ify', 'patient', 'test2@test.pl'),
(4863, 'test', '$2a$12$obv.RtIuyVq52oyHbJf/3e2/tQaL9kynluWw76ccnby', 'patient', 'test@test.pl'),
(4864, 'test4', '$2a$12$lDeSgPY8axwDFHGAp.LIBeM3V5hCDuUMBBpUsyilUSi', 'patient', 'test4@test.pl'),
(4865, 'test5', '$2a$12$BtIwh.hwLCTrplE7iK1dl.JcPn49ElUrD4YdyQ3VgOy', 'patient', 'test5@test.pl'),
(2147483647, 'test7', '$2a$12$IQsAiKiAu7.7RBDNMPz5LOuX5ysOgGOPYLVvOBAASWM', 'patient', 'test7@test.pl');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `adminactions`
--
ALTER TABLE `adminactions`
  ADD PRIMARY KEY (`ActionID`),
  ADD KEY `AdminID` (`AdminID`),
  ADD KEY `TargetUserID` (`TargetUserID`);

--
-- Indeksy dla tabeli `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`AppointmentID`),
  ADD KEY `PatientID` (`PatientID`),
  ADD KEY `DoctorID` (`DoctorID`);

--
-- Indeksy dla tabeli `doctors`
--
ALTER TABLE `doctors`
  ADD KEY `DoctorID` (`DoctorID`);

--
-- Indeksy dla tabeli `doctorschedules`
--
ALTER TABLE `doctorschedules`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `DoctorID` (`DoctorID`);

--
-- Indeksy dla tabeli `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`PrescriptionID`),
  ADD KEY `AppointmentID` (`AppointmentID`);

--
-- Indeksy dla tabeli `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`ProfileID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `adminactions`
--
ALTER TABLE `adminactions`
  MODIFY `ActionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `appointments`
--
ALTER TABLE `appointments`
  MODIFY `AppointmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT dla tabeli `doctorschedules`
--
ALTER TABLE `doctorschedules`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT dla tabeli `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `PrescriptionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `profiles`
--
ALTER TABLE `profiles`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `adminactions`
--
ALTER TABLE `adminactions`
  ADD CONSTRAINT `adminactions_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `adminactions_ibfk_2` FOREIGN KEY (`TargetUserID`) REFERENCES `users` (`UserID`);

--
-- Ograniczenia dla tabeli `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `profiles` (`ProfileID`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`DoctorID`) REFERENCES `profiles` (`ProfileID`);

--
-- Ograniczenia dla tabeli `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`DoctorID`) REFERENCES `profiles` (`ProfileID`);

--
-- Ograniczenia dla tabeli `doctorschedules`
--
ALTER TABLE `doctorschedules`
  ADD CONSTRAINT `doctorschedules_ibfk_1` FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`);

--
-- Ograniczenia dla tabeli `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`AppointmentID`) REFERENCES `appointments` (`AppointmentID`);

--
-- Ograniczenia dla tabeli `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
