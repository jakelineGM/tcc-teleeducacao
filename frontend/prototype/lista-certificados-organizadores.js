// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

document.addEventListener('DOMContentLoaded', async () => {
  const selectEvento = document.getElementById('evento');
  const listaContainer = document.getElementById('lista-inscritos');

  // Carregar eventos
  fetch('/api/projetos-titulo')
    .then(res => res.json())
    .then(data => {
      data.forEach(evento => {
        const opt = document.createElement('option');
        opt.value = evento.id_evento;
        opt.textContent = evento.titulo;
        selectEvento.appendChild(opt);
      });
    });

  // Ao selecionar evento, carregar lista de inscritos
  selectEvento.addEventListener('change', () => {
    const idEvento = selectEvento.value;
    listaContainer.innerHTML = '';

    if (idEvento) {
      fetch(`/api/presenca/certificados/${idEvento}`)
        .then(res => res.json())
        .then(data => {
          if (data.inscritos.length === 0) {
            listaContainer.innerHTML = '<p>Nenhum inscrito encontrado para este evento.</p>';
            return;
          }

          data.inscritos.forEach(inscrito => {
            const div = document.createElement('div');
            div.className = 'inscrito';
            div.innerHTML = `
              <span>${inscrito.nome_publico}</span>
              <span>Presença: ${inscrito.presente ? '✔️' : '❌'}</span>
              <button class="certificado-btn ${inscrito.presente ? '' : 'disabled'}" ${inscrito.presente ? '' : 'disabled'} onclick="verCertificado(${inscrito.id_evento}, ${inscrito.id_publico}, ${inscrito.id_certificado})">
                Certificado
              </button>
            `;
            listaContainer.appendChild(div);
          });
        });
    }
  });
});

function verCertificado(id_evento, id_publico, id_certificado) {
  window.open(`/api/certificados/${id_evento}/${id_publico}/${id_certificado}`, '_blank');
}

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
