document.getElementById("sendBtn").addEventListener("click", function () {
    let phoneInput = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate message
    if (message === "") {
        alert("Error: Message cannot be empty.");
        return;
    }

    // Validate and split phone numbers: Allow phone numbers separated by commas
    let phones = phoneInput.split(",").map(phone => phone.trim());
    let validPhones = [];

    // Validate each phone number (should be in international format and 10-15 digits)
    phones.forEach(phone => {
        if (/^\+?\d{10,15}$/.test(phone)) {
            validPhones.push({ to: phone });
        } else {
            alert(`Error: Invalid phone number format: ${phone}`);
        }
    });

    if (validPhones.length === 0) {
        alert("Error: No valid phone numbers entered.");
        return;
    }

    // Prepare Infobip API data for multiple phone numbers
    const apiUrl = "https://1g3q89.api.infobip.com/sms/2/text/advanced"; // Your base URL
    const apiKey = "cf94ed62f189712a489a9dc18f05ac87-6c1e0c88-ff18-4e6e-af74-606b9430c584";

    const smsData = {
        messages: [
            {
                destinations: validPhones,  // Send to multiple numbers
                text: message,
                from: "EduSender"  // Use your custom sender ID
            }
        ]
    };

    // Send the SMS using Fetch API
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `App ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(smsData)
    })
    .then(response => response.json())
    .then(data => {
        // Check if API response indicates success
        if (data.messages && data.messages[0].status.groupId === 1) {
            alert("Message sent successfully!");
            // Clear input fields after successful send
            document.getElementById("phone").value = "";
            document.getElementById("message").value = "";
        } else {
            // Display the error message returned by Infobip
            alert(`Failed to deliver message: ${data.messages[0].status.description}`);
            console.error("Response:", data);
        }
    })
    .catch(error => {
        alert("Error: Unable to connect to the API. Check your internet and API setup.");
        console.error("Error:", error);
    });
});
