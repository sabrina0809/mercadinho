// Banco de dados fictício de usuários
const users = {
    'admin': 'senha123',
    'cliente': 'cliente123'
  };
  
  // Função de login
  document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');
  
    // Verificando se o nome de usuário existe e a senha está correta
    if (users[username] && users[username] === password) {
      localStorage.setItem('userLogged', username); // Armazenando o usuário no localStorage
      window.location.href = 'catalogo.html';  // Redirecionando para o catálogo
    } else {
      error.textContent = 'Usuário ou senha incorretos!';
    }
  });
  
  // Verificação de login na página de catálogo
  const userLogged = localStorage.getItem('userLogged');
  
  // Verifica se está na página de catálogo
  if (document.location.pathname.includes('catalogo.html')) {
    if (!userLogged) {
      alert('Você precisa fazer login primeiro!');
      window.location.href = 'login.html';  // Redireciona para o login se não estiver logado
    }
  }
  
  // Função de logout
  function logout() {
    localStorage.removeItem('userLogged');  // Remove o usuário do localStorage
    window.location.href = 'login.html';  // Redireciona para a página de login
  }
  