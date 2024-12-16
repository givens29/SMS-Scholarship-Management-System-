document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(
      `https://localhost:7033/api/Authentication/loginStudent?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            returnError(text);
            throw new Error(text || "Failed to fetch data");
          });
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        localStorage.setItem("token", data);
        window.location.href = "/HTML/Student/profile.html";
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
