import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = str(Path(__file__).parent.parent)
sys.path.append(backend_dir)

import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_text_with_secrets():
    return """
    OpenAI key: sk-1234567890abcdef1234567890abcdef1234567890abcdef
    Anthropic key: sk-ant-1234567890abcdef1234567890abcdef1234567890abcdef
    AWS AMI: ami-12345678
    """

@pytest.fixture
def test_text_without_secrets():
    return "This is a normal text without any secrets" 