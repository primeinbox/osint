export default async function handler(req, res) {
    // CORS headers for freedom
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { number } = req.query;
    
    if (!number) {
        return res.status(400).json({ error: 'Bhai number toh daal' });
    }
    
    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.LOOKUP_API_KEY;
    
    try {
        const response = await fetch(
            `${BASE_URL}/lookup?number=${encodeURIComponent(number)}&apikey=${API_KEY}`
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
