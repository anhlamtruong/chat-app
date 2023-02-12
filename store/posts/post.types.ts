import { Timestamp } from "firebase/firestore";

export enum POSTS_ACTION_TYPES {
  FETCH_POSTS_START = "post/FETCH_POSTS_START",
  FETCH_POSTS_SUCCESS = "post/FETCH_POSTS_SUCCESS",
  FETCH_POSTS_FAILED = "post/FETCH_POSTS_FAILED",
}

export type PostItem = {
  content: string;
  createdAt: Timestamp;
  heartCount: number;
  published: false;
  slug: string;
  title: string;
  uid: string;
  updatedAt: Timestamp;
  username: string;
};

export type Posts = {
  posts: PostItem[];
};
