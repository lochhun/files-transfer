const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
