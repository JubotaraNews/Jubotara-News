import { v2 as cloudinary } from "cloudinary";

const configureCloudinary = () => {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  if (!config.api_key || !config.cloud_name || !config.api_secret) {
    const missing = [];
    if (!config.cloud_name) missing.push("CLOUDINARY_CLOUD_NAME");
    if (!config.api_key) missing.push("CLOUDINARY_API_KEY");
    if (!config.api_secret) missing.push("CLOUDINARY_API_SECRET");
    throw new Error(`Cloudinary configuration missing: ${missing.join(", ")}`);
  }

  cloudinary.config(config);
};

export const uploadToCloudinary = async (file) => {
  try {
    configureCloudinary();
    
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);

    // use base64 string
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64, {
      resource_type: "image",
    });
    return result; // contains secure_url & public_id
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw error;
  }
};

// DELETE from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    configureCloudinary();
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // { result: 'ok' } if successful
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    throw err;
  }
};
