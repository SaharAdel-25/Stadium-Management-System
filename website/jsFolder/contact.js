function submitForm() {
    event.preventDefault(); // Prevent page reload

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const gender = document.getElementById('gender').value;
    const mobile = document.getElementById('mobile').value.trim();
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value.trim();
    const language = document.getElementById('language').value;
    const message = document.getElementById('message').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{8,15}$/; // Accepts 8-15 digit numbers

    if (!firstName || !lastName || !gender || !mobile || !dob || !email || !language || !message) {
        showToast('❌ Please fill in all fields.', 'danger');
        return;
    }

    if (!emailRegex.test(email)) {
        showToast('⚠️ Invalid email format.', 'warning');
        return;
    }

    if (!phoneRegex.test(mobile)) {
        showToast('⚠️ Enter a valid phone number (8-15 digits).', 'warning');
        return;
    }

    const formData = {
        firstName,
        lastName,
        gender,
        mobile,
        dob,
        email,
        language,
        message
    };

    fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then(data => {
        showToast(`✅ Thank you, ${firstName}! Your message has been sent.`, 'success');
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        showToast("❌ Failed to send your message. Please try again later.", 'danger');
    });
}

function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div></div>`;

    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// Link the submit button to the function
document.getElementById('contactForm').addEventListener('submit', submitForm);
