// Base URL for API
const baseURL = "https://tarmeezacademy.com/api/v1";

// Update the UI based on login status
function setupUi() {
  const token = localStorage.getItem("Token");

  const loginDiv = document.getElementById("loginDiv");
  const logoutDiv = document.getElementById("logoutDiv");

  // add btn
  const addBtn = document.getElementById("add-btn");

  if (token == null) {
    // user is guest (not logged in)
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }

    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    // for logged in user

    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }

    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

// Display a custom alert message
function showAlert(message, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const alertBox = document.createElement("div");
  alertBox.innerHTML = `
              <div class="alert alert-${type} alert-dismissible" role="alert">
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
  alertPlaceholder.append(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 2500);
}

//   ===== Auth Functions =====
// Register a new user
function registerBtnClick() {
  let image = document.getElementById("register-image-input").files[0];
  let name = document.getElementById("register-name-input").value;
  let username = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;

  let formData = new FormData();
  formData.append("image", image);
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);

  let headers = {
    "Content-Type": "multipart/form-data",
  };

  let url = `${baseURL}/register`;

  axios
    .post(url, formData, { headers })
    .then((response) => {
      let token = response.data.token;
      let user = response.data.user;
      localStorage.setItem("Token", token);
      localStorage.setItem("User", JSON.stringify(user));

      hideModal("register-modal");
      showAlert("Your Account Was Created Successfully!", "success");
      setupUi();
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// Log in
function loginBtnClick() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  let params = { username, password };
  let url = `${baseURL}/login`;

  axios
    .post(url, params)
    .then((response) => {
      let token = response.data.token;
      let user = response.data.user;
      localStorage.setItem("Token", token);
      localStorage.setItem("User", JSON.stringify(user));

      hideModal("login-modal");
      showAlert("Logged in successfully!", "success");
      setupUi();
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// Log out
function logoutClick() {
  localStorage.removeItem("Token");
  localStorage.removeItem("User");

  showAlert("Logged out successfully!", "success");
  setupUi();
}

// Hide the modal after the operation
function hideModal(modalId) {
  const modalElement = document.getElementById(modalId);
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
}

// Get Current User logged in
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("User");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
