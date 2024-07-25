import React, { useState } from "react";
import { getWordDefinition } from "./api";
import "./App.css";

// Helper function to strip {wi} tags
const stripTags = (text) => {
  return text.replace(/{wi}|{\/wi}/g, "");
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const App = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setDefinition(null);

    try {
      if (word) {
        const result = await getWordDefinition(word);
        if (result && result.length > 0) {
          const entry = result[0];
          if (entry.shortdef) {
            setDefinition(entry);
          } else {
            setError("No definition found.");
          }
        } else {
          setError("No definition found.");
        }
      }
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const renderExampleUsage = (entry) => {
    if (!entry.def) return null;

    const examples = [];

    entry.def.forEach((defItem) => {
      defItem.sseq.forEach((sseqItem) => {
        const sense = sseqItem[0][1];
        if (sense.dt) {
          sense.dt.forEach((dtItem) => {
            if (dtItem[0] === "vis") {
              dtItem[1].forEach((example, index) => {
                examples.push(<li key={index}>{stripTags(example.t)}</li>);
              });
            }
          });
        }
      });
    });

    return examples.length > 0 ? (
      examples
    ) : (
      <li>No example usage available.</li>
    );
  };

  return (
    <div className="App">
      <h1>Dictionary App</h1>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
      {error && <p className="error">{error}</p>}
      {definition && (
        <div>
          <h2>Definition of {word}:</h2>
          <p>
            {definition.shortdef.map((def, index) => (
              <span key={index}>
                {capitalizeFirstLetter(def)}
                {index < definition.shortdef.length - 1 ? "; " : ""}
              </span>
            ))}
          </p>
          <div>
            <h3>Example Usage:</h3>
            <ul>{renderExampleUsage(definition)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
