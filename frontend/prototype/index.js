fetch('http://localhost:4000/api/projetospublicados')
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById('lista-projetos');
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.titulo} (Status: ${item.id_status})`;
      lista.appendChild(li);
    });
  })
  .catch(err => console.error('Erro ao buscar projetos:', err));

