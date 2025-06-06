// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario) {
  alert("Você precisa estar logado para acessar seus certificados.");
  window.location.href = "login-publico.html";
}

fetch(`http://localhost:4000/api/certificados-publico/${usuario.id_publico}`)
  .then(res => res.json())
  .then(certificados => {
    const container = document.getElementById('certificadosP-lista');
    if (!certificados.length) {
      container.innerHTML = "<p>Você ainda não tem certificados disponíveis.</p>";
      return;
    }

    certificados.forEach(cert => {
      const html = `
        <div class="card">
          <h4>${cert.titulo}</h4>
          <p><strong>Palestrante:</strong> ${cert.palestrante}</p>
          <p><strong>Data:</strong> ${formatarData(cert.data_inicio)}</p>
          <button onclick="window.open('http://localhost:4000/api/certificado/${cert.id_certificado}', '_blank')">Certificado</button>
        </div>
      `;
      //Colocar no banco de dados a coluna para onde o certificado está armazenado
      container.innerHTML += html;
    });
  });

//Altera o formato exibido para um mais amigavel
function formatarData(dataISO) {
  const data = new Date(dataISO);
  const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoes);
}

//Muda o elemento do canto superior direito da tela
function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
    const entrarBtn = document.querySelector('.navbar-principal .entrar');
    if (entrarBtn) entrarBtn.outerHTML = avatar;
  }
}
