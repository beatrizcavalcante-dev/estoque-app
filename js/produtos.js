// ================================
// LÓGICA DA PÁGINA DE PRODUTOS
// ================================

const form = document.getElementById("form-produto")

// escuta o evento de envio do formulário
form.addEventListener("submit", function(evento) {

  // impede o comportamento padrão do form (recarregar a página)
  evento.preventDefault()

  // lê os valores dos campos
  const nome     = document.getElementById("nome").value.trim()
  const categoria = document.getElementById("categoria").value
  const quantidade = Number(document.getElementById("quantidade").value)
  const estoqueMinimo = Number(document.getElementById("estoque-minimo").value)

  // validação simples — campos obrigatórios
  if (!nome || !categoria) {
    alert("Preencha o nome e a categoria do produto.")
    return // para a função aqui se faltar campo
  }

  // cria o objeto do novo produto
  const novoProduto = {
    nome,
    categoria,
    quantidade,
    estoque_minimo: estoqueMinimo
  }
  
  produtos.push(novoProduto)
  salvarDados()   
  form.reset()  
  renderizarTabela()
  alert(`Produto "${nome}" cadastrado com sucesso!`)
})