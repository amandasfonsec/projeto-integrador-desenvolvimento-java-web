document.addEventListener("DOMContentLoaded", () => {

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

    adicionarEnderecoBtn.addEventListener("click", () => {
        const novoEndereco = enderecoTemplate.cloneNode(true);
        enderecosEntrega.appendChild(novoEndereco);
        adicionarEventosCEP();
        event.preventDefault();
    });

    function adicionarEventosCEP() {
        document.querySelectorAll(".cepEntrega").forEach(cepInput => {
            cepInput.addEventListener("blur", () => buscarCEP("cepEntrega", "logradouroEntrega", "bairroEntrega", "cidadeEntrega", "ufEntrega"));
        });

        document.querySelectorAll(".removerEndereco").forEach(botao => {
            botao.addEventListener("click", () => botao.closest(".endereco-entrega").remove());
        });

        document.querySelectorAll(".radioPadrao").forEach(radio => {
            radio.addEventListener("change", (e) => marcarPadrao(e.target));
        });
    }

    function marcarPadrao(radioSelecionado) {
        document.querySelectorAll(".radioPadrao").forEach(radio => radio.checked = false);
        radioSelecionado.checked = true;
    }

    document.getElementById("copiarEndereco").addEventListener("click", copiarEndereco);

    function copiarEndereco() {
        const ultimoEndereco = document.querySelector(".endereco-entrega:last-of-type"); 
        event.preventDefault();
        
        if (!ultimoEndereco) {
            alert("Adicione um endereço de entrega primeiro!");
            event.preventDefault();
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


    adicionarEventosCEP();
});
