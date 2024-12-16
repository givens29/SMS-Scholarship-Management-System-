const token = localStorage.getItem("token");
const id = getId(token);

const profilePicElement = document.getElementById("profilePicture");
const fullNameElement = document.getElementById("fullName");
const employeeIdElement = document.getElementById("employeeId");
const addressElement = document.getElementById("address");
const waNumberElement = document.getElementById("WAnumber");

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
    console.log(data);
    displayManagerData(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
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

function displayManagerData(data) {
  if (data.profilePicture && data.profilePicture.trim() !== "") {
    profilePicElement.src = `data:image/jpeg;base64,${data.profilePicture}`;
  } else {
    profilePicElement.src = "src/user.png";
  }
  fullNameElement.value = data.fullName;
  employeeIdElement.value = data.employeeId;
  addressElement.value = data.address;
  waNumberElement.value = data.wAnumber;
}
document
  .getElementById("editProfile")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const uploadPic = document.getElementById("upload-Pic");
    const newProfPic = uploadPic.files[0];

    const formData = new FormData();
    formData.append("employeeId", employeeIdElement.value);
    formData.append("fullName", fullNameElement.value);
    formData.append("address", addressElement.value);
    formData.append("wAnumber", waNumberElement.value);

    if (newProfPic) {
      formData.append("profilePicture", newProfPic);
    } else {
      const currentProfPicDataUrl = profilePicElement.src;
      if (currentProfPicDataUrl.startsWith("data:image")) {
        const base64String = currentProfPicDataUrl.split(",")[1];
        const mimeType = currentProfPicDataUrl
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const blob = base64ToBlob(base64String, mimeType);
        const file = new File([blob], "currentProfilePicture.jpg", {
          type: mimeType,
        });
        formData.append("profilePicture", file);
      }
    }

    fetch("https://localhost:7033/api/Manager/editProfile?managerId=" + id, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

function base64ToBlob(base64String, mimeType) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}
