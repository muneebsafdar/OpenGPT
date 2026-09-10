

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3client } from "../config/S3Config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";


export const GetFromS3 = async (fileName,expiry=600) => {
  
    return await getSignedUrl(
        S3client,
        new GetObjectCommand ({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key:fileName,
        }),
        {expiresIn:expiry}
    )

};