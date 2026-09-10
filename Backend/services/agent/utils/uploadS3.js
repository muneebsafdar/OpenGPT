import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3client } from "../config/S3Config.js";


export const uploadToS3 = async (contentType,fileName,Buffer) => {
  await S3client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key:fileName,
    Body:Buffer,
    ContentType:contentType
  }));

  return fileName
};