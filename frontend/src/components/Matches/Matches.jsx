import React, { useState, useEffect } from "react";
import axios from "../../Instance/Axios";
import "./Matches.css";
import Preferences from "./Preferences/Preferences";

import {
  gender,
  smokingHabits,
  drinkingHabits,
  interests,
  hobbies,
  qualifications,
} from "../../assets/data/Data";
import CustomSelect from "./CustomSelect";

const MatchingPage = () => {
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
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [matchesPerPage] = useState(12); // Matches per page
  const [isPreferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isSortModalOpen, setSortModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    Gender: "",
    Smoking: "",
    Drinking: "",
    Interests: [],
    Hobbies: [],
    Education: [],
  });
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/matches/me", {
        params: { page: currentPage, limit: matchesPerPage },
      });
      setMatches(response.data.matches);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMatches();
  }, [currentPage]);

  const applyFilterAndSort = () => {
    let filteredMatches = [...matches];

    // Apply filters
    if (filter.Gender) {
      filteredMatches = filteredMatches.filter(
        (match) => match.gender === filter.Gender
      );
    }
    if (filter.Smoking) {
      filteredMatches = filteredMatches.filter(
        (match) => match.smokingHabits === filter.Smoking
      );
    }
    if (filter.Drinking) {
      filteredMatches = filteredMatches.filter(
        (match) => match.drinkingHabits === filter.Drinking
      );
    }
    /*
    Have a plan to add filter strict mode.
    - when strict mode is on, provide exact matches according to filter(we use array.every)
    - when strict mode is off, provide non-exact(we use array.some)
    */
    if (filter.Interests.length) {
      filteredMatches = filteredMatches.filter((match) =>
        filter.Interests.every((ints) =>
          match.interests.map((ints2) => ints2.value).includes(ints)
        )
      );
    }
    if (filter.Hobbies.length) {
      filteredMatches = filteredMatches.filter((match) =>
        filter.Hobbies.every((hby) =>
          match.hobbies.map((hby2) => hby2.value).includes(hby)
        )
      );
    }
    if (filter.Education.length) {
      filteredMatches = filteredMatches.filter((match) =>
        filter.Education.every((edct) =>
          match.qualification.map((edct2) => edct2.value).includes(edct)
        )
      );
    }

    // Apply sorting
    if (sort) {
      filteredMatches.sort((a, b) => {
        if (sort === "ageAsc") {
          return a.age - b.age;
        } else if (sort === "ageDesc") {
          return b.age - a.age;
        }
        return 0;
      });
    }

    return filteredMatches;
  };

  const handlePreferencesSave = () => {
    setPreferencesModalOpen(false);
    setCurrentPage(1);
    fetchMatches();
  };

  const handlePageChange = (pageNumber) => {
    window.scroll({ top: 250, behavior: "smooth" });
    setCurrentPage(pageNumber);
  };

  const filteredAndSortedMatches = applyFilterAndSort();

  return (
    <div className="matching-container page-container">
      <div className="page-header">
        <h1 className="text-dark text-center">Matching Dashboard</h1>
        <div className="header-buttons">
          <i
            className="fa fa-sliders"
            onClick={() => setPreferencesModalOpen(true)}
          ></i>
          <i
            className="fa fa-filter"
            onClick={() => setFilterModalOpen(true)}
          ></i>
          <i className="fa fa-sort" onClick={() => setSortModalOpen(true)}></i>
        </div>
      </div>
      {loading ? (
        <div className="matches-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="match-item skeleton">
              <div className="skeleton-bg">
                <div className="skeleton-overlay">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-line"></div>
                  <div className="skeleton-text skeleton-line"></div>
                  <div className="skeleton-text skeleton-line"></div>
                  <div className="skeleton-text skeleton-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedMatches.length ? (
        <div className="matches-grid">
          {filteredAndSortedMatches.map((match, key) => (
            <div
              key={key}
              className="match-item"
              title={`Profile of ${match.username}`}
            >
              <div
                className="match-bg"
                style={{ backgroundImage: `url(${match.profilePic[0].url})` }}
              >
                <div className="match-overlay">
                  <h3 title={`Name: ${match.username}, Age: ${match.age}`}>
                    {match.username}, {match.age}
                  </h3>
                  <p title={`Location: ${match.location}`}>{match.location}</p>
                  <hr />
                  <p title="Education">
                    <strong>Education:</strong>{" "}
                    {match.qualification.map((qual, index) => (
                      <span
                        key={index}
                        title={`Education: ${qual.label}`}
                        className="badge"
                      >
                        {qual.label}
                      </span>
                    ))}
                  </p>
                  <p title="Hobbies">
                    <strong>Hobbies:</strong>{" "}
                    {match.hobbies.map((hby, index) => (
                      <span
                        key={index}
                        title={`Hobbies: ${hby.label}`}
                        className="badge"
                      >
                        {hby.label}
                      </span>
                    ))}
                  </p>
                  <p title="Interests">
                    <strong>Interests:</strong>{" "}
                    {match.interests.map((intr, index) => (
                      <span
                        key={index}
                        title={`Interests: ${intr.label}`}
                        className="badge"
                      >
                        {intr.label}
                      </span>
                    ))}
                  </p>
                  <p title={`Drinking: ${match.drinkingHabits}`}>
                    <strong>Drinking:</strong>{" "}
                    <span className="badge">
                      {drinkingHabits.find(
                        (hbit) => hbit.value === match.drinkingHabits
                      ).label || match.drinkingHabits}
                    </span>
                  </p>
                  <p title={`Smoking: ${match.smokingHabits}`}>
                    <strong>Smoking:</strong>{" "}
                    <span className="badge">
                      {smokingHabits.find(
                        (smk) => smk.value === match.smokingHabits
                      ).label || match.smokingHabits}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-dark text-center">
            No matches found...! Update your preferences or filters to view
          </h3>
        </div>
      )}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
            disabled={currentPage === number + 1}
          >
            {number + 1}
          </button>
        ))}
      </div>
      {isPreferencesModalOpen && (
        <Preferences
          isOpen={isPreferencesModalOpen}
          onClose={() => setPreferencesModalOpen(false)}
          onSave={handlePreferencesSave}
          userPreferences={[preferences, setPreferences]}
        />
      )}
      {isFilterModalOpen && (
        <div className="matches-model modal">
          <div className="modal-content">
            <span className="close" onClick={() => setFilterModalOpen(false)}>
              &times;
            </span>
            <h2>Filter</h2>
            <form>
              <div>
                <label>Filter by Education:</label>
                <CustomSelect
                  Name="Education"
                  Options={qualifications}
                  Value={filter.Education}
                  OnChange={(e) =>
                    setFilter({ ...filter, Education: e.target.value })
                  }
                  Placeholder={"Education"}
                  AllowMultiple={true}
                />
              </div>
              <div>
                <label>Filter by Hobbies:</label>
                <CustomSelect
                  Name="Hobbies"
                  Options={hobbies}
                  Value={filter.Hobbies}
                  OnChange={(e) =>
                    setFilter({ ...filter, Hobbies: e.target.value })
                  }
                  Placeholder={"Hobbies"}
                  AllowMultiple={true}
                />
              </div>
              <div>
                <label>Filter by Interests:</label>
                <CustomSelect
                  Name="Interests"
                  Options={interests}
                  Value={filter.Interests}
                  OnChange={(e) =>
                    setFilter({ ...filter, Interests: e.target.value })
                  }
                  Placeholder={"Interests"}
                  AllowMultiple={true}
                />
              </div>
              {!preferences.Drinking && (
                <div>
                  <label>Filter by Drinking Habits:</label>
                  <CustomSelect
                    Name="Drinking"
                    Options={drinkingHabits}
                    Value={filter.Drinking}
                    OnChange={(e) =>
                      setFilter({ ...filter, Drinking: e.target.value })
                    }
                    Placeholder={"Drinking habits"}
                    AllowMultiple={false}
                  />
                </div>
              )}
              {!preferences.Smoking && (
                <div>
                  <label>Filter by Smoking Habits:</label>
                  <CustomSelect
                    Name="Smoking"
                    Options={smokingHabits}
                    Value={filter.Smoking}
                    OnChange={(e) =>
                      setFilter({ ...filter, Smoking: e.target.value })
                    }
                    Placeholder={"Smoking habits"}
                    AllowMultiple={false}
                  />
                </div>
              )}
              {!preferences.Gender && (
                <div>
                  <label>Filter by Gender:</label>
                  <CustomSelect
                    Name="Gender"
                    Options={gender}
                    Value={filter.Gender}
                    OnChange={(e) =>
                      setFilter({ ...filter, Gender: e.target.value })
                    }
                    Placeholder={"Gender"}
                    AllowMultiple={false}
                  />
                </div>
              )}
              <button type="button" onClick={() => setFilterModalOpen(false)}>
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
      {isSortModalOpen && (
        <div className="matches-model modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSortModalOpen(false)}>
              &times;
            </span>
            <h2>Sort</h2>
            <form>
              <div>
                <label>Sort by Age:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">None</option>
                  <option value="ageAsc">Ascending</option>
                  <option value="ageDesc">Descending</option>
                </select>
              </div>
              <button type="button" onClick={() => setSortModalOpen(false)}>
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingPage;
