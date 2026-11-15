
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method !== 'GET') {
        return res.status(405).json({
            status: false,
            error: 'Method Not Allowed'
        });
    }

    const { aadhar } = req.query;

    if (!aadhar) {
        return res.status(400).json({
            status: false,
            error: 'Aadhar number missing',
            message: 'Aadhar number required'
        });
    }

    // Temporary mock mode
    if (process.env.MOCK_MODE === 'true') {
        return res.status(200).json({
            status: true,
            msg: 'Temporary test response',
            test_mode: true,
            record: {
                id: 'TEST-001',
                source: 'MOCK_DATA',
                verified: false
            },
            response_time: '4ms',
            developer: '@aerivue',
            BUY_API: '@aerivue',
            SUPPORT: '@aerivue',
            channel: 'https://t.me/blackapibox',
            owner: '@aerivue'
        });
    }

    // Real API configuration
    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.AADHAR_API_KEY;

    if (!BASE_URL || !API_KEY) {
        return res.status(500).json({
            status: false,
            error: 'Server config error'
        });
    }

    try {
        const url = `${BASE_URL}/aadhar?aadhar=${encodeURIComponent(aadhar)}&apikey=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                status: false,
                error: 'External API Error'
            });
        }

        if (data && typeof data === 'object') {
            data.BUY_API = '@aerivue';
            data.SUPPORT = '@aerivue';
            data.channel = 'https://t.me/pvthex';
            data.owner = '@aerivue';
            data.developer = '@aerivue';
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: 'Server Error'
        });
    }
}
