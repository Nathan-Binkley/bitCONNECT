import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert
} from '@mui/material';
import axios from 'axios';
import Results from './components/Results';

interface Finding {
    type: string;
    value: string;
    start: number;
    end: number;
    confidence: number;
}

function App() {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleTextSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/scan/text',
                new URLSearchParams({ text }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            setFindings(response.data.findings);
            setError(null);
        } catch (err) {
            setError('Error scanning text. Please try again.');
        }
    };

    const handleFileSubmit = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/scan/file', formData);
            setFindings(response.data.findings);
            setError(null);
        } catch (err) {
            setError('Error scanning file. Please try again.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    BitCONNECT Secret Scanner
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Scan Text
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to scan for secrets..."
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTextSubmit}
                        disabled={!text}
                    >
                        Scan Text
                    </Button>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Scan File
                    </Typography>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        style={{ marginBottom: '16px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFileSubmit}
                        disabled={!file}
                    >
                        Scan File
                    </Button>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {findings.length === 0 && text && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Nothing was found in the text
                    </Alert>
                )}

                {findings.length === 0 && file && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Nothing was found in the file
                    </Alert>
                )}

                {findings.length > 0 && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Results findings={findings} />
                    </Paper>
                )}
            </Box>
        </Container>
    );
}

export default App; 