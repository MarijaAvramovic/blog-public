// js/login.js

const API_BASE = 'http://localhost:4100';  

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
     
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user?.username || username);
      localStorage.setItem('name', data.user.name);

  

      
      window.location.href = 'index.html';
    } else {
      alert(data.error || "Login failed. Please check your credentials.");
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Could not connect to server. Make sure backend is running.");
  }
});