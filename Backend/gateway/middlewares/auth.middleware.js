import redis from "../../shared/redis/redis.js";

const authMiddleware = async (req, res, next) => {
    try {
        const sessionID = req.cookies?.SessionID;

        console.log(sessionID)
        if (!sessionID) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No session found",
            });
        }

        const data = await redis.get(`session:${sessionID}`);

        console.log("data" + data)
        if (!data) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Session expired or invalid",
            });
        }

        req.user = JSON.parse(data);


        next();
    } catch (error) {
        console.error("[AuthMiddleware] error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default authMiddleware;
