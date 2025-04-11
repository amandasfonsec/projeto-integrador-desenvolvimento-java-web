let btnLoginCadastro = document.getElementById('loginBtn');
let modalAcao = document.getElementById('modalAcao');

window.addEventListener("DOMContentLoaded", function () {
    let nomeCliente = localStorage.getItem("nomeCliente");

    if (nomeCliente) {
        btnLoginCadastro.innerHTML = `<i class="fa fa-user"></i> | ${nomeCliente}`;

        btnLoginCadastro.addEventListener("click", function () {
            modalAcao.classList.toggle("hidden");
        });

        // Botão de logout
        const btnSair = document.getElementById("logoutBtn");
        if (btnSair) {
            btnSair.addEventListener("click", function () {
                const confirmar = confirm("Deseja sair da sessão?");
                if (confirmar) {
                    localStorage.removeItem("nomeCliente");
                    localStorage.removeItem("tokenCliente");
                    localStorage.removeItem("idCliente");
                    localStorage.removeItem("carrinho");
                    window.location.href = "./loginCliente.html";
                }
            });
        }

        // Botão de editar perfil
        const btnEditar = document.getElementById("btnEditarPerfil");
        if (btnEditar) {
            btnEditar.addEventListener("click", function () {
                window.location.href = "./editarPerfilCliente.html";
            });
        }

    } else {
        btnLoginCadastro.addEventListener("click", function () {
            window.location.href = "./loginCliente.html";
        });
    }
});
