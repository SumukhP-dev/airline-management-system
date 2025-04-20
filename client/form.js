document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = {};
  
      formData.forEach((value, key) => {
        data[key] = value.replace(/^['"]+|['"]+$/g, "").trim();
      });
  
      // Validate required fields
      const requiredFields = (form.dataset.required || "").split(",");
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field].trim() === "") {
          alert(`Please fill out all required fields.`);
          return;
        }
      }      
  
      // Optional preprocessing for known forms
      switch (form.id) {
        case "airplaneForm":
          data.seatCap = parseInt(data.seatCap);
          data.speed = parseInt(data.speed);
          data.maintained = data.maintained === "" ? null : data.maintained === "true";
          data.model = data.model === "" ? null : data.model;
          data.neo = data.neo === "true";
          break;
  
        case "personForm":
          data.age = parseInt(data.age);
          data.middleName = data.middleName === "" ? null : data.middleName;
          data.email = data.email === "" ? null : data.email;
          break;
  
        case "airportForm":
          // Example: no specific preprocessing required
          break;
  
        // Add more form-specific cases here if needed
      }
  
      console.log("🔼 Sending data:", data);
  
      try {
        const response = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        console.log("✅ Response:", result);
        alert(result.message || result.error);
      } catch (err) {
        console.error("❌ Request failed:", err);
        alert("Failed to send data to server.");
      }
    });
  });
  