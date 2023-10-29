const mongoose = require("mongoose");
const shortid = require("shortid")
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: { type: String },
  description:{type:String},
  state: { type: String, value: ["pending", "completed", "deleted"], default:"pending" },
  user_id:{type:String}
});

const TaskModel = mongoose.model("tasks", TaskSchema);
module.exports = TaskModel;