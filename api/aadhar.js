export default async function handler(req, res) {
    // ✅ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // ❌ Only GET allowed
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    const { aadhar } = req.query;

    // ❌ Validation
    if (!aadhar) {
        return res.status(400).json({
            error: "Aadhar number missing",
            message: "Aadhar number daal bhai"
        });
    }

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.AADHAR_API_KEY;

    // ❌ ENV check
    if (!BASE_URL || !API_KEY) {
        return res.status(500).json({
            error: "Server config error",
            message: "Missing ENV variables"
        });
    }

    try {
        const url = `${BASE_URL}/aadhar?aadhar=${encodeURIComponent(aadhar)}&apikey=${API_KEY}`;

        const response = await fetch(url);

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({
                error: "Invalid JSON from external API",
                raw: text
            });
        }

        // ❌ External API error handling
        if (!response.ok) {
            return res.status(response.status).json({
                error: "External API Error",
                raw: data
            });
        }

        // ❌ Expiry check
        if (data?.message?.toLowerCase?.().includes("expire")) {
            return res.status(403).json({
                error: "API Expired",
                message: "Contact @aerivue"
            });
        }

        // 🔥 Handle ARRAY response (your case)
        if (Array.isArray(data?.data)) {
            data.data = Array.from(
                new Map(data.data.map(item => [item.mobile, item])).values()
            );
        }

        // 🔥 Branding fix (TOP LEVEL)
        if (data && typeof data === 'object') {
            data.BUY_API = "@aerivue";
            data.SUPPORT = "@aerivue";
            data.channel = "https://t.me/blackapibox";
            data.owner = "@aerivue";
        }

        // ✅ FINAL RESPONSE (NO WRAPPING)
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Server Error",
            message: error.message
        });
    }
}
