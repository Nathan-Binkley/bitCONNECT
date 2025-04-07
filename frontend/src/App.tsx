import React, { useState } from 'react';
import axios from 'axios';
import Results from './components/Results';
import HealthCheck from './components/HealthCheck';

interface Finding {
    type: string;
    value: string;
    start: number;
    end: number;
    confidence: number;
}

// Get API URL from environment variable
const API_URL = process.env.API_URL || 'http://localhost:8000';

function App() {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTextSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/scan/text`,
                new URLSearchParams({ text }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            setFindings(response.data.findings);
            setError(null);
        } catch (err) {
            setError('Error scanning text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSubmit = async (selectedFile: File) => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/scan/file`, formData);
            setFindings(response.data.findings);
            setError(null);
        } catch (err) {
            setError('Error scanning file. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            handleFileSubmit(selectedFile);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    BitCONNECT Secret Scanner
                </h1>

                <HealthCheck apiUrl={API_URL} />

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Scan Text
                    </h2>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to scan for secrets..."
                    />
                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleTextSubmit}
                        disabled={!text || isLoading}
                    >
                        {isLoading ? 'Scanning...' : 'Scan Text'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Scan File
                    </h2>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-4"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="text-primary-600">Scanning file...</div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {findings.length === 0 && text && !isLoading && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
                        Nothing was found in the text
                    </div>
                )}

                {findings.length === 0 && file && !isLoading && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
                        Nothing was found in the file
                    </div>
                )}

                {findings.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Results findings={findings} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App; 