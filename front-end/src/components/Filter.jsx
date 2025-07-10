import React, { useEffect, useState } from "react";
import "../css/Filter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import FullScreenLoader from "./FullscreenLoader";

function Filter({ onFilterChange, setFilterLoading, setCityRefreshTrigger }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    setLoadingCities(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations/cities`)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.data);
      })
      .catch((err) => {
        console.error("Failed to load cities:", err);
        setLocations([]);
      })
      .finally(() => setLoadingCities(false));
  }, []);

  const handleSearch = async () => {
    setFilterLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (location) params.append("location", location);
      if (date) params.append("date", date);

      const response = await fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/events/search?${params.toString()}`
      );

      if (response.status === 404) {
        onFilterChange([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      onFilterChange(data.data.length ? data.data : []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  if (loadingCities) {
    return <FullScreenLoader />;
  }

  return (
    <div className="filter">
      <div className="searchbar">
        <div className="bgcolor">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find Events That You Love"
          />
          <button onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className="date-loc">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filter;
