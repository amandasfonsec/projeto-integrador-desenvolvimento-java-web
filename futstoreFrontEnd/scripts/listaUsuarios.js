document.addEventListener("DOMContentLoaded", function () {
    fetchUsuarios();  //Carrega a tabela 
    setInterval(fetchUsuarios, 1000);  //Atualiza a tabela
});

function fetchUsuarios() {
    fetch("http://localhost:8080/usuarios") 
        .then(response => response.json())
        .then(usuarios => tabela(usuarios))
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

function tabela(usuarios) {
    const tabela = document.querySelector("table");
    
    //Limpa a tabela
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
        alterar.innerHTML = `<a href="#">Alterar</a>`;

        let habilitar = linha.insertCell(5);
        habilitar.innerHTML = `<a href="#">Habilitar</a>`;
    });
}
