const token = localStorage.getItem("token");

const id = getId(token);

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

fetch("https://localhost:7033/api/Student/getManager?managerId=" + id, {
  method: "GET",
  headers: {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    displayProfile(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function displayProfile(data) {
  const employeeIdElement = document.getElementById("employeeId");
  const fullNameElement = document.getElementById("fullName");
  const WAnumberElement = document.getElementById("WAnumber");
  const addressElement = document.getElementById("address");
  const profilePicElement = document.getElementById("profilePicture");

  employeeIdElement.innerHTML = `${data.employeeId}`;
  fullNameElement.innerHTML = `${data.fullName}`;
  WAnumberElement.innerHTML = `${data.wAnumber}`;
  addressElement.innerHTML = `${data.address}`;

  if (data.profilePicture && data.profilePicture.length > 0) {
    profilePicElement.src = `data:image/jpeg;base64,${data.profilePicture}`;
  } else {
    profilePicElement.src = "src/user.png";
    profilePicElement.alt = "No profile picture available";
  }
}
