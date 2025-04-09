const idCliente = localStorage.getItem("idCliente");

console.log(idCliente);

function formatarCPF(input) {
    let cpf = input.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    input.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}


let enderecoDados;

document.addEventListener("DOMContentLoaded", () => {
    /*
    
    function buscarCEP(inputCEP, logradouro, bairro, cidade, uf) {
        const cep = document.getElementById(inputCEP).value.replace(/\D/g, '');
        if (/^\d{8}$/.test(cep)) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        alert("CEP não encontrado.");
                    } else {
                        document.getElementById(logradouro).value = data.logradouro || "";
                        document.getElementById(bairro).value = data.bairro || "";
                        document.getElementById(cidade).value = data.localidade || "";
                        document.getElementById(uf).value = data.uf || "";
                    }
                })
                .catch(() => alert("Erro ao buscar CEP. Verifique sua conexão com a internet."));
        }
    }
    */

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
            enderecoDados = await responseEndereco.json();
            enderecoDados.forEach((endereco, index) => {
                console.log(`Editando endereco [${index}]:`, endereco);
            });
            //document.getElementById("cep").value = buscarCEP()
            //buscarCEP(inputCEP, logradouro, bairro, cidade, uf)
            document.getElementById("logradouro").value = enderecoDados[0].logradouro;
            document.getElementById("numero").value = enderecoDados[0].numero;
            document.getElementById("complemento").value = enderecoDados[0].complemento;
            document.getElementById("bairro").value = enderecoDados[0].bairro;
            document.getElementById("cidade").value = enderecoDados[0].cidade;
            document.getElementById("uf").value = enderecoDados[0].uf;
            document.getElementById("cep").value = enderecoDados[0].cep;


        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            alert("Erro ao carregar Endereco para edição.");
        }

        const enderecosEntrega = document.getElementById("enderecosEntrega");
        const enderecoTemplate = document.getElementById("enderecoTemplate").content;
        const adicionarEnderecoBtn = document.getElementById("adicionarEndereco");


        function adicionarEnderecosRegistrado(enderecoDados) {

            const enderecosRegistrado = document.getElementById("enderecosRegistrado");
            enderecoDados.forEach((endereco, index) => {
                if (index === 0) return;

                const enderecoRegistrado = enderecoTemplate.cloneNode(true);
                const titulo = enderecoRegistrado.querySelector("h4");
                if (titulo) {
                    titulo.textContent = "Endereço de Entrega Registrado";
                }
                const botaoRemover = enderecoRegistrado.querySelector(".removerEndereco")
                if (botaoRemover) {
                    botaoRemover.remove();
                }

                
                enderecoRegistrado.querySelector(".cepEntrega").value = endereco.cep || "";
                enderecoRegistrado.querySelector(".cepEntrega").disabled = true;

                enderecoRegistrado.querySelector(".logradouroEntrega").value = endereco.logradouro || "";
                enderecoRegistrado.querySelector(".logradouroEntrega").disabled = true;

                enderecoRegistrado.querySelector(".numeroEntrega").value = endereco.numero || "";
                enderecoRegistrado.querySelector(".numeroEntrega").disabled = true;

                enderecoRegistrado.querySelector(".complementoEntrega").value = endereco.complemento || "";
                enderecoRegistrado.querySelector(".complementoEntrega").disabled = true;

                enderecoRegistrado.querySelector(".bairroEntrega").value = endereco.bairro || "";
                enderecoRegistrado.querySelector(".bairroEntrega").disabled = true;

                enderecoRegistrado.querySelector(".cidadeEntrega").value = endereco.cidade || "";
                enderecoRegistrado.querySelector(".cidadeEntrega").disabled = true;

                enderecoRegistrado.querySelector(".ufEntrega").value = endereco.uf || "";
                enderecoRegistrado.querySelector(".ufEntrega").disabled = true;

                


                if (endereco.padrao === "true") {
                    enderecoRegistrado.querySelector(".radioPadrao").checked = true;
                }

                enderecosRegistrado.appendChild(enderecoRegistrado);

            });
        }
        adicionarEnderecosRegistrado(enderecoDados);



        adicionarEnderecoBtn.addEventListener("click", (event) => {
            const novoEndereco = enderecoTemplate.cloneNode(true);
            enderecosEntrega.appendChild(novoEndereco);
            adicionarEventosCEP();
            event.preventDefault();
        });
        function adicionarEventosCEP() {
            document.querySelectorAll(".cepEntrega").forEach((cepInput, index) => {
                cepInput.removeEventListener("blur", handleCEP); // remove duplicata
                cepInput.addEventListener("blur", handleCEP);
            });

            document.querySelectorAll(".removerEndereco").forEach(botao => {
                botao.removeEventListener("click", handleRemover); // remove duplicata
                botao.addEventListener("click", handleRemover);
            });
        }
        function handleCEP(event) {
            const container = event.target.closest(".endereco-entrega");

            const cep = container.querySelector(".cepEntrega").value.replace(/\D/g, '');

            if (/^\d{8}$/.test(cep)) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.erro) {
                            alert("CEP não encontrado.");
                        } else {
                            container.querySelector(".logradouroEntrega").value = data.logradouro || "";
                            container.querySelector(".bairroEntrega").value = data.bairro || "";
                            container.querySelector(".cidadeEntrega").value = data.localidade || "";
                            container.querySelector(".ufEntrega").value = data.uf || "";
                        }
                    })
                    .catch(() => alert("Erro ao buscar CEP."));
            }
        }

        function handleRemover(event) {
            const endereco = event.target.closest(".endereco-entrega");
            endereco.remove();
        }


    }
});



