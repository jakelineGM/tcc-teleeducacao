// Carregar navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('navbars').innerHTML = html;
        personalizarNavbar();
    });

document.addEventListener('DOMContentLoaded', async () => {
    const selectEvento = document.getElementById('evento');
    const selectTipo = document.getElementById('tipo_produto');
    const selectPalestrante = document.getElementById('palestrante');
    const form = document.getElementById('form-produto');

    // Carregar eventos
    const eventos = await fetch('/api/titulo-projetos-em-producao').then(r => r.json());
    eventos.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id_evento;
        opt.textContent = e.titulo;
        selectEvento.appendChild(opt);
    });

    // Carregar tipos de produto
    const tipos = await fetch('/api/tipos-produto').then(r => r.json());
    tipos.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id_tipo_produto;
        opt.textContent = t.descricao;
        selectTipo.appendChild(opt);
    });

    // Carregar palestrantes
    const palestrantes = await fetch('/api/nome-palestrantes').then(r => r.json());
    palestrantes.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id_palestrante;
        opt.textContent = p.nome;
        selectPalestrante.appendChild(opt);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const link = document.getElementById('arquivo_link').value.trim();
        const arquivo = document.getElementById('arquivo').files[0];

        // Validação: Só pode um dos dois campos preenchidos (arquivo OU link)
        if (link && arquivo) {
            alert('Por favor, preencha apenas um dos campos: o link OU o arquivo.');
            return;
        }
        if (!link && !arquivo) {
            alert('Por favor, insira o link OU o arquivo.');
            return;
        }
        // Validação: Se for link, precisa começar com https://
        if (link && !link.startsWith('https://')) {
            alert('O link precisa começar com https://');
            return;
        }

        const formData = new FormData();
        formData.append('id_evento', selectEvento.value);
        formData.append('id_tipo_produto', selectTipo.value);
        formData.append('id_palestrante', selectPalestrante.value);

        if (link) {
            formData.append('link_arquivo', link);
        } else if (arquivo) {
            formData.append('arquivo', arquivo);
        }

        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
                form.reset();
            } else {
                alert(result.error || 'Erro ao cadastrar produto.');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar o formulário.');
        }
    });

});

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
