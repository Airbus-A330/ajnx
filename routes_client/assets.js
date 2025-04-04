const fs = require("node:fs");

const express = require("express");
const mime = require("mime");

const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 10,
    },
};

router.get("/:asset", async (req, res) => {
    let f = fs.readFileSync("./assets/" + req.params.asset);
    const mime_type = mime.getType("./assets/" + req.params.asset);

    res.writeHead(200, {
        "Content-Length": f.length,
        "Content-Type": mime_type,
        "Cache-Control": `max-age=${process.env.NODE_ENV === "production" ? 31536000 : 0}`,
    });

    res.end(f);
});

module.exports = router;
