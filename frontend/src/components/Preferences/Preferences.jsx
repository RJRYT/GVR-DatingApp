import React, { useState, useEffect } from "react";
import axios from "../../Instance/Axios";

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    AgeRange: { min: "", max: "" },
    Location: "",
    Interests: [],
    Hobbies: [],
    Education: [],
    Gender: "",
    Smoking: "",
    Drinking: "",
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get("/matches/preferences");
        if (response.data.preferences) {
          setPreferences(response.data.preferences);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/matches/preferences", preferences);
      alert(response.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Age Range:</label>
        <input
          type="number"
          name="AgeRange.min"
          value={preferences.AgeRange.min}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              AgeRange: { ...preferences.AgeRange, min: e.target.value },
            })
          }
          required
        />
        <input
          type="number"
          name="AgeRange.max"
          value={preferences.AgeRange.max}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              AgeRange: { ...preferences.AgeRange, max: e.target.value },
            })
          }
          required
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="Location"
          value={preferences.Location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Interests:</label>
        <input
          type="text"
          name="Interests"
          value={preferences.Interests.join(", ")}
          onChange={(e) => {
            if (e.target.value === "") e.target.value = null;
            setPreferences({
              ...preferences,
              Interests: e.target.value ? e.target.value.split(", ") : [],
            });
          }}
        />
      </div>
      <div>
        <label>Hobbies:</label>
        <input
          type="text"
          name="Hobbies"
          value={preferences.Hobbies.join(", ")}
          onChange={(e) => {
            if (e.target.value === "") e.target.value = null;
            setPreferences({
              ...preferences,
              Hobbies: e.target.value ? e.target.value.split(", ") : [],
            });
          }}
        />
      </div>
      <div>
        <label>Education:</label>
        <input
          type="text"
          name="Education"
          value={preferences.Education.join(", ")}
          onChange={(e) => {
            if (e.target.value === "") e.target.value = null;
            setPreferences({
              ...preferences,
              Education: e.target.value ? e.target.value.split(", ") : [],
            });
          }}
        />
      </div>
      <div>
        <label>Gender:</label>
        <input
          type="text"
          name="Gender"
          value={preferences.Gender}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Smoking:</label>
        <input
          type="text"
          name="Smoking"
          value={preferences.Smoking}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Drinking:</label>
        <input
          type="text"
          name="Drinking"
          value={preferences.Drinking}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Preferences</button>
    </form>
  );
};

export default PreferencesForm;
