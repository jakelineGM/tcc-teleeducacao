// Carrega as navbars
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });


// Valida login e inicializa dashboard
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario) {
  alert("Você precisa estar logado para acessar essa página.");
  window.location.href = "login-publico.html";
} else {
  const primeiroNome = usuario.nome.split(" ")[0];
  document.getElementById('boas-vindas').textContent = `Bem-vindo(a), ${usuario.nome}`;

  // Buscar inscrições recentes do usuário
  fetch(`http://localhost:4000/api/inscricoes-recentes/${usuario.id_publico}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('inscricoes-recentes');
      data.forEach(proj => {
        container.innerHTML += `
          <div class="card">
            <h4>${proj.titulo}</h4>
            <p><strong>Palestrante:</strong> ${proj.palestrante}</p>
            <p><strong>Presença:</strong> ${proj.presente == 1 ? '✅ Confirmada' : '-----'}</p>
            <button onclick="window.open('${proj.link_arquivo}', '_blank')">Meet</button>
          </div>`;
      });
    });
}

//Função para mudar botão entrar para o
function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
    const entrarBtn = document.querySelector('.navbar-principal .entrar');
    if (entrarBtn) entrarBtn.outerHTML = avatar;
  }
}

//Função para exibir data e hora de modo amigavel
function formatarDataComHora(dataISO) {
  const data = new Date(dataISO);
  const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora = data.getHours().toString().padStart(2, '0');
  return `${dataFormatada}, ${hora}h`;
}