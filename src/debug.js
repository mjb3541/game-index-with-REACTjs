// Import the readline module and node-fetch
const readline = require('readline');
const fetch = require('node-fetch'); // Make sure node-fetch is installed

const apiKey = '573f4010d2c24bfb98f173ee8385cc01';  // Replace with your actual API key

// Create an interface for reading data from the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function that returns a Promise to get the game name
function getUrl() {
    return new Promise((resolve) => {
        rl.question('What is the name of the game you want to search for? ', (gameName) => {
            console.log(`You are searching for: ${gameName}`);

            // Build the API URL based on the user's input
            const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`;

            // Resolve the promise with the API URL
            resolve(apiUrl);

            // Close the readline interface
            rl.close();
        });
    });
}

// Function to get specific game based on URL 
async function getGame(apiUrl) {
    try {
        // Fetch info about the game
        const response = await fetch(apiUrl);
        const data = await response.json();

        // If data has results, return the first game
        if (data.results && data.results.length > 0) {
            return data.results[0];
        } else {
            console.log('Game not found');
            return null; // Explicitly return null if no game found
        }
    } catch (error) {
        console.error('Error fetching game data: ', error);
        return null; // Return null in case of error
    }
}

// Function to print game data
function printGameData(game) {
    if (game) {
        console.log(`Game Name: ${game.name}`);
        console.log(`Released: ${game.released}`);
        console.log(`Rating: ${game.rating}`);
        console.log(`Genres: ${game.genres.map(genre => genre.name).join(', ')}`);
        console.log(`Platforms: ${game.platforms.map(platform => platform.platform.name).join(', ')}`);
    } else {
        console.log('No game data available.'); // Correct error message
    }
}

// Usage of the getUrl() function with async/await
async function main() {
    // Get and print URL based on input
    const apiUrl = await getUrl();
    // Get game based on URL
    const game = await getGame(apiUrl);
    console.log(`API URL: ${apiUrl}`);

    // Print game data (handle null case inside the function)
    printGameData(game);
}

main();
