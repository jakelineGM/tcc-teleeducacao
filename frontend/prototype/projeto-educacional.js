function formatarDataComHora(dataISO) {
  const data = new Date(dataISO);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora = data.getHours().toString().padStart(2, '0');
  return `${dia}, ${hora}h`;
}
// Reaproveita navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => document.getElementById('navbars').innerHTML = html);

// Busca detalhes do projeto com base na query param ?id=...
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`http://localhost:4000/api/projeto-educacional/${id}`)
  .then(res => res.json())
  .then(data => {
    console.log('[FRONTEND] Dados recebidos do backend:', data);

    document.getElementById('titulo').textContent = data.titulo;
    document.getElementById('palestrante').textContent = data.palestrante;
    document.getElementById('imagem').src = `http://localhost:4000/${data.imagem}`;
    document.getElementById('descricao').textContent = data.descricao;
    document.getElementById('link-arquivo').href = data.link_arquivo;

    document.getElementById('tipo-produto').textContent = data.tipo_produto;
    document.getElementById('publico-alvo').textContent = data.publico_alvo;
    document.getElementById('tema').textContent = data.tema || '—';

    if (data.possui_inscricao === 1) {
      document.getElementById('inscricao-info').style.display = 'block';
      document.getElementById('data-inicio').textContent = formatarDataComHora(data.data_inicio);
    }

    // Evento de clique no botão de inscrição
    document.getElementById('botao-inscrever').addEventListener('click', () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      
      if (!usuario) {
        const desejaLogin = confirm("Entre no sistema para inscrever-se.\nClick OK para ir a página de login.");
        if (desejaLogin) {
          window.location.href = "login-publico.html";
        }
      } else {
        alert("Inscrição realizada com sucesso!");
        // Futuramente: chamada ao backend POST /api/inscricao
      }
    });
    
  });

  

