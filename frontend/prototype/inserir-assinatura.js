// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-assinatura');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/assinaturas', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Assinatura inserida com sucesso!');
        form.reset();
      } else {
        alert(`Erro: ${result.error || 'Erro ao inserir assinatura.'}`);
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao enviar o formulário.');
    }
  });
});

// Personalizar navbar
function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
    const entrarBtn = document.querySelector('.navbar-principal .entrar');
    if (entrarBtn) entrarBtn.outerHTML = avatar;
  }
}
