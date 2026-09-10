import redis from "../../../shared/redis/redis.js";
import User from "../model/user.model.js";
import { loginUser } from "../services/auth.services.js";

export const login = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required",
            });
        }

        const { user, sessionID } = await loginUser(token);

        console.log(user, sessionID);

        // 1. Save session data
        await redis.set(
            `session:${sessionID}`,
            JSON.stringify({
                userId: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.PlanExpiresAt,
            }),
            "EX",
            24 * 60 * 60
        );

        // 2. Save user-to-session mapping key
        await redis.set(`user_session:${user._id}`, sessionID, "EX", 24 * 60 * 60);

        res.cookie("SessionID", sessionID, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user,
        });

    } catch (error) {
        console.error("[AuthController] login error:", error.message);

        if (
            error.code === "auth/id-token-expired" ||
            error.code === "auth/argument-error" ||
            error.code === "auth/invalid-id-token"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        const sessionID = req?.cookies?.SessionID;
        console.log(sessionID);

        if (sessionID) {
            const rawSession = await redis.get(`session:${sessionID}`);
            if (rawSession) {
                const sessionData = JSON.parse(rawSession);
                if (sessionData?.userId) {
                    await redis.del(`user_session:${sessionData.userId}`);
                }
            }
            await redis.del(`session:${sessionID}`);
        }

        res.clearCookie("SessionID", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error("[AuthController] logout error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID header is required",
            });
        }

        if (!plan || !credits) {
            return res.status(400).json({
                success: false,
                message: "Plan and credits are required",
            });
        }

        // Calculate plan expiration (30 days from now)
        const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Update user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                plan,
                $inc: { credits: Number(credits), totalCredits: Number(credits) },
                PlanExpiresAt: planExpiresAt,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get the sessionID using the userId key stored during login
        const sessionID = await redis.get(`user_session:${userId}`);


        console.log(sessionID)

        if (sessionID) {
            const rawSession = await redis.get(`session:${sessionID}`);
            if (rawSession) {
                const sessionData = JSON.parse(rawSession);

                console.log(sessionData)
                // Update cached session fields
                sessionData.plan = updatedUser.plan;
                sessionData.credits = updatedUser.credits;

                await redis.set(
                    `session:${sessionID}`,
                    JSON.stringify(sessionData),
                    "EX",
                    7 * 24 * 60 * 60
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "User payment details updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("[AuthController] updateUserPayment error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const deductCredits = async (req, res) => {


    const AGENT_CREDITS={
          "chat": 2,
          "image":5,
          "search":5,
          "ppt":10,
          "pdf":10,
          "code":4
    }
    try {
        
        const { agent ,userId} = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required (header 'x-user-id' or body)",
            });
        }

        if (!agent) {
            return res.status(400).json({
                success: false,
                message: "Agent is required in body",
            });
        }

        const requiredCredits = AGENT_CREDITS[agent];

        if (requiredCredits === undefined) {
            return res.status(400).json({
                success: false,
                message: `Invalid agent name: '${agent}'`,
            });
        }

        // Atomically deduct credits ONLY if the user has enough balance
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: userId,
                credits: { $gte: requiredCredits }, // Guarantees credits > 0 and sufficient
            },
            {
                $inc: { credits: -requiredCredits },
            },
            { new: true }
        );

        // If no user was updated, either the user doesn't exist or credits are insufficient
        if (!updatedUser) {
            const existingUser = await User.findById(userId);

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(400).json({
                success: false,
                message: "Insufficient credits",
                currentCredits: existingUser.credits,
                requiredCredits,
            });
        }

        // Sync remaining credits to Redis session cache
        const sessionID = await redis.get(`user_session:${userId}`);
        if (sessionID) {
            const rawSession = await redis.get(`session:${sessionID}`);
            if (rawSession) {
                const sessionData = JSON.parse(rawSession);
                sessionData.credits = updatedUser.credits;

                await redis.set(
                    `session:${sessionID}`,
                    JSON.stringify(sessionData),
                    "EX",
                    24 * 60 * 60
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Credits deducted successfully",
            remainingCredits: updatedUser.credits,
            deductedCredits: requiredCredits,
        });

    } catch (error) {
        console.error("[AuthController] deductCredits error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
