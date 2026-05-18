const form = document.getElementById("form-produto")

// ================================
// RENDERIZA tabela com filtro opcional
// ================================
function renderizarTabela(filtro = "") {
  const tbody = document.getElementById("tabela-produtos")
  tbody.innerHTML = ""

  // filtra produtos pelo nome se houver texto na busca
  const lista = filtro
    ? produtos.filter(p =>
        p.nome.toLowerCase().includes(filtro.toLowerCase())
      )
    : produtos

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--text-muted); padding: 24px;">
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
        <td>
          <button class="btn-excluir" data-index="${produtos.indexOf(produto)}">
            Excluir
          </button>
        </td>
      </tr>
    `
  })
}

// ================================
// BUSCA EM TEMPO REAL
// ================================
const campoBusca = document.getElementById("busca")

campoBusca.addEventListener("input", function() {
  renderizarTabela(this.value)
})

// ================================
// CADASTRO DE PRODUTO
// ================================
form.addEventListener("submit", function(evento) {
  evento.preventDefault()

  const nome        = document.getElementById("nome").value.trim()
  const categoria   = document.getElementById("categoria").value
  const quantidade  = Number(document.getElementById("quantidade").value)
  const estoqueMinimo = Number(document.getElementById("estoque-minimo").value)

  if (!nome || !categoria) {
    alert("Preencha o nome e a categoria do produto.")
    return
  }

  produtos.push({ nome, categoria, quantidade, estoque_minimo: estoqueMinimo })
  salvarDados()
  form.reset()
  renderizarTabela()
  alert(`Produto "${nome}" cadastrado com sucesso!`)
})

// ================================
// DELETAR PRODUTO
// ================================
document.addEventListener("click", function(evento) {

  // verifica se o clique foi num botão de excluir
  if (!evento.target.classList.contains("btn-excluir")) return

  const index = Number(evento.target.dataset.index)
  const nome  = produtos[index].nome

  // pede confirmação antes de deletar
  const confirmado = confirm(`Deseja excluir "${nome}"?`)
  if (!confirmado) return

  // remove o produto do array pelo index
  produtos.splice(index, 1)
  salvarDados()
  renderizarTabela()
})

renderizarTabela()