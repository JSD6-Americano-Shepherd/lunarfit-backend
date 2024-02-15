import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadToCloudinary(base64File) {
  const result = await cloudinary.uploader.upload(base64File, {
    resource_type: "image",
  });
  return result;
}

export default uploadToCloudinary;
// const uploadToCloudinary = async (req, res, next) => {
//   const fileBufferBase64 = Buffer.from(req.file.buffer).toString("base64");
//   const base64File = `data:${req.file.mimetype};base64,${fileBufferBase64}`;
//   req.cloudinary = await cloudinary.uploader.upload(base64File, {
//     resource_type: "image",
//   });

//   next();
// };

// export default uploadToCloudinary;
