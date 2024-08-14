document.addEventListener('DOMContentLoaded', () => {
  // Get all comment buttons and attach event listeners
  document.querySelectorAll('.comment-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const postId = event.target.getAttribute('data-id');
      const commentForm = document.getElementById(`comment-form-${postId}`);
      commentForm.style.display = 'block';
    });
  });

  // Handle submit button click
  document.querySelectorAll('.submit-comment').forEach(button => {
    button.addEventListener('click', (event) => {
      const postId = event.target.closest('.comment-form-container').id.replace('comment-form-', '');
      const commentForm = document.getElementById(`comment-form-${postId}`);
      const textarea = commentForm.querySelector('textarea');
      const message = textarea.value;
      
      // Logic to handle form submission
      console.log('Comment submitted:', message);

      // Hide the form after submission
      commentForm.style.display = 'none';
    });
  });

  // Handle cancel button click
  document.querySelectorAll('.cancel-comment').forEach(button => {
    button.addEventListener('click', (event) => {
      const commentForm = event.target.closest('.comment-form-container');
      commentForm.style.display = 'none';
    });
  });
});