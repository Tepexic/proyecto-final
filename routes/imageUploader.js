// Uploads image and return url
const express = require("express");
const { Router } = express;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require("fs");
const logger = require("./../utils/logger");

const AWS = require("aws-sdk");

const imageUploader = Router();

imageUploader.post("/", upload.single("avatar"), async (req, res) => {
  const env = process.env.NODE_ENV || "development";

  const tempPath = req.file.path;
  const extension = path.extname(req.file.originalname).toLowerCase();
  const uniqueName = generateGuid() + extension;

  if (env === "development") {
    const targetPath = path.join(__dirname, `./../public/${uniqueName}`);
    if (
      (extension === ".png") |
      (extension === ".jpg") |
      (extension === ".jpeg")
    ) {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
        res.status(201).json({
          url: `/${uniqueName}`,
        });
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png/.jpg files are allowed!");
      });
    }
  } else {
    // Upload to S3
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: "proyecto-final-coderhouse", // bucket name
      Key: uniqueName, // name the file will be saved as
      Body: fs.createReadStream(req.file.path),
    };
    const result = await s3.upload(params).promise();
    res.status(201).json({
      url: result.Location,
    });
  }
});

const handleError = (err, res) => {
  logger.info({ ruta: req.path, metodo: req.method, error: err });
  logger.error({ ruta: req.path, metodo: req.method, error: err });
  res.status(500).json(err);
};

function generateGuid() {
  var result, i, j;
  result = "";
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
}

module.exports = imageUploader;
