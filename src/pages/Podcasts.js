// components/Podcasts.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setPodcasts } from "../slices/podcastSlice";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Header from "../components/Header";
import PodcastCard from "../components/PodcastCard";

function Podcasts() {
  const podcasts = useSelector((state) => state.podcast.podcasts);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.error("Error fetching podcasts:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className="wrapper">
        <h1>Discover Podcasts</h1>
        <div className="podcast-flex">
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              id={podcast.id}
              title={podcast.title}
              displayImage={podcast.displayImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Podcasts;
