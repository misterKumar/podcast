// components/Profile.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { auth, db } from "../firebase";
import {
  onSnapshot,
  doc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/Header";
import PodcastCard from "../components/PodcastCard";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const q = query(
        collection(db, "podcasts"),
        where("createdBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPodcasts(docsData);
    };
    if (user) {
      fetchDocs();
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <div className="wrapper">
        <h1>Profile</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <PodcastCard title={user.name} displayImage={user.profilePic} />
        </div>
        <h1 style={{ marginBottom: "2rem" }}>My Podcasts</h1>
        <div className="podcast-flex">
          {podcasts.length == 0 ? (
            <p style={{ fontSize: "1.2rem" }}>You Have Zero Podcasts</p>
          ) : (
            <>
              {podcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  displayImage={podcast.displayImage}
                />
              ))}
              {podcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  displayImage={podcast.displayImage}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
