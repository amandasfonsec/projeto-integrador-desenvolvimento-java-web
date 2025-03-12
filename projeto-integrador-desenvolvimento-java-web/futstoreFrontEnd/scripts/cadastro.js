const formulario = document.getElementById('formCadastro');

const Inome = document.querySelector('#nomeCadastro');
const Iemail = document.querySelector('#emailCadastro');
const Isenha = document.querySelector('#senhaCadastro');
const Isenha2 = document.querySelector('#confirmaSenhaCadastro');
const Icpf = document.querySelector('#cpfCadastro');
const Igrupo = document.querySelector('#selectGrupoCadastro');


function cadastrar() {
    fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: Inome.value,
            email: Iemail.value,
            senha: Isenha.value,
            cpf: Icpf.value,
            grupo: Igrupo.value
        })
    })
    .then(function (res) {
        if (res.ok) {
            // Se der certo
            window.location.href = 'listaUsuarios.html'; 
        }
    })
    .catch(function (error) {
        console.log('Erro na requisição:', error);
    });
}

function limpar() {
    Inome.value ="";
    Iemail.value ="";
    Isenha.value ="";
    Isenha2.value ="";
    Icpf.value ="";
    Igrupo.value ="";
}

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const dados ={
        nome: Inome.value,
        email: Iemail.value,
        senha: Isenha.value,
        cpf: Icpf.value,
        grupo: Igrupo.value
    }

    console.log(dados);
    
    cadastrar();
    limpar();

});