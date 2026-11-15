
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { imei_num } = req.query;

    if (!imei_num) {
        return res.status(400).json({
            error: 'IMEI number daal'
        });
    }

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
