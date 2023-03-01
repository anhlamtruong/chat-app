import { ChangeEvent, useState } from "react";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Loader from "./Loader";
import { async } from "@firebase/util";
type props = {
  show: Boolean;
};
interface FormInputs {
  file: File | null;
}
let defaultDownloadURL: string | null;

export default function ImageUploader({}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(defaultDownloadURL);
  // Creates a Firebase Upload Task
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file = Array.from(event.target.files as FileList)[0];
    const extension = file?.type.split("/")[1];

    //Makes reference to the storage bucket location
    const storageRef = ref(
      storage,
      `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Listen to updates to upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle state changes here
        const progressPCT = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log(`Upload is ${progressPCT}% done`);
      },
      (error) => {
        // Handle error here
        console.error(error);
      },
      async () => {
        // Handle successful upload here
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(downloadURL);
        console.log(`File available at ${downloadURL}`);
        setUploading(false);
      }
    );
  };
  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <>
          <label className="btn" htmlFor="file-input">
            📸 Upload Img
            <input
              type="file"
              id="file-input"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            ></input>
          </label>
        </>
      )}
      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
