function isTokenValid(token) {
    try {
        const pureToken = token.replace('Bearer ', '');
        const parts = pureToken.split('.');

        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        return false;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const grupo = localStorage.getItem('grupo');

    if (!token || !isTokenValid(token)) {
        alert('Sessão expirada! Faça login novamente.');
        window.location.href = './login.html';
        return;
    }

    const listarUsuariosLink = document.getElementById('listarUsuariosLink');
    const listarPedidosLink = document.getElementById('listarPedidos');

    if (grupo === 'ADMINISTRADOR') {
        listarUsuariosLink.style.display = 'inline-block';
        listarUsuariosLink.addEventListener('click', () => {
            window.location.href = './listaUsuarios.html';
        });
    }

    if (grupo === 'ADMINISTRADOR' || grupo === 'ESTOQUISTA') {
        listarPedidosLink.style.display = 'inline-block';
        listarPedidosLink.addEventListener('click', () => {
            window.location.href = './pedidosEstoquista.html';
        });
    }

    document.getElementById('listarProduto').addEventListener('click', () => {
        window.location.href = './listarProdutos.html';
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (confirm("Tem certeza que deseja sair?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("grupo");
            localStorage.removeItem("nome");
            localStorage.removeItem("userId");
            window.location.href = "login.html";
        }
    });
});
