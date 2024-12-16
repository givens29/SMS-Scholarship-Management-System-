document
  .getElementById("submitBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const employeeId = document.getElementById("employeeId").value;
    const fullName = document.getElementById("fullName").value;
    const address = document.getElementById("address").value;
    const wAnumber = document.getElementById("wAnumber").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const payload = {
      employeeId: employeeId,
      fullName: fullName,
      address: address,
      wAnumber: wAnumber,
      email: email,
      password: password,
    };

    fetch("https://localhost:7033/api/Authentication/registerManager", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then((json) => {
              console.error("Error JSON response:", json);
              returnError(json);
              throw new Error(json.message || "Failed to fetch data");
            });
          } else {
            return response.text().then((text) => {
              console.error("Error text response:", text);
              returnError(text);
              throw new Error(text || "Failed to fetch data");
            });
          }
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        if (typeof data === "string") {
          alert(data);
        } else {
          console.log("Response JSON:", data);
          alert(data.message || "You've successfully registered!");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  });

function returnError(text) {
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = text;
  errorContainer.appendChild(errorMessage);
}
