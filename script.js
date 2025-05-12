document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const albumTitleElement = document.getElementById('album-title');
  const artistGuessInput = document.getElementById('artist-guess');
  const submitGuessButton = document.getElementById('submit-guess');
  const feedbackElement = document.getElementById('feedback');
  const scoreElement = document.getElementById('score');
  const gameArea = document.getElementById('game-area');
  const winMessage = document.getElementById('win-message');
  const finalScoreElement = document.getElementById('final-score');
  const spotifyLinkElement = document.getElementById('spotify-link');
  const refreshButton = document.getElementById('refresh-button'); // Button to play again after game end
  const refreshAlbumButton = document.getElementById('refresh-album-button'); // Button to skip/refresh current album

  // Data: Array of objects with album and artist
  const albums = [
      { album: "I Like It When You Sleep, for You Are So Beautiful yet So Unaware of It", artist: "The 1975" },
      { album: "Death of a Bachelor", artist: "Panic at the Disco" },
      { album: "1989", artist: "Taylor Swift" },
      { album: "When We All Fall Asleep, Where Do We Go?", artist: "Billie Eilish" },
      { album: "Thank U, Next", artist: "Ariana Grande" },
      { album: "÷ (Divide)", artist: "Ed Sheeran" },
      { album: "21", artist: "Adele" },
      { album: "A Head Full of Dreams", artist: "Coldplay" },
      { album: "Night Visions", artist: "Imagine Dragons" },
      { album: "Blurryface", artist: "Twenty One Pilots" }
      // Add more albums here!
  ];

  let currentAlbumIndex;
  let score = 0;
  let guessedAlbumsIndices = []; // To keep track of indices of albums already used in the current game

  // Function to start or reset the game
  function startGame() {
      score = 0;
      guessedAlbumsIndices = []; // Reset guessed albums
      scoreElement.textContent = score;
      feedbackElement.textContent = '';
      feedbackElement.style.opacity = 0; // Hide feedback initially
      artistGuessInput.value = '';
      gameArea.classList.remove('hidden');
      winMessage.classList.add('hidden');
      refreshButton.classList.add('hidden'); // Hide "Play Again" button at the start
      submitGuessButton.disabled = false; // Enable guess button
      artistGuessInput.disabled = false; // Enable input field
      refreshAlbumButton.classList.remove('hidden'); // Show "Skip Album" button
      displayRandomAlbum();
  }

  // Function to display a random album that hasn't been guessed correctly yet
  function displayRandomAlbum() {
      // Clear previous feedback animation state
      feedbackElement.style.opacity = 0;

      if (guessedAlbumsIndices.length === albums.length) {
          // All albums guessed, end the game (shouldn't happen before score reaches 5, but good fallback)
          endGame();
          return;
      }

      let randomIndex;
      do {
          randomIndex = Math.floor(Math.random() * albums.length);
      } while (guessedAlbumsIndices.includes(randomIndex)); // Keep picking if already guessed

      currentAlbumIndex = randomIndex;
      albumTitleElement.textContent = albums[currentAlbumIndex].album;
      artistGuessInput.value = ''; // Clear input field
      artistGuessInput.focus(); // Focus input for next guess
  }

  // Function to check the user's guess
  function checkGuess() {
      const userGuess = artistGuessInput.value.trim().toLowerCase();
      const correctAnswer = albums[currentAlbumIndex].artist.toLowerCase();

      if (userGuess === correctAnswer) {
          feedbackElement.textContent = "Correct!";
          feedbackElement.style.color = "green"; // Use 'green' here, CSS will map it to the muted color
          feedbackElement.style.opacity = 1; // Fade in feedback

          score++;
          scoreElement.textContent = score;

          // Add the current album index to the guessed list
          guessedAlbumsIndices.push(currentAlbumIndex);

          if (score === 5) {
              // Disable input and buttons before ending the game
              artistGuessInput.disabled = true;
              submitGuessButton.disabled = true;
              refreshAlbumButton.classList.add('hidden'); // Hide skip button when game ends
              setTimeout(endGame, 1000); // Wait 1 second before ending the game
          } else {
              // Move to the next album after a short delay
              setTimeout(displayRandomAlbum, 1000); // Wait 1 second before showing the next album
          }
      } else {
          feedbackElement.textContent = `Incorrect. The artist was ${albums[currentAlbumIndex].artist}.`;
          feedbackElement.style.color = "red"; // Use 'red' here, CSS will map it to the muted color
          feedbackElement.style.opacity = 1; // Fade in feedback

          // No score change, display the next album after a short delay
          setTimeout(displayRandomAlbum, 2000); // Wait 2 seconds after an incorrect guess
      }

      artistGuessInput.value = ''; // Clear input after guess
  }

  // Function to handle the end of the game
  function endGame() {
      gameArea.classList.add('hidden');
      winMessage.classList.remove('hidden');
      finalScoreElement.textContent = score;
      refreshButton.classList.remove('hidden'); // Show "Play Again" button

      // *** IMPORTANT: Updated Spotify playlist link ***
      const spotifyPlaylistLink = "https://open.spotify.com/playlist/0lMt1RO0QF35qVapcXwxp8?si=1CY01SEzTA26osUUeFFARA&pi=0TlO8NRvQue3y";
      spotifyLinkElement.href = spotifyPlaylistLink;
  }

  // Event listener for the guess button
  submitGuessButton.addEventListener('click', checkGuess);

  // Allow pressing Enter key to submit guess
  artistGuessInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !submitGuessButton.disabled) { // Check if button is not disabled
          checkGuess();
      }
  });

  // Event listener for the "Skip Album" button
  refreshAlbumButton.addEventListener('click', displayRandomAlbum);


  // Event listener for the "Play Again" button (after game end)
  refreshButton.addEventListener('click', startGame);

  // Start the game when the page loads
  startGame();
});
