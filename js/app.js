const API = "http://127.0.0.1:3000"

async function carregarProdutos() {
  const resposta = await fetch(`${API}/produtos`)
  const produtos = await resposta.json()
  return produtos
}

async function carregarMovimentacoes() {
  const resposta = await fetch(`${API}/movimentacoes`)
  const movimentacoes = await resposta.json()
  return movimentacoes
}

async function atualizarMetrics() {
  const produtos       = await carregarProdutos()
  const movimentacoes  = await carregarMovimentacoes()

  const totalProdutos = produtos.length

  const totalEntradas = movimentacoes
    .filter(m => m.tipo === "entrada")
    .reduce((soma, m) => soma + m.quantidade, 0)

  const totalSaidas = movimentacoes
    .filter(m => m.tipo === "saida")
    .reduce((soma, m) => soma + m.quantidade, 0)

  const totalAlertas = produtos
    .filter(p => p.quantidade < p.estoque_minimo).length

  document.getElementById("total-produtos").textContent = totalProdutos
  document.getElementById("total-entradas").textContent = totalEntradas
  document.getElementById("total-saidas").textContent   = totalSaidas
  document.getElementById("total-alertas").textContent  = totalAlertas
}

async function renderizarTabela() {
  const produtos = await carregarProdutos()
  const tbody    = document.getElementById("tabela-produtos")

  if (!tbody) return

  tbody.innerHTML = ""

  produtos.forEach(produto => {
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
        <td>${badge}</td>
      </tr>
    `
  })
}

// MENU MOBILE //
const menuToggle = document.getElementById("menu-toggle")
const sidebar    = document.getElementById("sidebar")

if (menuToggle) {
  menuToggle.addEventListener("click", function() {
    sidebar.classList.toggle("open")
  })

  document.addEventListener("click", function(evento) {
    const clicouFora = !sidebar.contains(evento.target) &&
                       !menuToggle.contains(evento.target)
    if (clicouFora && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open")
    }
  })
}

if (document.getElementById("total-produtos")) atualizarMetrics()
if (document.getElementById("tabela-produtos")) renderizarTabela()