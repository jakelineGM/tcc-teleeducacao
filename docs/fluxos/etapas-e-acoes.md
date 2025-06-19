## 📄 Documentação – Funcionalidades de Etapas e Ações (BACKEND)

### 📌 Módulo: Gerenciamento de Etapas e Ações

Este módulo contém as rotas responsáveis pelo **CRUD (inserção, atualização, listagem)** de **Etapas** e **Ações** dentro do sistema de Teleeducação.

---

### ✅ Funcionalidades Implementadas

#### 🟢 Inserção de Etapa (POST `/etapas`)

* **Campos obrigatórios:**

  * `nome`
  * `id_status`
  * `data_fim`
  * `id_evento`

* **Campos opcionais:**

  * `data_inicio` (pode ser `null`)

* **Validações:**

  * Verifica ausência de campos obrigatórios.
  * Retorna erro 400 caso falte algum campo.

---

#### 🟢 Inserção de Ação (POST `/acoes`)

* **Campos obrigatórios:**

  * `descricao`
  * `id_status`
  * `data_fim`
  * `id_etapa`
  * `id_organizador`

* **Campos opcionais:**

  * `data_inicio` (pode ser `null`)

* **Validações:**

  * Verifica ausência de campos obrigatórios.
  * Retorna erro 400 caso falte algum campo.

---

#### 🟢 Atualização Completa de Etapa (PUT `/etapas/:id`)

* Permite alterar **todos os campos**.
* **Comparação campo a campo** com os dados do banco para listar no response **somente os campos que sofreram alteração**.
* Retorno JSON detalha o que foi alterado com **"antes" → "depois"**.
* Caso nenhuma alteração seja detectada, retorna mensagem específica.

---

#### 🟢 Atualização de Status da Etapa (PUT `/etapas/:id/status`)

* Permite alterar **somente o `id_status`**.
* Valida se o campo `id_status` foi enviado.

---

#### 🟢 Atualização Completa de Ação (PUT `/acoes/:id`)

* Permite alterar **todos os campos**.
* Também faz **comparação campo a campo**, listando alterações reais no response.

---

#### 🟢 Atualização de Status da Ação (PUT `/acoes/:id/status`)

* Permite alterar **apenas o `id_status`** da ação.

---

### 🟢 Listagem de Etapas (GET `/etapas`)

* Retorna para cada etapa:

  * `id_etapa`
  * `nome`
  * **Descrição do status** (via join com `StatusEtapaAcao`)
  * `data_inicio`
  * `data_fim`
  * **Título do projeto** (via join com `ProjetoEducacional`)

---

### 🟢 Listagem de Ações por Etapa (GET `/etapas/:id_etapa/acoes`)

* Retorna todas as ações associadas a uma etapa específica.
* Campos retornados:

  * `id_acao`
  * `descricao`
  * **Descrição do status** (via join com `StatusEtapaAcao`)
  * `data_inicio`
  * `data_fim`
  * **Nome do organizador** (via join com `Organizador`)

---

### 🟢 Listagens Auxiliares para Front (Caixas de Seleção)

| Rota                 | Conteúdo                           |
| -------------------- | ---------------------------------- |
| `/status-etapa-acao` | Lista de status (id e descrição)   |
| `/projetos`          | Lista de projetos (id e título)    |
| `/etapas-lista`      | Lista de etapas (id e nome)        |
| `/organizadores`     | Lista de organizadores (id e nome) |

---

### ✅ Validações e Tratamento de Erros

* Todas as rotas retornam:

  * **200**: Sucesso
  * **400**: Campos obrigatórios faltando
  * **404**: Registro não encontrado
  * **500**: Erros internos de servidor
* Todas as rotas fazem **console.log** dos principais eventos e erros.

---

### ✅ Observação Final

* Todas as comparações de campos `data_inicio` e `data_fim` utilizam **normalização de datas ISO** para evitar falsos positivos em comparação de datas entre banco e payload.

---

## 📄 Documentação – Funcionalidades de Etapas e Ações (FRONTEND)

### Estrutura de Telas Envolvidas

| Tela                           | Descrição                                                              |
| ------------------------------ | ---------------------------------------------------------------------- |
| `inserir-etapas-e-acoes.html`  | Tela de criação de Etapas e Ações                                      |
| `lista-de-etapas-e-acoes.html` | Tela de listagem, visualização e alteração de status de Etapas e Ações |

---

## 🎯 Funcionalidades por Tela

### 📝 Inserir Etapas e Ações (`inserir-etapas-e-acoes.html`)

#### Formulário de Criação de Etapas:

* **Campos obrigatórios:**

  * Evento
  * Título da Etapa
  * Data Fim
  * Status
* **Campos opcionais:**

  * Data Início (exibido apenas se o checkbox "Inserir data de início" for marcado)

#### Formulário de Criação de Ações:

* **Campos obrigatórios:**

  * Etapa
  * Título da Ação
  * Data Fim
  * Status
  * Organizador
* **Campos opcionais:**

  * Data Início (exibido apenas se o checkbox "Inserir data de início" for marcado)

#### Comportamento:

* Os campos de seleção (Evento, Etapa, Status, Organizador) são carregados dinamicamente via API.
* Ao submeter os formulários, os dados são enviados via **POST** para:

  * `/api/etapas` (Para Etapas)
  * `/api/acoes` (Para Ações)
* Caso a criação seja bem-sucedida, exibe mensagem de sucesso e recarrega a página.

---

### 📋 Lista de Etapas e Ações (`lista-de-etapas-e-acoes.html`)

#### Estrutura Visual:

* Exibe os projetos (eventos) agrupando dentro de cada um:

  * Suas respectivas Etapas
  * E, dentro de cada Etapa, suas Ações

#### Layout por Etapa:

* Nome da etapa
* Datas (Início e Fim)
* Status (exibido com cor específica por ID de status)
* Lista de ações associadas

#### Layout por Ação:

* Descrição da Ação
* Datas
* Nome do Organizador
* Status (com cor conforme status)

---

#### Cores de Status (aplicado tanto para Etapas quanto Ações):

| Status       | ID | Cor      |
| ------------ | -- | -------- |
| Pendente     | 1  | Laranja  |
| Em andamento | 2  | Azul     |
| Concluído    | 3  | Verde    |
| Atrasado     | 4  | Vermelho |
| Cancelado    | 5  | Cinza    |

---

#### Ações na tela:

| Ação                      | Descrição                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Alterar Status**        | Exibe caixas de seleção para alterar o status da etapa e das ações relacionadas. Exibe também um único botão “Salvar Todos”. |
| **Editar Etapa**          | Redireciona o usuário para a tela de edição da etapa (futura implementação).                                                 |
| **Criar etapas ou ações** | Redireciona para a tela de criação.                                                                                          |

---

### 📲 Fluxo de Alteração de Status (frontend):

1. Usuário clica em **"Alterar Status"** na etapa.
2. Front exibe:

   * Um `<select>` para o status da etapa.
   * Um `<select>` abaixo de cada ação para seu respectivo status.
   * Um único botão **"Salvar Todos"**.
3. Ao clicar em salvar:

   * O frontend faz múltiplos `PUT` assíncronos:

     * `/api/etapas/:id/status`
     * `/api/acoes/:id/status`
4. Após sucesso, a tela recarrega.

---

## ✅ Integração com Backend (Endpoints utilizados)

| Método | Endpoint                      | Usado para                  |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/api/status-etapa-acao`      | Carregar status disponíveis |
| GET    | `/api/projetos-titulo`        | Carregar lista de eventos   |
| GET    | `/api/etapas`                 | Listar etapas               |
| GET    | `/api/etapas/:id_etapa/acoes` | Listar ações de uma etapa   |
| POST   | `/api/etapas`                 | Criar nova etapa            |
| POST   | `/api/acoes`                  | Criar nova ação             |
| PUT    | `/api/etapas/:id/status`      | Atualizar status da etapa   |
| PUT    | `/api/acoes/:id/status`       | Atualizar status da ação    |

---

## 🧱 Estrutura de Código Frontend envolvida

| Arquivo                       | Função                                   |
| ----------------------------- | ---------------------------------------- |
| `inserir-etapas-e-acoes.js`   | Lógica de criação de etapas e ações      |
| `inserir-etapas-e-acoes.css`  | Estilo visual da tela de inserção        |
| `lista-de-etapas-e-acoes.js`  | Lógica de listagem e alteração de status |
| `lista-de-etapas-e-acoes.css` | Estilo visual da tela de listagem        |