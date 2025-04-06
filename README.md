# BitCONNECT - Secret Detection Tool

A full-stack application for detecting secrets in text and files. The application consists of a Python FastAPI backend and a React TypeScript frontend.

## Features

- Scan text for potential secrets
- Upload and scan files for secrets
- Modern, responsive UI
- Dockerized deployment

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd bitCONNECT
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development

### Backend
The backend is a Python FastAPI application located in the `backend` directory. It provides two main endpoints:
- `/scan/text` - Scan text for secrets
- `/scan/file` - Scan uploaded files for secrets

### Frontend
The frontend is a React TypeScript application located in the `frontend` directory. It provides a user interface for:
- Text input and scanning
- File upload and scanning
- Displaying scan results

## API Documentation
Once the application is running, you can access the API documentation at:
http://localhost:8000/docs 