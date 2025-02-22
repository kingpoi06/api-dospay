import Users from "../../models/UserModel.js";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: [
        "uuid",
        "username",
        "namaLengkap",
        "nip", 
        "notelp",
        "alamat",
        "email",
        "role",
        "jwt_token",
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserByUuid = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: [
        "uuid",
        "username",
        "namaLengkap",
        "nip",
        "notelp",
        "alamat",
        "email",
        "role",
        "jwt_token",
      ],
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    username,
    namalengkap,
    nip,
    notelp,
    alamat,
    email,
    role,
  } = req.body;

  const password = crypto.randomBytes(8).toString("hex");
  const hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      username: username,
      email: email,
      namalengkap: namalengkap,
      alamat: alamat,
      nip: nip,
      notelp: notelp,
      password: hashPassword,
      role: role,
    });

    // Konfigurasi transporter email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Receiver email
      subject: "Konfirmasi Pendaftaran Akun DosPay",
      html: `
      <p>Halo <strong>${username}</strong>,</p>
      <p>Selamat! Pendaftaran akun Anda di <em>DosPay</em> berhasil. Berikut adalah informasi akun Anda:</p>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>User:</strong> ${role}</li>
      </ul>
      <h3>Informasi Penting:</h3>
      <h3>Temukan Masalah atau Bug?</h3>
      <p>Jika Anda menemukan kendala atau bug pada website, silakan hubungi:</p>
      <p><strong>WhatsApp:</strong> 082147354774 (tyo)</p>
      <p>Terima kasih telah bergabung dengan <em>DosPay</em>. Kami berkomitmen untuk memberikan layanan terbaik kepada Anda.</p>
      <p>Salam hangat,<br/><strong>Tim DosPay</strong></p>
    `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: "Register Done and Confirmation Email Sent!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  // Cari user berdasarkan UUID
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  // Ambil data dari request body
  const {
    username,
    namalengkap,
    nip,
    notelp,
    alamat,
    email,
    password,
    confPassword,
    role,
  } = req.body;

  let hashPassword = user.password; 
  let passwordChanged = false; 

  if (password && password !== "") {
    if (password !== confPassword) {
      return res
        .status(400)
        .json({ msg: "Password and Confirm Password Don't Match!" });
    }
    hashPassword = await argon2.hash(password);
    passwordChanged = true; 
  }

  try {
    
    await Users.update(
      {
        username: username || user.username,
        email: email || user.email,
        namalengkap: namalengkap || user.namalengkap,
        alamat: alamat || user.alamat,
        nip: nip || user.nip,
        notelp: notelp || user.notelp,
        password: hashPassword, 
        role: role || user.role,
      },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );

    
    if (passwordChanged) {
      // Konfigurasi transporter email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Opsi email
      const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: user.email, 
        subject: "Notifikasi Perubahan Password",
        html: `
        <p>Halo <strong>${user.username}</strong>,</p>
        <p>Password akun Anda telah berhasil diubah.</p>
        <p>Jika Anda tidak merasa melakukan perubahan ini, segera hubungi kami untuk mengamankan akun Anda.</p>
        <p>Terima kasih,<br/><strong>Tim DosPay</strong></p>
      `,
      };

      // Kirim email
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ msg: "Telah Berhasi Diganti, Silahkan Cek Email!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  try {
    await Users.destroy({
      where: {
        uuid: user.uuid,
      },
    });
    res.status(200).json({ msg: "Delete Successfully!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};