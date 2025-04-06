document.addEventListener("DOMContentLoaded", () => {
    const enderecosAdicionais = []; //salvar os endereços

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

    document.getElementById("cep").addEventListener("blur", () => buscarCEP("cep", "logradouro", "bairro", "cidade", "uf"));

    const enderecosEntrega = document.getElementById("enderecosEntrega");
    const enderecoTemplate = document.getElementById("enderecoTemplate").content;
    const adicionarEnderecoBtn = document.getElementById("adicionarEndereco");

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

        document.querySelectorAll(".radioPadrao").forEach(radio => {
            radio.addEventListener("change", (e) => marcarPadrao(e.target));
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

    function marcarPadrao(radioSelecionado) {
        document.querySelectorAll(".radioPadrao").forEach(radio => radio.checked = false);
        radioSelecionado.checked = true;
    }

    document.getElementById("copiarEndereco").addEventListener("click", copiarEndereco);

    function copiarEndereco(event) {
        event.preventDefault();

        const ultimoEndereco = document.querySelector(".endereco-entrega:last-of-type");
        if (!ultimoEndereco) {
            alert("Adicione um endereço de entrega primeiro!");
            return;
        }

        const cep = document.getElementById("cep").value;
        const logradouro = document.getElementById("logradouro").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const numero = document.getElementById("numero").value || "";
        const complemento = document.getElementById("complemento").value || "";

        ultimoEndereco.querySelector(".cepEntrega").value = cep;
        ultimoEndereco.querySelector(".logradouroEntrega").value = logradouro;
        ultimoEndereco.querySelector(".bairroEntrega").value = bairro;
        ultimoEndereco.querySelector(".cidadeEntrega").value = cidade;
        ultimoEndereco.querySelector(".ufEntrega").value = uf;
        ultimoEndereco.querySelector(".numeroEntrega").value = numero;
        ultimoEndereco.querySelector(".complementoEntrega").value = complemento;

        document.getElementById("copiarEndereco").disabled = true;
        document.getElementById("copiarEndereco").style.backgroundColor = "#ccc";
        document.getElementById("copiarEndereco").style.color = "#666";
        document.getElementById("copiarEndereco").style.cursor = "not-allowed";
    }

    // para salvar os enderecos de entrega
    function coletarEnderecosEntrega() {
        const lista = [];
        document.querySelectorAll(".endereco-entrega").forEach(endereco => {
            const cep = endereco.querySelector(".cepEntrega").value;
            const logradouro = endereco.querySelector(".logradouroEntrega").value;
            const bairro = endereco.querySelector(".bairroEntrega").value;
            const cidade = endereco.querySelector(".cidadeEntrega").value;
            const uf = endereco.querySelector(".ufEntrega").value;
            const numero = endereco.querySelector(".numeroEntrega").value;
            const complemento = endereco.querySelector(".complementoEntrega").value;
            const padrao = endereco.querySelector(".radioPadrao").checked;

            lista.push({ cep, logradouro, bairro, cidade, uf, numero, complemento, padrao });
        });

        return lista;
    }

    adicionarEventosCEP();


    document.getElementById("formCadastro").addEventListener("submit", async function (e) {
        e.preventDefault(); 
    
        // Dados pessoais
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const cpf = document.getElementById("cpfCadastro").value.replace(/\D/g, '');
        const dataNascimento = document.getElementById("dataNascimento").value;
        const genero = document.getElementById("genero").value;
        const senha = document.getElementById("senhaCadastro").value;
    
        // Endereço de faturamento
        const enderecoFaturamento = {
            cep: document.getElementById("cep").value,
            logradouro: document.getElementById("logradouro").value,
            numero: document.getElementById("numero").value,
            complemento: document.getElementById("complemento").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            uf: document.getElementById("uf").value,
            tipo: "FATURAMENTO",
            padrao: false
        };
    
        // Endereços de entrega
        const enderecosEntrega = coletarEnderecosEntrega().map(endereco => ({
            ...endereco,
            tipo: "ENTREGA"
        }));
    
        const enderecos = [enderecoFaturamento, ...enderecosEntrega];
    
        const dadosCliente = {
            nome,
            email,
            cpf,
            dataNascimento,
            genero,
            senha,
            enderecos
        };
    
        try {
            const response = await fetch("http://localhost:8080/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosCliente)
            });
    
            if (response.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "home.html"; 
            } else {
                const erro = await response.text();
                alert("Erro ao cadastrar: " + erro);
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro de rede ao cadastrar.");
        }
    });
    
});
