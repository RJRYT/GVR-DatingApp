import React, { useState, useEffect } from "react";
import axios from "../../Instance/Axios";
import "./Matches.css";
import Preferences from "../Preferences/Preferences";

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(10); // Change this value to set the number of matches per page
  const [isPreferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [isFilterSortModalOpen, setFilterSortModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const fetchMatches = async () => {
    try {
      const response = await axios.get("/matches/me");
      setMatches(response.data.matches);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchMatches();
  }, []);

  const applyFilterAndSort = () => {
    let filteredMatches = [...matches];

    if (filter) {
      filteredMatches = filteredMatches.filter(
        (match) => match.gender === filter
      );
    }

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

  const paginatedMatches = applyFilterAndSort().slice(
    (currentPage - 1) * matchesPerPage,
    currentPage * matchesPerPage
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(applyFilterAndSort().length / matchesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="matching-container page-container">
      <div className="page-header">
        <h1>Matching Dashboard</h1>
        <div>
          <button onClick={() => setPreferencesModalOpen(true)}>
            Set Preferences
          </button>
          <button onClick={() => setFilterSortModalOpen(true)}>
            Filter & Sort
          </button>
        </div>
      </div>
      <div className="matches-list">
        {paginatedMatches.map((match) => (
          <div key={match._id} className="match-item">
            <img src={match.profilePic[0].url} alt={match.username} />
            <p>
              {match.username}, {match.age}
            </p>
            <p>{match.location}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
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
      {isFilterSortModalOpen && (
        <div className="matches-model modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setFilterSortModalOpen(false)}
            >
              &times;
            </span>
            <h2>Filter & Sort</h2>
            <form>
              <div>
                <label>Filter by Gender:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label>Sort by Age:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">None</option>
                  <option value="ageAsc">Ascending</option>
                  <option value="ageDesc">Descending</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setFilterSortModalOpen(false)}
              >
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
