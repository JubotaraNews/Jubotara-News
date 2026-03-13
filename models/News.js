import mongoose, { Schema, model } from "mongoose";

const NewsSchema = new Schema(
  {
    headline: { type: String, required: true },
    reporterInfo: { type: String, required: false }, // optional
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageSrc: { type: String, required: true },
    imageCaption: { type: String, required: false },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    authorName: { type: String, required: false },
    status: {
      type: String,
      enum: ["published", "pending", "draft"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    likesCount: { type: Number, default: 0 },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true },
);

export default mongoose.models.News || model("News", NewsSchema);
