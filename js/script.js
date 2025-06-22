document.addEventListener('DOMContentLoaded', () => {
  // Elementos da interface
  const telaLogin = document.getElementById('tela-login');
  const formLogin = document.getElementById('form-login');
  const erroLogin = document.getElementById('erro-login');
  const conteudoPrincipal = document.getElementById('conteudo-principal');

  const catalogo = document.getElementById('catalogo');
  const itensCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');
  const quantidadeCarrinho = document.getElementById('quantidade-carrinho');
  const carrinhoAside = document.getElementById('carrinho');
  const botaoCarrinho = document.getElementById('botao-carrinho');
  const botaoFecharCarrinho = document.getElementById('fechar-carrinho');
  const botaoFinalizarCompra = document.getElementById('finalizar-compra');
  const modalCheckout = document.getElementById('modal-checkout');
  const formCheckout = document.getElementById('form-checkout');
  const resumoPedidoDiv = document.getElementById('resumo-pedido');
  const botaoCancelarCheckout = document.getElementById('cancelar-checkout');
  const botaoLogout = document.getElementById('botao-logout');

  let produtos = [];
  let carrinho = [];

  // --- Funções para localStorage do carrinho ---
  function salvarCarrinho() {
    localStorage.setItem('carrinhoMercado', JSON.stringify(carrinho));
  }

  function carregarCarrinho() {
    const dados = localStorage.getItem('carrinhoMercado');
    if (dados) {
      carrinho = JSON.parse(dados);
    }
  }

  // Controle simples de login:
  // Usuário fixo: admin
  // Senha fixa: 1234
  function estaLogado() {
    return sessionStorage.getItem('logado') === 'true';
  }

  function fazerLogin(usuario, senha) {
    // aqui você pode trocar para validação real via backend
    return usuario === 'admin' && senha === '1234';
  }

  function mostrarConteudo() {
    telaLogin.style.display = 'none';
    conteudoPrincipal.style.display = 'block';
    carregarCarrinho();
    atualizarCarrinho();
    buscarProdutos();
  }

  function mostrarLogin() {
    telaLogin.style.display = 'block';
    conteudoPrincipal.style.display = 'none';
  }

  // Tratamento do submit do login
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (fazerLogin(usuario, senha)) {
      sessionStorage.setItem('logado', 'true');
      erroLogin.textContent = '';
      mostrarConteudo();
      formLogin.reset();
    } else {
      erroLogin.textContent = 'Usuário ou senha incorretos.';
    }
  });

  // Logout - limpar sessão e voltar para login
  botaoLogout.addEventListener('click', () => {
    sessionStorage.removeItem('logado');
    mostrarLogin();
  });

  // Busca produtos da API
  async function buscarProdutos() {
    try {
      const resposta = await fetch('https://fakestoreapi.com/products');
      const dados = await resposta.json();
      produtos = dados;
      filtrarCategoria('Todos');
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      catalogo.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
  }

  // Exibir produtos no catálogo
  function exibirCatalogo(produtosExibidos) {
    catalogo.innerHTML = '';

    produtosExibidos.forEach(produto => {
      const produtoHTML = document.createElement('div');
      produtoHTML.classList.add('produto');

      produtoHTML.innerHTML = `
          <img src="${produto.image}" alt="${produto.title}" />
          <h3>${produto.title}</h3>
          <p>${produto.description.substring(0, 70)}...</p>
          <span>R$ ${produto.price.toFixed(2)}</span><br />
          <button>Adicionar ao Carrinho</button>
      `;

      produtoHTML.querySelector('button').addEventListener('click', () => {
        adicionarAoCarrinho(produto.id);
      });

      catalogo.appendChild(produtoHTML);
    });
  }

  // Adicionar produto ao carrinho por id
  function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ id: produto.id, nome: produto.title, preco: produto.price, quantidade: 1 });
    }

    atualizarCarrinho();
    abrirCarrinho();
    salvarCarrinho();
  }

  // Remover item do carrinho por id
  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
    salvarCarrinho();
  }

  // Atualizar carrinho na UI
  function atualizarCarrinho() {
    itensCarrinho.innerHTML = '';

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(item => {
      const itemHTML = document.createElement('li');
      itemHTML.innerHTML = `
          ${item.nome} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}
          <button class="remover-item">Remover</button>
      `;

      itemHTML.querySelector('button').addEventListener('click', () => {
        removerDoCarrinho(item.id);
      });

      itensCarrinho.appendChild(itemHTML);

      total += item.preco * item.quantidade;
      quantidadeTotal += item.quantidade;
    });

    totalCarrinho.innerText = `Total: R$ ${total.toFixed(2)}`;
    quantidadeCarrinho.innerText = quantidadeTotal;
  }

  // Filtrar por categoria
  function filtrarCategoria(categoria) {
    if (categoria === 'Todos') {
      exibirCatalogo(produtos);
    } else {
      const filtrados = produtos.filter(p => p.category === categoria);
      exibirCatalogo(filtrados);
    }
    fecharCarrinho();
  }

  // Abrir/fechar carrinho lateral
  function abrirCarrinho() {
    carrinhoAside.classList.add('aberto');
  }

  function fecharCarrinho() {
    carrinhoAside.classList.remove('aberto');
  }

  botaoCarrinho.addEventListener('click', () => {
    if (carrinhoAside.classList.contains('aberto')) {
      fecharCarrinho();
    } else {
      abrirCarrinho();
    }
  });

  botaoFecharCarrinho.addEventListener('click', () => {
    fecharCarrinho();
  });

  // Botões de categoria no menu
  const botoesCategorias = document.querySelectorAll('.menu-itens button');
  botoesCategorias.forEach(botao => {
    botao.addEventListener('click', () => {
      const categoria = botao.getAttribute('data-categoria');
      filtrarCategoria(categoria);
    });
  });

  // Finalizar compra - abrir modal
  botaoFinalizarCompra.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    mostrarResumoPedido();
    abrirModal();
  });

  // Mostrar resumo do pedido no modal
  function mostrarResumoPedido() {
    let html = '<h3>Resumo do Pedido:</h3><ul>';
    carrinho.forEach(item => {
      html += `<li>${item.nome} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>`;
    });
    html += `</ul><p><strong>Total: R$ ${carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)}</strong></p>`;
    resumoPedidoDiv.innerHTML = html;
  }

  function abrirModal() {
    modalCheckout.style.display = 'flex';
  }

  function fecharModal() {
    modalCheckout.style.display = 'none';
  }

  botaoCancelarCheckout.addEventListener('click', () => {
    fecharModal();
  });

  formCheckout.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const pagamento = formCheckout.elements['pagamento'].value;

    if (!nome || !endereco || !telefone || !pagamento) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    alert(`Obrigado pela sua compra, ${nome}!\n\nSeu pedido foi confirmado.\nForma de pagamento: ${pagamento}\nEndereço de entrega: ${endereco}`);

    carrinho = [];
    atualizarCarrinho();
    salvarCarrinho();
    fecharModal();
    fecharCarrinho();
    formCheckout.reset();
  });

  // Verificar se já está logado na sessão
  if (estaLogado()) {
    mostrarConteudo();
  } else {
    mostrarLogin();
  }
});
