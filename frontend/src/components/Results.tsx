import React from 'react';

interface Finding {
    type: string;
    value: string;
    start: number;
    end: number;
    confidence: number;
}

interface ResultsProps {
    findings: Finding[];
}

const Results: React.FC<ResultsProps> = ({ findings }) => {
    if (!findings || findings.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No secrets detected
            </div>
        );
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 95) return 'bg-red-100 text-red-800';
        if (confidence >= 85) return 'bg-orange-100 text-orange-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Detected Secrets</h2>
            <div className="space-y-4">
                {findings.map((finding, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-800">{finding.type}</h3>
                                <p className="mt-1 font-mono text-sm text-gray-600 break-all">
                                    {finding.value}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(finding.confidence)}`}>
                                {finding.confidence}% confidence
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            Position: {finding.start} - {finding.end}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results; 