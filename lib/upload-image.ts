import cloudinary from "./cloudinary";

export const uploadImage = async (image: File, folder: string) => {
  const buffer = await image.arrayBuffer();

  const bytes = Buffer.from(buffer);

  return new Promise(async (resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (error, result) => {
          if (error) {
            return reject(error.message);
          }
          return resolve(result);
        }
      )
      .end(bytes);
  });
};
