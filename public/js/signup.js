document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
      const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
          alert('Signup successful! Please login.');
          window.location.href = '/'; // Redirect to login page
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error('Signup error:', error);
  }
});