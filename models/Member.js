import mongoose, { Schema, model } from "mongoose";

const MemberSchema = new Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: [
        "পৃষ্ঠপোষক",
        "উপদেষ্টা পরিষদ",
        "সম্পাদনা বিভাগ",
        "রিপোর্টিং বিভাগ",
        "ফটো ও ভিডিও বিভাগ",
        "অনলাইন বিভাগ",
        "জেলা প্রতিনিধি",
        "উপজেলা প্রতিনিধি",
      ],
    },
    isHead: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Member || model("Member", MemberSchema);
