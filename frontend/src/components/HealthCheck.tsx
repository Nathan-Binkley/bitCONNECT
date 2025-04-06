import React, { useState, useEffect } from 'react';

interface HealthCheckProps {
    apiUrl: string;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ apiUrl }) => {
    const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch(`${apiUrl}/health`);
                if (response.ok) {
                    setStatus('healthy');
                    setError(null);
                } else {
                    setStatus('unhealthy');
                    setError('Backend service is not responding correctly');
                }
            } catch (err) {
                setStatus('unhealthy');
                setError('Unable to connect to backend service');
            }
        };

        checkHealth();
        // Check health every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [apiUrl]);

    if (status === 'checking') {
        return (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-6 flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking backend connection...
            </div>
        );
    }

    if (status === 'unhealthy') {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
                {error || 'Backend service is unavailable'}
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
            Backend service is healthy
        </div>
    );
};

export default HealthCheck; 