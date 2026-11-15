
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method Not Allowed'
        });
    }

    const { number } = req.query;

    if (!number) {
        return res.status(400).json({
            error: 'Number missing'
        });
    }

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.LOOKUP_API_KEY;

    if (!BASE_URL || !API_KEY) {
        return res.status(500).json({
            error: 'Server configuration missing'
        });
    }

    try {
        const url = new URL('/lookup', BASE_URL);
        url.searchParams.set('number', number);
        url.searchParams.set('apikey', API_KEY);

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(502).json({
                error: 'API request failed'
            });
        }

        const data = await response.json();

        // Remove old credit metadata
        delete data.developer;
        delete data.credit;

        // Aerivue branding
        data.by = '@aerivue';
        data.channel = 'https://t.me/pvthex';

        return res.status(200).json(data);

    } catch {
        return res.status(500).json({
            error: 'Server Error'
        });
    }
}
