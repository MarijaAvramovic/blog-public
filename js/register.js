// js/register.js

const API_BASE = 'http://localhost:4100';

document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const name = document.getElementById('name').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert("Username and password are required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username, 
        name: name || username,   // fallback to username if name is empty
        password 
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! You can now login.");
      window.location.href = 'login.html';
    } else {
      alert(data.error || "Registration failed. Please try again.");
    }

  } catch (error) {
    console.error("Register error:", error);
    alert("Could not connect to server. Make sure your backend is running.");
  }
});