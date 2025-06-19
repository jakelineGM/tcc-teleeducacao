// Carregar navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('navbars').innerHTML = html;
        personalizarNavbar();
    });

document.addEventListener('DOMContentLoaded', () => {
    const statusSelect = document.getElementById('id_status');
    const temaSelect = document.getElementById('id_tema');
    const publicoSelect = document.getElementById('id_publico_alvo');

    // Carregar campos dinâmicos
    fetch('/api/statusProjeto').then(r => r.json()).then(data => {
        data.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id_status;
            opt.textContent = s.descricao;
            statusSelect.appendChild(opt);
        });
    });

    fetch('/api/temas').then(r => r.json()).then(data => {
        data.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id_tema;
            opt.textContent = t.descricao;
            temaSelect.appendChild(opt);
        });
    });

    fetch('/api/publicoAlvo').then(r => r.json()).then(data => {
        data.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id_publico_alvo;
            opt.textContent = p.descricao;
            publicoSelect.appendChild(opt);
        });
    });

    // Mostrar/Esconder hora inicio
    document.getElementById('hora_inicio_check').addEventListener('change', (e) => {
        document.getElementById('hora_inicio').style.display = e.target.checked ? 'block' : 'none';
    });

    // Mostrar/Esconder data fim e hora fim
    document.getElementById('tem_data_fim').addEventListener('change', (e) => {
        document.getElementById('data-fim-section').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('hora_fim_check').addEventListener('change', (e) => {
        document.getElementById('hora_fim').style.display = e.target.checked ? 'block' : 'none';
    });

    // Envio do formulário
    document.getElementById('form-projeto').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        function formatarData(data, horaId) {
            if (!data) return null;
            const partes = data.split('/');
            if (partes.length !== 3) return null;
            let dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
            const hora = document.getElementById(horaId).value;
            if (hora) dataISO += ` ${hora}:00`;
            return dataISO;
        }

        const payload = {
            titulo: formData.get('titulo'),
            id_status: Number(formData.get('id_status')),
            id_tema: formData.get('id_tema') ? Number(formData.get('id_tema')) : null,
            id_publico_alvo: formData.get('id_publico_alvo') ? Number(formData.get('id_publico_alvo')) : null,
            palavra_chave: formData.get('palavra_chave') ? formData.get('palavra_chave') : null,
            gera_certificado: Number(formData.get('gera_certificado')),
            possui_inscricao: Number(formData.get('possui_inscricao')),
            data_inicio: formatarData(formData.get('data_inicio'), 'hora_inicio'),
            data_fim: document.getElementById('tem_data_fim').checked ? formatarData(formData.get('data_fim'), 'hora_fim') : null,
            imagem: null,  // Por enquanto null até o backend aceitar upload de arquivos
            id_organizador: null
        };


        fetch('/api/projetos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const response = await res.json();
                if (res.ok) {
                    alert('Projeto criado com sucesso!');
                    e.target.reset();
                } else {
                    alert(`Erro: ${response.error || response.message}`);
                }
            })
            .catch(err => {
                console.error('Erro:', err);
                alert('Erro ao enviar os dados.');
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