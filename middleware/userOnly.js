import Users from "../models/UserModel.js";

const checkRole = (roles) => async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        uuid: req.userUuid,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: `User not found at ${req.userUuid}` });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    req.role = user.role;
    next();
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const adminOnly = checkRole(["admin"]);
export const bendaharaOnly = checkRole(["bendahara"]);
export const allroleOnly = checkRole(["bendahara", "admin"]);

