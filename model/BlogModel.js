const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const BlogModel = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: { type: String, required: true },
  author: { id: String, name: String  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  read_count: { type: Number, default: 0 },
  reading_time: { type: Number, default: 0 },
  tags: [String],
  author_name: { type: String},
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Blog = mongoose.model("blogs", BlogModel);
module.exports = Blog;
