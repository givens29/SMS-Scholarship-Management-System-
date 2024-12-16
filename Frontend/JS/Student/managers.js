const token = localStorage.getItem("token");

const id = getId(token);

fetch("https://localhost:7033/api/Student/getlistofManagers", {
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
    console.log(data);
    const containerListManagers = document.getElementById("listManagers");
    if (data === null || data.length === 0) {
      displayEmptyListMessage(containerListManagers);
    } else {
      displayManagers(containerListManagers, data);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function displayEmptyListMessage(container) {
  const messageContainer = document.createElement("div");
  messageContainer.textContent = "The list is empty.";
  messageContainer.style.color = "gray";
  messageContainer.style.fontStyle = "italic";
  messageContainer.style.fontSize = "20px";
  messageContainer.style.textAlign = "center";
  container.appendChild(messageContainer);
}

function displayManagers(listManagers, data) {
  data.forEach((managers) => {
    const managerLink = document.createElement("a");
    managerLink.href = `/HTML/Student/profileManager.html?managerId=${managers.id}`;
    const img = document.createElement("img");
    if (managers.profilePic && managers.profilePic.trim() !== "") {
      img.src = `data:image/jpeg;base64,${managers.profilePic}`;
    } else {
      img.src = "src/user.png";
    }

    img.className = "card-img-top";
    img.alt = "Profile Picture";
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";

    managerLink.textContent = managers.fullName;
    managerLink.style.textDecoration = "none";
    managerLink.style.color = "black";
    managerLink.style.display = "block";
    managerLink.style.marginBottom = "10px";
    managerLink.style.fontSize = "25px";

    const colpicManager = document.createElement("div");
    colpicManager.classList.add("col");
    colpicManager.appendChild(img);
    const colNameManager = document.createElement("div");
    colNameManager.classList.add("col");
    colNameManager.appendChild(managerLink);
    const rowManager = document.createElement("div");
    rowManager.classList.add("row");
    rowManager.appendChild(colpicManager);
    rowManager.appendChild(colNameManager);
    const divManager = document.createElement("div");
    divManager.classList.add("container");
    divManager.appendChild(rowManager);

    listManagers.appendChild(divManager);
  });
}

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
