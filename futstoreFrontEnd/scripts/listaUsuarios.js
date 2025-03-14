document.addEventListener("DOMContentLoaded", function () {
    fetchUsuarios();

    document.getElementById("buscarBtn").addEventListener("click", function () {
        const termoBusca = document.getElementById("buscarInput").value;
        fetchUsuarios(termoBusca);
    });
});

function fetchUsuarios(termoBusca = "") {
    const url = termoBusca ? `http://localhost:8080/usuarios/buscar?nome=${encodeURIComponent(termoBusca)}` : "http://localhost:8080/usuarios";
    
    fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } })
        .then(response => response.json())
        .then(usuarios => tabela(usuarios))
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

function tabela(usuarios) {
    const tabela = document.querySelector("table");
    const usuarioLogadoId = localStorage.getItem("id");
    console.log(usuarioLogadoId);

    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    usuarios.forEach(usuario => {
        let linha = tabela.insertRow();

        linha.insertCell(0).textContent = usuario.nome;
        linha.insertCell(1).textContent = usuario.email;
        linha.insertCell(2).textContent = usuario.status;
        linha.insertCell(3).textContent = usuario.grupo;
        linha.insertCell(4).innerHTML = `<a href="cadastro.html?id=${usuario.id}">Alterar</a>`;

        let habilitar = linha.insertCell(5);
        
        if (usuario.id.toString() === usuarioLogadoId) {
            habilitar.innerHTML = `<span style="color: gray;">Não permitido</span>`;
        } else {
            habilitar.innerHTML = `<a href="#" class="habilitar" data-id="${usuario.id}" data-status="${usuario.status}">
                ${usuario.status === 'ATIVO' ? 'Desabilitar' : 'Habilitar'}
            </a>`;

            habilitar.querySelector('a').addEventListener('click', function (event) {
                event.preventDefault();
                alterarStatus(event.target);
            });
        }
    });
}

function alterarStatus(botao) {
    const idUsuario = botao.getAttribute('data-id');
    const novoStatus = botao.getAttribute('data-status') === 'ATIVO' ? 'INATIVO' : 'ATIVO';

    if (confirm(`Tem certeza que deseja ${novoStatus === 'ATIVO' ? 'habilitar' : 'desabilitar'} este usuário?`)) {
        fetch(`http://localhost:8080/usuarios/${idUsuario}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                botao.textContent = novoStatus === 'ATIVO' ? 'Desabilitar' : 'Habilitar';
                botao.setAttribute('data-status', novoStatus);
                botao.closest('tr').cells[2].textContent = novoStatus;
            } else {
                console.error('Erro ao atualizar status');
            }
        })
        .catch(error => console.error('Erro ao atualizar status:', error));
    }
}

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