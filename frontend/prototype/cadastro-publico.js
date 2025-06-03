document.addEventListener('DOMContentLoaded', () => {
  const estadoSelect = document.getElementById('estado');
  const cidadeSelect = document.getElementById('cidade');
  const ocupacaoSelect = document.getElementById('ocupacao');
  const atuacaoSelect = document.getElementById('atuacao');

  // Carrega estados
  fetch('http://localhost:4000/api/estados')
    .then(res => res.json())
    .then(estados => {
      estados.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id_estado;
        opt.text = e.nome;
        estadoSelect.add(opt);
      });
    });

  estadoSelect.addEventListener('change', () => {
    cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
    fetch(`http://localhost:4000/api/cidades/${estadoSelect.value}`)
      .then(res => res.json())
      .then(cidades => {
        cidades.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id_cidade;
          opt.text = c.nome;
          cidadeSelect.add(opt);
        });
      });
  });

  // Carrega ocupações
  fetch('http://localhost:4000/api/ocupacao')
    .then(res => res.json())
    .then(ocupacoes => {
      ocupacoes.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.id_ocupacao;
        opt.text = o.nome;
        ocupacaoSelect.add(opt);
      });
    });

  // Carrega todas as atuações
  fetch('http://localhost:4000/api/atuacao')
  .then(res => res.json())
  .then(atuacoes => {
    atuacoes.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id_atuacao; // Pode usar o ID como valor
      opt.text = a.descricao;   // Nome correto agora
      atuacaoSelect.add(opt);
    });
  });


  // Submeter formulário
  document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (!/^\d{11}$/.test(formData.cpf)) return alert('CPF inválido! Utilize somente números');
    if (!/^\d{11}$/.test(formData.telefone)) return alert('Telefone inválido! Utilize somente números e insira o DDD');

    try {
      const res = await fetch('http://localhost:4000/api/cadastro-publico', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Cadastro realizado!');
      window.location.href = "login-publico.html";
    } catch (err) {
      console.error(err);
      alert('Erro no cadastro!');
    }
  });
});
