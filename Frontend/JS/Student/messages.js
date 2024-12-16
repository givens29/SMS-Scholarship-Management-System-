const token = localStorage.getItem("token");

const id = getId(token);

let managerName;
let managerId;

document
  .getElementById("sendMessage-button")
  .addEventListener("click", function () {
    var myModal = new bootstrap.Modal(
      document.getElementById("sendMessageModal")
    );
    myModal.show();
  });

document
  .getElementById("sendMessageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const messageTo = document.getElementById("messageTo").value;
    const messageFrom = document.getElementById("messageFrom").value;
    const messageSubject = document.getElementById("messageSubject").value;
    const messageBody = document.getElementById("messageBody").value;
    const messageAttachments =
      document.getElementById("messageAttachments").files;

    alert("Message sent successfully!");

    var myModal = bootstrap.Modal.getInstance(
      document.getElementById("sendMessageModal")
    );
    myModal.hide();

    document.getElementById("sendMessageForm").reset();
  });

fetch("https://localhost:7033/api/Message/getMessages?id=" + id, {
  method: "GET",
  headers: {
    Accept: "*/*",
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
    let isread;
    data.forEach((manager) => {
      const messageNotif = document.getElementById("notif");

      const hasUnreadMessages = manager.sentMessages.some(
        (message) => !message.isRead
      );

      if (hasUnreadMessages) {
        messageNotif.style.color = "red";
        isread = true;
      } else {
        isread = false;
      }

      fetchManagerDetails(manager.id, isread);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function fetchManagerDetails(userId, isread) {
  fetch("https://localhost:7033/api/Student/getManager?managerId=" + userId, {
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
      managerName = data.fullName;
      managerId = data.accountId;
      const listMessages = document.getElementById("listMessages");
      const name = document.createElement("h5");
      name.textContent = data.fullName;
      const container = document.createElement("div");
      container.classList.add("container", "mt-5");
      container.appendChild(name);

      if (isread) {
        container.style.backgroundColor = "#FCB6B6";
      }

      container.addEventListener("click", () => {
        fetchConvo(userId);
      });
      listMessages.appendChild(container);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchConvo(managerId) {
  fetch(
    "https://localhost:7033/api/Message/getConversation?currentUserId=" +
      id +
      "&otherUserId=" +
      managerId,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
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
      displayConversation(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayConversation(data) {
  const listConversations = document.getElementById("listConversations");
  const conversationContainer = document.createElement("div");
  conversationContainer.classList.add(
    "conversation-container",
    "mt-5",
    "conversation-box"
  );

  const combinedMessages = data.sentMessages
    .map((message) => ({
      ...message,
      type: "sent",
    }))
    .concat(
      data.receivedMessages.map((message) => ({
        ...message,
        type: "received",
      }))
    );

  combinedMessages.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  combinedMessages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "mt-5", message.type);

    const formattedDateTime = formatDateTime(message.dateTime);

    messageElement.textContent = `${
      message.type === "sent" ? "You" : managerName
    }: ${message.body} (${formattedDateTime})`;

    const deleteButton = document.createElement("p");
    deleteButton.textContent = "delete";
    deleteButton.classList.add("delete", "ms-3");
    deleteButton.addEventListener("click", function () {
      DeleteMessage(message.id);
    });

    messageElement.appendChild(deleteButton);
    conversationContainer.appendChild(messageElement);
  });

  listConversations.innerHTML = "";
  listConversations.appendChild(conversationContainer);

  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container", "mt-3");

  const messageForm = document.createElement("form");
  messageForm.classList.add("message-form", "d-flex", "align-items-start");

  const uploadInput = document.createElement("input");
  uploadInput.type = "file";
  uploadInput.classList.add("form-control", "me-3");

  const textBox = document.createElement("textarea");
  textBox.classList.add("form-control", "me-3");
  textBox.placeholder = "Type your message here...";
  textBox.rows = 3;

  const sendButton = document.createElement("button");
  sendButton.type = "submit";
  sendButton.classList.add("btn");
  sendButton.textContent = "Send";

  sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("senderId", data.id);
    formData.append("recipientId", managerId);
    formData.append("subject", "New Message");
    formData.append("body", textBox.value);

    const now = new Date();
    const dateTime = now.toISOString();
    formData.append("dateTime", dateTime);

    if (uploadInput.files.length > 0) {
      formData.append("file", uploadInput.files[0]);
    }
    console.log(formData);

    fetch(
      "https://localhost:7033/api/Message/sendMessage?senderId=" +
        data.id +
        "&receipantId=" +
        managerId,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  });

  messageForm.appendChild(uploadInput);
  messageForm.appendChild(textBox);
  messageForm.appendChild(sendButton);
  formContainer.appendChild(messageForm);
  listConversations.appendChild(formContainer);
}

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function DeleteMessage(messageID) {
  fetch(
    "https://localhost:7033/api/Message/deleteMessage?idMessage=" + messageID,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error sending message:", error);
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
