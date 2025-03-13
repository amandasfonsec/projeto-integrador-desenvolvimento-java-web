document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("http://localhost:8080/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (!response.ok) {
            alert("Usuário ou senha inválidos!");
            return;
        }

        const data = await response.json();
        const token = data.token; //pega o token
        const grupo = data.grupo; //pega o grupo
        const nome = data.nome; //pega o nome

        // Armazena o token e os ouros negócios no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("grupo", grupo);
        localStorage.setItem("nome", nome);


        window.location.href = 'principal.html';
        

    } catch (error) {
        console.error("Erro ao logar:", error);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('grupo');
    localStorage.removeItem('nome');
});
