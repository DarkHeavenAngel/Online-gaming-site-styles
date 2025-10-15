const BACKEND_URL = "http://127.0.0.1:8000";

function isLoggedIn() {
  return localStorage.getItem("accessToken") !== null;
}

function setUser(username) {
  localStorage.setItem("username", username);
}

function getUser() {
  return localStorage.getItem("username");
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "public.html";
}

function protectPrivatePage() {
  if (!isLoggedIn()) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname.split("/").pop());
    window.location.href = "login.html";
  }
}

function redirectAfterLogin() {
  const redirect = localStorage.getItem("redirectAfterLogin") || "private.html";
  localStorage.removeItem("redirectAfterLogin");
  window.location.href = redirect;
}

function updateNav() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userSpan = document.getElementById("userSpan");

  if (isLoggedIn()) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline";
    if (userSpan) userSpan.textContent = getUser();
  } else {
    if (loginBtn) loginBtn.style.display = "inline";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userSpan) userSpan.textContent = "";
  }
}

// 🔹 Функція реєстрації користувача
function registerUser() {
  const username = document.getElementById("regUsername").value;
  const first_name = document.getElementById("regFirstName").value;
  const last_name = document.getElementById("regLastName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const password_check = document.getElementById("regPasswordCheck").value;

  const errorDiv = document.getElementById("errorMessages");
  errorDiv.innerHTML = "";

  fetch(`${BACKEND_URL}/auth/register/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, first_name, last_name, email, password, password_check })
  })
  .then(async res => {
    const data = await res.json();

    if (res.status === 201) {
      alert("Registered successfully! You can now log in.");
      window.location.href = "login.html";
    } else if (res.status === 400) {
      // показуємо всі помилки валідації з бекенду
      for (const key in data) {
        const messages = Array.isArray(data[key]) ? data[key] : [data[key]];
        messages.forEach(msg => {
          const p = document.createElement("p");
          p.textContent = `${key}: ${msg}`;
          p.style.color = "red";
          errorDiv.appendChild(p);
        });
      }
    } else {
      errorDiv.textContent = "Unknown error. Try again later.";
    }
  })
  .catch(err => {
    errorDiv.textContent = "Something went wrong. Please try again.";
    console.error(err);
  });
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");
  errorDiv.innerHTML = "";

  fetch(`${BACKEND_URL}/auth/api/token/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data => {
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setUser(username);
      redirectAfterLogin();
    } else {
      errorDiv.textContent = "Invalid credentials";
      errorDiv.style.color = "red";
    }
  })
  .catch(err => {
    errorDiv.textContent = "Login failed. Please try again.";
    errorDiv.style.color = "red";
    console.error(err);
  });
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = localStorage.getItem("redirectAfterLogin") || "private.html";
  }
}
