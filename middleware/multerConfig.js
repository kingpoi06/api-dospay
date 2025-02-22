// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// console.log("Multer Config Loaded:", upload);

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage(); 
const fileFilter = (req, file, cb) => {
    // Hanya menerima file Excel dengan ekstensi .xlsx
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true); // Terima file
    } else {
      cb(new Error('Hanya file Excel (.xlsx) yang diperbolehkan'), false); // Tolak file lainnya
    }
  };
  
  const upload = multer({ storage, fileFilter }).single('file');

console.log("Multer Config Loaded:", upload);

export default upload;