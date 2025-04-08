const idCliente = localStorage.getItem("idCliente");

console.log(idCliente);

document.addEventListener("DOMContentLoaded", () => {

    editarPerfil(idCliente);

    async function editarPerfil(idCliente) {
        const token = localStorage.getItem("tokenCliente");
        const nomeCliente = localStorage.getItem("nomeCliente");

        try {
            let response = await fetch(`http://localhost:8080/clientes/${idCliente}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar perfil para edição: ${response.status}`);
            }
            let perfilDados = await response.json();
            console.log("Editando perfil",perfilDados);

            //ATUALIZA OS CAMPOS DO PERFIL
            document.getElementById("nome").value = perfilDados.nome;

        }
        catch (error) {
        console.error("Erro ao buscar produto:", error);
        alert("Erro ao carregar produto para edição.");
    }
    }
}
)

