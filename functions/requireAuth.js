function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", user);
        req.user = user;
        next();
    } catch (err) {
        console.log("Token verification error:", err.stack);
        res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = requireAuth;
