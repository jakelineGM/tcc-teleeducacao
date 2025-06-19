// Carregar navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('navbars').innerHTML = html;
        personalizarNavbar();
    });

document.addEventListener('DOMContentLoaded', () => {
    const statusSelects = [document.getElementById('status_etapa'), document.getElementById('status_acao')];
    const projetoSelect = [document.getElementById('evento_etapa'), document.getElementById('evento_acao')];
    const etapaSelect = document.getElementById('etapa');
    const organizadorSelect = document.getElementById('organizador');

    function carregarSelect(url, selectElement, valueField, textField, incluirPlaceholder = true) {
        if (incluirPlaceholder) {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = '-- Selecione --';
            placeholder.disabled = true;
            placeholder.selected = true;
            selectElement.appendChild(placeholder);
        }
        fetch(url)
            .then(res => res.json())
            .then(data => {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[valueField];
                    option.textContent = item[textField];
                    selectElement.appendChild(option);
                });
            });
    }

    function carregarEtapasPorEvento(idEvento) {
        etapaSelect.innerHTML = '';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '-- Selecione --';
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.style.color = '#888';
        etapaSelect.appendChild(placeholder);

        fetch(`/api/etapas-nomes?id_evento=${idEvento}`)
            .then(res => res.json())
            .then(data => {
                data.forEach(etapa => {
                    const option = document.createElement('option');
                    option.value = etapa.id_etapa;
                    option.textContent = etapa.nome;
                    etapaSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Erro ao carregar etapas:', err));
    }

    // Carregando os selects fixos
    //Não chama placeholder
    carregarSelect('/api/status-etapa-acao', statusSelects[0], 'id_status', 'descricao', false);
    carregarSelect('/api/status-etapa-acao', statusSelects[1], 'id_status', 'descricao', false);
    //Chamam placeholder
    carregarSelect('/api/projetos-titulo', projetoSelect[0], 'id_evento', 'titulo');
    carregarSelect('/api/projetos-titulo', projetoSelect[1], 'id_evento', 'titulo');
    carregarSelect('/api/organizadores-nomes', organizadorSelect, 'id_organizador', 'nome');

    // Mostrar/ocultar campos de data de início
    document.getElementById('check_data_inicio_etapa').addEventListener('change', e => {
        document.getElementById('data_inicio_etapa').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('check_data_inicio_acao').addEventListener('change', e => {
        document.getElementById('data_inicio_acao').style.display = e.target.checked ? 'block' : 'none';
    });

    // Ao mudar o evento no formulário de Ação, recarrega as etapas
    document.getElementById('evento_acao').addEventListener('change', (e) => {
        const idEvento = e.target.value;
        if (idEvento) carregarEtapasPorEvento(idEvento);
    });


    // Função de conversão de data
    function formatarData(dataStr) {
        if (!dataStr) return null;
        const [dia, mes, ano] = dataStr.split('/');
        return `${ano}-${mes}-${dia} 00:00:00`;
    }

    // Enviar formulário de Etapa
    document.getElementById('form-etapa').addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            nome: document.getElementById('titulo_etapa').value,
            id_status: Number(document.getElementById('status_etapa').value),
            id_evento: Number(document.getElementById('evento_etapa').value),
            data_inicio: document.getElementById('check_data_inicio_etapa').checked ? formatarData(document.getElementById('data_inicio_etapa').value) : null,
            data_fim: formatarData(document.getElementById('data_fim_etapa').value)
        };

        fetch('/api/etapas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))
            .then(() => {
                alert('Etapa criada com sucesso!');
                location.reload();
            })
            .catch(err => {
                console.error(err);
                alert(err.error || 'Erro ao criar etapa');
            });
    });

    // Enviar formulário de Ação
    document.getElementById('form-acao').addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            descricao: document.getElementById('titulo_acao').value,
            id_status: Number(document.getElementById('status_acao').value),
            id_evento: Number(document.getElementById('evento_acao').value),
            id_etapa: Number(document.getElementById('etapa').value),
            id_organizador: Number(document.getElementById('organizador').value),
            data_inicio: document.getElementById('check_data_inicio_acao').checked ? formatarData(document.getElementById('data_inicio_acao').value) : null,
            data_fim: formatarData(document.getElementById('data_fim_acao').value)
        };

        fetch('/api/acoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))
            .then(() => {
                alert('Ação criada com sucesso!');
                location.reload();
            })
            .catch(err => {
                console.error(err);
                alert(err.error || 'Erro ao criar ação');
            });
    });
});


//Função para mudar botão entrar para o
function personalizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
        const primeiroNome = usuario.nome.split(" ")[0];
        const avatar = `<span>👤 Olá, ${primeiroNome}</span>`;
        const entrarBtn = document.querySelector('.navbar-principal .entrar');
        if (entrarBtn) entrarBtn.outerHTML = avatar;
    }
}