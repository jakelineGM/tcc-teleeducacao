// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

//idenfificar o tipo de usario 
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario) {
  alert("Organizador, você precisa estar logado para acessar a lista de palestrantes.");
  window.location.href = "login-organizador.html";
}


const listaContainer = document.getElementById('lista-palestrantes');
const inputNome = document.getElementById('filtro-nome');
const selectEspecialidade = document.getElementById('filtro-especialidade');

// Carrega especialidades para o select
fetch('http://localhost:4000/api/especialidades')
  .then(res => res.json())
  .then(data => {
    data.forEach(especialidade => {
      const opt = document.createElement('option');
      opt.value = especialidade;
      opt.textContent = especialidade;
      selectEspecialidade.appendChild(opt);
    });
  });

// Buscar e exibir palestrantes
function carregarPalestrantes(nome = '', especialidade = '') {
  const query = new URLSearchParams();
  if (nome) query.append('nome', nome);
  if (especialidade) query.append('especialidade', especialidade);

  fetch(`http://localhost:4000/api/palestrantes?${query.toString()}`)
    .then(res => res.json())
    .then(data => {
      listaContainer.innerHTML = '';
      if (data.length === 0) {
        listaContainer.innerHTML = '<p>Nenhum palestrante encontrado.</p>';
        return;
      }
      console.log(typeof data, data);
      data.forEach(list => {
        const html = `
          <div class="card">
            <h4>${list.nome}</h4>
            <p><strong>Especialidade:</strong> ${list.especialidade}</p>
            <p><strong>Telefone:</strong> ${list.telefone}</p>
            <p><strong>Email:</strong> ${list.email}</p>
            <p><strong>Preferências:</strong> ${list.preferencias || 'Nenhuma'}</p>
            ${list.crm ? `<p><strong>CRM:</strong> ${list.crm}</p>` : ''}
          </div>
        `;
        listaContainer.innerHTML += html;
      });
    });
}

// Inicial
carregarPalestrantes();

// Eventos
inputNome.addEventListener('input', () => {
  carregarPalestrantes(inputNome.value, selectEspecialidade.value);
});

selectEspecialidade.addEventListener('change', () => {
  carregarPalestrantes(inputNome.value, selectEspecialidade.value);
});

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