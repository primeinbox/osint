export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { imei } = req.query;
    
    if (!imei) {
        return res.status(400).json({ error: 'IMEI number daal' });
    }
    
    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.IMEI_API_KEY;
    
    try {
        const response = await fetch(
            `${BASE_URL}/imei?imei=${encodeURIComponent(imei)}&apikey=${API_KEY}`
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
