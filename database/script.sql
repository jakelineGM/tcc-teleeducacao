-- Tabelas de domínio adicionais
CREATE TABLE StatusInscricao (
    id_status_inscricao INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(50)
);

CREATE TABLE PreferenciaAudiovisual (
    id_preferencia INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100)
);

-- Atualização da tabela Palestrante
CREATE TABLE Palestrante (
    id_palestrante INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    especialidade VARCHAR(100),
    crm VARCHAR(20),
    id_preferencia INT,
    FOREIGN KEY (id_preferencia) REFERENCES PreferenciaAudiovisual (id_preferencia)
);

-- Atualização da tabela Inscricao
CREATE TABLE Inscricao (
    id_inscricao INT PRIMARY KEY AUTO_INCREMENT,
    id_publico INT NOT NULL,
    id_evento INT NOT NULL,
    id_status_inscricao INT,
    presente BOOLEAN DEFAULT FALSE,
    UNIQUE (id_publico, id_evento),
    FOREIGN KEY (id_publico) REFERENCES Publico (id_publico),
    FOREIGN KEY (id_evento) REFERENCES ProjetoEducacional (id_evento),
    FOREIGN KEY (id_status_inscricao) REFERENCES StatusInscricao (id_status_inscricao)
);

-- Certificado com formato lógico de registro
-- O formato {evento_id}-{usuario_id}-{AAAA} será gerado pela aplicação,
-- mas o campo é armazenado como string
CREATE TABLE Certificado (
    id_certificado INT PRIMARY KEY AUTO_INCREMENT,
    data_emissao DATE,
    registro VARCHAR(50), -- Ex: "23-198-2025"
    id_evento INT NOT NULL,
    id_publico INT,
    id_organizador INT,
    id_palestrante INT,
    FOREIGN KEY (id_evento) REFERENCES ProjetoEducacional (id_evento),
    FOREIGN KEY (id_publico) REFERENCES Publico (id_publico),
    FOREIGN KEY (id_organizador) REFERENCES Organizador (id_organizador),
    FOREIGN KEY (id_palestrante) REFERENCES Palestrante (id_palestrante)
);

CREATE TABLE ProjetoAssinatura (
    - > id_projeto_assinatura INT PRIMARY KEY AUTO_INCREMENT,
    - > id_evento INT NOT NULL,
    - > id_assinatura INT NOT NULL,
    - > ordem INT NULL,
    - > FOREIGN KEY (id_evento) REFERENCES ProjetoEducacional (id_evento),
    - > FOREIGN KEY (id_assinatura) REFERENCES Assinatura (id_assinatura) - >
);

CREATE TABLE Assinatura (
    - > id_assinatura INT PRIMARY KEY AUTO_INCREMENT,
    - > nome VARCHAR(150) NOT NULL,
    - > cargo VARCHAR(100) NOT NULL,
    - > caminho_arquivo VARCHAR(255) NOT NULL - >
);
