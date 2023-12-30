import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

function PodcastCard({ displayImage, title, id }) {
  return (
    <Link to={`/podcast/${id}`}>
      <div className="card">
        <img className="image" src={displayImage} />
        <div className="info">
          <p>{title}</p>
          <FaPlay />
        </div>
      </div>
    </Link>
  );
}

export default PodcastCard;
