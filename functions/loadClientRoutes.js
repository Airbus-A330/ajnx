const pc = require("picocolors");
const path = require("node:path");

const date = require("./date");
const getFiles = require("./getFiles");

module.exports = (app) => {
    for (let f of getFiles("./routes_client/")) {
        if (!f.endsWith(`.js`)) return;
        f = f.replace(process.cwd(), "");

        let route = f
            .replace(".js", "")
            .replace(/routes_client/i, "/")
            .toLowerCase();

        if (route.endsWith(`_`)) {
            route = route
                .split("/")
                .reverse()
                .join("/")
                .replace("_", "")
                .split("/")
                .reverse()
                .join("/");
        }

        route = route.replaceAll("_", ":");

        const mod = require(`..${f}`);

        for (let r of mod.stack) {
            r = r.route;

            ratelimits.set(
                `[${Object.keys(r.methods)[0].toUpperCase()}] ${(route + r.path).replaceAll("//", "/")}`.split(
                    ":",
                )[0],
                new RL(mod.ratelimit[Object.keys(r.methods)[0].toUpperCase()]),
            );
        }

        let req_path = path.normalize(route).split(path.sep).join("/");

        app.use(
            req_path,
            async (req, res, next) => {
                const identifier =
                    req.headers["cf-connecting-ip"] ??
                    req.headers["x-forwarded-for"] ??
                    req.ip;

                const rl = ratelimits.get(
                    `[${req.method}] ${route}${route.endsWith("/") ? "" : "/"}`,
                );

                logger.reqLog(req);

                if (rl) {
                    if (!(await rl.canUse(identifier))) {
                        const { next_reset, count } =
                            await rl.getData(identifier);

                        const remainingTime = next_reset - Date.now();

                        res.set({
                            "X-Retry-After": Math.ceil(remainingTime / 1000),
                            "X-Ratelimit-Limit": count,
                            "X-Ratelimit-Remaining": 0,
                            "X-Ratelimit-Reset": Math.ceil(next_reset / 1000),
                            "X-Ratelimit-Reset-After": Math.ceil(
                                remainingTime / 1000,
                            ),
                        });

                        res.status(429).render("pages/ratelimit", {
                            tagline: "Someone's getting a speeding ticket...",
                            time_ms: remainingTime,
                            time: hD(remainingTime, {
                                round: true,
                            }).toLocaleString(),
                        });

                        return;
                    } else {
                        rl.increment(identifier);
                    }
                }

                next();
            },
            mod,
        );
    }
};
