
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

        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            alert(data.erro || data || "Usuário ou senha inválidos!");
            return;
        }

        if (data.erro) { 
            alert(data.erro); 
            return;
        }

        // Token e dados salvos normalmente
        const token = data.token;
        const grupo = data.grupo;
        const nome = data.nome;
        const id = data.id;

        localStorage.setItem("token", token);
        localStorage.setItem("grupo", grupo);
        localStorage.setItem("nome", nome);
        localStorage.setItem("id", id);

        window.location.href = 'principal.html';

    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao conectar ao servidor.");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('grupo');
    localStorage.removeItem('nome');
    localStorage.removeItem('id');
});
