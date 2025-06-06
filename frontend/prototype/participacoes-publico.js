// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario) {
  alert("Você precisa estar logado para acessar suas participações.");
  window.location.href = "login-publico.html";
}

fetch(`http://localhost:4000/api/participacoes/${usuario.id_publico}`)
  .then(res => res.json())
  .then(participacoes => {
    const andamento = document.getElementById('participacoes-andamento');
    const finalizado = document.getElementById('participacoes-finalizadas');

    participacoes.forEach(proj => {
      const html = `
      <div class="card">
      <h4>${proj.titulo}</h4>
      <p><strong>Palestrante:</strong> ${proj.palestrante}</p>
      <p><strong>Participação:</strong> ${proj.presente ? '✅ Confirmada' : '-'}</p>
      <p><strong>Data:</strong> ${formatarDataComHora(proj.data_inicio)}</p>
      ${proj.id_status == 6
        ? `<button onclick="window.open('avaliacao.html?id=${proj.id_avaliacao}', '_blank')">Avaliação</button>
        <button onclick="window.open('http://localhost:4000/api/certificado/${proj.id_certificado}', '_blank')">Certificado</button>`
        : `<button onclick="window.open('${proj.link_arquivo}', '_blank')">Meet</button>`
      }
      </div>
      `;

      if (proj.id_status == 6) {
        finalizado.innerHTML += html;
      } else if ([4, 5].includes(proj.id_status)) {
        andamento.innerHTML += html;
      }
    });
  });

function formatarDataComHora(dataISO) {
  const data = new Date(dataISO);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora = data.getHours().toString().padStart(2, '0');
  return `${dia}, ${hora}h`;
}

function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
    const entrarBtn = document.querySelector('.navbar-principal .entrar');
    if (entrarBtn) entrarBtn.outerHTML = avatar;
  }
}
