// components/CreatePodcast.js
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InputComponent from "../components/Input";
import FileInput from "../components/Input/FileInput";
import Button from "../components/Button";
import { toast } from "react-toastify";

export default function CreatePodcast() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bannerImageRef = ref(
        storage,
        `podcasts/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(bannerImageRef, bannerImage);

      const bannerImageUrl = await getDownloadURL(bannerImageRef);

      const displayImageRef = ref(
        storage,
        `podcasts/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(displayImageRef, displayImage);

      const displayImageURL = await getDownloadURL(displayImageRef);

      const podcastData = {
        title,
        description,
        bannerImage: bannerImageUrl,
        displayImage: displayImageURL,
        createdBy: auth.currentUser.uid,
      };

      const docRef = await addDoc(collection(db, "podcasts"), podcastData);

      // Redirect to the podcast details page
      navigate(`/podcast/${docRef.id}`);
      setTitle("");
      setDescription("");
      setBannerImage(null);
      setDisplayImage(null);
      toast.success("Podcast Created Successful!");
    } catch (error) {
      console.error("Error creating podcast:", error);
      toast.error("Error creating podcast:", error);
    }
  };

  const handleImageChange = (file) => {
    setDisplayImage(file);
  };

  const handleBannerImageChange = (file) => {
    setBannerImage(file);
  };

  return (
    <div>
      <Header />
      <div className="wrapper">
        <h1>Create Podcast</h1>
        <form>
          <InputComponent
            type="text"
            placeholder="Title"
            state={title}
            setState={setTitle}
          />
          <InputComponent
            type="text"
            placeholder="Description"
            state={description}
            setState={setDescription}
          />
          <FileInput
            id="display-image"
            onFileSelected={handleImageChange}
            accept={"image/*"}
            text={"Upload Display Image"}
          />
          <FileInput
            id="banner-image"
            onFileSelected={handleBannerImageChange}
            accept={"image/*"}
            text={"Upload Banner Image"}
          />
          <Button text="Create Podcast" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}
