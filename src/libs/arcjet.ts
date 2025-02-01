import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/bun";

const aj = arcjet({
    key: Bun.env.ARCJET_KEY!,
    characteristics: ["ip.src"],
    rules: [
        shield({
            mode: "LIVE",
        }),
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:MONITOR",
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 2, 
            interval: 10,
            capacity: 10,
        }),
    ],
});

export default aj;