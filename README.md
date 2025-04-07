# BitCONNECT - Secret Detection Tool

BitCONNECT is a powerful secret detection tool that helps identify sensitive information like API keys, tokens, and credentials in your codebase. It provides a user-friendly interface for scanning both text and files, with detailed confidence scores for each detection.

## Features

- 🔍 **Comprehensive Secret Detection**
  - OpenAI API Keys
  - Anthropic API Keys
  - AWS AMI IDs
  - AWS Access Keys
  - And more...

- 📊 **Confidence Scoring**
  - Visual confidence indicators
  - Percentage-based scoring
  - Color-coded results

- 📝 **Multiple Input Methods**
  - Text input scanning
  - File upload support
  - JSON file processing

- 🛡️ **Security Focused**
  - Client-side processing
  - Secure API communication
  - No data storage

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: FastAPI (Python)
- **Containerization**: Docker
- **Deployment**: Render

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+ (for local development)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bitconnect.git
   cd bitconnect
   ```

2. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your settings
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```
   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

4. **For local development without Docker**
   ```bash
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload

   # Frontend
   cd frontend
   npm install
   npm start
   ```

## Usage

1. **Text Scanning**
   - Enter text in the input field
   - Click "Scan Text"
   - View results with confidence scores

2. **File Scanning**
   - Click "Choose File"
   - Select a file to scan
   - View results with confidence scores

## Confidence Scores

- 🔴 **High Confidence** (≥95%): Very likely to be a valid secret
- 🟠 **Medium Confidence** (≥85%): Likely to be a valid secret
- 🟡 **Lower Confidence** (<85%): Possible secret, needs verification

## API Documentation

### Endpoints

- `POST /scan/text`
  ```json
  {
    "text": "your text to scan"
  }
  ```

- `POST /scan/file`
  - Accepts multipart/form-data
  - File field name: "file"

### Response Format
```json
{
  "findings": [
    {
      "type": "OpenAI API Key",
      "value": "sk-...",
      "start": 0,
      "end": 51,
      "confidence": 95.00
    }
  ]
}
```

## Deployment

### Render Deployment

1. **Backend Service**
   - Set environment variables:
     ```
     PORT=8000
     ```

2. **Frontend Service**
   - Set environment variables:
     ```
     API_URL=https://your-backend-service.onrender.com
     ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI for the excellent Python web framework
- React for the frontend framework
- Docker for containerization
- Render for hosting 