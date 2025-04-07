let btnLoginCadastro = document.getElementById('loginBtn');
let modalAcao = document.getElementById('modalAcao');

window.addEventListener("DOMContentLoaded", function() {
    let nomeCliente = localStorage.getItem("nomeCliente");

    if (nomeCliente) {

        btnLoginCadastro.innerHTML = `<i class="fa fa-user"></i> | ${nomeCliente}`;

        btnLoginCadastro.addEventListener("click", function(){
            modalAcao.classList.toggle("hidden");
        });

    } else {
        btnLoginCadastro.addEventListener("click", function(){
            window.location.href = "./loginCliente.html";
        });
    }
});
