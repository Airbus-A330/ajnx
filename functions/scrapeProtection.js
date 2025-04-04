const crypto = require("node:crypto");
const { WAFJS } = require("wafjs");

let _wafjs = new WAFJS({
    allowedMethods: ["GET"], // allowed / desired HTTP methods
    contentTypes: ["application/json"], // allowed / desired content-types
});

module.exports = (req, res) => {
    let bot = false;

    if (!req.headers["x-integrity-key"]) {
        res.status(400).send({
            status: 400,
            message: "Missing integrity key",
        });

        return;
    }

    const secret = crypto
        .createHmac("sha256", process.env.CRYPTO_SECRET)
        .update(Math.round(Date.now() / config.security.threshold))
        .digest("hex"); // allow for 5 minutes of error

    if (
        _wafjs.wafChecks(
            req.headers["user-agent"],
            req.method,
            req.headers["content-type"],
        )
    ) {
        bot = true;
    }

    if (secret != req.headers["x-integrity-key"]) {
        bot = true;
    }

    if (bot) {
        console.log(
            pc.gray("[" + date() + "]") +
                pc.cyan(pc.bold("[Log]: ")) +
                " Scrape detection triggered by " +
                pc.magenta(
                    pc.bold(
                        req.headers["cf-connecting-ip"] ??
                            req.headers["x-forwarded-for"],
                    ),
                ) +
                ", who made a " +
                pc.blue(pc.bold(req.method)) +
                " request to " +
                pc.gray(pc.underline(req.originalUrl)),
        );
    }

    return !bot;
};
