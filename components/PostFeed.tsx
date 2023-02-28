import { PostItem } from "@/store/posts/post.types";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { NextPage } from "next";
export type UserProfilePage = {
  post: PostItem;
  admin: boolean;
};

export type PostItemType = {
  post: PostItem;
  admin: boolean;
};

const PostFeed: NextPage<UserProfilePage> = ({ post, admin, ...other }) => {
  return (
    <>
      {post ? (
        <PostItem post={post} key={post.slug} admin={admin} />
      ) : (
        <div>Nothing</div>
      )}
    </>
  );
};
export default PostFeed;

const PostItem: NextPage<PostItemType> = ({ post, admin, ...other }) => {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <>
      <div className="card">
        <Link href={`/${post.username}/${post.slug}`}>
          <strong>{`  ${post.title}`}</strong>
        </Link>
        <Link href={`/${post.username}`}>
          <strong> By @{post.username}</strong>
        </Link>
      </div>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>
      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </>
  );
};
