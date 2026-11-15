
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({
            status: false,
            message: 'Method not allowed'
        });
    }

    let { userid } = req.query;

    if (!userid || typeof userid !== 'string') {
        return res.status(400).json({
            status: false,
            message: 'Telegram username ya ID daalo'
        });
    }

    const cleanUserid = userid.trim().replace(/^@/, '');

    if (!cleanUserid) {
        return res.status(400).json({
            status: false,
            message: 'Valid Telegram username ya ID daalo'
        });
    }

    console.log(
        `Request received | User: ${cleanUserid} | Provider: @aerivue`
    );

    const BASE_URL = process.env.AERIVUE_BASE;

    if (!BASE_URL) {
        return res.status(500).json({
            status: false,
            message: 'API configuration missing'
        });
    }

    try {
        const apiUrl = new URL('/advanced/tg2num', BASE_URL);
        apiUrl.searchParams.set('q', cleanUserid);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(502).json({
                status: false,
                message: 'Upstream API request failed',
                developer: '@aerivue'
            });
        }

        const data = await response.json();

        return res.status(200).json({
            msg: data.msg || 'Details fetched successfully',
            tg_id: data.tg_id || null,
            developer: '@aerivue'
        });

    } catch (error) {
        console.error('API Error:', error.message);

        return res.status(500).json({
            status: false,
            message: 'Server Error',
            developer: '@aerivue'
        });
    }
}
