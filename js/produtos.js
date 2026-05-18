const form      = document.getElementById("form-produto")
const btnSubmit = document.getElementById("btn-submit")

// ================================
// RENDERIZA tabela com filtro opcional
// ================================
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

    const index = produtos.indexOf(produto)

    tbody.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.estoque_minimo}</td>
        <td>${badge}</td>
        <td style="display:flex; gap:8px;">
          <button class="btn-editar"  data-index="${index}">Editar</button>
          <button class="btn-excluir" data-index="${index}">Excluir</button>
        </td>
      </tr>
    `
  })
}

// ================================
// BUSCA EM TEMPO REAL
// ================================
document.getElementById("busca").addEventListener("input", function() {
  renderizarTabela(this.value)
})

// ================================
// CLIQUES NA TABELA (editar e excluir)
// ================================
document.addEventListener("click", function(evento) {

  // EXCLUIR
  if (evento.target.classList.contains("btn-excluir")) {
    const index = Number(evento.target.dataset.index)
    const nome  = produtos[index].nome

    if (!confirm(`Deseja excluir "${nome}"?`)) return

    produtos.splice(index, 1)
    salvarDados()
    renderizarTabela()
    return
  }

  // EDITAR — preenche o formulário com os dados do produto
  if (evento.target.classList.contains("btn-editar")) {
    const index   = Number(evento.target.dataset.index)
    const produto = produtos[index]

    document.getElementById("nome").value            = produto.nome
    document.getElementById("categoria").value       = produto.categoria
    document.getElementById("quantidade").value      = produto.quantidade
    document.getElementById("estoque-minimo").value  = produto.estoque_minimo
    document.getElementById("edit-index").value      = index

    // muda o texto do botão para deixar claro que é edição
    btnSubmit.textContent = "Salvar Alterações"

    // rola a página até o formulário
    form.scrollIntoView({ behavior: "smooth" })
  }
})

// ================================
// SUBMIT — cadastro ou edição
// ================================
form.addEventListener("submit", function(evento) {
  evento.preventDefault()

  const nome          = document.getElementById("nome").value.trim()
  const categoria     = document.getElementById("categoria").value
  const quantidade    = Number(document.getElementById("quantidade").value)
  const estoqueMinimo = Number(document.getElementById("estoque-minimo").value)
  const editIndex     = Number(document.getElementById("edit-index").value)

  if (!nome || !categoria) {
    alert("Preencha o nome e a categoria do produto.")
    return
  }

  if (editIndex === -1) {
    // CADASTRO NOVO
    produtos.push({ nome, categoria, quantidade, estoque_minimo: estoqueMinimo })
    alert(`Produto "${nome}" cadastrado com sucesso!`)
  } else {
    // EDIÇÃO
    produtos[editIndex] = { nome, categoria, quantidade, estoque_minimo: estoqueMinimo }
    alert(`Produto "${nome}" atualizado com sucesso!`)

    // reseta o índice e o botão
    document.getElementById("edit-index").value = -1
    btnSubmit.textContent = "Cadastrar Produto"
  }

  salvarDados()
  form.reset()
  renderizarTabela()
})


renderizarTabela()