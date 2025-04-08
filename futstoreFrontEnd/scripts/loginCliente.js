document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("http://localhost:8080/clientes/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
            window.location.href = "home.html";
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

        const tokenCliente = data.token;
        const nomeCliente = data.nome;
        const idCliente = data.id;

        localStorage.setItem("tokenCliente", tokenCliente);
        localStorage.setItem("nomeCliente", nomeCliente);
        localStorage.setItem("idCliente", idCliente);


    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao conectar ao servidor.");
    }
});

