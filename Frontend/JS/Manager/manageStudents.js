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

const listNewStudent = document.getElementById("listStudents");

fetch("https://localhost:7033/api/Manager/listofStudent", {
  method: "GET",
  headers: {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text || "Failed to fetch data");
      });
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    if (data === null || data.length === 0) {
      displayEmptyListMessage(listNewStudent);
    } else {
      data.forEach((student) => {
        const img = document.createElement("img");
        if (student.profilePic && student.profilePic.trim() !== "") {
          img.src = `data:image/jpeg;base64,${student.profilePic}`;
        } else {
          img.src = "src/user.png";
        }

        img.className = "card-img-top";
        img.alt = "Profile Picture";
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";

        const liName = document.createElement("p");
        liName.textContent = student.fullName;

        const liUniversity = document.createElement("p");
        liUniversity.textContent = student.university.name;

        const cardColPic = document.createElement("div");
        cardColPic.className = "col-4";
        cardColPic.appendChild(img);
        const cardColInfo = document.createElement("div");
        cardColInfo.className = "col-4";
        cardColInfo.appendChild(liName);
        cardColInfo.appendChild(liUniversity);
        const cardRow = document.createElement("div");
        (cardRow.className = "row"), "justify-content-start";
        cardRow.appendChild(cardColPic);
        cardRow.appendChild(cardColInfo);
        const card = document.createElement("div");
        card.className = "container mt-5";
        card.appendChild(cardRow);

        card.addEventListener("click", () => {
          window.location.href = `profileStudent.html?studentID=${student.accountId}`;
        });

        listNewStudent.appendChild(card);
      });
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
  container.appendChild(messageContainer);
}
