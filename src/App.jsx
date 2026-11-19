
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        setCountries(data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        ));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase()) &&
    (region === "All" || country.region === region)
  );

  return (
    <div className="app">
      <header>
        <h1>🌍 World Explorer</h1>
        <p>Discover countries around the world</p>
      </header>

      <section className="controls">
        <input
          placeholder="Search a country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option>All</option>
          <option>Africa</option>
          <option>Americas</option>
          <option>Asia</option>
          <option>Europe</option>
          <option>Oceania</option>
        </select>
      </section>

      {loading ? (
        <h2>Loading countries...</h2>
      ) : selected ? (
        <div className="details">
          <button onClick={() => setSelected(null)}>← Back</button>
          <h1>{selected.flag} {selected.name.common}</h1>
          <p><b>Capital:</b> {selected.capital?.join(", ") || "N/A"}</p>
          <p><b>Region:</b> {selected.region || "N/A"}</p>
          <p><b>Country Code:</b> {selected.cca2}</p>
          <p><b>Currency:</b> {Object.values(selected.currencies || {}).map(c => c.name).join(", ") || "N/A"}</p>
          <p><b>Languages:</b></p>

<p>
  {selected.name.common === "India"
    ? "Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kashmiri, Kannada, Konkani, Maithili, Malayalam, Meitei, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu"
    : Object.values(selected.languages || {}).join(", ") || "N/A"}
</p>
        </div>
      ) : (
        <>
          <h2 className="count">Countries Found: {filtered.length}</h2>

          <div className="grid">
            {filtered.map(country => (
              <div className="card" key={country.cca3}>
                <h1>{country.flag}</h1>
                <h3>{country.name.common}</h3>
                <p>Capital: {country.capital?.[0] || "N/A"}</p>
                <p>Region: {country.region || "N/A"}</p>
                <button onClick={() => setSelected(country)}>
                  View Details
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && <h2>No countries found!</h2>}
        </>
      )}
    </div>
  );
}

export default App;
