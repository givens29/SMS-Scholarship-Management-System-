const token = localStorage.getItem("token");

const id = getId(token);

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
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function displayStudentData(data) {
  const idNumberElement = document.getElementById("idNumber");
  const fullNameElement = document.getElementById("fullName");
  const dateOfBirthElement = document.getElementById("dateOfBirth");
  const addressElement = document.getElementById("address");
  const waNumberElement = document.getElementById("wAnumber");
  const profilePicElement = document.getElementById("profilePicture");

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

  idNumberElement.innerHTML = `${data.idNumber}`;
  fullNameElement.innerHTML = `${data.fullName}`;
  const datetimeString = getDateTimeComponents(data.dateOfBirth);
  dateOfBirthElement.innerHTML = datetimeString;
  addressElement.innerHTML = `${data.address}`;
  addressElement.innerHTML = `${data.wAnumber}`;

  bankNameElement.innerHTML = `${data.bank.name}`;
  bankAccountNameElement.innerHTML = `${data.bank.accountName}`;
  bankAccountNumberElement.innerHTML = `${data.bank.accountNumber}`;

  parentFullNameElement.innerHTML = `${data.parent.fullName}`;
  parentRelationElement.innerHTML = `${data.parent.relation}`;
  parentAddressElement.innerHTML = `${data.parent.address}`;
  parentEmailElement.innerHTML = `${data.parent.email}`;
  parentWANumberElement.innerHTML = `${data.parent.wAnumber}`;

  universityNameElement.innerHTML = `${data.university.name}`;
  universityAddressElement.innerHTML = `${data.university.address}`;
  universityEmailElement.innerHTML = `${data.university.email}`;
  universityLinkElement.innerHTML = `${data.university.link}`;
  universityLinkElement.href = `${data.university.link}`;

  if (data.profilePicture && data.profilePicture.length > 0) {
    profilePicElement.src = `data:image/jpeg;base64,${data.profilePicture}`;
  } else {
    profilePicElement.src = "src/user.png";
    profilePicElement.alt = "No profile picture available";
  }
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

function getDateTimeComponents(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
