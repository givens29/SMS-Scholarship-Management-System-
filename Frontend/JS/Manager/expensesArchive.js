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

fetch("https://localhost:7033/api/Manager/getlistofProcessedExpenses", {
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
    const listExpenseArchive = document.getElementById(
      "listStudentsArchiveExpenses"
    );
    if (data === null || data.length === 0) {
      displayEmptyListMessage(listExpenseArchive);
    } else {
      data.forEach((expense) => {
        const container = document.createElement("div");
        container.classList.add("container", "mt-5");

        const rowName = document.createElement("div");
        rowName.classList.add("row");
        const colName = document.createElement("div");
        colName.classList.add("col");
        colName.textContent = "Student Name: " + expense.studentName;
        rowName.appendChild(colName);

        const rowDate = document.createElement("div");
        rowDate.classList.add("row");
        const colDate = document.createElement("div");
        colDate.classList.add("col");
        colDate.textContent = "Date: " + expense.dateTime;
        rowDate.appendChild(colDate);

        const rowPeriod = document.createElement("div");
        rowPeriod.classList.add("row");
        const colPeriod = document.createElement("div");
        colPeriod.classList.add("col");
        colPeriod.textContent =
          "Living Cost Period: " + expense.livingCostPeriod;
        rowPeriod.appendChild(colPeriod);

        const rowDocuments = document.createElement("div");
        rowDocuments.classList.add("row");
        const colLivingCost = document.createElement("div");
        colLivingCost.classList.add("col");
        const livingCostDownloadLink = createDownloadLink(
          expense.livingCostDocument,
          "LivingCost.pdf"
        );
        colLivingCost.appendChild(livingCostDownloadLink);

        const colInvoice = document.createElement("div");
        colInvoice.classList.add("col");
        const invoiceDownloadLink = createDownloadLink(
          expense.invoice,
          "Invoice.pdf"
        );
        colInvoice.appendChild(invoiceDownloadLink);

        rowDocuments.appendChild(colLivingCost);
        rowDocuments.appendChild(colInvoice);

        container.appendChild(rowName);
        container.appendChild(rowDate);
        container.appendChild(rowPeriod);
        container.appendChild(rowDocuments);

        listExpenseArchive.appendChild(container);
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
