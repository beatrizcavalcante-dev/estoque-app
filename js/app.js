const produtosSalvos = localStorage.getItem("produtos")

const produtos = produtosSalvos ? JSON.parse(produtosSalvos) : [
  { nome: "Caneta Azul",    quantidade: 50,  categoria: "Papelaria",    estoque_minimo: 10 },
  { nome: "Caderno A4",     quantidade: 8,   categoria: "Papelaria",    estoque_minimo: 10 },
  { nome: "Mouse USB",      quantidade: 3,   categoria: "Informática",  estoque_minimo: 5  },
  { nome: "Teclado ABNT",   quantidade: 15,  categoria: "Informática",  estoque_minimo: 5  },
  { nome: "Papel Sulfite",  quantidade: 2,   categoria: "Papelaria",    estoque_minimo: 20 },
]

const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || []

// ================================
// SALVA os dados no localStorage
// ================================
function salvarDados() {
  localStorage.setItem("produtos", JSON.stringify(produtos))
  localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes))
}

// ================================
// FUNÇÃO — atualiza os cards do dashboard
// ================================
function atualizarMetrics() {

  // conta quantos produtos existem
  const totalProdutos = produtos.length

  // soma todas as entradas
  const totalEntradas = movimentacoes
    .filter(m => m.tipo === "entrada")   // pega só as entradas
    .reduce((soma, m) => soma + m.quantidade, 0) // soma as quantidades

  // soma todas as saídas
  const totalSaidas = movimentacoes
    .filter(m => m.tipo === "saida")
    .reduce((soma, m) => soma + m.quantidade, 0)

  // conta produtos abaixo do estoque mínimo
  const totalAlertas = produtos
    .filter(p => p.quantidade < p.estoque_minimo).length

  // atualiza o HTML com os valores calculados
  document.getElementById("total-produtos").textContent = totalProdutos
  document.getElementById("total-entradas").textContent = totalEntradas
  document.getElementById("total-saidas").textContent   = totalSaidas
  document.getElementById("total-alertas").textContent  = totalAlertas
}

// ================================
// FUNÇÃO — renderiza a tabela de produtos
// ================================
function renderizarTabela() {
  const tbody = document.getElementById("tabela-produtos")

  // limpa o conteúdo anterior
  tbody.innerHTML = ""

  // percorre cada produto e cria uma linha na tabela
  produtos.forEach(produto => {

    // define o status com base na quantidade
    let badge = ""
    if (produto.quantidade === 0) {
      badge = '<span class="badge critico">Sem estoque</span>'
    } else if (produto.quantidade < produto.estoque_minimo) {
      badge = '<span class="badge baixo">Estoque baixo</span>'
    } else {
      badge = '<span class="badge ok">Em estoque</span>'
    }

    // cria a linha HTML
    const linha = `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>${produto.quantidade}</td>
        <td>${badge}</td>
      </tr>
    `

    // insere a linha no tbody
    tbody.innerHTML += linha
  })
}

// chama ao carregar a página
// verifica qual página está aberta antes de chamar
if (document.getElementById("total-produtos")) atualizarMetrics()
if (document.getElementById("tabela-produtos")) renderizarTabela()