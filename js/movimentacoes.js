// PREENCHE o select com os produtos
function preencherSelectProdutos() {
  const select = document.getElementById("produto-select")
  select.innerHTML = '<option value="">Selecione o produto...</option>'

  produtos.forEach((produto, index) => {
    // index é a posição do produto no array
    // usamos como identificador único
    select.innerHTML += `<option value="${index}">${produto.nome}</option>`
  })
}

// RENDERIZA 
function renderizarMovimentacoes() {
  const tbody = document.getElementById("tabela-movimentacoes")
  tbody.innerHTML = ""

  // exibe do mais recente para o mais antigo
  const lista = [...movimentacoes].reverse()

  lista.forEach(mov => {
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

// REGISTRA nova movimentação
const form = document.getElementById("form-movimentacao")

form.addEventListener("submit", function(evento) {
  evento.preventDefault()

  const indexProduto = document.getElementById("produto-select").value
  const tipo         = document.getElementById("tipo").value
  const quantidade   = Number(document.getElementById("qtd-mov").value)
  const observacao   = document.getElementById("observacao").value.trim()

  // validações
  if (indexProduto === "") {
    alert("Selecione um produto.")
    return
  }
  if (!quantidade || quantidade <= 0) {
    alert("Informe uma quantidade válida.")
    return
  }

  const produto = produtos[indexProduto]

  // impede saída maior que o estoque disponível
  if (tipo === "saida" && quantidade > produto.quantidade) {
    alert(`Estoque insuficiente. Disponível: ${produto.quantidade}`)
    return
  }

  // atualiza a quantidade do produto
  if (tipo === "entrada") {
    produto.quantidade += quantidade
  } else {
    produto.quantidade -= quantidade
  }

  // cria o registro da movimentação
  const novaMovimentacao = {
    produto: produto.nome,
    tipo,
    quantidade,
    observacao,
    data: new Date().toLocaleDateString("pt-BR") // data de hoje
  }

  movimentacoes.push(novaMovimentacao)
  salvarDados()
  form.reset()
  preencherSelectProdutos()
  renderizarMovimentacoes()
})

preencherSelectProdutos()
renderizarMovimentacoes()