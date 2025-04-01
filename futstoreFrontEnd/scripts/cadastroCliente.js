
document.addEventListener("DOMContentLoaded", () => {

    // Função para buscar dados do CEP FATURAMENTO na API
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

    // Função para buscar dados do CEP ENTREGA na API
    function buscarCEPNovo(inputCEP, logradouro, bairro, cidade, uf) {
        const cep = document.getElementById(inputCEP).value.replace(/\D/g, '');  // CORREÇÃO: Pegando o valor do inputCEP corretamente.
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
    document.getElementById("cepEntrega").addEventListener("blur", () => buscarCEPNovo("cepEntrega", "logradouroEntrega", "bairroEntrega", "cidadeEntrega", "ufEntrega")); // CORREÇÃO: IDs corretos
});


// Copiar o endereço de faturamento
document.addEventListener("DOMContentLoaded", function() {
    const btnCopiar = document.getElementById("copiarEndereco");

    btnCopiar.addEventListener("click", function(event) {
        event.preventDefault(); // Pra não enviar o formulário, se não apaga tudo na hora de copiar
        copiarEndereco();
    });
});

function copiarEndereco() {
    document.getElementById("cepEntrega").value = document.getElementById("cep").value;
    document.getElementById("logradouroEntrega").value = document.getElementById("logradouro").value;
    document.getElementById("numeroEntrega").value = document.getElementById("numero").value;
    document.getElementById("complementoEntrega").value = document.getElementById("complemento").value;
    document.getElementById("bairroEntrega").value = document.getElementById("bairro").value;
    document.getElementById("cidadeEntrega").value = document.getElementById("cidade").value;
    document.getElementById("ufEntrega").value = document.getElementById("uf").value;
}


