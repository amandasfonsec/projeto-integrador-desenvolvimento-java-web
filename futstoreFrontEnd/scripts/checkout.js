const freteLocalStorage = localStorage.getItem("freteSelecionado");
const token = localStorage.getItem("tokenCliente");
//const idEnderecos = [];
function logEnderecosDados(enderecos) {
    enderecos.forEach((endereco, index) => {
        console.log(`Editando endereco [${index}]:`, endereco);
        
    });
}
window.logEnderecosDados = logEnderecosDados;

function coletarItensPedidos() {
    const lista = [];
    const carrinho = JSON.parse(localStorage.getItem("carrinho"));
    carrinho.forEach(itemPedido => {
        const produto = { codigo: itemPedido.codigo };
        const qtdProduto = itemPedido.quantidade;
        const valorUnitario = parseFloat(itemPedido.valor);
        const subTotal = qtdProduto * valorUnitario;

        lista.push({
            produto, 
            qtdProduto,
            valorUnitario,
            subTotal
        });
    });
    return lista;
}


function formatarCPF(input) {
    let cpf = input.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    input.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
document.addEventListener("DOMContentLoaded", async () => {
     idEnderecos = [];
    localStorage.removeItem("enderecoNovo");
    localStorage.removeItem("enderecoSelecionadoParaEntrega");
    localStorage.removeItem("formaPagamento");
    localStorage.removeItem("freteCalculado");
    localStorage.removeItem("freteSelecionado");
    localStorage.removeItem("cepSalvo");
    try {


        let enderecosDados;
        const idCliente = localStorage.getItem("idCliente");
        const token = localStorage.getItem("tokenCliente");
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
        enderecosDados = await responseEndereco.json();
        logEnderecosDados(enderecosDados);
        localStorage.setItem("enderecoRegistrado", JSON.stringify(enderecosDados));

        const enderecosEntregaNovos = document.getElementById("enderecosEntregaNovos");
        const enderecoTemplate = document.getElementById("enderecoTemplate").content;
        const adicionarEnderecoBtn = document.getElementById("adicionarEndereco");

        function adicionarEnderecosRegistrado(enderecosDados) {
            
            const enderecosRegistrado = document.getElementById("enderecosRegistrado");
            enderecosDados.forEach((endereco, index) => {
                if (index === 0) return;

                const enderecoRegistrado = enderecoTemplate.cloneNode(true);
                const titulo = enderecoRegistrado.querySelector("h4");
                enderecoRegistrado.querySelector(".endereco-entrega").setAttribute("data-id", endereco.id_Endereco);
                
                if (titulo) {
                    titulo.textContent = "Endereço de Entrega Cadastrado";
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
        adicionarEnderecosRegistrado(enderecosDados);

        adicionarEnderecoBtn.addEventListener("click", (event) => {
            const novoEndereco = enderecoTemplate.cloneNode(true);
            //const idDoEndereco;
            enderecosEntregaNovos.appendChild(novoEndereco);
            enderecosEntregaNovos.setAttribute("endereco-novo", "true");
            adicionarEventosCEP();
            event.preventDefault();

            adicionarEnderecoBtn.disabled = true;
            adicionarEnderecoBtn.style.backgroundColor = "#ccc";
            adicionarEnderecoBtn.style.color = "#666";
            adicionarEnderecoBtn.style.cursor = "not-allowed";
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
            if (enderecosEntregaNovos.getAttribute("endereco-novo") === "true") {
                adicionarEnderecoBtn.disabled = false;
                adicionarEnderecoBtn.style.backgroundColor = "";
                adicionarEnderecoBtn.style.color = "";
                adicionarEnderecoBtn.style.cursor = "";
            }
            endereco.remove();
        }


    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar Enderecos.");
    }
    let enderecoSelecionadoPedido;
    //let enderecosEntregaNovos = [];


    function coletarEnderecoEntregaNovo() {
        let lista = null;
        const idEnderecosExistentes = 0;

        document.querySelectorAll("#enderecosEntregaNovos").forEach((endereco) => {
            const cep = endereco.querySelector(".cepEntrega").value;
            const logradouro = endereco.querySelector(".logradouroEntrega").value;
            const bairro = endereco.querySelector(".bairroEntrega").value;
            const cidade = endereco.querySelector(".cidadeEntrega").value;
            const uf = endereco.querySelector(".ufEntrega").value;
            const numero = endereco.querySelector(".numeroEntrega").value;
            const complemento = endereco.querySelector(".complementoEntrega").value;
            const padrao = false;
            //o const padrao deve ser falso, pois ser padrao ou não neste caso é irrelevante
            //o radio button neste caso funcionara para definir qual é o endereço da entrega 



            lista = {

                cep,
                logradouro,
                bairro,
                cidade,
                uf,
                numero,
                complemento,
                tipo: "ENTREGA",
                padrao
            };



            //este if, teoricamente, serve para definir qual o endereco
            // que será selecionado como o de
            //entrega deste pedido oficialmente. 
        });



        return lista;
    }

    function coletarEnderecoEntregaSelecionado() {
        let enderecoSelecionadoPedidoAux = null;
        
        const idEnderecosExistentes = 0;
        document.querySelectorAll(".endereco-entrega").forEach((endereco) => {
            const radioSelecionado = endereco.querySelector(".radioPadrao");

            if (radioSelecionado && radioSelecionado.checked) {
                const cep = endereco.querySelector(".cepEntrega").value.replace(/\D/g, '');
                const logradouro = endereco.querySelector(".logradouroEntrega").value;
                const bairro = endereco.querySelector(".bairroEntrega").value;
                const cidade = endereco.querySelector(".cidadeEntrega").value;
                const uf = endereco.querySelector(".ufEntrega").value;
                const numero = endereco.querySelector(".numeroEntrega").value;
                //const id_Endereco = 
                const complemento = endereco.querySelector(".complementoEntrega").value;
                const id_Endereco = endereco.getAttribute("data-id");
                if(id_Endereco){
                    enderecoSelecionadoPedidoAux = {
                    cep,
                    logradouro,
                    bairro,
                    cidade,
                    uf,
                    id_Endereco,
                    numero,
                    complemento,
                    tipo: "ENTREGA",
                    padrao: false
                };
                }else{
                enderecoSelecionadoPedidoAux = {
                    cep,
                    logradouro,
                    bairro,
                    cidade,
                    uf,
                    numero,
                    complemento,
                    tipo: "ENTREGA",
                    padrao: false
                }};
            }
        });

        return enderecoSelecionadoPedidoAux;
    }
    window.coletarEnderecoEntregaSelecionado = coletarEnderecoEntregaSelecionado;
    const botao = document.getElementById("passaParaEtapaDois");
    botao.addEventListener("click", (event) => {

        const radioSelecionado = document.querySelector('input[name="enderecoPadrao"]:checked');
        if (!radioSelecionado) {
            alert("Por favor, selecione um endereço de entrega antes de continuar.");
            return;
        }


        if (localStorage.getItem('freteSelecionado') === null) {
            alert("Por favor, selecione uma forma de frete antes de continuar.");
            return;
        }



        //verifica se existe novo endereço sendo criado
        if (document.querySelector("#enderecosEntregaNovos .endereco-entrega")) {
            let enderecoEntregaNovo = coletarEnderecoEntregaNovo();
            console.log("Endereço novo:", enderecoEntregaNovo);
            localStorage.setItem("enderecoNovo", JSON.stringify(enderecoEntregaNovo));
        }
        // coleta e salva o endereço selecionado
        let enderecoSelecionadoPedido = coletarEnderecoEntregaSelecionado();
        localStorage.setItem("enderecoSelecionadoParaEntrega", JSON.stringify(enderecoSelecionadoPedido));
        console.log("endereco selecionado para entrega", enderecoSelecionadoPedido);

        //avança pra etapa dois, no caso do pagamento
        proximaEtapa(2);

    });

   

    document.getElementById("finalizaPedido").addEventListener("click", async function (e) {
          e.preventDefault(); 
        const hoje = new Date();
        const dtPedido = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
        const cliente = { idCliente: parseInt(localStorage.getItem('idCliente')) };
        const enderecoSelecionado = JSON.parse(localStorage.getItem('enderecoSelecionadoParaEntrega'));
        const endereco = enderecoSelecionado.id_Endereco 
    ? { id_endereco: parseInt(enderecoSelecionado.id_Endereco) } 
    : enderecoSelecionado;
//TESTE123
        const formaPagamento = localStorage.getItem('formaPagamento');
        const frete = JSON.parse(localStorage.getItem('freteSelecionado'));
        const valorFrete = parseFloat(frete.valor.replace(',', '.'));
        const valorTotalPedido = localStorage.getItem('valorTotalPedido');
        const statusPedido = "Aguardando Pagamento";
        const itensPedido = coletarItensPedidos();

        const dadosPedido = {
            dtPedido,
            cliente,
            endereco,
            formaPagamento,
            valorFrete,
            valorTotalPedido,
            statusPedido,
            itensPedido
        }
        console.log(dadosPedido);
        



        try {
            const response = await fetch("http://localhost:8080/pedidos", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPedido)
            });

             if (response.ok) {

                
                    alert("Pedido Cadastrado com Sucesso. Valor Total R$:" + valorTotalPedido);
                    window.location.href = "home.html";
                    localStorage.removeItem("carrinho");
                
            } else {
                const erro = await response.text();
                alert("Erro ao cadastrar: " + erro);
            }
        } catch (error) {
            console.error("Erro de rede", error);
            alert("Erro de rede ao cadastrar pedido.");
        }
    });

});


//Parte do frete
const botoesFrete = document.querySelectorAll("#freteContainer button");

function atualizarResumoCompra(frete, botaoSelecionado, tipoFrete) {
    botoesFrete.forEach(botao => {
        botao.style.opacity = "0.5";
        botao.textContent = "Selecionar";
    });

    botaoSelecionado.style.opacity = "1";
    botaoSelecionado.textContent = "Selecionado";

    localStorage.setItem("freteSelecionado", JSON.stringify({ tipo: tipoFrete, valor: frete }));
}

const btnPadrao = document.getElementById("btnPadrao");
const btnRegistrada = document.getElementById("btnRegistrada");
const btnSedex = document.getElementById("btnSedex");

if (btnPadrao) {
    btnPadrao.addEventListener("click", function () {
        atualizarResumoCompra("10,00", this, "Padrao");
    });
}

if (btnRegistrada) {
    btnRegistrada.addEventListener("click", function () {
        atualizarResumoCompra("15,00", this, "Registrada");
    });
}

if (btnSedex) {
    btnSedex.addEventListener("click", function () {
        atualizarResumoCompra("25,00", this, "Sedex");
    });
}



//Pagamento

/*

function validarEndereco() {
    const selecionado = document.querySelector('input[name="enderecoSelecionado"]:checked');
    if (!selecionado) {
        alert("Selecione um endereço para entrega antes de continuar.");
        return;
    }

    const endereco = JSON.parse(selecionado.dataset.endereco);
    localStorage.setItem("enderecoEntrega", JSON.stringify(endereco));
    proximaEtapa(2);
}
*/
function exibirCamposCartao(mostrar) {
    document.getElementById("dados-cartao").style.display = mostrar ? "block" : "none";
}

function validarPagamento() {
    const formaPagamento = document.querySelector('input[name="pagamento"]:checked');

    if (!formaPagamento) {
        alert("Selecione uma forma de pagamento.");
        return;
    }

    if (formaPagamento.value === "Cartão de Crédito") {
        const numero = document.getElementById("numero-cartao").value.trim();
        const nome = document.getElementById("nome-cartao").value.trim();
        const vencimento = document.getElementById("vencimento-cartao").value.trim();
        const codigo = document.getElementById("codigo-cartao").value.trim();
        const parcelas = document.getElementById("parcelas-cartao").value.trim();

        if (!numero || !nome || !vencimento || !codigo || !parcelas) {
            alert("Preencha todos os campos do cartão de crédito.");
            return;
        }

    }

    localStorage.setItem("formaPagamento", formaPagamento.value);
    proximaEtapa(3);
}


function carregarResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const formaPagamento = localStorage.getItem("formaPagamento") || "Não informado";
    const endereco = JSON.parse(localStorage.getItem("enderecoSelecionadoParaEntrega") || "{}");
    const frete = JSON.parse(localStorage.getItem("freteSelecionado") || "{}");

    const resumoDiv = document.getElementById("resumoPedido");
    if (!resumoDiv) return;

    let html = "<h4>Produtos:</h4><ul>";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.valor * item.quantidade;
        total += subtotal;
        html += `<div class="produto-resumo"><img src="${item.imagemPrincipal}" alt="${item.nome}" width="200">
        <li>${item.nome} - R$ ${item.valor} x ${item.quantidade} = R$ ${subtotal.toFixed(2)}</li></div>`;
    });

    const valorFrete = parseFloat(frete.valor?.replace(",", ".") || "0");
    const valorTotalPedido = total + valorFrete;

    // Agora sim, salva o valor total corretamente
    localStorage.setItem('valorTotalPedido', valorTotalPedido.toFixed(2));

    html += "</ul>";
    html += `<p><strong>Frete:</strong> ${frete.tipo || "Padrão"} - R$ ${frete.valor || "0,00"}</p>`;
    html += `<p><strong>Total Geral:</strong> R$ ${(total + parseFloat(frete.valor?.replace(",", ".") || "0")).toFixed(2)}</p>`;
    html += `<p><strong>Forma de Pagamento:</strong> ${formaPagamento}</p>`;



    if (endereco.logradouro) {
        html += `<p><strong>Entrega em:</strong> ${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf} (${endereco.cep})</p>`;
    } else {
        html += `<p><strong>Entrega em:</strong> Não informado </p>`;

    }

    resumoDiv.innerHTML = html;
}

function proximaEtapa(numero) {
    document.querySelectorAll('.form-etapa').forEach(div => div.style.display = 'none');
    document.getElementById('etapa-' + numero).style.display = 'block';
    if (numero === 3) carregarResumoPedido();
}

