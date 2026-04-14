// js/main.js

const API_BASE = 'http://localhost:4100';    

async function loadPosts() {
  const postsContainer = document.getElementById('posts-container');
  
  try {
    const response = await fetch(`${API_BASE}/api/posts`);
    const result = await response.json();

    if (!result.success || !result.posts || result.posts.length === 0) {
      postsContainer.innerHTML = `
        <p style="text-align: center; grid-column: 1 / -1; color: #666; padding: 2rem;">
          No posts available yet.
        </p>`;
      return;
    }

    let html = '';

    result.posts.forEach(post => {
      const commentCount = post.comments ? post.comments.length : 0;

      html += `
        <div class="post-card">
          <h4>${post.title}</h4>
          <p class="meta">
            By ${post.author?.name || post.author?.username || 'Unknown'} • 
            ${new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p>${post.content.substring(0, 180)}${post.content.length > 180 ? '...' : ''}</p>
          
          <div class="post-footer">
            <span class="comment-count">
              💬 ${commentCount} comment${commentCount !== 1 ? 's' : ''}
            </span>
            <a href="post.html?id=${post.id}" class="read-more">Read Full Post</a>
          </div>
        </div>
      `;
    });

    postsContainer.innerHTML = html;

  } catch (error) {
    console.error('Error loading posts:', error);
    postsContainer.innerHTML = `
      <p style="text-align: center; grid-column: 1 / -1; color: #e74c3c; padding: 2rem;">
        Could not load posts. Make sure your backend server is running.
      </p>`;
  }
}
 function updateAuthUI() {
  const nav = document.querySelector('nav');   // finds the <nav> in index.html
  
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    // User is logged in → show name and logout
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <span style="color: white; font-weight: 500; padding: 10px 18px;">
        Hello, ${username}
      </span>
      <a href="#" onclick="logoutUser(event)">Logout</a>
    `;
  } else {
    // User is not logged in → show login/register
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
      <a href="admin-login.html" class="admin-link">Admin Login</a>
    `;
  }
}

// Logout function
window.logoutUser = function(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  alert("You have been logged out.");
  window.location.href = 'index.html';
};

// ==================== Initialize everything ====================
loadPosts();
updateAuthUI();