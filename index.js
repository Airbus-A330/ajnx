const fs = require("node:fs");
const os = require("node:os");
const cluster = require("node:cluster");
const path = require("node:path");

const express = require("express");
const pc = require("picocolors");
const bodyParser = require("body-parser");

global.hD = require("humanize-duration");
global.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

global.config = require("./static/config/config.js");
global.date = require("./functions/date.js");
global.logger = require("./functions/logRoutes.js");

global.db = require("./functions/db.js");

const app = express();

app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use(express.static(path.join(__dirname, 'client/build')));

process.on("unhandledRejection", (err) => {
    logger.logErr(err.stack);
});

if (cluster.isMaster) {
    let numCPUs = os.cpus().length;

    (() => {
        console.log(`
            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄       ▄ 
            ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░▌     ▐░▌
            ▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀▀█░█▀▀▀ ▐░▌░▌     ▐░▌ ▐░▌   ▐░▌ 
            ▐░▌       ▐░▌      ▐░▌    ▐░▌▐░▌    ▐░▌  ▐░▌ ▐░▌  
            ▐░█▄▄▄▄▄▄▄█░▌      ▐░▌    ▐░▌ ▐░▌   ▐░▌   ▐░▐░▌   
            ▐░░░░░░░░░░░▌      ▐░▌    ▐░▌  ▐░▌  ▐░▌    ▐░▌    
            ▐░█▀▀▀▀▀▀▀█░▌      ▐░▌    ▐░▌   ▐░▌ ▐░▌   ▐░▌░▌   
            ▐░▌       ▐░▌      ▐░▌    ▐░▌    ▐░▌▐░▌  ▐░▌ ▐░▌  
            ▐░▌       ▐░▌ ▄▄▄▄▄█░▌    ▐░▌     ▐░▐░▌ ▐░▌   ▐░▌ 
            ▐░▌       ▐░▌▐░░░░░░░▌    ▐░▌      ▐░░▌▐░▌     ▐░▌
             ▀         ▀  ▀▀▀▀▀▀▀      ▀        ▀▀  ▀       ▀             
`);

        console.log(
            pc.gray("[" + date() + "]") +
                pc.green(pc.bold("[Process]: ")) +
                "Process started!",
        );

        console.log(
            pc.gray("[" + date() + "]") +
                pc.green(pc.bold("[Process]:")) +
                " CPU: " +
                pc.bold(os.cpus()[0].model) +
                ".",
        );
        console.log(
            pc.gray("[" + date() + "]") +
                pc.green(pc.bold("[Process]:")) +
                " Discovered " +
                pc.bold(os.cpus().length) +
                " CPUs.",
        );
        console.log(
            pc.gray("[" + date() + "]") +
                pc.green(pc.bold("[Process]:")) +
                " Running on PID " +
                pc.bold(process.ppid) +
                ".",
        );

        console.log(
            pc.gray("[" + date() + "]") +
                pc.green(pc.bold("[Process]:")) +
                " " +
                (process.env.NODE_ENV == "production"
                    ? "System is in " +
                      pc.green(pc.bold("production")) +
                      " mode."
                    : "⚠️  System is in " +
                      pc.yellow(pc.bold("development")) +
                      " mode."),
        );
    })();

    for (let i = 0; i < numCPUs; ++i) {
        cluster.fork().send({
            initLogs: i == 0,
        });
    }
} else {
    process.on("message", (message) => {
        if (message.initLogs) {
            console.log(
                pc.gray("[" + date() + "]") +
                    pc.green(pc.bold("[Process]:")) +
                    " Client Process started!",
            );

            console.log(
                pc.gray("[" + date() + "]") +
                    pc.blue(pc.bold("[System]: ")) +
                    "Client listening on port " +
                    pc.yellow(pc.bold(config.server.port)) +
                    ".",
            );

            // DB Query Test
            db.query("SELECT 1")
                .then(() => {
                    pc.gray("[" + date() + "]") +
                        pc.yellow(pc.bold("[Database]: ")) +
                        "✅ Connected to MySQL database successfully.";
                })
                .catch((err) => {
                    pc.gray("[" + date() + "]") +
                        pc.yellow(pc.bold("[Database]: ")) +
                        "❌ Failed to connect to MySQL database:",
                        err;
                });
        }
    });

    require("./functions/loadAPIRoutes.js")(app);

    app.all("*", async (req, res, next) => {
        if (req.path.startsWith('/api/')) {
            return next(); 
        }

        logger.routeNotFound(req);

        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    });

    app.listen(config.server.port);
}
