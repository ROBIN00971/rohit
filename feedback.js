import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Get the HTML elements from the page
const form = document.getElementById('feedback-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

// Listen for when the user clicks the "Submit" button
form.addEventListener('submit', async (e) => {
    // Prevent the form from reloading the page
    e.preventDefault();

    // Disable the button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formMessage.textContent = ''; // Clear any previous messages
    formMessage.classList.remove('success', 'error');

    // Get the values the user typed into the form fields
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    try {
        // Try to add a new document to your "feedback" collection in Firestore
        const docRef = await addDoc(collection(window.db, "feedback"), {
            name: name,
            email: email,
            message: message,
            submittedAt: serverTimestamp() // Add a server-side timestamp for when it was received
        });

        // If successful, show a success message to the user
        formMessage.textContent = 'Thank you! Your feedback has been submitted successfully.';
        formMessage.classList.add('success');
        form.reset(); // Clear the form fields

    } catch (error) {
        // If something goes wrong, log the error and show an error message
        console.error("Error adding document: ", error);
        formMessage.textContent = 'An error occurred. Please try again later.';
        formMessage.classList.add('error');
    } finally {
        // Whether it succeeded or failed, re-enable the button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
    }
});
