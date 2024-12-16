let notifExpense;
let notifNewStudents;
const notif = document.getElementById("notifBell");
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
    data.forEach((student) => {
      const messageNotif = document.getElementById("notif");

      const hasUnreadMessages = student.sentMessages.some(
        (message) => !message.isRead
      );

      if (hasUnreadMessages) {
        messageNotif.style.color = "red";
      }
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

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
    if (data != null || data.length != 0) {
      notif.style.color = "red";
      notifExpense = data;
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

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
    if (data != null || data.length != 0) {
      notif.style.color = "red";
      notifNewStudents = data;
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

document
  .getElementById("notifBell")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const modal = document.getElementById("expenseModal");
    const modalBody = document.getElementById("modalBody");
    const notification = document.getElementById("notifications");

    notifExpense.forEach((notif) => {
      const container = document.createElement("div");
      container.classList.add("notifContainer");
      container.classList.add("container");
      container.style.backgroundColor = "#FCB6B6";

      const expense = document.createElement("h5");
      expense.textContent = "Expense";
      const name = document.createElement("p");
      name.textContent = notif.studentName;

      notification.appendChild(container);
      container.appendChild(expense);
      container.appendChild(name);
      modalBody.appendChild(notification);
    });

    notifNewStudents.forEach((newStudent) => {
      const container = document.createElement("div");
      container.classList.add("notifContainer");
      container.classList.add("container");
      container.style.backgroundColor = "#FCB6B6";

      const expense = document.createElement("h5");
      expense.textContent = "New Student";
      const name = document.createElement("p");
      name.textContent = newStudent.fullName;

      notification.appendChild(container);
      container.appendChild(expense);
      container.appendChild(name);
      modalBody.appendChild(notification);
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
  });
