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
                "POSTMAN",
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 2, 
            interval: 5,
            capacity: 2,
        }),
    ],
});

export default aj;