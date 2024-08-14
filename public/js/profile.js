document.addEventListener('DOMContentLoaded', () => {
  let currentUserId = null;

  // Fetch current user info
  fetch('/api/current-user')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch current user');
      return response.json();
    })
    .then(data => {
      currentUserId = data.userId;
    })
    .catch(error => {
      console.error('Error fetching current user:', error);
    });

  // Function to fetch and display comments for a specific post
  function loadComments() {
    fetch('/api/comments')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
      })
      .then(comments => {
        comments.forEach(comment => {
          const postId = comment.post.id;
          const commentsContainer = document.getElementById(`comments-container-${postId}`);
          if (!commentsContainer) return;
  
          const commentElement = document.createElement('div');
          commentElement.classList.add('comment');
          commentElement.innerHTML = `
            <p>${comment.message}</p>
            <p>By ${comment.user.name} on ${new Date(comment.date_created).toLocaleString()}</p>
          `;
          commentsContainer.appendChild(commentElement);
        });
      })
      .catch(error => {
        console.error('Error loading comments:', error);
      });
  }

  // Load comments for each post on page load
  document.querySelectorAll('.project').forEach(post => {
    const postId = post.querySelector('.js-modal-trigger').getAttribute('data-id');
    loadComments(postId);
  });

  // Attach event listeners to comment buttons
  document.querySelectorAll('.js-modal-trigger').forEach(button => {
    button.addEventListener('click', (event) => {
      const postId = event.target.getAttribute('data-id');
      const modal = document.getElementById(`modal-${postId}`);
      if (modal) {
        modal.classList.add('is-active');
      }
    });
  });

  // Handle submit button click
  document.querySelectorAll('.submit-comment').forEach(button => {
    button.addEventListener('click', async (event) => {
      const postId = event.target.getAttribute('data-id');
      const modal = document.getElementById(`modal-${postId}`);
      const textarea = modal.querySelector('textarea');
      const message = textarea.value.trim();

      if (!currentUserId || !message) {
        alert('Please enter a comment and ensure you are logged in.');
        return;
      }

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, userId: currentUserId, message })
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const result = await response.json();
        console.log('Comment submitted successfully:', result);

        // Reload comments after submission
        loadComments();

        modal.classList.remove('is-active'); // Close the modal
        textarea.value = '';
      } catch (error) {
        console.error('Error submitting comment:', error);
        alert('There was an error submitting your comment. Please try again.');
      }
    });
  });

  // Handle cancel button click
  document.querySelectorAll('.cancel-comment').forEach(button => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal');
      if (modal) {
        modal.classList.remove('is-active');
      }
    });
  });

  // Close modal when clicking outside of it
  document.querySelectorAll('.modal-background').forEach(background => {
    background.addEventListener('click', () => {
      background.parentElement.classList.remove('is-active');
    });
  });
});