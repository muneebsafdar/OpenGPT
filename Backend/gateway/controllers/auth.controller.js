export const getMe = (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
};
