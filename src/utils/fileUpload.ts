import { S3 } from 'aws-sdk';
export default class FileUpload {
  static async upload(files: any[]) {
    return new Promise((resolve, reject) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      let images = [];
      files.forEach(async (file) => {
        const splitFile = file.originalname.split('.');
        const random = Date.now();
        const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;
        const params = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
          Key: fileName,
          Body: file.buffer,
        };
        const uploadResponse = await s3.upload(params).promise();
        images.push(uploadResponse);
        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }

  static async deleteImages(images) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    let imagesKeys = images.map((image) => {
      return {
        Key: image.Key,
      };
    });
    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
      Delete: {
        Objects: imagesKeys,
        Quiet: false,
      },
    };
    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
