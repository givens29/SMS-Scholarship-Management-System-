document
  .getElementById("logoutBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const role = getRoleFromToken(token);

    if (role === "Manager") {
      localStorage.removeItem("token");
      window.location.href = "/HTML/Manager/login.html";
    } else {
      localStorage.removeItem("token");
      window.location.href = "/HTML/Student/login.html";
    }
  });

function getRoleFromToken(token) {
  // Split the token into its three parts: header, payload, signature
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  // Decode the payload from Base64URL
  const payload = JSON.parse(
    atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
  );

  // Extract the role claim
  const role =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!role) {
    throw new Error("Role claim not found in token");
  }

  return role;
}
