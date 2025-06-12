# ➕ Inserção de Palestrante

## 📌 Objetivo
Permitir que organizadores cadastrem novos palestrantes na plataforma, associando informações básicas e preferências de tipos de conteúdo.

---

## 🔗 Endpoint
`POST /api/inserir-palestrante`

---

## 📥 Body esperado (JSON)

| Campo         | Tipo      | Obrigatório | Descrição                                      |
|---------------|-----------|-------------|------------------------------------------------|
| nome          | string    | ✅          | Nome do palestrante                            |
| email         | string    | ❌          | Email para contato                             |
| telefone      | string    | ✅          | Somente números, 11 dígitos                    |
| especialidade | string    | ✅          | Área de especialidade                          |
| crm           | string    | ❌          | Número do CRM (se aplicável)                   |
| preferencias  | array<int>| ❌          | IDs dos tipos de produto preferidos            |

---

## 🧪 Validações

1. Telefone deve conter exatamente 11 dígitos numéricos.
2. Nome, telefone e especialidade são obrigatórios.
3. Verificação de duplicidade: impede cadastro de palestrantes com mesmo nome + especialidade.

---

## ⚙️ Lógica interna

1. Valida os dados recebidos.
2. Verifica duplicidade no banco (`SELECT * FROM Palestrante WHERE nome = ? AND especialidade = ?`).
3. Se não houver duplicata, insere o palestrante na tabela `Palestrante`.
4. Se houver array `preferencias`, insere os dados na tabela `PalestranteTipoProduto`.

---

## 🧵 Necessidade de Promises no módulo `db`

> ⚠️ **Atenção:** O uso de `await db.query(...)` **requer** que o método `query()` do módulo `db` seja baseado em Promises.

Caso contrário, o código pode falhar silenciosamente ou gerar erros inesperados.

### ✅ Solução recomendada:

No arquivo `models/db.js`, adapte o método `query` para retornar Promises utilizando `mysql2`:

```js
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ /* config */ });

module.exports = pool;
