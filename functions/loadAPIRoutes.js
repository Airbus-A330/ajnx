const pc = require("picocolors");
const path = require("node:path");

const date = require("./date");
const getFiles = require("./getFiles");

let routeCounter = 0;

module.exports = (app) => {
    for (let f of getFiles("./routes_api/")) {
        if (!f.endsWith(`.js`)) return;
        f = f.replace(process.cwd(), "");

        let route = f
            .replace(".js", "")
            .replace(/routes_api/i, "/")
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
        route = route.replace("/api/", "/");

        const mod = require(`..${f}`);

        for (let r of mod.stack) {
            r = r.route;

            if (r.path) {
                routeCounter++;
            }
        }

        let req_path = path
            .normalize("/api" + route)
            .split(path.sep)
            .join("/");

        app.use(
            req_path,
            async (req, res, next) => {
                logger.reqLog(req);
                next();
            },
            mod,
        );
    }

    process.on("message", (message) => {
        if (message.initLogs) {
            console.log(
                pc.gray("[" + date() + "]") +
                    pc.blue(pc.bold("[System]: ")) +
                    pc.bold(routeCounter.toLocaleString()) +
                    " routes successfully loaded!\n",
            );
        }
    });
};
