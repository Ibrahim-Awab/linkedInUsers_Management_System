import  mongoose from  "mongoose";


const postSchema = new mongoose.Schema({
    owner: String,
    text: String,
    profile_link: String,
    like_status: Boolean,
    image: String,
    postDate: String,
    fetchedAt: { type: Date, default: Date.now },
  });
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;


