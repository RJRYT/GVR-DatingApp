import React from "react";
import axios from "../../../Instance/Axios";
import { toast } from "react-toastify";

import {
  locations,
  interests,
  hobbies,
  qualifications,
  gender,
  smokingHabits,
  drinkingHabits,
} from "../../../assets/data/Data";
import CustomSelect from "../CustomSelect";

const PreferencesModal = ({ isOpen, onClose, onSave, userPreferences }) => {
  const [preferences, setPreferences] = userPreferences;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("/matches/preferences", preferences);
      toast.success(response.data.message);
      onSave();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response.data.message || "Somthing broken... ! Try again later"
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="matches-model modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Preferences</h2>
        <form>
          <div>
            <label>Age Range:</label>
            <br />
            <input
              type="number"
              name="AgeRange.min"
              style={{ width: "50%" }}
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
              style={{ width: "50%" }}
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
            <CustomSelect
              Name="Location"
              Options={locations}
              Value={preferences.Location}
              OnChange={handleChange}
              Placeholder={"Location"}
              AllowMultiple={false}
            />
          </div>
          <div>
            <label>Education:</label>
            <CustomSelect
              Name="Education"
              Options={qualifications}
              Value={preferences.Education}
              OnChange={handleChange}
              Placeholder={"Education"}
              AllowMultiple={true}
            />
          </div>
          <div>
            <label>Hobbies:</label>
            <CustomSelect
              Name="Hobbies"
              Options={hobbies}
              Value={preferences.Hobbies}
              OnChange={handleChange}
              Placeholder={"Hobbies"}
              AllowMultiple={true}
            />
          </div>
          <div>
            <label>Interests:</label>
            <CustomSelect
              Name="Interests"
              Options={interests}
              Value={preferences.Interests}
              OnChange={handleChange}
              Placeholder={"Interests"}
              AllowMultiple={true}
            />
          </div>
          <div>
            <label>Drinking:</label>
            <CustomSelect
              Name="Drinking"
              Options={drinkingHabits}
              Value={preferences.Drinking}
              OnChange={handleChange}
              Placeholder={"Drinking"}
              AllowMultiple={false}
            />
          </div>
          <div>
            <label>Smoking:</label>
            <CustomSelect
              Name="Smoking"
              Options={smokingHabits}
              Value={preferences.Smoking}
              OnChange={handleChange}
              Placeholder={"Smoking"}
              AllowMultiple={false}
            />
          </div>
          <div>
            <label>Gender:</label>
            <CustomSelect
              Name="Gender"
              Options={gender}
              Value={preferences.Gender}
              OnChange={handleChange}
              Placeholder={"Gender"}
              AllowMultiple={false}
            />
          </div>
          <button type="button" onClick={handleSave}>
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreferencesModal;
