const containerListExpenses = document.getElementById("listExpense");

const token = localStorage.getItem("token");

const id = getId(token);

fetch(`https://localhost:7033/api/Student/getlistofExpense?studentId=${id}`, {
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
    if (data === null || data.length === 0) {
      displayEmptyListMessage(containerListExpenses);
    } else {
      displayExpenses(containerListExpenses, data);
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

function displayExpenses(listExpensesDiv, data) {
  listExpensesDiv.innerHTML = "";

  data.forEach((expenseRecord) => {
    const periodOfExpense = expenseRecord.livingCostPeriod;
    const costExpense = expenseRecord.cost;
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
    expenseDiv.style.display = "flex";
    expenseDiv.style.justifyContent = "space-between";
    expenseDiv.style.alignItems = "center";
    expenseDiv.style.padding = "10px";
    expenseDiv.style.marginBottom = "10px";
    expenseDiv.style.border = "1px solid #ddd";
    expenseDiv.style.borderRadius = "5px";

    const detailsContainer = document.createElement("div");
    detailsContainer.style.flexGrow = "1";

    const periodParagraph = document.createElement("p");
    periodParagraph.textContent = "Living Cost Period: " + periodOfExpense;

    const costParagraph = document.createElement("p");
    costParagraph.textContent = "Cost: " + costExpense;

    const statusParagraph = document.createElement("p");
    statusParagraph.textContent = statusText;
    statusParagraph.style.fontWeight = "bold";
    statusParagraph.style.fontStyle = "italic";

    const livingCostDownloadLink = createDownloadLink(
      expenseRecord.livingCostDocument,
      periodOfExpense + "_living_cost.pdf"
    );

    const invoiceDownloadLink = createDownloadLink(
      expenseRecord.invoice,
      periodOfExpense + "_invoice.pdf"
    );

    detailsContainer.appendChild(livingCostDownloadLink);
    detailsContainer.appendChild(invoiceDownloadLink);
    detailsContainer.appendChild(periodParagraph);
    detailsContainer.appendChild(costParagraph);
    detailsContainer.appendChild(statusParagraph);

    const removeButtonContainer = document.createElement("div");
    removeButtonContainer.style.display = "flex";
    removeButtonContainer.style.alignItems = "center";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("btn");
    removeButton.onclick = () => removeExpense(expenseRecord.id);

    removeButtonContainer.appendChild(removeButton);

    expenseDiv.appendChild(detailsContainer);
    expenseDiv.appendChild(removeButtonContainer);

    listExpensesDiv.appendChild(expenseDiv);
  });
}

function createDownloadLink(fileUrl, fileName) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.textContent = fileName;
  link.download = fileName;
  return link;
}

function removeExpense(expenseId) {
  console.log("Removing expense with ID:", expenseId);
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

function removeExpense(expenseId) {
  console.log("Removing expense with ID:", expenseId);

  fetch(
    `https://localhost:7033/api/Student/deleteExpense?idExpense=${expenseId}`,
    {
      method: "DELETE",
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
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
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
