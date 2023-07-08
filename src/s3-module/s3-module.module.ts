import { Module } from '@nestjs/common';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3ModuleService } from './s3-module.service';
import { S3ModuleController } from './s3-module.controller';
import * as AWS from "aws-sdk";

const client = new S3Client({})


@Module({
  controllers: [S3ModuleController],
  providers: [S3ModuleService]
})
export class S3ModuleModule {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3
  ({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file)
  {
      const { originalname } = file;

      await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
  }

  async s3_upload(file, bucket, name, mimetype)
  {
      const params = 
      {
          Bucket: bucket,
          Key: String(name),
          Body: file,
          ACL: "public-read",
          ContentType: mimetype,
          ContentDisposition:"inline",
          CreateBucketConfiguration: 
          {
              LocationConstraint: "ap-south-1"
          }
      };

      console.log(params);

      try
      {
          let s3Response = await this.s3.upload(params).promise();

          console.log(s3Response);
      }
      catch (e)
      {
          console.log(e);
      }
  }

  async s3_download(file, bucket, name, mimetype) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: file
    });
  
    try {
      const response = await client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const str = await response.Body.transformToString();
      console.log(str);
    } catch (err) {
      console.error(err);
    }
  };

  
      
}
  
