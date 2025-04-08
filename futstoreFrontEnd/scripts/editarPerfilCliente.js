const idCliente = localStorage.getItem("idCliente");

console.log(idCliente);

function formatarCPF(input) {
    let cpf = input.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    input.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}


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
            console.log("Editando perfil", perfilDados);

            //ATUALIZA OS CAMPOS DO PERFIL

            document.getElementById("nome").value = perfilDados.nome;
            document.getElementById("email").value = perfilDados.email;
            document.getElementById("cpfCadastro").value = perfilDados.cpf;
            formatarCPF(document.getElementById("cpfCadastro"));
            document.getElementById("dataNascimento").value = perfilDados.dataNascimento;
            document.getElementById("genero").value = perfilDados.genero;

            //ATUALIZA OS CAMPOS DO ENDEREÇO DE FATURAMENTO
           
            let responseEndereco = await fetch(`http://localhost:8080/clientes/${idCliente}/enderecos`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!responseEndereco.ok) {
                throw new Error(`Erro ao buscar endereco para edição: ${responseEndereco.status}`);
            }
            let enderecoDados = await responseEndereco.json();
            console.log("Editando endereco", enderecoDados);


        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            alert("Erro ao carregar Endereco para edição.");
        }
    }
});



