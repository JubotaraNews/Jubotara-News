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

// Optimize Cloudinary image URL with automatic format and quality
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url; // Return as-is if not a Cloudinary URL
  }

  try {
    // Parse the Cloudinary URL
    const urlParts = url.split("/upload/");
    if (urlParts.length !== 2) return url;

    const baseUrl = urlParts[0];
    const imagePath = urlParts[1];

    // Build transformation parameters
    const transformations = [];

    // Always add automatic format and quality
    transformations.push("f_auto", "q_auto");

    // Add additional transformations if specified
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);

    // Insert transformations into the URL
    const optimizedUrl = `${baseUrl}/upload/${transformations.join(",")}/${imagePath}`;

    return optimizedUrl;
  } catch (error) {
    console.warn("Failed to optimize Cloudinary URL:", error);
    return url; // Return original URL on error
  }
};

// Generate blur placeholder for images
export const generateBlurDataURL = (width = 10, height = 6) => {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `;

  // Convert to base64 data URL
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
};
