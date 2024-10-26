import mongoose, { Schema } from "mongoose";
import { IBlogPost } from "../types/type.all";
import { userSchema } from "./user.model";

const COLLECTION_NAME: string = "blog";
const DOCUMENT_NAME: string = "blog";

const blogSchema: Schema = new Schema<IBlogPost>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    images: {
      type: [],
    },
    dateEdited: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Blog = mongoose.model<IBlogPost>(DOCUMENT_NAME, blogSchema);

export default Blog;
