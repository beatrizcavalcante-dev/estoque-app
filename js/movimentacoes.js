// ================================
// PREENCHE SELECT COM PRODUTOS DA API
// ================================
async function preencherSelectProdutos() {
  const resposta = await fetch(`${API}/produtos`)
  const produtos  = await resposta.json()

  const select = document.getElementById("produto-select")
  select.innerHTML = '<option value="">Selecione o produto...</option>'

  produtos.forEach(produto => {
    select.innerHTML += `<option value="${produto.id}">${produto.nome}</option>`
  })
}

// ================================
// RENDERIZA TABELA DE MOVIMENTAÇÕES
// ================================
async function renderizarMovimentacoes() {
  const resposta      = await fetch(`${API}/movimentacoes`)
  const movimentacoes = await resposta.json()

  const tbody = document.getElementById("tabela-movimentacoes")
  tbody.innerHTML = ""

  if (movimentacoes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--text-muted); padding: 24px;">
          Nenhuma movimentação registrada.
        </td>
      </tr>
    `
    return
  }

  movimentacoes.forEach(mov => {
    const tipo = mov.tipo === "entrada"
      ? '<span class="badge ok">Entrada</span>'
      : '<span class="badge critico">Saída</span>'

    tbody.innerHTML += `
      <tr>
        <td>${mov.produto}</td>
        <td>${tipo}</td>
        <td>${mov.quantidade}</td>
        <td>${mov.observacao || "—"}</td>
        <td>${mov.data}</td>
      </tr>
    `
  })
}

// ================================
// REGISTRAR MOVIMENTAÇÃO
// ================================
const form = document.getElementById("form-movimentacao")

form.addEventListener("submit", async function(evento) {
  evento.preventDefault()

  const produto_id = document.getElementById("produto-select").value
  const tipo       = document.getElementById("tipo").value
  const quantidade = Number(document.getElementById("qtd-mov").value)
  const observacao = document.getElementById("observacao").value.trim()

  if (!produto_id) {
    alert("Selecione um produto.")
    return
  }

  if (!quantidade || quantidade <= 0) {
    alert("Informe uma quantidade válida.")
    return
  }

  // busca o produto para verificar estoque
  const resposta = await fetch(`${API}/produtos/${produto_id}`)
  const produto  = await resposta.json()

  if (tipo === "saida" && quantidade > produto.quantidade) {
    alert(`Estoque insuficiente. Disponível: ${produto.quantidade}`)
    return
  }

  await fetch(`${API}/movimentacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      produto_id,
      produto: produto.nome,
      tipo,
      quantidade,
      observacao,
      data: new Date().toLocaleDateString("pt-BR")
    })
  })

  form.reset()
  preencherSelectProdutos()
  renderizarMovimentacoes()
})

// inicializa
preencherSelectProdutos()
renderizarMovimentacoes()