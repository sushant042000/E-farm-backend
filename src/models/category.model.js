import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      unique: true,
      require: true,
    },
    imageUri: {
      type: String,
      unique: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
