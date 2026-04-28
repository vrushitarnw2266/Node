const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, //email and image file choosen
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  imageurl: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1536640136628-849c177e76a1?q=80&w=250&auto=format&fit=crop",
  },
});

// Security: Hash password before saving to MongoDB
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // 12 rounds of salting is the industry standard balance of speed and security
  this.password = await bcrypt.hash(this.password, 12);
});

// Security: Method to compare incoming password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
