const token = localStorage.getItem("token");
const id = getId(token);
let parentId;
let bankId;
let uniId;

const profilePicElement = document.getElementById("profilePicture");
const idNumberElement = document.getElementById("idNumber");
const fullNameElement = document.getElementById("fullName");
const dateOfBirthElement = document.getElementById("dateOfBirth");
const addressElement = document.getElementById("address");
const waNumberElement = document.getElementById("WAnumber");

const bankNameElement = document.getElementById("bankName");
const bankAccountNameElement = document.getElementById("bankAccountName");
const bankAccountNumberElement = document.getElementById("bankAccountNumber");

const parentFullNameElement = document.getElementById("parentFullName");
const parentRelationElement = document.getElementById("parentRelation");
const parentAddressElement = document.getElementById("parentAddress");
const parentEmailElement = document.getElementById("parentEmail");
const parentWANumberElement = document.getElementById("parentWANumber");

const universityNameElement = document.getElementById("universityName");
const universityAddressElement = document.getElementById("universityAddress");
const universityEmailElement = document.getElementById("universityEmail");
const universityLinkElement = document.getElementById("universityLink");

fetch("https://localhost:7033/api/Manager/getStudent?id=" + id, {
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
    displayStudentData(data);
    parentId = data.parentId;
    bankId = data.bankId;
    uniId = data.universityId;
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

function displayStudentData(data) {
  if (data.profilePicture && data.profilePicture.trim() !== "") {
    profilePicElement.src = `data:image/jpeg;base64,${data.profilePicture}`;
  } else {
    profilePicElement.src = "src/user.png";
  }
  idNumberElement.value = data.idNumber;
  fullNameElement.value = data.fullName;
  const datetimeString = data.dateOfBirth;
  const datePart = datetimeString.split("T")[0];
  dateOfBirthElement.value = datePart;
  addressElement.value = data.address;
  waNumberElement.value = data.wAnumber;

  bankNameElement.value = data.bank.name;
  bankAccountNameElement.value = data.bank.accountName;
  bankAccountNumberElement.value = data.bank.accountNumber;

  parentFullNameElement.value = data.parent.fullName;
  parentRelationElement.value = data.parent.relation;
  parentAddressElement.value = data.parent.address;
  parentEmailElement.value = data.parent.email;
  parentWANumberElement.value = data.parent.wAnumber;

  universityNameElement.value = data.university.name;
  universityAddressElement.value = data.university.address;
  universityEmailElement.value = data.university.email;
  universityLinkElement.value = data.university.link;
}

document
  .getElementById("editProfile")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const uploadPic = document.getElementById("upload-Pic");
    const newProfPic = uploadPic.files[0];

    const formData = new FormData();
    formData.append("IDNumber", idNumberElement.value);
    formData.append("fullName", fullNameElement.value);
    formData.append("dateOfBirth", dateOfBirthElement.value);
    formData.append("address", addressElement.value);
    formData.append("WAnumber", waNumberElement.value);
    formData.append("address", addressElement.value);

    if (newProfPic) {
      formData.append("profilePicture", newProfPic);
    } else {
      const currentProfPicDataUrl = profilePicElement.src;
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

    fetch("https://localhost:7033/api/Student/editProfile?studentId=" + id, {
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

document
  .getElementById("editParent")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const parentData = {
      fullName: parentFullNameElement.value,
      relation: parentRelationElement.value,
      address: parentAddressElement.value,
      email: parentEmailElement.value,
      wAnumber: parentWANumberElement.value,
    };

    fetch(
      "https://localhost:7033/api/Student/editParent?idParent=" + parentId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parentData),
      }
    )
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

document.getElementById("editUni").addEventListener("click", function (event) {
  event.preventDefault();

  const uniData = {
    name: universityNameElement.value,
    address: universityAddressElement.value,
    email: universityEmailElement.value,
    link: universityLinkElement.value,
  };

  fetch("https://localhost:7033/api/Student/editUniversity?idUni=" + uniId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(uniData),
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

document.getElementById("editBank").addEventListener("click", function (event) {
  event.preventDefault();

  const bankData = {
    name: bankNameElement.value,
    accountName: bankAccountNameElement.value,
    accountNumber: bankAccountNumberElement.value,
  };
  fetch("https://localhost:7033/api/Student/editBank?idBank=" + bankId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bankData),
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
