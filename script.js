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
    const refreshButton = document.getElementById('refresh-button');
    const refreshAlbumButton = document.getElementById('refresh-album-button');
    const showHintButton = document.getElementById('show-hint-button'); // New hint button
    const hintTextElement = document.getElementById('hint-text'); // New hint text element

    // Data: Array of objects with album, artist, and hint
    const albums = [
        { album: "I Like It When You Sleep, for You Are So Beautiful yet So Unaware of It", artist: "The 1975", hint: "British indie pop band formed in 2002." },
        { album: "Death of a Bachelor", artist: "Panic at the Disco", hint: "Known for the song 'I Write Sins Not Tragedies'." },
        { album: "1989", artist: "Taylor Swift", hint: "Named after the artist's birth year, features 'Blank Space'." },
        { album: "When We All Fall Asleep, Where Do We Go?", artist: "Billie Eilish", hint: "Features the hit 'Bad Guy'." },
        { album: "÷ (Divide)", artist: "Ed Sheeran", hint: "Third studio album by the English singer-songwriter." },
        { album: "Chromatica", artist: "Lady Gaga", hint: "Dance-pop album featuring 'Rain on Me'." },
        { album: "Red", artist: "Taylor Swift", hint: "Features the hit 'We Are Never Ever Getting Back Together'." },
        { album: "Revolver", artist: "The Beatles", hint: "1966 album with 'Eleanor Rigby' and 'Yellow Submarine'." },
        { album: "Norman Fucking Rockwell!", artist: "Lana Del Rey", hint: "Critically acclaimed album released in 2019." },
        { album: "Limasawa Street", artist: "Ben&Ben", hint: "Folk-pop band known for 'Kathang Isip' and 'Pagtingin'." },
        { album: "CLAPCLAPCLAP!", artist: "IV of Spades", hint: "Funky, retro-inspired music with 'Mundo' and 'Hey Barbara'." }
    ];

    let currentAlbumIndex;
    let score = 0;
    let guessedAlbumsIndices = [];

    // Function to start or reset the game
    function startGame() {
        score = 0;
        guessedAlbumsIndices = [];
        scoreElement.textContent = score;
        feedbackElement.textContent = '';
        feedbackElement.style.opacity = 0;
        artistGuessInput.value = '';
        gameArea.classList.remove('hidden');
        winMessage.classList.add('hidden');
        refreshButton.classList.add('hidden');
        submitGuessButton.disabled = false;
        artistGuessInput.disabled = false;
        refreshAlbumButton.classList.remove('hidden');
        showHintButton.classList.remove('hidden'); // Show hint button
        hintTextElement.classList.add('hidden'); // Hide hint text initially
        displayRandomAlbum();
    }

    // Function to display a random album that hasn't been guessed correctly yet
    function displayRandomAlbum() {
        feedbackElement.style.opacity = 0;
        hintTextElement.classList.add('hidden'); // Hide hint when a new album loads

        if (guessedAlbumsIndices.length === albums.length) {
            endGame();
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * albums.length);
        } while (guessedAlbumsIndices.includes(randomIndex));

        currentAlbumIndex = randomIndex;
        albumTitleElement.textContent = albums[currentAlbumIndex].album;
        artistGuessInput.value = '';
        artistGuessInput.focus();
    }

    // Function to check the user's guess
    function checkGuess() {
        const userGuess = artistGuessInput.value.trim().toLowerCase();
        const correctAnswer = albums[currentAlbumIndex].artist.toLowerCase();

        if (userGuess === correctAnswer) {
            feedbackElement.textContent = "Correct!";
            feedbackElement.style.color = "green";
            feedbackElement.style.opacity = 1;

            score++;
            scoreElement.textContent = score;

            guessedAlbumsIndices.push(currentAlbumIndex);

            if (score === 5) {
                artistGuessInput.disabled = true;
                submitGuessButton.disabled = true;
                refreshAlbumButton.classList.add('hidden');
                showHintButton.classList.add('hidden'); // Hide hint button when game ends
                setTimeout(endGame, 1000);
            } else {
                setTimeout(displayRandomAlbum, 1000);
            }
        } else {
            feedbackElement.textContent = `Incorrect. The artist was ${albums[currentAlbumIndex].artist}.`;
            feedbackElement.style.color = "red";
            feedbackElement.style.opacity = 1;

            setTimeout(displayRandomAlbum, 2000);
        }

        artistGuessInput.value = '';
    }

    // Function to handle the end of the game
    function endGame() {
        gameArea.classList.add('hidden');
        winMessage.classList.remove('hidden');
        finalScoreElement.textContent = score;
        refreshButton.classList.remove('hidden');

        // IMPORTANT: Updated Spotify playlist link
        const spotifyPlaylistLink = "https://open.spotify.com/playlist/0lMt1RO0QF35qVapcXwxp8?si=1CY01SEzTA26osUUeFFARA&pi=0TlO8NRvQue3y";
        spotifyLinkElement.href = spotifyPlaylistLink;
    }

    // Function to display the hint
    function showHint() {
        if (currentAlbumIndex !== undefined && albums[currentAlbumIndex].hint) {
            hintTextElement.textContent = `Hint: ${albums[currentAlbumIndex].hint}`;
            hintTextElement.classList.remove('hidden');
        }
    }

    // Event listeners
    submitGuessButton.addEventListener('click', checkGuess);

    artistGuessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !submitGuessButton.disabled) {
            checkGuess();
        }
    });

    refreshAlbumButton.addEventListener('click', displayRandomAlbum);
    showHintButton.addEventListener('click', showHint); // Event listener for show hint button
    refreshButton.addEventListener('click', startGame);

    // Start the game when the page loads
    startGame();
});