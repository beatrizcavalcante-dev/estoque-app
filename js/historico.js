async function renderizarHistorico(filtro = "todos") {
  const resposta      = await fetch(`${API}/movimentacoes`)
  const movimentacoes = await resposta.json()

  const tbody    = document.getElementById("tabela-historico")
  const msgVazio = document.getElementById("msg-vazio")

  tbody.innerHTML = ""

  const lista = filtro === "todos"
    ? movimentacoes
    : movimentacoes.filter(m => m.tipo === filtro)

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

const botoes = document.querySelectorAll(".btn-filtro")

botoes.forEach(botao => {
  botao.addEventListener("click", function() {
    botoes.forEach(b => b.classList.remove("active"))
    this.classList.add("active")
    renderizarHistorico(this.dataset.filtro)
  })
})

renderizarHistorico()