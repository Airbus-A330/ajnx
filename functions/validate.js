const xss = require("xss");

module.exports = (object, res, constraints, mustExist = true) => {
    for (let constraint of constraints) {
        if (mustExist) {
            if (!Object.values(constraint)[0].optional) {
                if (!object[Object.keys(constraint)[0]]) {
                    res.status(400).send({
                        status: 400,
                        message: `Missing parameter property '${Object.keys(constraint)[0]}'`,
                    });

                    return false;
                }
            }
        }

        if (constraint.type == "STRING") {
            if (object[Object.keys(constraint)[0]]) {
                if (typeof object[Object.keys(constraint)[0]] !== "string") {
                    res.status(400).send({
                        status: 400,
                        message: `Invalid value for property '${Object.keys(constraint)[0]}'.`,
                    });

                    return false;
                }

                if (
                    !Object.values(constraint)[0].regex.test(
                        object[Object.keys(constraint)[0]],
                    )
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `Invalid value for property '${Object.keys(constraint)[0]}'.`,
                    });

                    return false;
                }

                if (
                    Object.values(constraint)[0].length.min >
                        object[Object.keys(constraint)[0]].length ||
                    Object.values(constraint)[0].length.max <
                        object[Object.keys(constraint)[0]].length
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `Parameter property '${Object.keys(constraint)[0]}' must be no less than ${Object.values(constraint)[0].length.min} in length, but no greater than ${Object.values(constraint)[0].length.max} in length.`,
                    });

                    return false;
                }
            }
        } else if (constraint.type == "NUMBER") {
            if (object[Object.keys(constraint)[0]]) {
                if (isNaN(object[Object.keys(constraint)[0]])) {
                    res.status(400).send({
                        status: 400,
                        message: `Invalid value for property '${Object.keys(constraint)[0]}'.`,
                    });

                    return false;
                }

                if (
                    Object.values(constraint)[0].lower_bound >
                    object[Object.keys(constraint)[0]]
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `Parameter property '${Object.keys(constraint)[0]}' must be greater than ${Object.values(constraint)[0].lower_bound}.`,
                    });

                    return false;
                }

                if (
                    Object.values(constraint)[0].upper_bound <
                    object[Object.keys(constraint)[0]]
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `Parameter property '${Object.keys(constraint)[0]}' must be less than ${Object.values(constraint)[0].upper_bound}.`,
                    });

                    return false;
                }
            }
        }
    }
    // everything worked out, continue operation.
    return true;
};

module.exports.validateGradeEntry = (req, res) => {
    if (!req.body.data) {
        res.status(400).send({
            status: 400,
            message: "Missing data field.",
        });

        return false;
    }

    for (let i = 0; i < req.body.data.length; ++i) {
        if (!req.body.data[i].id) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].id is required.`,
            });

            return false;
        }

        if (!req.body.data[i].weight) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].weight is required.`,
            });

            return false;
        }

        if (!req.body.data[i].name) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].name is required.`,
            });

            return false;
        }

        if (typeof req.body.data[i].id !== "string") {
            res.status(400).send({
                status: 400,
                message: `data[${i}].id must be a string.`,
            });

            return false;
        }

        if (typeof req.body.data[i].name !== "string") {
            res.status(400).send({
                status: 400,
                message: `data[${i}].name must be a string.`,
            });

            return false;
        }

        if (
            req.body.data[i].name.length > 100 ||
            req.body.data[i].name.length < 2
        ) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].name must be between 2 and 100 characters.`,
            });

            return false;
        }

        req.body.data[i].name = xss(req.body.data[i].name);

        if (req.body.data[i].id.length > 20) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].id must be less than 20 characters.`,
            });

            return false;
        }

        if (isNaN(req.body.data[i].weight)) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].weight must be a number.`,
            });

            return false;
        }

        if (req.body.data[i].weight < 0 || req.body.data[i].weight > 1) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].weight must be between 0 and 1.`,
            });

            return false;
        }

        if (!["ASSIGNMENT", "CATEGORY"].includes(req.body.data[i].type)) {
            res.status(400).send({
                status: 400,
                message: `data[${i}].type must be either ASSIGNMENT or CATEGORY.`,
            });

            return false;
        }

        if (req.body.data[i].type == "ASSIGNMENT") {
            if (!req.body.data[i].grade) {
                res.status(400).send({
                    status: 400,
                    message: `data[${i}].grade is required.`,
                });

                return false;
            }

            if (isNaN(req.body.data[i].grade)) {
                res.status(400).send({
                    status: 400,
                    message: `data[${i}].grade must be a number or null.`,
                });

                return false;
            }

            if (
                req.body.data[i].grade !== -1 &&
                (req.body.data[i].grade < 0 || req.body.data[i].grade > 1)
            ) {
                res.status(400).send({
                    status: 400,
                    message: `data[${i}].grade must be between 0 and 1.`,
                });

                return false;
            }
        } else {
            if (!req.body.data[i].children) {
                res.status(400).send({
                    status: 400,
                    message: `data[${i}].children is required.`,
                });

                return false;
            }

            if (!Array.isArray(req.body.data[i].children)) {
                res.status(400).send({
                    status: 400,
                    message: `data[${i}].children must be an array.`,
                });

                return false;
            }

            for (let j = 0; j < req.body.data[i].children.length; ++j) {
                if (!req.body.data[i].children[j].id) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].id is required.`,
                    });
                    return false;
                }

                if (typeof req.body.data[i].children[j].id !== "string") {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].id must be a string.`,
                    });

                    return false;
                }

                if (req.body.data[i].children[j].id > 20) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].id must be less than 20 characters.`,
                    });

                    return false;
                }

                if (!req.body.data[i].children[j].weight) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].weight is required.`,
                    });

                    return false;
                }

                if (isNaN(req.body.data[i].children[j].weight)) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].weight must be a number.`,
                    });

                    return false;
                }

                if (
                    req.body.data[i].children[j].weight < 0 ||
                    req.body.data[i].children[j].weight > 1
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].weight must be between 0 and 1.`,
                    });

                    return false;
                }

                if (!req.body.data[i].children[j].grade) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].grade is required.`,
                    });

                    return false;
                }

                if (isNaN(req.body.data[i].children[j].grade)) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].grade must be a number.`,
                    });

                    return false;
                }

                if (
                    req.body.data[i].children[j].grade !== -1 &&
                    (req.body.data[i].children[j].grade < 0 ||
                        req.body.data[i].children[j].grade > 1)
                ) {
                    res.status(400).send({
                        status: 400,
                        message: `data[${i}].children[${j}].grade must be between 0 and 1.`,
                    });

                    return false;
                }
            }
        }
    }

    if (req.body.data.map((x) => x.weight).reduce((a, b) => a + b) > 1) {
        res.status(400).send({
            status: 400,
            message: "Sum of all weights must not be greater than 1.",
        });

        return false;
    }

    let idSet = new Set();
    let comparisonIncrement = 0;

    for (let i = 0; i < req.body.data.length; ++i) {
        if (req.body.data[i].type == "ASSIGNMENT") {
            idSet.add(req.body.data[i].id);
            comparisonIncrement++;
        } else {
            for (let j = 0; j < req.body.data[i].children.length; ++j) {
                idSet.add(req.body.data[i].children[j].id);
                comparisonIncrement++;
            }
        }
    }

    if (idSet.size !== comparisonIncrement) {
        res.status(400).send({
            status: 400,
            message: "IDs cannot be duplicated.",
        });

        return false;
    }

    return true;
};
