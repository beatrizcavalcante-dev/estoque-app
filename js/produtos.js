let produtos = []

async function carregarProdutos() {
  const resposta = await fetch(`${API}/produtos`)
  produtos = await resposta.json()
  renderizarTabela()
}

function renderizarTabela(filtro = "") {
  const tbody = document.getElementById("tabela-produtos")
  tbody.innerHTML = ""

  const lista = filtro
    ? produtos.filter(p =>
        p.nome.toLowerCase().includes(filtro.toLowerCase())
      )
    : produtos

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">
          Nenhum produto encontrado.
        </td>
      </tr>
    `
    return
  }

  lista.forEach(produto => {
    let badge = ""
    if (produto.quantidade === 0) {
      badge = '<span class="badge critico">Sem estoque</span>'
    } else if (produto.quantidade < produto.estoque_minimo) {
      badge = '<span class="badge baixo">Estoque baixo</span>'
    } else {
      badge = '<span class="badge ok">Em estoque</span>'
    }

    tbody.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.estoque_minimo}</td>
        <td>${badge}</td>
        <td style="display:flex; gap:8px;">
          <button class="btn-editar"  data-id="${produto.id}">Editar</button>
          <button class="btn-excluir" data-id="${produto.id}">Excluir</button>
        </td>
      </tr>
    `
  })
}

document.getElementById("busca").addEventListener("input", function() {
  renderizarTabela(this.value)
})

document.addEventListener("click", async function(evento) {

  // EXCLUIR
  if (evento.target.classList.contains("btn-excluir")) {
    const id     = evento.target.dataset.id
    const produto = produtos.find(p => p.id == id)

    if (!confirm(`Deseja excluir "${produto.nome}"?`)) return

    await fetch(`${API}/produtos/${id}`, { method: "DELETE" })
    carregarProdutos()
    return
  }

  // EDITAR — preenche o formulário
  if (evento.target.classList.contains("btn-editar")) {
    const id      = evento.target.dataset.id
    const produto = produtos.find(p => p.id == id)

    document.getElementById("nome").value           = produto.nome
    document.getElementById("categoria").value      = produto.categoria
    document.getElementById("quantidade").value     = produto.quantidade
    document.getElementById("estoque-minimo").value = produto.estoque_minimo
    document.getElementById("edit-index").value     = id

    btnSubmit.textContent = "Salvar Alterações"
    form.scrollIntoView({ behavior: "smooth" })
  }
})

const form      = document.getElementById("form-produto")
const btnSubmit = document.getElementById("btn-submit")

form.addEventListener("submit", async function(evento) {
  evento.preventDefault()

  const nome          = document.getElementById("nome").value.trim()
  const categoria     = document.getElementById("categoria").value
  const quantidade    = Number(document.getElementById("quantidade").value)
  const estoqueMinimo = Number(document.getElementById("estoque-minimo").value)
  const editId        = document.getElementById("edit-index").value

  if (!nome || !categoria) {
    alert("Preencha o nome e a categoria.")
    return
  }

  const dados = { nome, categoria, quantidade, estoque_minimo: estoqueMinimo }

  if (editId === "-1" || editId === "") {
    // CADASTRO NOVO
    await fetch(`${API}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    })
    alert(`Produto "${nome}" cadastrado com sucesso!`)
  } else {
    // EDIÇÃO
    await fetch(`${API}/produtos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    })
    alert(`Produto "${nome}" atualizado!`)
    document.getElementById("edit-index").value = "-1"
    btnSubmit.textContent = "Cadastrar Produto"
  }

  form.reset()
  carregarProdutos()
})

carregarProdutos()