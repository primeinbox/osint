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

    // 🔥 Deep Branding Inject
    function injectBranding(obj) {
        if (typeof obj === "object" && obj !== null) {
            obj._credit = "@aerivue";

            for (let key in obj) {
                if (typeof obj[key] === "object") {
                    injectBranding(obj[key]);
                }
            }
        }
        return obj;
    }

    // 🔥 Random Hidden Credit
    function addRandomCredit(obj) {
        if (typeof obj === "object" && obj !== null) {
            const randomKey = "_" + Math.random().toString(36).substring(2, 8);
            obj[randomKey] = "@aerivue";

            for (let key in obj) {
                if (typeof obj[key] === "object") {
                    addRandomCredit(obj[key]);
                }
            }
        }
        return obj;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/lookup?number=${encodeURIComponent(number)}&apikey=${API_KEY}`
        );

        let data = await response.json();

        // 🔥 Inject branding everywhere
        data = injectBranding(data);
        data = addRandomCredit(data);

        // 🔥 Mix into real fields (optional but powerful)
        if (data.name) {
            data.name = `${data.name} | @aerivue`;
        }

        if (data.operator) {
            data.operator = `@aerivue • ${data.operator}`;
        }

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
