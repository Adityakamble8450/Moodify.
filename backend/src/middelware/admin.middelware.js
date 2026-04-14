const User = require("../model/user.model");

async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const userEmail = user.email?.toLowerCase();

        if (!adminEmail || !userEmail || userEmail !== adminEmail) {
            return res.status(403).json({ message: "Admin access only" });
        }

        req.adminUser = user;
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({ message: "Unable to verify admin access" });
    }
}

module.exports = adminMiddleware;
