"use server"

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export async function uploadImage(dataUri: string): Promise<string> {
  
  try {
    cloudinary.config({

      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
    // Data URI से MIME टाइप और Base64 डेटा निकालें
    const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid data URI');
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    // Base64 डेटा को Buffer में कनवर्ट करें
    const buffer = Buffer.from(base64Data, 'base64');

    // Buffer को Readable Stream में कनवर्ट करें
    const stream = Readable.from(buffer);

    // Cloudinary पर अपलोड करें
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'services-app',
          upload_preset: process.env.PRESET_NAME,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        }
      );
      stream.pipe(uploadStream);
    });

    return result.secure_url;

  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return '';
  }
}
