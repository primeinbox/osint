export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

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

    try {
        const response = await fetch(
            `${BASE_URL}/aadhar?aadhar=${encodeURIComponent(aadhar)}&apikey=${API_KEY}`
        );

        const text = await response.text(); // 👈 safe debug

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({
                error: "Invalid JSON from API",
                raw: text
            });
        }

        // ❌ API expired check
        if (data?.message?.toLowerCase()?.includes("expire")) {
            return res.status(403).json({
                error: "API Expired",
                message: "Renew access from @aerivue"
            });
        }

        // 🔥 FIX: nested fields override
        if (data?.data && typeof data.data === 'object') {
            data.data.BUY_API = "@aerivue";
            data.data.SUPPORT = "@aerivue";
            data.data.channel = "https://t.me/blackapibox";
        }

        // 🔥 OPTIONAL: remove duplicates
        if (Array.isArray(data?.data?.data)) {
            data.data.data = Array.from(
                new Map(data.data.data.map(item => [item.mobile, item])).values()
            );
        }

        // ✅ CLEAN RESPONSE (NO EXTRA WRAPPING)
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Server Error",
            message: error.message
        });
    }
}
