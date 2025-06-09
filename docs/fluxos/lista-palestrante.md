# 📋 Lista de Palestrantes

## Objetivo
Permitir que organizadores visualizem, filtrem e acessem as informações dos palestrantes cadastrados na plataforma de teleeducação.

---

## 🧭 Fluxo de uso

1. Organizador acessa a tela de lista.
2. O sistema valida se o organizador está logado.
3. A tela exibe todos os palestrantes disponíveis.
4. É possível filtrar por:
   - Nome (input de texto)
   - Especialidade (select dinâmico)
5. Ao aplicar filtros, os dados são atualizados automaticamente.

---

## 🔐 Permissão necessária
- Tipo de usuário: `Organizador`
- Validação via `localStorage.getItem('usuarioLogado')`

---

## 🔌 Backend - Endpoint `/api/palestrantes`

### Método
`GET`

### Query Params
| Nome         | Tipo   | Obrigatório | Descrição                     |
|--------------|--------|-------------|-------------------------------|
| `nome`       | string | Não         | Filtro por nome do palestrante |
| `especialidade` | string | Não       | Filtro por especialidade       |

### Resposta
```json
[
  {
    "id_palestrante": 1,
    "nome": "Ana Silva",
    "email": "ana@email.com",
    "telefone": "(00) 00000-0000",
    "especialidade": "Psicologia",
    "crm": null,
    "preferencias": "Podcast, Vídeo"
  }
]
