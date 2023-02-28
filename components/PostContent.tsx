import Link from "next/link";
import { PostItem } from "@/store/posts/post.types";
import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
export type PostPage = {
  post: PostItem;
};
// import ReactMarkdown from 'react-markdown';
// UI component for main post content
const PostContent: NextPage<PostPage> = ({ post }) => {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`} className="text-info">
          @{post.username}
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
};
export default PostContent;
