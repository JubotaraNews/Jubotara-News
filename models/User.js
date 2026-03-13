import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isActivated: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    activationToken: { type: String },
    activationExpires: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.User || model("User", UserSchema);
