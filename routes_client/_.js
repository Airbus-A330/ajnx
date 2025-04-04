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
        tagline: "Get the information you need about your classes.",
        course_names: course.join(","),
        course: req.query["course"]?.toUpperCase(),
        srcdbs: [
            { id: "1254", name: "Spring 2025" },
            { id: "1252", name: "January 2025" },
            { id: "1248", name: "Fall 2024" },
        ],
        srcdb_id: req.query["srcdb"] ?? "1254",
    });
});

module.exports = router;
