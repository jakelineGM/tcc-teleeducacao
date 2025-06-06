document.getElementById('formPresenca').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch('http://localhost:4000/api/registro-presenca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      // redirecionamento opcional após confirmação
    } else {
      alert(result.message || 'Erro na confirmação de presença.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar ao servidor.');
  }
});
