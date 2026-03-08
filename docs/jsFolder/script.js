document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("selectedSport").textContent.trim() === '') {
        document.getElementById("selectedSport").textContent = 'No data available';
    }
    if (document.getElementById("selectedFullName").textContent.trim() === '') {
        document.getElementById("selectedFullName").textContent = 'No data available';
    }
    if (document.getElementById("selectedPhone").textContent.trim() === '') {
        document.getElementById("selectedPhone").textContent = 'No data available';
    }
    if (document.getElementById("selectedEmail").textContent.trim() === '') {
        document.getElementById("selectedEmail").textContent = 'No data available';
    }
    if (document.getElementById("selectedPaymentMethod").textContent.trim() === '') {
        document.getElementById("selectedPaymentMethod").textContent = 'No data available';
    }
    if (document.getElementById("selectedDate").textContent.trim() === '') {
        document.getElementById("selectedDate").textContent = 'No data available';
    }
    if (document.getElementById("selectedTime").textContent.trim() === '') {
        document.getElementById("selectedTime").textContent = 'No data available';
    }
    if (document.getElementById("selectedStadium").textContent.trim() === '') {
        document.getElementById("selectedStadium").textContent = 'No data available';
    }

    function updatePaymentSummary() {
        const selectedSport = document.getElementById("sport").value;
        const selectedPayment = document.getElementById("payment").value;
        document.getElementById("selected-sport").textContent = selectedSport;
        document.getElementById("selected-payment").textContent = selectedPayment;
    }

    document.getElementById("sport").addEventListener("change", updatePaymentSummary);

    document.getElementById("payment").addEventListener("change", function () {
        updatePaymentSummary();
        const cardDetails = document.getElementById("card-details");
        cardDetails.style.display = (this.value === "Cash") ? "none" : "block";
    });

    document.getElementById("booking-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const sport = document.getElementById("sport").value;
        const fullName = document.getElementById("full-name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const paymentMethod = document.getElementById("payment").value;
        const cardHolder = document.getElementById("card-holder").value;
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;

        const selectedDate = document.getElementById("selectedDate").textContent.replace("Selected Day: ", "").trim();
        const selectedTime = document.getElementById("selectedTime").textContent.replace("Selected Time: ", "").trim();
        const selectedStadium = document.getElementById("selectedStadium").textContent.replace("Playground: ", "").trim();

        const bookingData = {
            sport,
            fullName,
            phone,
            email,
            paymentMethod,
            cardHolder,
            cardNumber,
            expiryDate,
            cvv,
            date: selectedDate,
            time: selectedTime,
            stadium: selectedStadium
        };

        fetch("http://localhost:3000/book-appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    if (data.errors) {
                        const messages = data.errors.map(err => `• ${err.msg}`).join("\n");
                        alert("⚠️ Please fix the following:\n" + messages);
                    } else {
                        alert("❌ Failed to submit booking.");
                    }
                    throw new Error("Validation failed");
                });
            }
            return response.json();
        })
        .then(result => {
            alert("✅ Booking completed successfully!");
            localStorage.setItem("lastBookingId", result.insertId);
            document.getElementById("booking-form").reset();
            updatePaymentSummary();
            document.getElementById("card-details").style.display = "none";
            document.querySelector(".payment-summary").style.display = "block";
            loadBookingInfo(result.insertId);
        })
        .catch(error => {
            console.error("❌ Booking Error:", error);
        });
    });

    function loadBookingInfo(id) {
        fetch(`http://localhost:3000/appointment/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch data.");
            return response.json();
        })
        .then(data => {
            console.log("📦 Booking Data:", data);
            document.getElementById("selectedSport").textContent = data.sport;
            document.getElementById("selectedFullName").textContent = data.fullName;
            document.getElementById("selectedPhone").textContent = data.phone;
            document.getElementById("selectedEmail").textContent = data.email;
            document.getElementById("selectedPaymentMethod").textContent = data.paymentMethod;
            document.getElementById("selectedDate").textContent = data.date;
            document.getElementById("selectedTime").textContent = data.time;
            document.getElementById("selectedStadium").textContent = data.stadium;
        })
        .catch(error => {
            console.error("❌ Error:", error);
            alert("❌ Failed to display booking data.");
        });
    }
});



