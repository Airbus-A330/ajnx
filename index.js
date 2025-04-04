const fs = require("node:fs");
const os = require("node:os");
const cluster = require("node:cluster");

const express = require("express");
const pc = require("picocolors");
const bodyParser = require("body-parser");

global.hD = require("humanize-duration");
global.mongoose = require("mongoose");
global.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

global.config = require("./static/config/config.js");
global.RL = require("./functions/rl.js");
global.random = require("./functions/random.js");
global.date = require("./functions/date.js");
global.logger = require("./functions/logRoutes.js");
global.validate = require("./functions/validate.js");
global.captchaCheck = require("./functions/captchaCheck.js");

const app = express();

global.ratelimits = new Map();

app.disable("x-powered-by");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

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
                    pc.blue(pc.bold("[System]:")) +
                    " Connected to Mongo Database!",
            );

            console.log(
                pc.gray("[" + date() + "]") +
                    pc.blue(pc.bold("[System]: ")) +
                    "Client listening on port " +
                    pc.yellow(pc.bold(config.server.port)) +
                    ".",
            );
        }
    });

    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI, {
        autoIndex: false,
    });

    require("./functions/loadClientRoutes.js")(app);
    require("./functions/loadAPIRoutes.js")(app);

    app.all("*", async (req, res) => {
        logger.routeNotFound(req);

        res.status(404).render("pages/404", {
            tagline: "Looks like someone's lost...",
        });
    });

    app.listen(config.server.port);
}
