let notifExpense;
let notifNewStudents;

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
