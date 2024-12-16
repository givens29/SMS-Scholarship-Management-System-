const token = localStorage.getItem("token");

const id = getId(token);

document
  .getElementById("academic-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const period = document.getElementById("academic-period").value;
    const transcriptRecord = document.getElementById("upload-transcriptRecord")
      .files[0];
    const verificationLetter = document.getElementById(
      "upload-verificationLetter"
    ).files[0];

    if (!transcriptRecord || !verificationLetter) {
      alert(
        "Please upload both the Transcript Record and Verification Letter."
      );
      return;
    }

    const formData = new FormData();
    formData.append("periodofAcademic", period);
    formData.append("transcriptRecord", transcriptRecord);
    formData.append("verificationLetter", verificationLetter);

    fetch(
      `https://localhost:7033/api/Student/addAcademic?id=${id}&periodofAcademic=${period}`,
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
        window.location.href = "academic.html";
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
