// ================================
// DADOS TEMPORÁRIOS
// Futuramente virão de um banco de dados
// Por enquanto ficam aqui no JS mesmo
// ================================
const produtos = [
  { nome: "Caneta Azul",    quantidade: 50,  categoria: "Papelaria",    estoque_minimo: 10 },
  { nome: "Caderno A4",     quantidade: 8,   categoria: "Papelaria",    estoque_minimo: 10 },
  { nome: "Mouse USB",      quantidade: 3,   categoria: "Informática",  estoque_minimo: 5  },
  { nome: "Teclado ABNT",   quantidade: 15,  categoria: "Informática",  estoque_minimo: 5  },
  { nome: "Papel Sulfite",  quantidade: 2,   categoria: "Papelaria",    estoque_minimo: 20 },
]

const movimentacoes = [
  { tipo: "entrada", quantidade: 20 },
  { tipo: "entrada", quantidade: 10 },
  { tipo: "saida",   quantidade: 5  },
  { tipo: "saida",   quantidade: 3  },
]

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

// chama a função quando a página carregar
atualizarMetrics()