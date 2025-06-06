document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch('http://localhost:4000/api/organizador-login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (res.ok) {

      // Armazena os dados do usuário no localStorage
      localStorage.setItem('usuarioLogado', JSON.stringify(result.usuario));

      alert(result.message);
      // Redirecionará para a tela pricipal do organizador
      //window.location.href = "dashboard-organizador.html";
    } else {
      alert(result.message || 'Erro no login');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar ao servidor');
  }
});
