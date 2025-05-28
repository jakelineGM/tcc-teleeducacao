-- Script para popular a tabela ProjetoEducacional

INSERT INTO ProjetoEducacional (
    titulo, descricao, data_inicio, data_fim, id_status, id_tema, id_tipo_projeto,
    possui_inscricao, gera_certificado, id_publico_alvo, id_organizador
) VALUES
-- Evento 1: Curso Outubro Rosa
('Outubro Rosa: Prevenção ao Câncer de Mama',
 'Palestra focada na conscientização e prevenção do câncer de mama, com palestras, vídeos e materiais educativos.',
 '2025-10-01 09:00:00', NULL, 1, 2, 1, 1, 1, 1, 1),

-- Evento 2: Roda de Conversa sobre Saúde Mental
('Saúde Mental: Vamos Falar Sobre Isso?',
 'Roda de conversa para o público em geral sobre saúde mental, prevenção e autocuidado, com participação de psicólogos.',
 '2025-09-10 14:00:00', '2025-09-10 16:00:00', 1, 3, 2, 1, 1, 2, 1),

-- Evento 3: Web Aula sobre Primeiros Socorros
('Web Aula: Primeiros Socorros em Situações Cotidianas',
 'Aula online com médico especialista sobre como agir em situações de emergência.',
 '2025-07-15 19:00:00', '2025-07-15 20:30:00', 1, 4, 3, 1, 0, 1, 2),

-- Evento 4: Campanha de Vacinação contra a Gripe
('Vacinação contra a Gripe: Campanha 2025',
 'Evento de vacinação com foco no público prioritário, em parceria com unidades de saúde locais.',
 '2025-06-01 08:00:00', '2025-06-30 17:00:00', 1, 5, 4, 1, 1, 2, 3),

-- Evento 5: Curso de Atualização em Diabetes
('Curso de Atualização em Diabetes para Profissionais de Saúde',
 'Treinamento especializado para médicos, enfermeiros e agentes de saúde sobre manejo de diabetes.',
 '2025-08-05 09:00:00', '2025-08-07 17:00:00', 1, 6, 1, 1, 1, 1, 1);
