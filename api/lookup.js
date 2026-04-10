export default async function handler(req, res) {
    // ✅ CORS (allow all)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Only GET allowed
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    const { number } = req.query;

    // ❌ Validation
    if (!number) {
        return res.status(400).json({
            error: "Number missing",
            message: "Bhai number toh daal"
        });
    }

    // Optional: basic format check (India)
    if (!/^[6-9]\d{9}$/.test(number)) {
        return res.status(400).json({
            error: "Invalid number",
            message: "Sahi mobile number daal"
        });
    }

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.LOOKUP_API_KEY;

    // ❌ Env check
    if (!BASE_URL || !API_KEY) {
        return res.status(500).json({
            error: "Server config error",
            message: "Missing ENV variables"
        });
    }

    try {
        const url = `${BASE_URL}/lookup?number=${encodeURIComponent(number)}&apikey=${API_KEY}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // ❌ External API error
        if (!response.ok) {
            return res.status(response.status).json({
                error: "External API Error",
                status: response.status
            });
        }

        const data = await response.json();

        // ❌ Empty response handling
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({
                error: "No Data Found"
            });
        }

        // 🔥 Fields override
if (data && typeof data === 'object') {
    data.by = "@aerivue";
    data.channel = "https://t.me/blackapibox";
}

        // ✅ Direct response (NO WRAPPING)
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Server Error",
            message: error.message
        });
    }
}
