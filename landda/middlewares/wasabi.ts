import multer from "multer";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const bucketName = process.env.WASABI_BUCKET_NAME;
const wasabiRegion = process.env.WASABI_REGION;
const wasabiEndpoint = new URL(process.env.WASABI_ENDPOINT!); // Convert to URL type
const accessKeyId = process.env.WASABI_ACCESS_KEY;
const secretAccessKey = process.env.WASABI_SECRET_KEY;

export const client = new S3Client({
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
  endpoint: {
    url: wasabiEndpoint,
  },
  // endpoint: wasabiEndpoint
  region: wasabiRegion,
});

export const upload = multer({
  fileFilter: function (req, file, done) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp"
    ) {
      console.log("fileFilter started");
      done(null, true);
    } else {
      console.log("Multer error - File type is not supported");
      done(null, false);
    }
  },
});

export const uploadToWasabi = async (key: any, body: any) => {
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
      })
    );
    // response image location
    const imageUrl = `https://${bucketName}.${wasabiEndpoint.host}/${key}`;

    return imageUrl;
  } catch (err) {
    console.error("Failed to upload to Wasabi: ", err);
    throw err;
  }
};
