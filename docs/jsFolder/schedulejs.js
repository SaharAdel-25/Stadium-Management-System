    document.addEventListener("DOMContentLoaded", function() {
    const currentMonth = document.getElementById("currentMonth");
    const daysContainer = document.getElementById("days-container");
    const selectedDate = document.getElementById("selectedDate");
    const selectedTime = document.getElementById("selectedTime");
    const selectedStadium = document.getElementById("selectedStadium");

    let currentDate = new Date(); 
    let selectedDayText = formatDate(currentDate);

    function formatDate(date) {
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    function updateMonthDisplay() {
        currentMonth.textContent = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }

    function generateDays() {
    daysContainer.innerHTML = "";
    let tempDate = new Date(currentDate);
    let daysHTML = "";
    let firstActiveDay = null;

    for (let i = -3; i <= 3; i++) { 
        let newDate = new Date(tempDate);
        newDate.setDate(currentDate.getDate() + i);
        let formattedDate = formatDate(newDate);

        let isActive = i === 0;
        if (isActive) firstActiveDay = formattedDate;

        daysHTML += `<span class="day ${isActive ? 'active' : ''}" data-date="${formattedDate}" data-month="${newDate.getMonth()}">${formattedDate}</span>`;
    }

    daysContainer.innerHTML = daysHTML;
    attachDayEvents();

    if (firstActiveDay) {
        selectedDayText = firstActiveDay;
        selectedDate.textContent = `Selected Day: ${selectedDayText}`;
    }
    }

    document.getElementById("prev-month").addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthDisplay();  
        generateDays();
    });

    document.getElementById("next-month").addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();  
    generateDays();
    });

    document.getElementById("prev-day").addEventListener("click", function() {
        currentDate.setDate(currentDate.getDate() - 1);
        if (currentDate.getDate() === 1) {
            updateMonthDisplay();  
        }
        generateDays();
    });

    document.getElementById("next-day").addEventListener("click", function() {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDate() === 1) {
            updateMonthDisplay();   
        }
        generateDays();
    });

    function attachDayEvents() {
        document.querySelectorAll(".day").forEach(day => {
        day.addEventListener("click", function() {
            const selectedMonth = parseInt(this.getAttribute('data-month'));
            const currentMonthValue = currentDate.getMonth();

            if (selectedMonth !== currentMonthValue) {
                currentDate.setMonth(selectedMonth);
                updateMonthDisplay();  
            }

            document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
            this.classList.add("active");
            selectedDayText = this.dataset.date;
            selectedDate.textContent = `Selected Day: ${selectedDayText}`;
            });
        });
    }

    generateDays();
    updateMonthDisplay();  

    document.querySelectorAll(".stadium").forEach(stadium => {
        stadium.addEventListener("click", function() {
            document.querySelectorAll(".stadium").forEach(s => s.classList.remove("selected"));
            this.classList.add("selected");
            selectedStadium.textContent = `Playground: ${this.querySelector("p").textContent.trim()}`;
        });
    });

    const unavailableTimes = [
        "10:00 AM", "4:30 AM", "11:00 AM", "5:30 AM", "12:00 PM", "01:00 PM","06:00 PM"
    ];

    document.querySelectorAll(".slots button").forEach(slot => {
        const slotTime = slot.textContent.trim();
        if (unavailableTimes.includes(slotTime)) {
            slot.classList.add("unavailable"); 
            slot.disabled = true; 
        }
    });

    document.querySelectorAll(".slots button").forEach(slot => {
    slot.addEventListener("click", function() {
        if (this.classList.contains("unavailable")) {
            alert(`${this.textContent.trim()} is unavailable. Please select another time.`);
            return;
        }

    document.querySelectorAll(".slots button").forEach(s => s.classList.remove("selected"));
    this.classList.add("selected");
    selectedTime.textContent = `Selected Time: ${this.textContent.trim()}`;
        });
    });
  
    });