import React, { useState, useEffect } from 'react';
import axios from "../../Instance/Axios";

const MatchingList = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/matches/me?page=${currentPage}`);
        setMatches(res.data.matches);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Matching List</h1>
      <ul>
        {matches.map(match => (
          <li key={match._id}>
            <h2>{match.username}</h2>
            <p>Age: {match.age}</p>
            <p>Interests: {match.interests.map(interest => interest.label).join(', ')}</p>
            <p>Location: {match.location}</p>
          </li>
        ))}
      </ul>
      <div>
        {[...Array(totalPages).keys()].map(num => (
          <button
            key={num + 1}
            onClick={() => handlePageChange(num + 1)}
            disabled={currentPage === num + 1}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MatchingList;
