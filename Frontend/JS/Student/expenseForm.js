const token = localStorage.getItem("token");

const id = getId(token);

document
  .getElementById("living-cost-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const period = document.getElementById("living-cost-period").value;
    const livingCost = document.getElementById("upload-living-cost").files[0];
    const invoice = document.getElementById("upload-invoice").files[0];
    const cost = document.getElementById("cost").value;

    const formData = new FormData();
    formData.append("livingCostPeriod", period);
    formData.append("livingCostDocument", livingCost);
    formData.append("invoice", invoice);
    formData.append("cost", cost);

    const now = new Date();
    const dateTime = now.toISOString();
    formData.append("dateTime", dateTime);

    fetch(
      `https://localhost:7033/api/Student/addExpense?id=${id}&livingCostPeriod=${period}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
      .then(async (response) => {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then((data) => {
            if (!response.ok) {
              throw new Error(data.message || "Failed to fetch data");
            }
            return data;
          });
        } else {
          return response.text().then((text) => {
            if (!response.ok) {
              throw new Error(text || "Failed to fetch data");
            }
            return { message: text };
          });
        }
      })
      .then((data) => {
        window.location.href = "/HTML/Student/expense.html";
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);

        alert("Error: " + error.message);
      });
  });

function getId(token) {
  if (!token) {
    return null;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  const payload = JSON.parse(jsonPayload);

  return payload[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication"
  ];
}
