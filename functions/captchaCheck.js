const pc = require("picocolors");
const date = require("./date.js");

module.exports = async (req, res) => {
    if (process.env.NODE_ENV !== "production") return true;

    let captchaData = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(req.body.captcha)}`,
        {
            method: "POST",
        },
    );

    captchaData = await captchaData.json();

    if (!captchaData.success) {
        res.status(400).send({
            status: false,
            message: "The captcha was missing or invalid. Please try again.",
        });

        if (process.env.NODE_ENV !== "production") {
            console.log(
                pc.gray("[" + date() + "]") +
                    pc.yellow(pc.bold("[Warning]: ")) +
                    "Invalid captcha triggered by " +
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

        return false;
    } else {
        return true;
    }
};
