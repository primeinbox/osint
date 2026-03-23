export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { aadhar } = req.query;

    if (!aadhar) {
        return res.status(400).json({
            status: false,
            message: "Aadhar number daalo"
        });
    }

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.AADHAR_API_KEY;

    try {
        const response = await fetch(
            `${BASE_URL}/aadhar?aadhar=${encodeURIComponent(aadhar)}&apikey=${API_KEY}`
        );

        const data = await response.json();

        // 🔥 Agar API expired message aaye
        if (data?.message?.includes("expire")) {
            return res.status(200).json({
                status: false,
                error: "API is expired",
                message: "⚠️ This API is currently not active.",
                provider: "@aerivue",
                api: "Black-Api-Box",
                fix: "Contact @aerivue to renew access"
            });
        }

        // Normal response
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
