export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { number } = req.query;

    if (!number) {
        return res.status(400).json({
            status: false,
            error: "Number missing",
            message: "Bhai number toh daal"
        });
    }

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.LOOKUP_API_KEY;

    try {
        const response = await fetch(
            `${BASE_URL}/lookup?number=${encodeURIComponent(number)}&apikey=${API_KEY}`
        );

        const data = await response.json();

        // ✅ Direct original API response return karo
        return res.status(200).json({
            status: true,
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: "Server Error",
            message: error.message
        });
    }
}
