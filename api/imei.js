
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Default IMEI if not provided
    const imei_num = req.query.imei_num || '864316075704036';

    const BASE_URL = process.env.IMEI_BASE;

    if (!BASE_URL) {
        return res.status(500).json({
            error: 'IMEI_BASE environment variable missing'
        });
    }

    try {
        const apiUrl = new URL(BASE_URL);
        apiUrl.searchParams.set('imei_num', imei_num);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'IMEI API request failed'
            });
        }

        const data = await response.json();

        if (data.result) {
            data.made_by = '@aerivue';
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch IMEI information'
        });
    }
}
