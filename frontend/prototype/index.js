// Carrega as navbars
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

// Carrega os destaques
fetch('http://localhost:4000/api/projetos-destaques')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('destaques');
    data.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <h3>${item.titulo}</h3>
          <p>${item.palestrante}</p>
          <p>${formatarDataComHora(item.data_inicio) || ''}</p>
          <button onclick="location.href='projeto-educacional.html?id=${item.id_evento}'">Saiba mais</button>
        </div>`;
    });
  });

// Carrega as palestras
fetch('http://localhost:4000/api/projetos-palestras')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('palestras');
    data.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <h3>${item.titulo}</h3>
          <p>${item.palestrante}</p>
          <p>${formatarDataComHora(item.data_inicio)}</p>
          <button onclick="location.href='projeto-educacional.html?id=${item.id_evento}'">Saiba mais</button>
        </div>`;
    });
  });

// Carrega os podcasts
fetch('http://localhost:4000/api/projetos-podcasts')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('podcasts');
    data.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <h3>${item.titulo}</h3>
          <p>${item.palestrante}</p>
          <button onclick="location.href='projeto-educacional.html?id=${item.id_evento}'">Ouvir</button>
        </div>`;
    });
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

//Função para exibir data e hora de modo amigavel
function formatarDataComHora(dataISO) {
  const data = new Date(dataISO);
  const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora = data.getHours().toString().padStart(2, '0');
  return `${dataFormatada}, ${hora}h`;
}


/*
  //Função para exibir apenas a data de modo amigavel
  function formatarData(dataISO) {
  const data = new Date(dataISO);
  const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoes);
  }
  */ 