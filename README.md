# Portal Pacjenta

[ENG version below]

## Opis projektu

Portal Pacjenta to aplikacja webowa, która umożliwia pacjentom zarządzanie wizytami lekarskimi, przeglądanie wyników badań oraz komunikację z placówkami medycznymi. Aplikacja została zaprojektowana z użyciem najnowszych technologii frontendowych i backendowych.

- **Frontend**: Angular (v17.2.1)
- **Backend**: Node.js (v18.16.0) + Express.js (v4.18.1)
- **Konteneryzacja**: Docker, Docker Compose
- **Serwer produkcyjny**: Nginx (v1.21)

## Technologie

- **Angular CLI** v17.2.1
- **Node.js** v18.16.0
- **Express.js** v4.18.1
- **Docker** v24.0.1
- **Nginx** v1.21.0

## Uruchamianie za pomocą Dockera

Projekt jest w pełni konteneryzowany za pomocą Dockera i Docker Compose. Uruchomienie projektu jest szybkie i proste, a instrukcje znajdują się poniżej:

1. **Skopiowanie repozytorium**:

```bash
git clone https://github.com/kacperk72/portal-pacjenta.git


## Project Description

Portal Pacjenta is a web application designed to help patients manage their medical appointments, view test results, and communicate with medical institutions. The app was built using the latest frontend and backend technologies.

Frontend: Angular (v17.2.1)
Backend: Node.js (v18.16.0) + Express.js (v4.18.1)
Containerization: Docker, Docker Compose
Production Server: Nginx (v1.21)

## Technologies

- **Angular CLI** v17.2.1
- **Node.js** v18.16.0
- **Express.js** v4.18.1
- **Docker** v24.0.1
- **Nginx** v1.21.0

## Running with Docker

The project is fully containerized using Docker and Docker Compose. Launching the project is quick and easy with the following steps:

Clone the repository:

git clone https://github.com/kacperk72/portal-pacjenta.git

Start the application using Docker Compose:

docker-compose up --build
