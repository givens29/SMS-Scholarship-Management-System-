let currentStep = 0;
const steps = document.querySelectorAll(".step");

function showStep(step) {
  steps.forEach((stepDiv, index) => {
    stepDiv.classList.toggle("active", index === step);
  });
}
function validateCurrentStep() {
  const currentStepDiv = steps[currentStep];
  const inputs = currentStepDiv.querySelectorAll("input[required]");
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.value) {
      input.style.backgroundColor = "#E98C8D";
      isValid = false;
    } else {
      input.style.backgroundColor = "";
    }
  });
  return isValid;
}
function nextStep() {
  if (validateCurrentStep() && currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function uploadFile() {
  const fileInput = document.getElementById("pdfFileInput");
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("pdfFile", file);

    `data:application/pdf;base64,${student.scholarshipContract}`;
  } else {
    alert("Please select a PDF file.");
  }
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formProps = {
      IDNumber: document.getElementById("idNumber").value,
      fullName: document.getElementById("fullName").value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
      address: document.getElementById("address").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      WAnumber: document.getElementById("WAnumber").value,
      parentFullName: document.getElementById("parentFullName").value,
      parentRelation: document.getElementById("parentRelation").value,
      parentAddress: document.getElementById("parentAddress").value,
      parentEmail: document.getElementById("parentEmail").value,
      parentWANumber: document.getElementById("parentWANumber").value,
      bankName: document.getElementById("bankName").value,
      bankAccountName: document.getElementById("bankAccountName").value,
      bankAccountNumber: document.getElementById("bankAccountNumber").value,
      universityName: document.getElementById("universityName").value,
      universityAddress: document.getElementById("universityAddress").value,
      universityEmail: document.getElementById("universityEmail").value,
      universityLink: document.getElementById("universityLink").value,
    };

    const fileInput = document.getElementById("pdfFileInput");
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formProps.scholarshipContract = file;

      const formData = new FormData();
      formData.append("IDNumber", formProps.IDNumber);
      formData.append("fullName", formProps.fullName);
      formData.append("dateOfBirth", formProps.dateOfBirth);
      formData.append("address", formProps.address);
      formData.append("email", formProps.email);
      formData.append("password", formProps.password);
      formData.append("WAnumber", formProps.WAnumber);
      formData.append("parent.fullName", formProps.parentFullName);
      formData.append("parent.relation", formProps.parentRelation);
      formData.append("parent.address", formProps.parentAddress);
      formData.append("parent.email", formProps.parentEmail);
      formData.append("parent.WAnumber", formProps.parentWANumber);
      formData.append("bank.name", formProps.bankName);
      formData.append("bank.accountName", formProps.bankAccountName);
      formData.append("bank.accountNumber", formProps.bankAccountNumber);
      formData.append("university.name", formProps.universityName);
      formData.append("university.address", formProps.universityAddress);
      formData.append("university.email", formProps.universityEmail);
      formData.append("university.link", formProps.universityLink);
      formData.append("scholarshipContract", file);

      registerStudent(formData);
    } else {
      alert("No file uploaded");
    }
  });

function registerStudent(formData) {
  fetch("https://localhost:7033/api/Authentication/registerStudent?", {
    method: "POST",
    body: formData,
  })
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
      console.log("Response Text:", data);
      alert(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });
}

function returnError(text) {
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = text;
  errorContainer.appendChild(errorMessage);
}
