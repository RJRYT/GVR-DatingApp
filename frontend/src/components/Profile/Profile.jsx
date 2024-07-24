import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AccessDenied from "../AccessDenied/AccessDenied";
import axios from "../../Instance/Axios";
import "./Profile.css";

const Profile = () => {
  const { authState, loading } = useContext(AuthContext);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId === "@me") {
          setUser(authState.user);
        } else {
          const response = await axios.get(`/users/profile/${userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setApiLoading(false);
      }
    };

    if (!loading && authState.isAuthenticated) fetchUserProfile();
  }, [userId, authState, loading]);

  if (!loading && !authState.isAuthenticated) return <AccessDenied />;

  if (loading || apiLoading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="skeleton skeleton-profile-photo"></div>
          <div className="skeleton skeleton-text skeleton-username"></div>
          <div className="skeleton skeleton-text skeleton-age-location"></div>
        </div>
        <div className="profile-gallery">
          <div className="skeleton skeleton-gallery-photo"></div>
          <div className="skeleton skeleton-gallery-photo"></div>
          <div className="skeleton skeleton-gallery-photo"></div>
          <div className="skeleton skeleton-gallery-photo"></div>
          <div className="skeleton skeleton-gallery-video"></div>
        </div>
        <div className="profile-details">
          <div className="skeleton skeleton-text skeleton-detail"></div>
          <div className="skeleton skeleton-text skeleton-detail"></div>
          <div className="badges-container">
            <div className="skeleton skeleton-badge"></div>
            <div className="skeleton skeleton-badge"></div>
            <div className="skeleton skeleton-badge"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profilePic[0]?.url}
          alt="Profile"
          className="profile-photo"
        />
        <h2>{user.username}</h2>
        <p>Age: {user.age}</p>
        <p>Location: {user.location}</p>
      </div>
      <div className="profile-gallery">
        {user.profilePic.map((pic, index) => (
          <img
            key={index}
            src={pic.url}
            alt="Profile"
            className="profile-pic"
          />
        ))}
        {user.shortReel && (
          <video controls className="short-reel">
            <source src={user.shortReel.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="profile-details">
        <p>Gender: {user.gender}</p>
        <p>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</p>
        <div className="badges-container">
          <div className="badges">
            <h3>Hobbies:</h3>
            {user.hobbies.map((hobby, index) => (
              <span key={index} className="badge">
                {hobby.label}
              </span>
            ))}
          </div>
          <div className="badges">
            <h3>Interests:</h3>
            {user.interests.map((interest, index) => (
              <span key={index} className="badge">
                {interest.label}
              </span>
            ))}
          </div>
          <div className="badges">
            <h3>Qualification:</h3>
            {user.qualification.map((qual, index) => (
              <span key={index} className="badge">
                {qual.label}
              </span>
            ))}
          </div>
        </div>
        <p>Smoking Habits: {user.smokingHabits}</p>
        <p>Drinking Habits: {user.drinkingHabits}</p>
      </div>
    </div>
  );
};

export default Profile;
