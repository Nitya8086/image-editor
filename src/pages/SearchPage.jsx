import { useState } from "react";
import { fetchImages } from "../services/api";
import ImageCard from "../components/ImageCard";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setHasSearched(true); 
    const results = await fetchImages(query);
    setImages(results);
    setLoading(false);
};

  return (
    <div className="search-container">
      <div className="userDetails">
        <p>Name:Nitya Patel</p>
        <p>Email:Nitya@gmail.com</p>
      </div>
      <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
      <h1 className="title">Search Page</h1>
        <div className="search-box">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search term"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            🔍
          </button>
        </div>
      </div>


      <div className="image-grid">
    {loading ? (
        Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="image-item skeleton" />
        ))
    ) : images.length === 0 && hasSearched ? (
        <div className="no-results-card">
            <h2>No Results Found</h2>
            <p>Try a different search term.</p>
        </div>
    ) : (
        images.map((img) => (
            <div key={img.id} className="image-item">
                <img src={img.src.large} alt="search result" className="image" />
                <button
                    className="add-caption-btn"
                    onClick={() =>
                        navigate(`/edit/${img.id}`, {
                            state: { imageUrl: img.src.large },
                        })
                    }
                >
                    Add Caption
                </button>
            </div>
        ))
    )}
</div>



    </div>
  );
};

export default SearchPage;
