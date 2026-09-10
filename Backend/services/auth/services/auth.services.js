import User from "../model/user.model.js";
import { app } from "../config/firebase.js";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";

export const loginUser = async (token) => {
    const decodedToken = await getAuth(app).verifyIdToken(token);

    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ FbUserId: uid });

    if (!user) {
        user = await User.create({
            FbUserId: uid,
            username: name || "Anonymous",
            email: email || "",
            avatar: picture || "",
        });
    }

    const sessionID = crypto.randomUUID();

    return {
        user,
        sessionID,
    };
};