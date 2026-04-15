// js/post.js

const API_BASE = 'http://localhost:4100';
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
  window.location.href = 'index.html';
}

// Check if user is logged in
const token = localStorage.getItem('token');

if (!token) {
  alert("You need to login to view this post.");
  window.location.href = 'login.html';
  // Stop further execution
} else {
  // User is logged in → load the post
  loadPost();
}

// ==================== Load Single Post ====================
async function loadPost() {
  const postContent = document.getElementById('post-content');
  const commentsSection = document.getElementById('comments-section');
  const commentForm = document.getElementById('comment-form');

  try {
    const response = await fetch(`${API_BASE}/api/posts/${postId}`);
    const result = await response.json();

    if (!result.success || !result.post) {
      postContent.innerHTML = `<p style="color: red;">Post not found.</p>`;
      return;
    }

    const post = result.post;

    // Show full post
    postContent.innerHTML = `
      <h2>${post.title}</h2>
      <p class="meta">
        By ${post.author?.name || post.author?.username} • 
        ${new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div class="content">${post.content}</div>
    `;

    // Show comments section
    commentsSection.style.display = 'block';

    // Show comment form only if logged in (already checked above)
    commentForm.style.display = 'block';

    // Render comments
    renderComments(post.comments || []);

  } catch (error) {
    console.error(error);
    postContent.innerHTML = `<p style="color: red;">Failed to load post.</p>`;
  }
}

function renderComments(comments) {
  const commentsList = document.getElementById('comments-list');
  if (comments.length === 0) {
    commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
    return;
  }

  let html = '';
  comments.forEach(comment => {
    html += `
      <div class="comment">
        <strong>${comment.author?.name || comment.author?.username}</strong>
        <p>${comment.content}</p>
        <small>${new Date(comment.createdAt).toLocaleString()}</small>
      </div>
    `;
  });
  commentsList.innerHTML = html;
}

// Submit new comment
window.submitComment = async function() {
  const content = document.getElementById('comment-text').value.trim();
  if (!content) {
    alert("Comment cannot be empty");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    });

    const result = await response.json();

    if (result.success) {
     
      document.getElementById('comment-text').value = '';
      loadPost(); // refresh comments
    } else {
      alert(result.error || "Failed to post comment");
    }
  } catch (error) {
    alert("Error posting comment");
  }
};