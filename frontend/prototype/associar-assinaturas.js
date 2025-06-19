// Carregar navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('navbars').innerHTML = html;
        personalizarNavbar();
    });

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('assinaturas-container');
    const btnAdicionar = document.getElementById('adicionar-assinatura');
    const form = document.getElementById('form-associacao');
    const selectEvento = document.getElementById('evento');

    // Carregar eventos
    const eventos = await fetch('/api/projetos-titulo').then(r => r.json());
    eventos.forEach(ev => {
        const opt = document.createElement('option');
        opt.value = ev.id_evento;
        opt.textContent = ev.titulo;
        selectEvento.appendChild(opt);
    });

    // Carregar lista de assinaturas disponíveis
    let listaAssinaturas = [];
    try {
        listaAssinaturas = await fetch('/api/assinaturas-nomes').then(r => r.json());
    } catch (err) {
        console.error('Erro ao carregar assinaturas:', err);
    }

    // Função para criar novo campo de assinatura+ordem
    function criarCampoAssinatura() {
        const div = document.createElement('div');
        div.className = 'assinatura-item';

        // Campo Select de assinatura
        const select = document.createElement('select');
        select.name = 'assinatura';
        select.required = true;

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '-- Selecione a assinatura --';
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);

        listaAssinaturas.forEach(ass => {
            const opt = document.createElement('option');
            opt.value = ass.id_assinatura;
            opt.textContent = ass.nome;
            select.appendChild(opt);
        });

        // Campo de ordem
        const inputOrdem = document.createElement('input');
        inputOrdem.type = 'number';
        inputOrdem.name = 'ordem';
        inputOrdem.placeholder = 'Ordem (opcional)';

        div.appendChild(select);
        div.appendChild(inputOrdem);
        container.appendChild(div);
    }

    // Criar o primeiro campo por padrão
    criarCampoAssinatura();

    btnAdicionar.addEventListener('click', criarCampoAssinatura);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idEvento = selectEvento.value;
        if (!idEvento) {
            alert('Selecione um evento!');
            return;
        }

        const campos = container.querySelectorAll('.assinatura-item');
        const assinaturas = [];

        campos.forEach(div => {
            const idAssinatura = div.querySelector('select').value;
            const ordem = div.querySelector('input[name="ordem"]').value || null;

            if (idAssinatura) {
                assinaturas.push({
                    id_assinatura: Number(idAssinatura),
                    ordem: ordem ? Number(ordem) : null
                });
            }
        });

        if (assinaturas.length === 0) {
            alert('Adicione ao menos uma assinatura.');
            return;
        }

        try {
            const res = await fetch('/api/associar-assinaturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_evento: Number(idEvento),
                    assinaturas: assinaturas
                })
            });

            const result = await res.json();

            if (res.ok) {
                alert(result.message);
                form.reset();
                container.innerHTML = '';
                criarCampoAssinatura();
            } else {
                alert(result.error || 'Erro ao associar assinaturas.');
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
