document.addEventListener('DOMContentLoaded', () => {
  // Carregar Estados, Cidades, Ocupações (mock simples)
  const estados = { 'AM': ['Manaus', 'Parintins'], 'SP': ['São Paulo', 'Campinas'] };
  const ocupacoes = { 'Saúde': ['Médico', 'Enfermeiro'], 'Educação': ['Professor', 'Pedagogo'] };

  const estadoSelect = document.getElementById('estado');
  const cidadeSelect = document.getElementById('cidade');
  const ocupacaoSelect = document.getElementById('ocupacao');
  const atuacaoSelect = document.getElementById('atuacao');

  // Popular estados
  for (let estado in estados) {
    const opt = document.createElement('option');
    opt.value = estado;
    opt.text = estado;
    estadoSelect.add(opt);
  }

  estadoSelect.addEventListener('change', () => {
    cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
    const cidades = estados[estadoSelect.value] || [];
    cidades.forEach(c => {
      let opt = document.createElement('option');
      opt.value = c;
      opt.text = c;
      cidadeSelect.add(opt);
    });
  });

  // Popular ocupações
  for (let o in ocupacoes) {
    const opt = document.createElement('option');
    opt.value = o;
    opt.text = o;
    ocupacaoSelect.add(opt);
  }

  ocupacaoSelect.addEventListener('change', () => {
    atuacaoSelect.innerHTML = '<option value="">Selecione a Atuação</option>';
    const atuacoes = ocupacoes[ocupacaoSelect.value] || [];
    atuacoes.forEach(a => {
      let opt = document.createElement('option');
      opt.value = a;
      opt.text = a;
      atuacaoSelect.add(opt);
    });
  });

  // Submeter formulário
  document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries());
    // Validações simples
    if (!/^\d{11}$/.test(formData.cpf)) return alert('CPF inválido!');
    if (!/^\(\d{2}\) 9\d{4}-\d{4}$/.test(formData.telefone)) return alert('Telefone inválido escreve no formato (92) 98888-8888!');

    // Enviar para API
    try {
      const res = await fetch('http://localhost:4000/api/cadastro-publico', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Cadastro realizado!');
    } catch (err) {
      console.error(err);
      alert('Erro no cadastro!');
    }
  });
});
