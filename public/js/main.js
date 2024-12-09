// public/js/main.js
function switchTab(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelector(`.tab:${tab === "login" ? "first-child" : "last-child"}`)
    .classList.add("active");

  document.getElementById("loginForm").style.display =
    tab === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display =
    tab === "register" ? "block" : "none";
  document.getElementById("userData").style.display = "none";

  // Clear messages
  document.getElementById("loginMessage").textContent = "";
  document.getElementById("registerMessage").textContent = "";
}

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("registerMessage").textContent = data.message;
        document.getElementById("registerMessage").className = "success";
        document.getElementById("registerForm").reset();
      } else {
        document.getElementById("registerMessage").textContent = data.error;
        document.getElementById("registerMessage").className = "error";
      }
    } catch (error) {
      document.getElementById("registerMessage").textContent = "Server error";
      document.getElementById("registerMessage").className = "error";
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("loginMessage").textContent =
          "Login successful!";
        document.getElementById("loginMessage").className = "success";
        document.getElementById("loginForm").reset();

        // Show user data
        document.getElementById("userName").textContent = data.user.name;
        document.getElementById("userData").style.display = "block";
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "none";
      } else {
        document.getElementById("loginMessage").textContent = data.error;
        document.getElementById("loginMessage").className = "error";
      }
    } catch (error) {
      document.getElementById("loginMessage").textContent = "Server error";
      document.getElementById("loginMessage").className = "error";
    }
  });

function logout() {
  document.getElementById("userData").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("loginMessage").textContent = "";
}
