// Carregar navbar
fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbars').innerHTML = html;
    personalizarNavbar();
  });

document.addEventListener('DOMContentLoaded', () => {
  const btnTodos = document.getElementById('btn-todos');
  const btnPorProjeto = document.getElementById('btn-por-projeto');
  const selectProjeto = document.getElementById('projeto');
  const seletorProjetoDiv = document.getElementById('seletor-projeto');
  const listaDiv = document.getElementById('lista-produtos');

  let modo = 'todos';

  async function carregarProjetos() {
    const projetos = await fetch('/api/titulo-asc-projetos').then(r => r.json());
    selectProjeto.innerHTML = '<option value="">-- Selecione um projeto --</option>';
    projetos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id_evento;
      opt.textContent = p.titulo;
      selectProjeto.appendChild(opt);
    });
  }

  async function carregarProdutos(url) {
    listaDiv.innerHTML = '';

    const produtos = await fetch(url).then(r => r.ok ? r.json() : []);

    produtos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'linha-produto';

      // Coluna 1: Ícone link
      let iconeLink = '';
      if (p.link_arquivo) {
        if (p.link_arquivo.startsWith('http')) {
          iconeLink = `<span class="icone-link" onclick="window.open('${p.link_arquivo}', '_blank')">🌐</span>`;
        } else if (p.link_arquivo.startsWith('/uploads')) {
          const nomeArquivo = p.link_arquivo.split('/produtos/')[1];
          iconeLink = `<span class="icone-link" onclick="window.open('/api/produtos/view/${nomeArquivo}', '_blank')">📄</span>`;
        }
      }

      // Coluna 2: Tipo Produto
      const tipo = `<span>${p.tipo_produto}</span>`;

      // Coluna 3: Nome Palestrante (não veio na sua API, precisa ajustar backend se quiser)
      const palestrante = `<span>---</span>`; // Exemplo placeholder (ajuste backend se quiser trazer o nome real)

      // Coluna 4: Nome Projeto
      const projeto = `<span>${p.nome_projeto}</span>`;

      // Coluna 5: Lixeira (só se status = 1)
      let lixeira = '';
      if (p.status_projeto === 1) {
        lixeira = `<span class="icone-lixeira" onclick="deletarProduto(${p.id_produto})">🗑️</span>`;
      }

        div.innerHTML = `
            <span class="col-icon">${iconeLink}</span>
            <span class="col-tipo">${p.tipo_produto}</span>
            <span class="col-palestrante">${p.nome_palestrante || '---'}</span>
            <span class="col-projeto">${p.nome_projeto || '---'}</span>
            <span>${lixeira}</span>
        `
        listaDiv.appendChild(div);
    });
  }

  btnTodos.addEventListener('click', () => {
    modo = 'todos';
    btnTodos.classList.add('ativo');
    btnPorProjeto.classList.remove('ativo');
    seletorProjetoDiv.style.display = 'none';
    carregarProdutos('/api/produtos');
  });

  btnPorProjeto.addEventListener('click', async () => {
    modo = 'por-projeto';
    btnPorProjeto.classList.add('ativo');
    btnTodos.classList.remove('ativo');
    seletorProjetoDiv.style.display = 'block';
    await carregarProjetos();
    listaDiv.innerHTML = '';
  });

  selectProjeto.addEventListener('change', () => {
    const id = selectProjeto.value;
    if (id) {
      carregarProdutos(`/api/produtos/evento/${id}`);
    } else {
      listaDiv.innerHTML = '';
    }
  });

  window.deletarProduto = async (idProduto) => {
    const confirmacao = confirm('Tem certeza que deseja deletar este produto?');
    if (!confirmacao) return;

    try {
      const res = await fetch(`/api/produtos/${idProduto}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok) {
        alert('Produto deletado com sucesso!');
        if (modo === 'todos') {
          carregarProdutos('/api/produtos');
        } else if (modo === 'por-projeto' && selectProjeto.value) {
          carregarProdutos(`/api/produtos/evento/${selectProjeto.value}`);
        }
      } else {
        alert(result.error || 'Erro ao deletar produto.');
      }
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar produto.');
    }
  };

  // Por padrão carregar todos
  carregarProdutos('/api/produtos');
});

function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
    const entrarBtn = document.querySelector('.navbar-principal .entrar');
    if (entrarBtn) entrarBtn.outerHTML = avatar;
  }
}