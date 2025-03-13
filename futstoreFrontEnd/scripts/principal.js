// Função para validação do token, que precisa em todas as pgs
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

    if (!listarUsuariosLink) {
        console.error('Elemento listarUsuariosLink não encontrado!');
        return;
    }

    if (grupo !== 'ADMINISTRADOR') {
        listarUsuariosLink.style.pointerEvents = 'none';
        listarUsuariosLink.style.color = 'gray';
    } else {
        listarUsuariosLink.style.pointerEvents = 'auto';
        listarUsuariosLink.style.color = 'black';
        listarUsuariosLink.addEventListener('click', () => {
            window.location.href = './listaUsuarios.html';
        });
    }

    

});


    
