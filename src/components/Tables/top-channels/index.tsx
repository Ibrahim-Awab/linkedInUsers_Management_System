// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import { useSearch } from "@/components/Layouts/header/searchContext";
// interface Channel {
//   owner: string;
//   image: string;
//   postDate: string;
//   text: string;
//   profile_link: string;
// }

// export function TopChannels({ className }: { className?: string }) {
//   const [data, setData] = useState<Channel[]>([]);
//   const [selectedText, setSelectedText] = useState<string | null>(null);
//   const [gptReply, setGptReply] = useState<string | null>(null);
//   const { searchTerm } = useSearch();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("/api/post");
//         const result = await response.json();
//         if (result.success) {
//           setData(result.data);
//         } else {
//           console.error("Failed to fetch data");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchData();
//   }, []);
//   const filteredData = data.filter((channel) =>
//     channel.owner.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleReadMore = (text: string) => {
//     setSelectedText(text);
//   };

//   const handleCloseModal = () => {
//     setSelectedText(null);
//     setGptReply(null);
//   };

//   const handleGptReply = async (text: string) => {
//     try {
//       const response = await fetch("/api/gpt", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ postText: text }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setGptReply(result.comment);
//       } else {
//         console.error("Failed to generate GPT reply");
//       }
//     } catch (error) {
//       console.error("Error generating GPT reply:", error);
//     }
//   };

//   return (
//     <div>
//       <div
//         className={cn(
//           "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
//           className
//         )}
//       >
//         <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
//           Users Posts
//         </h2>

//         {filteredData.map((channel, i) => (
//           <div
//             key={channel.owner + i}
//             className="mb-4 p-4 border rounded-lg dark:border-gray-700"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <Image
//                 src={channel.image}
//                 className="size-8 rounded-full object-cover"
//                 width={40}
//                 height={40}
//                 alt={channel.owner + " Logo"}
//                 role="presentation"
//                 unoptimized={true}
//               />
//               <div className="text-base font-medium text-dark dark:text-white">
//                 {channel.owner}
//               </div>
//             </div>
//             <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//               {new Date(channel.postDate).toLocaleDateString()}
//             </div>
//             <div className="text-base text-dark dark:text-white mb-2">
//               {channel.text.length > 100 ? (
//                 <>
//                   {channel.text.substring(0, 100)}...
//                   <button
//                     className="text-blue-500 hover:underline ml-2"
//                     onClick={() => handleReadMore(channel.text)}
//                   >
//                     Read More
//                   </button>
//                 </>
//               ) : (
//                 channel.text
//               )}
//             </div>
//             <a
//               href={channel.profile_link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:underline mb-2 block"
//             >
//               View Post For Like & Comment
//             </a>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => handleGptReply(channel.text)}
//             >
//               GPT Reply
//             </button>
//           </div>
//         ))}
//       </div>

//       {(selectedText || gptReply) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded-lg max-w-lg w-full">
//             <h3 className="text-lg font-bold mb-4">Post Text</h3>
//             <p className="mb-4">{selectedText || gptReply}</p>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={handleCloseModal}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client"
// import Image from "next/image"
// import { useEffect, useState } from "react"
// import { cn } from "@/lib/utils"
// import { useSearch } from "@/components/Layouts/header/searchContext"

// interface Channel {
//   owner: string
//   image: string
//   postDate: string
//   text: string
//   profile_link: string
//   isImportant: boolean
// }

// export function TopChannels({ className }: { className?: string }) {
//   const [data, setData] = useState<Channel[]>([])
//   const [selectedText, setSelectedText] = useState<string | null>(null)
//   const [gptReply, setGptReply] = useState<string | null>(null)
//   const { searchTerm } = useSearch()
//   const [month, setMonth] = useState<string>("")
//   const [year, setYear] = useState<string>("")
//   const [currentPage, setCurrentPage] = useState<number>(1)
//   const postsPerPage = 20

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("/api/post")
//         const result = await response.json()
//         if (result.success) {
//           setData(result.data)
//         } else {
//           console.error("Failed to fetch data")
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }
//     }

//     fetchData()
//   }, [])

//   const filteredData = data.filter((channel) => {
//     const postDate = new Date(channel.postDate)
//     const matchesMonth = month ? postDate.getMonth() + 1 === Number.parseInt(month) : true
//     const matchesYear = year ? postDate.getFullYear() === Number.parseInt(year) : true
//     return channel.owner.toLowerCase().includes(searchTerm.toLowerCase()) && matchesMonth && matchesYear
//   })

//   const indexOfLastPost = currentPage * postsPerPage
//   const indexOfFirstPost = indexOfLastPost - postsPerPage
//   const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost)

//   const handleReadMore = (text: string) => {
//     setSelectedText(text)
//   }

//   const handleCloseModal = () => {
//     setSelectedText(null)
//     setGptReply(null)
//   }

//   const handleGptReply = async (text: string) => {
//     try {
//       const response = await fetch("/api/gpt", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ postText: text }),
//       })
//       const result = await response.json()
//       if (response.ok) {
//         setGptReply(result.comment)
//       } else {
//         console.error("Failed to generate GPT reply")
//       }
//     } catch (error) {
//       console.error("Error generating GPT reply:", error)
//     }
//   }

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber)
//   }

//   return (
//     <div>
//       <div
//         className={cn(
//           "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
//           className,
//         )}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Users Posts</h2>
//           <div className="flex gap-2">
//             <select value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded px-2 py-1">
//               <option value="">Month</option>
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {new Date(0, i).toLocaleString("default", { month: "long" })}
//                 </option>
//               ))}
//             </select>
//             <select value={year} onChange={(e) => setYear(e.target.value)} className="border rounded px-2 py-1">
//               <option value="">Year</option>
//               {Array.from({ length: 5 }, (_, i) => (
//                 <option key={i} value={2025 - i}>
//                   {2025 - i}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {currentPosts.map((channel, i) => (
//           <div
//             key={channel.owner + i}
//             className={`mb-4 p-4 border rounded-lg dark:border-gray-700 ${
//               channel.isImportant ? "bg-yellow-50bg-[#020D1A] dark:bg-[#020D1A]" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <Image
//                 src={channel.image || "/placeholder.svg"}
//                 className="size-8 rounded-full object-cover"
//                 width={40}
//                 height={40}
//                 alt={channel.owner + " Logo"}
//                 role="presentation"
//                 unoptimized={true}
//               />
//               <div className="text-base font-medium text-dark dark:text-white">{channel.owner}</div>
//               {channel.isImportant && (
//                 <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-yellow-300">
//                   Important User
//                 </span>
//               )}
//             </div>
//             <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//               {new Date(channel.postDate).toLocaleDateString()}
//             </div>
//             <div className="text-base text-dark dark:text-white mb-2">
//               {channel.text.length > 100 ? (
//                 <>
//                   {channel.text.substring(0, 100)}...
//                   <button className="text-blue-500 hover:underline ml-2" onClick={() => handleReadMore(channel.text)}>
//                     Read More
//                   </button>
//                 </>
//               ) : (
//                 channel.text
//               )}
//             </div>
//             <a
//               href={channel.profile_link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:underline mb-2 block"
//             >
//               View Post For Like & Comment
//             </a>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleGptReply(channel.text)}>
//               GPT Reply
//             </button>
//           </div>
//         ))}

//         <div className="flex justify-center mt-4">
//           {Array.from({ length: Math.ceil(filteredData.length / postsPerPage) }, (_, i) => (
//             <button
//               key={i}
//               className={`px-4 py-2 mx-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//               onClick={() => handlePageChange(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       {(selectedText || gptReply) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded-lg max-w-lg w-full">
//             <h3 className="text-lg font-bold mb-4">Post Text</h3>
//             <p className="mb-4">{selectedText || gptReply}</p>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCloseModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useSearch } from "@/components/Layouts/header/searchContext"
import { Loader2 } from "lucide-react"

interface Channel {
  owner: string
  image: string
  postDate: string
  text: string
  profile_link: string
  isImportant: boolean
}

export function TopChannels({ className }: { className?: string }) {
  const [data, setData] = useState<Channel[]>([])
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [gptReply, setGptReply] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { searchTerm } = useSearch()
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const postsPerPage = 20

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/post")
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        } else {
          console.error("Failed to fetch data")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const filteredData = data.filter((channel) => {
    const postDate = new Date(channel.postDate)
    const matchesMonth = month ? postDate.getMonth() + 1 === Number.parseInt(month) : true
    const matchesYear = year ? postDate.getFullYear() === Number.parseInt(year) : true
    return channel.owner.toLowerCase().includes(searchTerm.toLowerCase()) && matchesMonth && matchesYear
  })

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost)

  const handleReadMore = (text: string) => {
    setSelectedText(text)
  }

  const handleCloseModal = () => {
    setSelectedText(null)
    setGptReply(null)
  }

  const handleGptReply = async (text: string) => {
    setIsLoading(true)
    setGptReply(null)
    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postText: text }),
      })
      const result = await response.json()
      if (response.ok) {
        setGptReply(result.comment)
      } else {
        console.error("Failed to generate GPT reply")
        setGptReply("Failed to generate GPT reply. Please try again.")
      }
    } catch (error) {
      console.error("Error generating GPT reply:", error)
      setGptReply("An error occurred while generating the GPT reply. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Function to format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; 
  };
  

  return (
    <div>
      <div
        className={cn(
          "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className,
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Users Posts</h2>
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Year</option>
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={2025 - i}>
                  {2025 - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentPosts.map((channel, i) => (
          <div
            key={channel.owner + i}
            className={`mb-4 p-4 border rounded-lg dark:border-gray-700 ${
              channel.isImportant ? "bg-yellow-50 dark:bg-[#020D1A]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={channel.image || "/placeholder.svg"}
                className="size-8 rounded-full object-cover"
                width={40}
                height={40}
                alt={channel.owner + " Logo"}
                role="presentation"
                unoptimized={true}
              />
              <div className="text-base font-medium text-dark dark:text-white">{channel.owner}</div>
              {channel.isImportant && (
                <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-yellow-300">
                  Important User
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatDate(channel.postDate)}</div>
            <div className="text-base text-dark dark:text-white mb-2">
              {channel.text.length > 100 ? (
                <>
                  {channel.text.substring(0, 100)}...
                  <button className="text-blue-500 hover:underline ml-2" onClick={() => handleReadMore(channel.text)}>
                    Read More
                  </button>
                </>
              ) : (
                channel.text
              )}
            </div>
            <a
              href={channel.profile_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mb-2 block"
            >
              View Post For Like & Comment
            </a>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleGptReply(channel.text)}>
              GPT Reply
            </button>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredData.length / postsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 mx-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {(selectedText || gptReply || isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">
              {isLoading ? "Generating GPT Reply..." : selectedText ? "Post Text" : "GPT Reply"}
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <p className="mb-4">{selectedText || gptReply}</p>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

