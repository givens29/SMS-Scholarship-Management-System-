const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("studentID");

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

  const academicElement = document.getElementById("listAcademic");
  const expenseElement = document.getElementById("listExpense");

  idNumberElement.innerHTML = `${data.idNumber}`;
  fullNameElement.innerHTML = `${data.fullName}`;
  const datetimeString = getDateTimeComponents(data.dateOfBirth);
  dateOfBirthElement.innerHTML = datetimeString;
  addressElement.innerHTML = `${data.address}`;

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

  if (data.academics === null || data.academics.length === 0) {
    displayEmptyListMessage(academicElement);
  } else {
    displayAcademic(academicElement, data.academics);
  }

  if (data.expenses === null || data.expenses.length === 0) {
    displayEmptyListMessage(expenseElement);
  } else {
    displayExpenses(expenseElement, data.expenses);
  }
}

function displayEmptyListMessage(container) {
  const messageContainer = document.createElement("div");
  messageContainer.textContent = "The list is empty.";
  messageContainer.style.color = "gray";
  messageContainer.style.fontStyle = "italic";
  messageContainer.style.fontSize = "20px";
  messageContainer.style.textAlign = "center";
  container.appendChild(messageContainer);
}

function displayAcademic(listAcademicDiv, data) {
  data.forEach((academicRecord) => {
    const periodOfAcademic = academicRecord.periodofAcademic;

    const academicDiv = document.createElement("div");
    academicDiv.classList.add("academic-record");

    const transcriptDownloadLink = createDownloadLink(
      academicRecord.transcriptRecord,
      periodOfAcademic + "_transcript.pdf"
    );
    academicDiv.appendChild(transcriptDownloadLink);

    const verificationLetterDownloadLink = createDownloadLink(
      academicRecord.verificationLetter,
      periodOfAcademic + "_verification_letter.pdf"
    );
    academicDiv.appendChild(verificationLetterDownloadLink);

    const periodContainer = document.createElement("div");
    periodContainer.style.display = "flex";
    periodContainer.style.alignItems = "center";

    const periodParagraph = document.createElement("p");
    periodParagraph.textContent = "Period of Academic: " + periodOfAcademic;
    periodContainer.appendChild(periodParagraph);

    academicDiv.appendChild(periodContainer);

    listAcademicDiv.appendChild(academicDiv);
  });
}

function displayExpenses(listExpensesDiv, data) {
  listExpensesDiv.innerHTML = "";

  data.forEach((expenseRecord) => {
    const periodOfExpense = expenseRecord.livingCostPeriod;
    const isProcessed = expenseRecord.isProcess;

    let statusText = "";
    switch (isProcessed) {
      case 0:
        statusText = "Unprocessed";
        break;
      case 1:
        statusText = "Processed";
        break;
      case 2:
        statusText = "Declined";
        break;
    }

    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expense-record");

    const livingCostDownloadLink = createDownloadLink(
      expenseRecord.livingCostDocument,
      periodOfExpense + "_living_cost.pdf"
    );
    expenseDiv.appendChild(livingCostDownloadLink);

    const invoiceDownloadLink = createDownloadLink(
      expenseRecord.invoice,
      periodOfExpense + "_invoice.pdf"
    );
    expenseDiv.appendChild(invoiceDownloadLink);

    const periodContainer = document.createElement("div");
    periodContainer.classList.add("row");
    periodContainer.style.display = "flex";
    periodContainer.style.alignItems = "center";

    const periodParagraph = document.createElement("p");
    periodParagraph.textContent = "Living Cost Period: " + periodOfExpense;
    periodContainer.appendChild(periodParagraph);

    const statusParagraph = document.createElement("p");
    statusParagraph.textContent = "Status: " + statusText;
    statusParagraph.style.marginLeft = "10px";
    periodContainer.appendChild(statusParagraph);

    expenseDiv.appendChild(periodContainer);

    listExpensesDiv.appendChild(expenseDiv);
  });
}
function createDownloadLink(base64String, fileName) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.textContent = fileName;

  return downloadLink;
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
function getDateTimeComponents(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
var modal = document.getElementById("myModal");

var btn = document.getElementById("parent-Container");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function displayStudent(data) {
  const parent = document.getElementById("parentFullName1");
  parent.value = `${data.parent.fullName}`;
}
