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

fetch("https://localhost:7033/api/Manager/getlistofUnprocessedExpenses", {
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
    const listExpenses = document.getElementById("listStudentsExpenses");
    if (data === null || data.length === 0) {
      displayEmptyListMessage(listExpenses);
    } else {
      displayExpenses(listExpenses, data);
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

function displayExpenses(listExpensesDiv, data) {
  const groupedExpenses = groupExpensesByStudent(data);

  Object.keys(groupedExpenses).forEach((studentName) => {
    const studentDiv = document.createElement("div");
    studentDiv.classList.add("student");

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = studentName;
    studentDiv.appendChild(nameParagraph);

    studentDiv.addEventListener("click", () => {
      showUnprocessedExpensesModal(studentName, groupedExpenses[studentName]);
    });

    listExpensesDiv.appendChild(studentDiv);
  });
}

function groupExpensesByStudent(data) {
  const groupedExpenses = {};

  data.forEach((expenseRecord) => {
    const studentName = expenseRecord.studentName;
    if (!groupedExpenses[studentName]) {
      groupedExpenses[studentName] = [];
    }
    groupedExpenses[studentName].push(expenseRecord);
  });

  return groupedExpenses;
}

function showUnprocessedExpensesModal(studentName, expenses) {
  const modal = document.getElementById("expenseModal");
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = "";

  const studentNameElement = document.createElement("h3");
  studentNameElement.classList.add("studentName");
  studentNameElement.textContent = studentName;
  modalBody.appendChild(studentNameElement);

  const unprocessedExpenses = expenses.filter((expense) => !expense.processed);
  unprocessedExpenses.forEach((expenseRecord) => {
    const bankName = document.createElement("p");
    bankName.textContent = `Bank: ${expenseRecord.bankInfo.name}`;
    modalBody.appendChild(bankName);

    const accountName = document.createElement("p");
    accountName.textContent = `Account Name: ${expenseRecord.bankInfo.accountName}`;
    modalBody.appendChild(accountName);

    const accountNumber = document.createElement("p");
    accountNumber.textContent = `Account Number: ${expenseRecord.bankInfo.accountNumber}`;
    modalBody.appendChild(accountNumber);

    studentNameElement.addEventListener("click", function (event) {
      window.location.href = `profileStudent.html?studentID=${expenseRecord.studentId}`;
    });

    const expenseContainer = document.createElement("div");
    expenseContainer.classList.add("expense-container");
    expenseContainer.style.border = "1px solid #ccc";
    expenseContainer.style.padding = "10px";
    expenseContainer.style.marginBottom = "10px";

    const date = document.createElement("p");
    date.textContent = getDateTimeComponents(expenseRecord.dateTime);
    expenseContainer.appendChild(date);

    const periodParagraph = document.createElement("p");
    periodParagraph.textContent = expenseRecord.livingCostPeriod;
    expenseContainer.appendChild(periodParagraph);

    const cost = document.createElement("p");
    cost.textContent = expenseRecord.cost;
    expenseContainer.appendChild(cost);

    const livingCostDownloadLink = createDownloadLink(
      expenseRecord.livingCostDocument,
      "LivingCost.pdf"
    );
    expenseContainer.appendChild(livingCostDownloadLink);

    const invoiceDownloadLink = createDownloadLink(
      expenseRecord.invoice,
      "Invoice.pdf"
    );
    expenseContainer.appendChild(invoiceDownloadLink);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "end";

    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accept";
    acceptButton.classList.add("btn", "btn-accept");
    acceptButton.style.marginRight = "10px";
    acceptButton.onclick = () => {
      isAcceptExpense(expenseRecord.idExpense, true);
      modal.style.display = "none";
    };
    buttonContainer.appendChild(acceptButton);

    const declineButton = document.createElement("button");
    declineButton.textContent = "Decline";
    declineButton.classList.add("btn", "btn-decline");
    declineButton.style.marginLeft = "10px";
    declineButton.onclick = () => {
      isAcceptExpense(expenseRecord.idExpense, false);
      modal.style.display = "none";
    };
    buttonContainer.appendChild(declineButton);

    expenseContainer.appendChild(buttonContainer);

    modalBody.appendChild(expenseContainer);
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

function isAcceptExpense(id, isAccept) {
  fetch(
    "https://localhost:7033/api/Manager/processExpense?idExpense=" +
      id +
      "&isProcess=" +
      isAccept,
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
      alert(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });
}

function getDateTimeComponents(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hour}:${minute}`;
}
