import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes//login/AuthRoute.js";
import TokenRoute from "./routes//login/TokenRoute.js";

import SatkerunivRoute from "./routes/satkerUniv/SatkerUnivRoute.js";

import CabangSatkerRoute from "./routes/satkerUniv/cabangsatker/CabangSatkerRoute.js";

import RuhPejabatRoute from "./routes/satkerUniv/RUHpejabat/RuhPejabatRoute.js";

import RestorepegawaiRoute from "./routes/satkerUniv/cabangsatker/pegawai/RestorepegawaiRoute.js"
import PegawaiRoute  from "./routes/satkerUniv/cabangsatker/pegawai/PegawaiRoute.js"

import KehormatanRoute  from "./routes/satkerUniv/cabangsatker/pegawai/tunjangan/KehormatanRoute.js"
import ProfesiRoute  from "./routes/satkerUniv/cabangsatker/pegawai/tunjangan/ProfesiRoute.js"

import TanggalKehormatanRoute from "./routes/satkerUniv/cabangsatker/pegawai/tanggaltunjangan/TanggalKehormatanRoute.js"
import TanggalProfesiRoute from "./routes/satkerUniv/cabangsatker/pegawai/tanggaltunjangan/TanggalProfesiRoute.js"

import { verifyToken, verifyUser } from "./middleware/verify.js";

dotenv.config();

const app = express();
app.use(express.static("uploads"));

// 1. Enable CORS middleware before defining routes
app.use(
  cors({
    credentials: true,
    // origin: ["http://localhost:5173", ""],
    origin: ["http://localhost:5173"],
  })
);

// 2. Set up helmet middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cookieParser());
// 3. Use JSON middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Sync database
(async () => {
  await db.sync();
})();

// 5. Define unprotected routes
app.use(AuthRoute);
app.use(TokenRoute);

// // 6. Apply middleware verification
app.use(verifyToken);
app.use(verifyUser);

// 7. Define protected routes
app.use(UserRoute);
app.use(SatkerunivRoute);
app.use(CabangSatkerRoute);
app.use(RuhPejabatRoute);
app.use(RestorepegawaiRoute);
app.use(PegawaiRoute);
app.use(KehormatanRoute);
app.use(ProfesiRoute);
app.use(TanggalKehormatanRoute);
app.use(TanggalProfesiRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
