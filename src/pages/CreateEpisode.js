// components/CreateEpisode.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";
import InputComponent from "../components/Input";
import FileInput from "../components/Input/FileInput";
import Button from "../components/Button";
import { toast } from "react-toastify";

function CreateEpisode() {
  const { podcastId } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const podcastDoc = await getDoc(doc(db, "podcasts", podcastId));
        if (podcastDoc.exists()) {
          setPodcast({ id: podcastDoc.id, ...podcastDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching podcast:", error);
      }
    };

    fetchPodcast();
  }, [podcastId]);

  const handleSubmit = async (e) => {
    try {
      const audioRef = ref(
        storage,
        `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(audioRef, audioFile);

      const audioURL = await getDownloadURL(audioRef);
      const episodeData = {
        title,
        description,
        audioFile: audioURL,
      };

      await addDoc(
        collection(db, "podcasts", podcastId, "episodes"),
        episodeData
      );

      navigate(`/podcast/${podcastId}`);
      setTitle("");
      setDescription("");
      setAudioFile(null);
      toast.success("Episode Created Successful!");
    } catch (error) {
      console.error("Error creating episode:", error);
      toast.error("Error creating episode:", error);
    }
  };

  const handleAudioChange = (file) => {
    setAudioFile(file);
  };

  if (!podcast) {
    return <div>Loading...</div>;
  }

  if (auth.currentUser.uid !== podcast.createdBy) {
    return (
      <div>You do not have permission to create episodes for this podcast.</div>
    );
  }

  return (
    <div>
      <Header />
      <div className="wrapper">
        <h1>Create Episode for {podcast.title}</h1>
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
            id="audio-file"
            onFileSelected={handleAudioChange}
            accept={".mp3"}
            text={"Add Audio File"}
          />
          <Button text={"Create Episode"} onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}

export default CreateEpisode;
