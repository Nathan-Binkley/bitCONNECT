from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import re

app = FastAPI(title="BitCONNECT API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_secrets(text: str) -> list:
    """
    Secret detection function that looks for various patterns and calculates confidence scores
    based on pattern matching and additional validation rules.
    """
    patterns = {
        "OpenAI API Key": {
            "pattern": r'sk-[a-zA-Z0-9]{32,}',
            "base_confidence": 0.95,
            "validation_rules": [
                (r'^sk-[a-zA-Z0-9]{32,}$', 0.05),  # Exact match
                (r'^sk-[a-zA-Z0-9]{48,}$', 0.10),  # Longer keys are more likely
                (r'^sk-[a-zA-Z0-9]{32,}$', -0.05)  # Shorter keys are less likely
            ]
        },
        "Anthropic API Key": {
            "pattern": r'sk-ant-[a-zA-Z0-9]{32,}',
            "base_confidence": 0.95,
            "validation_rules": [
                (r'^sk-ant-[a-zA-Z0-9]{32,}$', 0.05),  # Exact match
                (r'^sk-ant-[a-zA-Z0-9]{48,}$', 0.10),  # Longer keys are more likely
                (r'^sk-ant-[a-zA-Z0-9]{32,}$', -0.05)  # Shorter keys are less likely
            ]
        },
        "AWS AMI ID": {
            "pattern": r'ami-[a-f0-9]{8,}',
            "base_confidence": 0.90,
            "validation_rules": [
                (r'^ami-[a-f0-9]{8}$', 0.05),  # Standard length
                (r'^ami-[a-f0-9]{17}$', 0.10),  # Full length
                (r'^ami-[a-f0-9]{8,}$', -0.05)  # Non-standard length
            ]
        },
        "AWS API Key": {
            "pattern": r'AKIA[0-9A-Z]{16}',
            "base_confidence": 0.95,
            "validation_rules": [
                (r'^AKIA[0-9A-Z]{16}$', 0.05),  # Exact length
                (r'^AKIA[0-9A-Z]{17,}$', -0.10), # Too long
                (r'^AKIA[0-9A-Z]{1,15}$', -0.10) # Too short
            ]
        }
    }
    
    findings = []
    for secret_type, config in patterns.items():
        matches = re.finditer(config["pattern"], text)
        for match in matches:
            value = match.group()
            confidence = config["base_confidence"]
            
            # Apply validation rules to adjust confidence
            for rule_pattern, confidence_adjustment in config["validation_rules"]:
                if re.match(rule_pattern, value):
                    confidence += confidence_adjustment
            
            # Ensure confidence stays within 0-0.99 range
            confidence = max(0.0, min(0.99, confidence))
            
            findings.append({
                "type": secret_type,
                "value": value,
                "start": match.start(),
                "end": match.end(),
                "confidence": round(confidence * 100, 2)  # Convert to percentage
            })
    return findings

@app.post("/scan/text")
async def scan_text(text: str = Form(...)):
    findings = detect_secrets(text)
    return {"findings": findings}

@app.post("/scan/file")
async def scan_file(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode('utf-8')
    findings = detect_secrets(text)
    return {"findings": findings}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 