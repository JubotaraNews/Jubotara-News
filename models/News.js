import mongoose, { Schema, model } from "mongoose";

const NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    reporterInfo: { type: String, required: false }, // optional
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageSrc: { type: String, required: true },
    author: { type: String, default: "Admin" },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.News || model("News", NewsSchema);
