import multer from "multer";
import path from "path";
import crypto from "crypto";

const multerConfig = {
  // dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          cb(error, "failed to generate name");
        }
        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    },
    // destination: (req, file, cb) => {
    //   cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    // },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type "));
    }
  },
};

export { multerConfig };
