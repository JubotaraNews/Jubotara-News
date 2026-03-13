/**
 * Client-side helper to upload a file to Cloudinary via a server-side API route.
 * @param {File} file - The file object from an input element.
 * @returns {Promise<string|null>} - The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error(`Server returned status ${res.status}`);
    }

    if (!res.ok) {
      throw new Error(data.message || data.error || `Upload failed with status ${res.status}`);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Client upload error:", error);
    throw error;
  }
};
