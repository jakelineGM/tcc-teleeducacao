-- Script para popular a tabela ProjetoEducacional

INSERT INTO ProjetoEducacional (
    titulo, descricao, data_inicio, data_fim, id_status, id_tema, id_tipo_projeto,
    possui_inscricao, gera_certificado, id_publico_alvo, id_organizador
) VALUES
-- Evento 1: Curso Outubro Rosa
('Outubro Rosa: Prevenção ao Câncer de Mama',
 'Palestra focada na conscientização e prevenção do câncer de mama.',
 '2025-10-01 09:00:00', NULL, 4, 1, NULL, 1, 1, 3, 1),

-- Evento 2: Roda de Conversa sobre Saúde Mental
('Saúde Mental: Vamos Falar Sobre Isso?',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non augue vel velit hendrerit pellentesque et et dolor. Sed bibendum lorem non sagittis sollicitudin. Donec vestibulum ex sit amet leo eleifend, et finibus massa vehicula. Mauris non sapien justo. Integer eleifend consequat diam nec elementum. Proin tincidunt purus nisi, a fermentum odio dictum eget. Vestibulum eget congue turpis, sed pellentesque augue. Donec id justo dolor. Nullam eleifend id diam a bibendum. Integer tempus tortor nec nunc euismod egestas. Donec convallis sodales justo a scelerisque.
 Praesent rutrum erat at dolor scelerisque scelerisque. Nunc nulla massa, gravida id erat vitae, scelerisque ultricies tellus. Aenean quis rhoncus tellus. Proin suscipit vestibulum orci, sed volutpat tortor porta ac. Etiam lacinia lacus justo, eu vehicula neque luctus nec. Ut placerat egestas purus, sed sagittis ante pulvinar non. Proin fermentum vehicula mollis. Nunc cursus et nibh in pharetra. Duis lobortis ligula dolor, sit amet sagittis turpis blandit eu. Maecenas mattis ullamcorper congue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed augue erat, pharetra non sapien sit amet, mattis lobortis mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed odio ante, vehicula vitae felis nec, ullamcorper dapibus justo.',
 '2025-09-10 14:00:00', NULL, 2, NULL, NULL, 0, 0, 3, 1),

-- Evento 3: Web Aula sobre Primeiros Socorros
('PodCast - Primeiros Socorros em Situações Cotidianas',
 'Como manter a calma e prosseguir com os Primeiros Socorros',
 '2025-07-15 19:00:00', NULL, 1, NULL, NULL, 0, 0, 3, 1),

-- Evento 4: Campanha de Vacinação contra a Gripe
('Vacinação contra a Gripe: Campanha 2025',
 'Evento de vacinação com foco no público prioritário, em parceria com unidades de saúde locais.
 Ocorrerá no Hospital WXYZ localizado na rua Paramedicos.',
 '2025-06-01 08:00:00', '2025-06-30 17:00:00', 3, NULL, NULL, 0, 0, 3, 1);