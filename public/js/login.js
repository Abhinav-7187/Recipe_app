document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
      const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
          window.location.href = '/recipes'; // Redirect to recipes page
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error('Login error:', error);
  }
});