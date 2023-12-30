// components/PodcastDetails.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, onSnapshot } from "firebase/firestore";
import AudioPlayer from "../components/AudioPlayer";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import { FaPlay } from "react-icons/fa";
function PodcastDetails() {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [playingAudio, setPlayingAudio] = useState("");

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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", podcastId, "episodes")),
      (querySnapshot) => {
        const episodesData = [];
        querySnapshot.forEach((doc) => {
          episodesData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodesData);
      },
      (error) => {
        console.error("Error fetching episodes:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [podcastId]);

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="wrapper" style={{ marginTop: "0rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ textAlign: "left", marginBottom: "1rem" }}>
            {podcast.title}
          </h1>
          {podcast.createdBy == user.uid && (
            <Link to={`/podcast/${podcastId}/create-episode`}>
              <h1
                style={{
                  marginBottom: "1rem",
                  textAlign: "right",
                  color: "var(--white)",
                  border: "1px solid var(--white)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "1.2rem",
                }}
              >
                Create Episode
              </h1>
            </Link>
          )}
        </div>
        <div className="podcastBannerDiv">
          <img src={podcast.bannerImage} alt={podcast.title} />
        </div>

        <p>{podcast.description}</p>
        <h1 style={{ textAlign: "left", marginBottom: 0 }}>Episodes:</h1>
        {episodes.length > 0 ? (
          <ol style={{ marginTop: "1.5rem", paddingBottom: "4rem" }}>
            {episodes.map((episode) => (
              <li key={episode.id}>
                <p style={{ color: "var(--white)", textAlign: "left" }}>
                  {episode.title}
                </p>
                <p>{episode.description}</p>
                <p
                  onClick={() => {
                    setPlayingAudio(episode.audioFile);
                  }}
                  style={{
                    color: "var(--white)",
                    border: "1px solid var(--white)",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Play <FaPlay style={{ fontSize: "0.8rem" }} />
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p>This podcast currently have 0 episodes</p>
        )}

        {playingAudio && (
          <AudioPlayer audioSrc={playingAudio} image={podcast.displayImage} />
        )}
      </div>
    </div>
  );
}

export default PodcastDetails;
