document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch('http://localhost:4000/api/publico-login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      // Redirecionar para dashboard ou outra página
      window.location.href = "index.html"; // ajusta depois
    } else {
      alert(result.message || 'Erro no login');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar ao servidor');
  }
});
