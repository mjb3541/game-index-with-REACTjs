import React, { useState } from 'react';

// First function to fetch game data (games_list) and return game ID
async function fetchGameList(gameName, apiKey) {
  const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('RAWG API Full Response (List):', data); // Log the game list

    // Check if results exist and return the first game's ID
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data.results[0].id; // Return the first game's ID
    } else {
      console.log('No results found for this game.');
      return null; // Return null if no game is found
    }
  } catch (error) {
    console.error('Error fetching game list:', error);
    return null; // Return null on error
  }
}

// Second function to fetch detailed game info (games_read) using game ID
async function fetchGameDetails(gameId, apiKey) {
  const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('RAWG API Full Response (Details):', data); // Log the detailed game data



    return data; // Return the full game details
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null; // Return null on error
  }
}


function App() {
  const apiKey = '573f4010d2c24bfb98f173ee8385cc01';  // Replace with your actual API key
  const MAX_GAME_RATING = 5;
  const [inputValue, setInputValue] = useState(''); // State to hold the input value
  const [gameData, setGameData] = useState(null); // State to store the detailed game data
  const [loading, setLoading] = useState(false); // State to handle loading

  // Handle input change event
  const handleChange = (e) => {
    setInputValue(e.target.value); // Update the state with the current input value
  };

  // Handle form submission or button click to fetch game data
  const handleSubmit = async () => {
    setLoading(true); // Start loading

    // First fetch the game list to get the game ID
    const gameId = await fetchGameList(inputValue, apiKey);

    if (gameId) {
      // Fetch detailed game info using the game ID
      const detailedGameInfo = await fetchGameDetails(gameId, apiKey);
      setGameData(detailedGameInfo); // Set the detailed game data in state
    } else {
      setGameData(null); // No game found
    }

    setLoading(false); // End loading
  };

  return (
    <div className="home app">
      <h1>Enter Game Name</h1>
      <div className="form-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="E.g. minecraft"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {loading && <p>Loading...</p>}

      {gameData && (
        <>
          <p>Game found!</p>
          <hr className="Separator"></hr>

          {gameData.name && (
            <p className="game-name"><strong>{gameData.name}</strong></p>
          )}

          <div className="sticky-wrapper">
            {gameData.background_image && (
              <>
                <img
                  src={gameData.background_image}
                  alt="Game Image"
                  className="game-image"
                />
              </>
            )}

            <div className="centered-game-data">
              <div className="rating">
                {gameData.rating && (
                  <p><strong>Review Score: </strong>{gameData.rating} / {MAX_GAME_RATING} ({gameData.ratings_count}) <strong>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Metacritic Score: </strong>{gameData.metacritic}%</p>
                )}
              </div>

              {gameData.genres.length > 0 && (
                <div className="genres-container">
                  {gameData.genres.map((genre, index) => (
                    <div key={index} className="genre-ellipse">
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="game-info">
              <p><strong>Release date: </strong>{gameData.released}</p>
              <p><strong>Platforms: </strong>{gameData.platforms.map(platform => platform.platform.name).join(', ')}</p>
              <p><strong>Developers: </strong>{gameData.developers.map(dev => dev.name).join(', ')}</p>
              <p><strong>Publishers: </strong>{gameData.publishers.map(publisher => publisher.name).join(', ')}</p>
              <div className="description">
                <p dangerouslySetInnerHTML={{ __html: gameData.description }}></p>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !gameData && <p>No game data available.</p>}
    </div>
  );
}

export default App;