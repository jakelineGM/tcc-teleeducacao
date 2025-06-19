// Carregar navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('navbars').innerHTML = html;
        personalizarNavbar();
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

function getStatusClass(id_status) {
    switch (id_status) {
        case 1: return 'status-pendente';
        case 2: return 'status-andamento';
        case 3: return 'status-concluido';
        case 4: return 'status-atrasado';
        case 5: return 'status-cancelado';
        default: return '';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('lista-projetos');
    const statusList = await fetch('/api/status-etapa-acao').then(r => r.json());

    async function carregarEtapasEAcoes() {
        container.innerHTML = '';
        const etapas = await fetch('/api/etapas').then(r => r.json());

        const projetosMap = {};

        for (const etapa of etapas) {
            if (!projetosMap[etapa.projeto]) projetosMap[etapa.projeto] = [];
            projetosMap[etapa.projeto].push(etapa);
        }

        for (const [projeto, etapasDoProjeto] of Object.entries(projetosMap)) {
            //Criar quadro do projeto educacional
            const projetoBox = document.createElement('div');
            projetoBox.className = 'projeto-box';
            projetoBox.innerHTML = `<h3>${projeto}</h3>`;

            //Criar quadro da etapa
            etapasDoProjeto.forEach(async etapa => {
                const etapaDiv = document.createElement('div');
                etapaDiv.className = 'etapa';

                let datas = etapa.data_inicio ? `${formatarData(etapa.data_inicio)} a ${formatarData(etapa.data_fim)}` : `${formatarData(etapa.data_fim)}`;

                etapaDiv.innerHTML = `
                <div>
                    <strong>${etapa.nome}</strong><br>
                    ${datas}<br>
                    <span class="status-badge ${getStatusClass(etapa.id_status)}" id="status-etapa-${etapa.id_etapa}">${etapa.status}</span>
                    <div class="status-edit" id="status-edit-etapa-${etapa.id_etapa}" style="display:none;"></div>
                </div>
                <div class="acoes" id="acoes-etapa-${etapa.id_etapa}">Carregando ações...</div>
                `;

                projetoBox.appendChild(etapaDiv);

                // Criar os botões fora do .etapa
                const botoesDiv = document.createElement('div');
                botoesDiv.className = 'botoes-ocultos';
                botoesDiv.innerHTML = `
                <button onclick="mostrarAlterarStatus(${etapa.id_etapa}, 'etapa')">Alterar Status</button>
                <button onclick="editarEtapa(${etapa.id_etapa})">Editar</button>`;

                projetoBox.appendChild(botoesDiv);

                // Evento de clique para mostrar/ocultar os botões
                etapaDiv.addEventListener('click', () => {
                    botoesDiv.style.display = (botoesDiv.style.display === 'block') ? 'none' : 'block';
                });

                // Carrega ações da etapa
                const acoes = await fetch(`/api/etapas/${etapa.id_etapa}/acoes`).then(r => r.ok ? r.json() : []);
                const acoesDiv = document.getElementById(`acoes-etapa-${etapa.id_etapa}`);
                acoesDiv.innerHTML = '';

                acoes.forEach(acao => {
                    let datasAcao = acao.data_inicio ? `${formatarData(acao.data_inicio)} a ${formatarData(acao.data_fim)}` : `${formatarData(acao.data_fim)}`;
                    const acaoHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom:5px;">
              <span>${acao.descricao}</span>
              <span>${datasAcao}</span>
              <span>${acao.organizador || ''}</span>
              <span class="status-badge ${getStatusClass(acao.id_status)}">${acao.status}</span>
            </div>`;
                    acoesDiv.innerHTML += acaoHTML;
                });
            });

            container.appendChild(projetoBox);
        }
    }

    function formatarData(dataStr) {
        const date = new Date(dataStr);
        return date.toLocaleDateString('pt-BR');
    }

    window.mostrarAlterarStatus = async (id_etapa) => {
        // Monta a seleção de status da etapa
        const statusEtapaDiv = document.getElementById(`status-edit-etapa-${id_etapa}`);
        statusEtapaDiv.style.display = 'block';
        statusEtapaDiv.innerHTML = `
            <select id="novo-status-etapa-${id_etapa}">
            ${statusList.map(s => `<option value="${s.id_status}">${s.descricao}</option>`).join('')}
             </select>
        `;

        // Monta seleção de status de cada ação da etapa
        const acoesContainer = document.getElementById(`acoes-etapa-${id_etapa}`);
        const acoes = await fetch(`/api/etapas/${id_etapa}/acoes`).then(r => r.ok ? r.json() : []);

        acoes.forEach(acao => {
            const div = document.createElement('div');
            div.classList.add('status-edit');
            div.innerHTML = `
                <label>Status da ação: ${acao.descricao}</label>
                <select id="novo-status-acao-${acao.id_acao}">
                ${statusList.map(s => `<option value="${s.id_status}">${s.descricao}</option>`).join('')}
                </select>
            `;
            acoesContainer.appendChild(div);
        });

        // Adicionar botão de salvar único
        const salvarDiv = document.createElement('div');
        salvarDiv.classList.add('status-edit');
        salvarDiv.innerHTML = `<button onclick="salvarTodosOsStatus(${id_etapa}, [${acoes.map(a => a.id_acao).join(',')}])">Salvar Todos</button>`;
        acoesContainer.appendChild(salvarDiv);
    };


    window.salvarStatus = async (id, tipo) => {
        const novoStatus = document.getElementById(`novo-status-${tipo}-${id}`).value;
        const url = tipo === 'etapa' ? `/api/etapas/${id}/status` : `/api/acoes/${id}/status`;

        await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_status: Number(novoStatus) })
        });

        alert('Status atualizado!');
        carregarEtapasEAcoes();
    };

    window.salvarTodosOsStatus = async (id_etapa, ids_acoes) => {
        const updates = [];

        // Status da etapa
        const novoStatusEtapa = document.getElementById(`novo-status-etapa-${id_etapa}`).value;
        updates.push(fetch(`/api/etapas/${id_etapa}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_status: Number(novoStatusEtapa) })
        }));

        // Status de cada ação
        ids_acoes.forEach(id_acao => {
            const novoStatusAcao = document.getElementById(`novo-status-acao-${id_acao}`).value;
            updates.push(fetch(`/api/acoes/${id_acao}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_status: Number(novoStatusAcao) })
            }));
        });

        try {
            await Promise.all(updates);
            alert('Status de etapa e ações atualizados com sucesso!');
            location.reload();
        } catch (err) {
            console.error('Erro ao salvar os status:', err);
            alert('Erro ao salvar os status.');
        }
    };


    window.editarEtapa = (id) => {
        window.location.href = `editar-etapa.html?id=${id}`;
    };

    carregarEtapasEAcoes();
});