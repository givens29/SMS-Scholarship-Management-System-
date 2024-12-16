const containerListAcademic = document.getElementById("listAcademic");

const token = localStorage.getItem("token");

const id = getId(token);

fetch("https://localhost:7033/api/Student/getlistofAcademic?studentId=" + id, {
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
    if (data === null || data.length === 0) {
      displayEmptyListMessage(containerListAcademic);
    } else {
      displayAcademic(containerListAcademic, data);
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

function displayAcademic(listAcademicDiv, data) {
  listAcademicDiv.innerHTML = "";

  data.forEach((academicRecord) => {
    const periodOfAcademic = academicRecord.periodofAcademic;

    const academicDiv = document.createElement("div");
    academicDiv.classList.add("academic-record");
    academicDiv.style.display = "flex";
    academicDiv.style.justifyContent = "space-between";
    academicDiv.style.alignItems = "center";
    academicDiv.style.padding = "10px";
    academicDiv.style.marginBottom = "10px";
    academicDiv.style.border = "1px solid #ddd";
    academicDiv.style.borderRadius = "5px";

    const detailsContainer = document.createElement("div");
    detailsContainer.style.flexGrow = "1";

    const transcriptDownloadLink = createDownloadLink(
      academicRecord.transcriptRecord,
      periodOfAcademic + "_transcript.pdf"
    );

    const verificationLetterDownloadLink = createDownloadLink(
      academicRecord.verificationLetter,
      periodOfAcademic + "_verification_letter.pdf"
    );

    const periodParagraph = document.createElement("p");
    periodParagraph.textContent = "Period of Academic: " + periodOfAcademic;

    detailsContainer.appendChild(transcriptDownloadLink);
    detailsContainer.appendChild(verificationLetterDownloadLink);
    detailsContainer.appendChild(periodParagraph);

    const removeButtonContainer = document.createElement("div");
    removeButtonContainer.style.display = "flex";
    removeButtonContainer.style.alignItems = "center";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("btn");
    removeButton.onclick = () => removeAcademic(academicRecord.id);

    removeButtonContainer.appendChild(removeButton);

    academicDiv.appendChild(detailsContainer);
    academicDiv.appendChild(removeButtonContainer);

    listAcademicDiv.appendChild(academicDiv);
  });
}

function createDownloadLink(data, fileName) {
  const link = document.createElement("a");
  link.href = "data:application/pdf;base64," + data;
  link.download = fileName;
  link.textContent = fileName;
  link.style.marginRight = "10px";
  return link;
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

function removeAcademic(academicId) {
  fetch(
    `https://localhost:7033/api/Student/deleteAcademic?idAcademic=${academicId}`,
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
