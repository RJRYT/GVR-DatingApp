import React, { useState, useEffect } from "react";
import axios from "../../Instance/Axios";
import "./Matches.css";
import Preferences from "./Preferences/Preferences";

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [matchesPerPage] = useState(10); // Matches per page
  const [isPreferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isSortModalOpen, setSortModalOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState("");

  const fetchMatches = async () => {
    try {
      const response = await axios.get("/matches/me", {
        params: { page: currentPage, limit: matchesPerPage },
      });
      setMatches(response.data.matches);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchMatches();
  }, [currentPage]);

  const applyFilterAndSort = () => {
    let filteredMatches = [...matches];

    // Apply filters
    if (filter.gender) {
      filteredMatches = filteredMatches.filter(
        (match) => match.gender === filter.gender
      );
    }
    if (filter.smoking) {
      filteredMatches = filteredMatches.filter(
        (match) => match.smokingHabits === filter.smoking
      );
    }
    if (filter.drinking) {
      filteredMatches = filteredMatches.filter(
        (match) => match.drinkingHabits === filter.drinking
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
    fetchMatches();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredAndSortedMatches = applyFilterAndSort();

  return (
    <div className="matching-container page-container">
      <div className="page-header">
        <h1>Matching Dashboard</h1>
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
      <div className="matches-list">
        {filteredAndSortedMatches.map((match, key) => (
          <div key={key} className="match-item">
            <img src={match.profilePic[0].url} alt={match.username} />
            <p>
              {match.username}, {match.age}
            </p>
            <p>{match.location}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
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
                <label>Filter by Gender:</label>
                <select
                  value={filter.gender}
                  onChange={(e) =>
                    setFilter({ ...filter, gender: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label>Filter by Smoking Habits:</label>
                <select
                  value={filter.smoking}
                  onChange={(e) =>
                    setFilter({ ...filter, smoking: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label>Filter by Drinking Habits:</label>
                <select
                  value={filter.drinking}
                  onChange={(e) =>
                    setFilter({ ...filter, drinking: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
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