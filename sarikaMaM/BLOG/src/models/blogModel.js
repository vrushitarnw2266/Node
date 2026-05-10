const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
         slug: {
      type: String,
      unique: true
    },

    content: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    views: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published"
    },

    isReported: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
    