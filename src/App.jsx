import { useEffect, useState } from "react";

const REGIONS = ["all", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      if (query.trim() === "" && region === "all") {
        setCountries([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let url = "";

        if (query.trim() !== "") {
          url = `https://restcountries.com/v3.1/name/${query}`;
        } else if (region !== "all") {
          url = `https://restcountries.com/v3.1/region/${region}`;
        }

        const res = await fetch(url);

        if (!res.ok) {
          setCountries([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch countries");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [query, region]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      setQuery(search);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setQuery("");
    setRegion("all");
    setCountries([]);
    setError(null);
  };


  return (
    <div className="p-3">
      <h1 className="text-center m-4">Countries Explorer</h1>

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-8 mb-2">
          <input
            className="form-control"
            type="text"
            placeholder="Type country and press Enter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <button
            className="btn border bg-color w-100"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div>

        {loading && (
          <div className="text-center">
            <div className="spinner-grow text-color m-1" />
            <div className="spinner-grow text-color m-1" />
            <div className="spinner-grow text-color m-1" />
            <div className="spinner-grow text-color m-1" />
            <div className="spinner-grow text-color m-1" />
          </div>
        )}

        {error && (
          <div className="text-center text-danger">
            <p>{error}</p>
            <button className="btn border bg-color" onClick={clearFilters}>
              Retry
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          countries.length === 0 &&
          query.trim() !== "" && (
            <div className="text-center">
              <h4>No results found</h4>
              <button
                className="btn border bg-color mt-2"
                onClick={clearFilters}
              >
                Retry
              </button>
            </div>
          )}

        {!loading && !error && countries.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "15px",
            }}
          >
            {countries.map((country) => (
              <div
                key={country.cca3}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={country.flags?.png}
                  alt={country.name?.common}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <h3>{country.name?.common}</h3>
                <p>Region: {country.region}</p>
                <p>
                  Population:{" "}
                  {country.population?.toLocaleString() || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
