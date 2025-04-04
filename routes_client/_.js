const express = require("express");
const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

router.get("/", async (req, res) => {
    let course = require("../static/courses.json");

    if (require("../functions/random.js")(1, 50) == 4) {
        res.sendFile(
            (__dirname + "/assets/index.html").replace("routes_client/", ""),
        );
    }

    res.render("pages/index", {
        tagline: "Welcome to the next generation of banking."
    });
});

module.exports = router;
