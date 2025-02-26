import Users from "../../models/UserModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const postLogin = async (req, res) => {
  console.log("postLogin called");
  try {
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: "Akun tidak terdaftar" });
    }

    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
      console.log("Password mismatch");
      return res
        .status(400)
        .json({ msg: "Password Salah. Silahkan Masukan Lagi!" });
    }

    const { uuid, username, namalengkap, email, jabatan, satuankerja, role } =
      user;

    const accessToken = jwt.sign(
      { uuid, username, namalengkap, email, jabatan, satuankerja, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );

    const refreshToken = jwt.sign(
      { uuid, username, namalengkap, email, jabatan, satuankerja, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );

    // Update jwt_token di database
    await Users.update(
      { jwt_token: refreshToken },
      {
        where: { uuid: user.uuid },
      }
    );

    // ✅ Simpan refreshToken dalam Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Gunakan secure di mode production
      sameSite: "Strict",
      maxAge: 3600000, // 1 jam
    });

    // ✅ Simpan akses token di header Authorization
    res.set("Authorization", `Bearer ${accessToken}`);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("postLogin error:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // ✅ Ambil token dari cookie

    if (!refreshToken) {
      return res.sendStatus(401); // Unauthorized
    }

    const user = await Users.findOne({
      where: { jwt_token: refreshToken },
    });

    if (!user) {
      return res.sendStatus(404); // User not found
    }

    // ✅ Hapus refreshToken dari database
    await Users.update({ jwt_token: null }, { where: { uuid: user.uuid } });

    // ✅ Hapus cookie di browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ msg: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ msg: "Failed to logout" });
  }
};