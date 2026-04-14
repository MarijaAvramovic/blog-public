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
 
loadPosts();