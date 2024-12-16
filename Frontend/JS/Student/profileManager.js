const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("managerId");

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

document
  .getElementById("sendMessage-button")
  .addEventListener("click", function () {
    var myModal = new bootstrap.Modal(
      document.getElementById("sendMessageModal")
    );
    myModal.show();
  });

document.getElementById("addFileButton").addEventListener("click", function () {
  const fileInputsContainer = document.getElementById("fileInputsContainer");
  const newFileInput = document.createElement("input");
  newFileInput.classList.add("form-control", "mb-2");
  newFileInput.setAttribute("type", "file");
  newFileInput.setAttribute("name", "attachments");
  fileInputsContainer.appendChild(newFileInput);
});

document
  .getElementById("sendMessageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const from = getId(token);
    const to = id;
    const subject = document.getElementById("messageSubject").value;
    const body = document.getElementById("messageBody").value;
    const fileInputs = document.querySelectorAll('input[name="attachments"]');

    const formData = new FormData();
    formData.append("senderId", from);
    formData.append("receipantId", to);
    formData.append("subject", subject);
    formData.append("body", body);

    const now = new Date();
    const dateTime = now.toISOString();
    formData.append("dateTime", dateTime);

    fileInputs.forEach((fileInput) => {
      if (fileInput.files.length > 0) {
        formData.append("attachments", fileInput.files[0]);
      }
    });

    fetch("https://localhost:7033/api/Message/sendMessage", {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        alert("Message Sent");
        const sendMessageModal = new bootstrap.Modal(
          document.getElementById("sendMessageModal")
        );
        sendMessageModal.hide();
        document.getElementById("sendMessageForm").reset();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
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
