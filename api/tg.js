export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { userid } = req.query;

    if (!userid) {
        return res.status(400).json({
            status: false,
            message: "Telegram user ID daalo"
        });
    }

    // 🔥 Remove @ symbol if present in userid
    const cleanUserid = userid.replace(/^@/, '');
    
    // 📝 Log with original and cleaned userid
    console.log(`📥 Request received - Original: ${userid}, Cleaned: ${cleanUserid} | Provider: @aerivue`);

    const BASE_URL = process.env.AERIVUE_BASE;
    const API_KEY = process.env.TG_API_KEY;

    // 🔥 Toggle (future ke liye useful)
    const MAINTENANCE_MODE = false;

    if (MAINTENANCE_MODE) {
        return res.status(200).json({
            status: false,
            error: "API is expired",
            message: "⚠️ This API is currently not active.",
            provider: "@aerivue",
            api: "Black-Api-Box",
            fix: "Contact @aerivue to renew access"
        });
    }

    try {
        const response = await fetch(
            `${BASE_URL}/tg?userid=${encodeURIComponent(cleanUserid)}&apikey=${API_KEY}`
        );

        let data = await response.json();

        // 🔥 Sirf api_used field change karo, baaki sab original rahne do
        if (data && typeof data === 'object') {
            data.api_used = "@allblackapi";
        }

        // 🔥 API expire check
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

        // ✅ Normal response
        return res.status(200).json({
            status: true,
            data: data
        });

    } catch (error) {
        console.error(`❌ Error for user ${cleanUserid} | Provider: @aerivue -`, error.message);
        
        return res.status(500).json({
            status: false,
            error: "Server Error",
            message: error.message
        });
    }
}
