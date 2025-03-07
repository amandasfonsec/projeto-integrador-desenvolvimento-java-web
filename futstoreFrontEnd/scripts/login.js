const formulario = document.getElementById('loginForm');

const Iusuario = document.querySelector('#usuario');
const Isenha = document.querySelector('#senha');

function login() {
    fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: Iusuario.value,
            senha: Isenha.value
        })
    })
        .then(function (res) { console.log(res) })
        .catch(function (res) { console.log(res) })
}

formulario.addEventListener('submit', function (event) {
    event.preventDefault(); 
    login();
});