import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error);
        } else {
          resolve(uploadResult.secure_url);
        }
      }
    );
    stream.end(fileBuffer);
  });
};