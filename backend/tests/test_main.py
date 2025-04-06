from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_scan_text_no_secrets():
    response = client.post("/scan/text", data={"text": "This is a normal text without any secrets"})
    assert response.status_code == 200
    assert response.json() == {"findings": []}

def test_scan_text_openai_key():
    response = client.post("/scan/text", data={"text": "Here is an OpenAI key: sk-1234567890abcdef1234567890abcdef1234567890abcdef"})
    assert response.status_code == 200
    findings = response.json()["findings"]
    assert len(findings) == 1
    assert findings[0]["type"] == "OpenAI API Key"
    assert findings[0]["confidence"] > 90

def test_scan_text_anthropic_key():
    response = client.post("/scan/text", data={"text": "Here is an Anthropic key: sk-ant-1234567890abcdef1234567890abcdef1234567890abcdef"})
    assert response.status_code == 200
    findings = response.json()["findings"]
    assert len(findings) == 1
    assert findings[0]["type"] == "Anthropic API Key"
    assert findings[0]["confidence"] > 90

def test_scan_text_aws_ami():
    response = client.post("/scan/text", data={"text": "Here is an AWS AMI: ami-12345678"})
    assert response.status_code == 200
    findings = response.json()["findings"]
    assert len(findings) == 1
    assert findings[0]["type"] == "AWS AMI ID"
    assert findings[0]["confidence"] > 80

def test_scan_text_multiple_secrets():
    text = """
    OpenAI key: sk-1234567890abcdef1234567890abcdef1234567890abcdef
    Anthropic key: sk-ant-1234567890abcdef1234567890abcdef1234567890abcdef
    AWS AMI: ami-12345678
    """
    response = client.post("/scan/text", data={"text": text})
    assert response.status_code == 200
    findings = response.json()["findings"]
    assert len(findings) >= 3
    types = [f["type"] for f in findings]
    assert "OpenAI API Key" in types
    assert "Anthropic API Key" in types
    assert "AWS AMI ID" in types

def test_scan_file_no_secrets(tmp_path):
    test_file = tmp_path / "test.txt"
    test_file.write_text("This is a normal text without any secrets")
    
    with open(test_file, "rb") as f:
        response = client.post("/scan/file", files={"file": ("test.txt", f, "text/plain")})
    
    assert response.status_code == 200
    assert response.json() == {"findings": []}

def test_scan_file_with_secrets(tmp_path):
    test_file = tmp_path / "test.txt"
    test_file.write_text("""
    OpenAI key: sk-1234567890abcdef1234567890abcdef1234567890abcdef
    Anthropic key: sk-ant-1234567890abcdef1234567890abcdef1234567890abcdef
    """)
    
    with open(test_file, "rb") as f:
        response = client.post("/scan/file", files={"file": ("test.txt", f, "text/plain")})
    
    assert response.status_code == 200
    findings = response.json()["findings"]
    assert len(findings) >= 2
    types = [f["type"] for f in findings]
    assert "OpenAI API Key" in types
    assert "Anthropic API Key" in types 