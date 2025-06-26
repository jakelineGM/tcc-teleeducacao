// Utilizado pela navbar-publico
function personalizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const loginBtn = document.getElementById('login-btn');
  
  if (usuario && loginBtn) {
    const navActions = loginBtn.parentElement;
    loginBtn.remove();

    const painelBtn = document.createElement('a');
    painelBtn.href = "dashboard-publico.html";
    painelBtn.className = "botao";
    painelBtn.innerText = "Painel";

    const sairBtn = document.createElement('a');
    sairBtn.href = "#";
    sairBtn.className = "botao sair navbat";
    sairBtn.innerText = "Sair";
    sairBtn.onclick = logout;

    navActions.appendChild(painelBtn);
    navActions.appendChild(sairBtn);
  }
}

// Utilizado pelas navbars e menus laterais
function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = "index.html";
}

window.onload = personalizarNavbar;
