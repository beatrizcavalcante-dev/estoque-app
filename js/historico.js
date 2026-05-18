// ================================
// RENDERIZA o histórico filtrado
// ================================
function renderizarHistorico(filtro = "todos") {
  const tbody = document.getElementById("tabela-historico")
  const msgVazio = document.getElementById("msg-vazio")

  tbody.innerHTML = ""

  // filtra conforme o botão clicado
  const lista = filtro === "todos"
    ? [...movimentacoes].reverse()
    : [...movimentacoes].filter(m => m.tipo === filtro).reverse()

  // exibe mensagem se não houver registros
  if (lista.length === 0) {
    msgVazio.style.display = "block"
    return
  }

  msgVazio.style.display = "none"

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

// ================================
// LÓGICA DOS BOTÕES DE FILTRO
// ================================
const botoes = document.querySelectorAll(".btn-filtro")

botoes.forEach(botao => {
  botao.addEventListener("click", function() {

    // remove o active de todos os botões
    botoes.forEach(b => b.classList.remove("active"))

    // adiciona o active no botão clicado
    this.classList.add("active")

    // pega o valor do filtro do atributo data-filtro
    const filtro = this.dataset.filtro

    renderizarHistorico(filtro)
  })
})

renderizarHistorico()