import MetaTags from "@/components/Metatags";
import {
  DocumentData,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import styles from "@/styles/Admin.module.css";
import toast from "react-hot-toast";
import { updatePostFormAdmin } from "@/lib/firebase";
import ImageUploader from "./ImageUpLoader";
interface PostFormProps {
  postRef: DocumentReference<DocumentData>;
  defaultValues: DocumentData;
  preview: boolean;
}
interface FormData {
  content: string;
  published: boolean;
  errors?: {
    [key: string]: string;
  };
}
const PostForm: NextPage<PostFormProps> = (props: PostFormProps) => {
  const { postRef, preview, defaultValues } = props;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    mode: "onChange",
  });
  //! ADDING CSS TO THE FORM
  const { isValid, isDirty } = formState;
  const updatePost: SubmitHandler<FormData> = async ({
    content,
    published,
  }) => {
    await updatePostFormAdmin(postRef, content, published);
    reset({ content, published });
    toast.success("Post updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "Content is Too Long" },
            minLength: { value: 10, message: "Content is Too Short" },
            required: { value: true, message: "Content is required" },
          })}
          placeholder="Your Content"
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          ></input>
          <label>Published</label>
        </fieldset>
        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
export default PostForm;
