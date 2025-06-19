// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('lista-assinaturas');

  try {
    const assinaturas = await fetch('/api/assinaturas').then(r => r.json());

    if (!Array.isArray(assinaturas) || assinaturas.length === 0) {
      lista.innerHTML = '<p>Nenhuma assinatura encontrada.</p>';
      return;
    }

    assinaturas.forEach(ass => {
      const div = document.createElement('div');
      div.className = 'item-assinatura';
      div.innerHTML = `
        <span>${ass.nome}</span>
        <span>${ass.cargo}</span>
      `;
      lista.appendChild(div);
    });
  } catch (err) {
    console.error('Erro ao carregar assinaturas:', err);
    lista.innerHTML = '<p>Erro ao carregar assinaturas.</p>';
  }
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
