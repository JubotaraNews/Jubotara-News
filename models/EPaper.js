import mongoose from "mongoose";

const EPaperSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    pages: [
      {
        pageNumber: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        hotspots: [
          {
            title: { type: String },
            coords: {
              x: { type: Number, required: true },
              y: { type: Number, required: true },
              width: { type: Number, required: true },
              height: { type: Number, required: true },
            },
            type: {
              type: String,
              enum: ["zoom", "link"],
              default: "zoom",
            },
            content: { type: String }, // HTML content for detail view
            linkUrl: { type: String }, // Link to actual news post
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Indexing date for faster searches
EPaperSchema.index({ date: -1 });

export default mongoose.models.EPaper || mongoose.model("EPaper", EPaperSchema);
