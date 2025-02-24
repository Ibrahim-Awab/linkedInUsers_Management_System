
import dbConnect from "@/lib/mongodb";
import User from "@/shared/schemas/User";  
import Post from "@/shared/schemas/Post";  
import { NextResponse, NextRequest } from "next/server";
// export async function GET() {
//   try {
//     await dbConnect();
//     const users = await User.find({});
//     const posts = await Post.find({}).sort({ postDate: -1 }); 

//     const postsToDisplay: any[] = [];

//     for (const user of users) {
//       const userPosts = posts
//         .filter(
//           (post) => post.owner === user.owner && post.text !== "No text found"
//         )
//         .sort((a, b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime());

//       const lastLikedPost = [...userPosts]
//         .reverse()
//         .find((post) => post.like_status === true);

//       if (lastLikedPost) {
//         const nextEligibleDate = new Date(lastLikedPost.postDate);
//         nextEligibleDate.setDate(
//           nextEligibleDate.getDate() + user.postInterval
//         );

//         const nextEligiblePost = userPosts.find((post) => {
//           const postDate = new Date(post.postDate);
//           return postDate >= nextEligibleDate && post.like_status === false;
//         });

//         if (nextEligiblePost) {
//           postsToDisplay.push(nextEligiblePost);
//         }
//       } else {
//         const latestPost = userPosts[userPosts.length - 1];
//         if (latestPost && latestPost.like_status === false) {
//           postsToDisplay.push(latestPost);
//         }
//       }
//     }

//     const filteredPosts = postsToDisplay.filter((post) => {
//       if (!post.owner || !post.profile_link) return false;

//       const ownerNameParts = post.owner.toLowerCase().split(" ");

//       return ownerNameParts.some((namePart: string) =>
//         post.profile_link.toLowerCase().includes(namePart)
//       );
//     });

//     return NextResponse.json({ success: true, data: filteredPosts }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching posts from DB:", error);
//     return NextResponse.json({ error: "Error Occurs while Creating rounds" }, { status: 500 });
//   }
// }


export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({}).lean()
    const posts = await Post.find({}).sort({ postDate: -1 }).lean()

    const postsToDisplay: any[] = []

    for (const user of users) {
      const userPosts = posts
        .filter((post) => post.owner === user.owner && post.text !== "No text found")
        .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())

      const lastLikedPost = [...userPosts].reverse().find((post) => post.like_status === true)

      if (lastLikedPost) {
        const nextEligibleDate = new Date(lastLikedPost.postDate)
        nextEligibleDate.setDate(nextEligibleDate.getDate() + user.postInterval)

        const nextEligiblePost = userPosts.find((post) => {
          const postDate = new Date(post.postDate)
          return postDate >= nextEligibleDate && post.like_status === false
        })

        if (nextEligiblePost) {
          postsToDisplay.push({
            ...nextEligiblePost,
            isImportant: user.isImportant,
          })
        }
      } else {
        const latestPost = userPosts[userPosts.length - 1]
        if (latestPost && latestPost.like_status === false) {
          postsToDisplay.push({
            ...latestPost,
            isImportant: user.isImportant,
          })
        }
      }
    }

    const filteredPosts = postsToDisplay.filter((post) => {
      if (!post.owner || !post.profile_link) return false

      const ownerNameParts = post.owner.toLowerCase().split(" ")

      return ownerNameParts.some((namePart: string) => post.profile_link.toLowerCase().includes(namePart))
    })

    filteredPosts.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return b.isImportant ? -1 : 1
      }
      return new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
    })

    return NextResponse.json({ success: true, data: filteredPosts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching posts from DB:", error)
    return NextResponse.json({ error: "Error occurs while fetching posts" }, { status: 500 })
  }
}
