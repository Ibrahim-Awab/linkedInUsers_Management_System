import  mongoose from  "mongoose";

const userSchema = new mongoose.Schema({
    owner: String,
    image: String,
    postInterval: { type: Number, default: 30 },
    isImportant: { type: Boolean, default: false },
  });
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;


