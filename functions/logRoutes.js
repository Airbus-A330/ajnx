const pc = require("picocolors");
const date = require("./date");

exports.reqLog = (req) => {
    if (process.env.NODE_ENV == "production") return;

    console.log(
        pc.gray("[" + date() + "]") +
            pc.cyan(pc.bold("[Log]: ")) +
            pc.magenta(
                pc.bold(
                    req.headers["cf-connecting-ip"] ??
                        req.headers["x-forwarded-for"],
                ),
            ) +
            " made a " +
            pc.blue(pc.bold(req.method)) +
            " request made to " +
            pc.gray(pc.underline(req.originalUrl)),
    );
};

exports.routeNotFound = (req) => {
    if (process.env.NODE_ENV == "production") return;

    console.log(
        pc.gray("[" + date() + "]") +
            pc.cyan(pc.bold("[Log]: ")) +
            pc.bold(404) +
            " error triggered by " +
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
};

exports.logErr = (err) => {
    console.log(
        pc.gray("[" + date() + "]") +
            pc.red(pc.bold("[Error]: ")) +
            pc.gray(pc.italic(err)),
    );
};
