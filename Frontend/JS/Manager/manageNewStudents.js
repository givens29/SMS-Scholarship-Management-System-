const token = localStorage.getItem("token");

const id = getId(token);

const idNumberElement = document.getElementById("idNumber");
const fullNameElement = document.getElementById("fullName");
const dateOfBirthElement = document.getElementById("dateOfBirth");
const addressElement = document.getElementById("address");
const waNumberElement = document.getElementById("waNumber");

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

const scholarshipElement = document.getElementById("pdfViewer");

fetch("https://localhost:7033/api/Manager/listofNewStudents", {
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
    const listNewStudent = document.getElementById("listNewStudents");
    if (data === null || data.length === 0) {
      displayEmptyListMessage(listNewStudent);
    } else {
      data.forEach((student) => {
        const card = document.createElement("div");
        card.className = "card mt-5";
        card.style.width = "18rem";

        const ul = document.createElement("ul");
        ul.className = "list-group list-group-flush";

        const li = document.createElement("li");
        li.className = "list-group-item clickable";
        li.textContent = student.fullName;

        li.addEventListener("click", () => {
          showNewStudentModal(student);
        });

        ul.appendChild(li);
        card.appendChild(ul);
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

function showNewStudentModal(student) {
  const modal = document.getElementById("newStudentModal");
  const modalBody = document.getElementById("modalBody");

  idNumberElement.innerHTML = `${student.idNumber}`;
  fullNameElement.innerHTML = `${student.fullName}`;
  dateOfBirthElement.innerHTML = `${student.dateOfBirth}`;
  addressElement.innerHTML = `${student.address}`;
  waNumberElement.innerHTML = `${student.wAnumber}`;

  bankNameElement.innerHTML = `${student.bank.name}`;
  bankAccountNameElement.innerHTML = `${student.bank.accountName}`;
  bankAccountNumberElement.innerHTML = `${student.bank.accountNumber}`;

  parentFullNameElement.innerHTML = `${student.parent.fullName}`;
  parentRelationElement.innerHTML = `${student.parent.relation}`;
  parentAddressElement.innerHTML = `${student.parent.address}`;
  parentEmailElement.innerHTML = `${student.parent.email}`;
  parentWANumberElement.innerHTML = `${student.parent.wAnumber}`;

  universityNameElement.innerHTML = `${student.university.name}`;
  universityAddressElement.innerHTML = `${student.university.address}`;
  universityEmailElement.innerHTML = `${student.university.email}`;
  universityLinkElement.innerHTML = `${student.university.link}`;

  const url = `data:application/pdf;base64,${student.scholarshipContract}`;

  scholarshipElement.src = url;

  document
    .getElementById("acceptButton")
    .addEventListener("click", function (event) {
      isAccept(true, student.id);
    });

  document
    .getElementById("declineButton")
    .addEventListener("click", function (event) {
      isAccept(false, student.id);
    });

  modal.style.display = "block";

  const closeButton = modal.querySelector(".close");
  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function isAccept(isaccept, studentID) {
  fetch(
    "https://localhost:7033/api/Authentication/isAcceptNewStudent?id=" +
      studentID +
      "&accept=" +
      isaccept,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
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
      return response.text();
    })
    .then((data) => {
      window.location.href = "manageNewStudents.html";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
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
