// --- EmailJS Configuration ---
// IMPORTANT: Replace placeholders with your actual EmailJS details from your account
const EMAILJS_PUBLIC_KEY = "l1U0B1k8SH4xQuCrb"; // Your Public Key (from original code)
const EMAILJS_SERVICE_ID = "service_v4f6ecq"; // Your Service ID (from original code)
const EMAILJS_TEMPLATE_ID = "template_inx7etn"; // Your Template ID (from original code)

// Attempt to initialize EmailJS
try {
  // Check if emailjs object exists (loaded from CDN) and key is provided
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS Initialized.");
  } else if (typeof emailjs === 'undefined') {
     console.warn("EmailJS SDK not loaded.");
  } else {
    console.warn("EmailJS Public Key is not set. Email notifications will not work.");
  }
} catch (error) {
  console.error("Failed to initialize EmailJS:", error);
}

// --- DOM Elements Selection ---
// Select elements needed for interactivity
const entrySection = document.getElementById('entry');
const aboutSection = document.getElementById('about');
const inviteSection = document.getElementById('invite');
const music = document.getElementById('bgMusic');
const heartContainer = document.getElementById('heartContainer');

// Buttons
const seeInvitationButton = document.getElementById('see-invitation-button');
const maybeLaterButton = document.getElementById('maybe-later-button');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');

// Modal elements
const notificationModal = document.getElementById('notificationModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseButton = document.getElementById('modalCloseButton');

// Navbar elements
const menuButton = document.getElementById('menu-button');
const navbar = document.getElementById('navbar-default');

let heartInterval = null; // Variable to store the interval ID for heart animation

// --- Functions ---

/**
 * Shows a custom modal notification.
 * @param {string} title - The title for the modal.
 * @param {string} message - The main message content.
 * * @param {string} [buttonText='Close'] - The text for the close button.
 */
function showModal(title, message, buttonText = 'Close') {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalCloseButton.textContent = buttonText;
  modalCloseButton.disabled = false; // Ensure button is enabled by default
  notificationModal.classList.add('show'); // Add 'show' to trigger CSS transitions

  // Function to close the modal
  const closeModal = () => {
    notificationModal.classList.remove('show');
    // Clean up event listeners to prevent memory leaks
    modalCloseButton.removeEventListener('click', closeModal);
    notificationModal.removeEventListener('click', backdropClickHandler);
  };

  // Handler for clicking the close button
  modalCloseButton.addEventListener('click', closeModal, { once: true }); // Use 'once' to auto-remove listener

  // Handler for clicking the backdrop (outside the modal content)
  const backdropClickHandler = (event) => {
    // Close only if the click is directly on the backdrop, not the content inside
    if (event.target === notificationModal) {
      closeModal();
    }
  };
  notificationModal.addEventListener('click', backdropClickHandler);
}

/**
 * Reveals the main invitation content (About and Invite sections)
 * and starts the background music.
 */
function showInvitation() {
  // Hide entry section smoothly (optional, could just scroll past)
  entrySection.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    setTimeout(() => {
        entrySection.classList.add('hidden'); // Hide after fade
        entrySection.classList.remove('opacity-0', 'transition-opacity', 'duration-500'); // Reset classes
    }, 500);


  // Show the hidden sections
  aboutSection.classList.remove('hidden');
  inviteSection.classList.remove('hidden');
  // Apply fade-in animation (if the class wasn't already applied on load)
  aboutSection.classList.add('fade-in-element');
  inviteSection.classList.add('fade-in-element');

  // Smooth scroll to the 'about' section for better flow
  setTimeout(() => {
    // Check if the element exists before scrolling
    const aboutElement = document.getElementById('about');
    if (aboutElement) {
        aboutElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100); // Short delay to allow elements to render

  // Start background music gently if it's not already playing
  if (music.paused) {
    music.volume = 0; // Start silent
    music.play().then(() => {
      // Fade in volume smoothly
      let currentVolume = 0;
      const fadeAudio = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= 0.4) { // Target volume
          music.volume = 0.4;
          clearInterval(fadeAudio); // Stop fading when target is reached
        } else {
          music.volume = currentVolume;
        }
      }, 100); // Adjust interval for fade speed
    }).catch(error => console.error("Audio playback failed:", error));
  }
}

/**
 * Shows a polite message when the user clicks "Maybe Later".
 */
function showLeaveMessage() {
  showModal(
    "No Worries!",
    "Auggie understands. Thanks for considering! You can close this page now.",
    "Okay"
  );
  // Previously redirected: window.location.href = 'https://www.google.com';
}

/**
 * Handles the "Yes" response: starts heart animation, shows feedback,
 * and attempts to send an email notification via EmailJS.
 */
function respondYes() {
  // Prevent multiple submissions
  yesButton.disabled = true;
  yesButton.textContent = 'Sending...';

  startHeartAnimation(15000); // Start hearts animation for 15 seconds
  showModal("Sending Response...", "Please wait while we notify Auggie.", "Wait");
  modalCloseButton.disabled = true; // Disable close button during processing

  // --- EmailJS Integration ---
  // Check if EmailJS is available and configured
  if (typeof emailjs === 'undefined' || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    console.warn("EmailJS not initialized or configured properly.");
    // Provide feedback even if email fails
    setTimeout(() => { // Simulate delay for UX consistency
      showModal(
        "Notification Issue",
        "Could not send notification (EmailJS may not be set up correctly). Please tell Auggie you said yes!",
        "Okay"
      );
      yesButton.disabled = false; // Re-enable button on failure
      yesButton.textContent = "Yes, I'd love to!";
      modalCloseButton.disabled = false; // Re-enable close button
    }, 1000);
    return; // Exit the function
  }

  // Prepare email parameters
  const templateParams = {
    // Ensure these parameter names match your EmailJS template
    to_email: 'auggiejohnfred504@gmail.com', // Auggie's email address
    from_name: 'Invitation Website',         // Can be customized
    message: `Someone has accepted Auggie's invitation to the Kaamulan Festival on April 13th! Response time: ${new Date().toLocaleString()}`,
  };

  // Send the email using EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then((response) => {
      // Success callback
      console.log("EmailJS SUCCESS!", response.status, response.text);
      showModal(
        "Fantastic!",
        "Auggie is overjoyed! Your 'Yes' has been sent. Get ready for an amazing time at the Kaamulan Festival!",
        "Awesome!"
      );
      // Keep the 'Yes' button disabled and update text permanently
      yesButton.textContent = 'Accepted!';
      // Optionally hide the 'No' button after a 'Yes' response
      if(noButton) noButton.style.display = 'none';
      modalCloseButton.disabled = false; // Re-enable close button

    }, (error) => {
      // Error callback
      console.error("EmailJS FAILED...", error);
      showModal(
        "Oops!",
        "There was an issue sending the notification email. Please let Auggie know directly that you'd love to come!",
        "Okay"
      );
      yesButton.disabled = false; // Re-enable 'Yes' button on error
      yesButton.textContent = "Yes, I'd love to!";
      modalCloseButton.disabled = false; // Re-enable close button
    });
}

/**
 * Handles the "No" response: shows a confirmation message.
 */
function respondNo() {
  showModal(
    "Okay, Understood",
    "Totally okay. Maybe next time! Thanks for letting Auggie know.",
    "Got it"
  );
  // Optionally disable both response buttons after a 'No'
  if(yesButton) yesButton.disabled = true;
  if(noButton) noButton.disabled = true;
  if(yesButton) yesButton.classList.add('opacity-50'); // Visually indicate disabled state
  if(noButton) noButton.classList.add('opacity-50');
}

/**
 * Starts the falling heart animation for a specified duration.
 * @param {number} [duration=10000] - How long (in ms) the hearts should be generated.
 */
function startHeartAnimation(duration = 10000) {
  // Clear any existing heart animation interval
  if (heartInterval) clearInterval(heartInterval);

  // Function to create a single heart element
  const createHeart = () => {
    const heart = document.createElement('div');
    heart.classList.add('heart'); // Apply CSS class for styling and base animation
    heart.style.left = Math.random() * 100 + 'vw'; // Random horizontal position

    // Randomize animation duration for variety
    const animDuration = 4 + Math.random() * 4; // Float duration between 4s and 8s
    heart.style.animationDuration = `${animDuration}s, 1.2s`; // Assign durations for 'float' and 'pulse' animations

    heartContainer.appendChild(heart);

    // Remove the heart element from the DOM after its animation is complete
    // Add a small buffer to ensure animation finishes
    setTimeout(() => {
      heart.remove();
    }, animDuration * 1000 + 500);
  };

  // Create hearts at a regular interval
  heartInterval = setInterval(createHeart, 350); // Generate a new heart every 350ms

  // Stop generating new hearts after the specified duration
  setTimeout(() => {
    clearInterval(heartInterval);
    heartInterval = null; // Reset interval variable
  }, duration);
}


// --- Event Listeners ---

// Add listeners only if the elements exist
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup: Ensure sections are hidden correctly (can be redundant if HTML default is hidden)
    if (aboutSection) aboutSection.classList.add('hidden');
    if (inviteSection) inviteSection.classList.add('hidden');

    // Button click listeners
    if (seeInvitationButton) seeInvitationButton.addEventListener('click', showInvitation);
    if (maybeLaterButton) maybeLaterButton.addEventListener('click', showLeaveMessage);
    if (yesButton) yesButton.addEventListener('click', respondYes);
    if (noButton) noButton.addEventListener('click', respondNo);

    // Mobile Menu Toggle Listener
    if (menuButton && navbar) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            navbar.classList.toggle('hidden'); // Toggle visibility of the nav links container
            // Optional: Add transition classes for smoother toggle if needed via CSS
        });
    }

    // Close mobile menu when a nav link is clicked
    if (navbar) {
        document.querySelectorAll('#navbar-default a').forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is open (i.e., not hidden and screen is mobile)
                if (!navbar.classList.contains('hidden') && window.innerWidth < 768) { // 768px is Tailwind's 'md' breakpoint
                    menuButton.setAttribute('aria-expanded', 'false');
                    navbar.classList.add('hidden');
                }
                // Smooth scroll is handled by CSS `scroll-behavior: smooth;` on the <html> element
            });
        });
    }
});
