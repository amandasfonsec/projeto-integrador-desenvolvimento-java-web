document.addEventListener("DOMContentLoaded", function () {
    fetchUsuarios();

    document.getElementById("buscarBtn").addEventListener("click", function () {
        const termoBusca = document.getElementById("buscarInput").value;
    
        fetch(`http://localhost:8080/usuarios/buscar?nome=${encodeURIComponent(termoBusca)}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(usuarios => {
                tabela(usuarios);
            })
            .catch(error => console.error("Erro ao buscar usuários:", error));
    });
});

function fetchUsuarios() {
    fetch("http://localhost:8080/usuarios", {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar usuários");
            }
            return response.json();
        })
        .then(usuarios => {
            usuariosData = usuarios;
            tabela(usuarios);
        })
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

function tabela(usuarios) {
    const tabela = document.querySelector("table");

    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    usuarios.forEach(usuario => {
        let linha = tabela.insertRow();

        linha.insertCell(0).textContent = usuario.nome;
        linha.insertCell(1).textContent = usuario.email;
        linha.insertCell(2).textContent = usuario.status;
        linha.insertCell(3).textContent = usuario.grupo;

        let alterar = linha.insertCell(4);
        alterar.innerHTML = `<a href="cadastro.html?id=${usuario.id}">Alterar</a>`;

        let habilitar = linha.insertCell(5);
        habilitar.innerHTML = `<a href="#" class="habilitar" data-id="${usuario.id}" data-status="${usuario.status}">
            ${usuario.status === 'ATIVO' ? 'Desabilitar' : 'Habilitar'}
        </a>`;

        // evento para alternar o status
        habilitar.querySelector('a').addEventListener('click', function (event) {
            event.preventDefault();

            const idUsuario = event.target.getAttribute('data-id');
            const novoStatus = event.target.getAttribute('data-status') === 'ATIVO' ? 'INATIVO' : 'ATIVO';

            const confirmacao = window.confirm(`Tem certeza que deseja ${novoStatus === 'ATIVO' ? 'habilitar' : 'desabilitar'} o usuário ${event.target.closest('tr').cells[0].textContent}?`);

            if (confirmacao) {
                // atualizar o status
                fetch(`http://localhost:8080/usuarios/${idUsuario}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: novoStatus }) 
                })
                .then(response => {
                    if (response.ok) {
                        // Atualizar o status na tabela
                        event.target.textContent = novoStatus === 'ATIVO' ? 'Desabilitar' : 'Habilitar';
                        event.target.setAttribute('data-status', novoStatus);
                        // Alterar a coluna de status
                        event.target.closest('tr').cells[2].textContent = novoStatus === 'ATIVO' ? 'ATIVO' : 'INATIVO';
                    } else {
                        console.error('Erro ao atualizar status');
                    }
                })
                .catch(error => console.error('Erro ao atualizar status:', error));
            } else {
                console.log('Alteração cancelada');
            }
        });
    });
}




