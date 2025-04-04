const fs = require("node:fs");

const express = require("express");
const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

router.get("/", async (req, res) => {
    let f = fs.readFileSync("./static/icon.ico");

    res.writeHead(200, {
        "Content-Length": f.length,
    });

    res.end(f);
});

module.exports = router;
