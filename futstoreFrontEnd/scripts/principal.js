function isTokenValid(token) {
    try {
        const pureToken = token.replace('Bearer ', '');
        const parts = pureToken.split('.');

        if (parts.length !== 3) {
            return false;
        }

        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) {
            return false;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        return false;
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token || !isTokenValid(token)) {
        alert('Sessão expirada! Faça login novamente.');
        window.location.href = './login.html';
        return;
    }

    const grupo = localStorage.getItem('grupo');
    console.log('Grupo:', grupo);

    const listarUsuariosLink = document.getElementById('listarUsuariosLink');
    const listarPedidosLink = document.getElementById('listarPedidos');

    if (!listarUsuariosLink) {
        console.error('Elemento listarUsuariosLink não encontrado!');
        return;
    }

    if (grupo !== 'ADMINISTRADOR') {
        listarPedidosLink.style.display = 'none';
        listarUsuariosLink.style.display = 'none';
    } else {
        //Enquanto a lista de Pedidos não foi criada o style.display do listarPedidos deve ficar invisivel
        //(por enquanto...)
        listarPedidosLink.style.display = 'none';
        listarUsuariosLink.style.pointerEvents = 'auto';
        listarUsuariosLink.style.color = 'dark-blue';
        listarUsuariosLink.addEventListener('click', () => {
            window.location.href = './listaUsuarios.html';
        });
    }

    

});

document.getElementById('listarProduto').addEventListener('click', () => {
    window.location.href = './listarProdutos.html';
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (confirm("Tem certeza que deseja sair?")) {
            // Remover dados do localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("grupo");
            localStorage.removeItem("nome");
            localStorage.removeItem("userId");

            // Redirecionar para a página de login
            window.location.href = "login.html";
        }
    });
});
    
