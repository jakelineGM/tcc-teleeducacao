document.addEventListener('DOMContentLoaded', () => {
  const cargoSelect = document.getElementById('cargo');

  // Carrega cargos
  fetch('http://localhost:4000/api/cargo')
    .then(res => res.json())
    .then(cargo => {
      cargo.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id_cargo;
        opt.text = c.nome;
        cargoSelect.add(opt);
      });
    });

  // Submeter formulário
  document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (!/^\d{11}$/.test(formData.telefone)) return alert('Telefone inválido! Utilize somente números e insira o DDD');

    try {
      const res = await fetch('http://localhost:4000/api/cadastro-organizadores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Cadastro realizado!');
      window.location.href = "login-organizadores.html";
    } catch (err) {
      console.error(err);
      alert('Erro no cadastro!');
    }
  });
});
