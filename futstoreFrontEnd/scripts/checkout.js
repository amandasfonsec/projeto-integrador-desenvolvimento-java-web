document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("enderecos-entrega");
  const idCliente = localStorage.getItem("idCliente");

  if (!idCliente) {
    container.innerHTML = "<p>Cliente não autenticado.</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/clientes/${idCliente}/enderecos`);
    if (!response.ok) throw new Error("Erro ao buscar endereços.");

    const enderecos = await response.json();
    const enderecosEntrega = enderecos.filter(e => e.tipo === "ENTREGA");
    console.log("📬 Endereços recebidos:", enderecos);

    if (enderecosEntrega.length === 0) {
      container.innerHTML = "<p>Nenhum endereço de entrega cadastrado.</p>";
      return;
    }

    enderecosEntrega.forEach((endereco) => {
      const div = document.createElement("div");
      div.classList.add("endereco-box");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "enderecoSelecionado";
      radio.value = endereco.idEndereco;
      radio.dataset.endereco = JSON.stringify(endereco);

      const label = document.createElement("label");
      label.appendChild(radio);
      label.innerHTML += ` ${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf} (${endereco.cep})`;

      div.appendChild(document.createElement("hr"));
      div.appendChild(label);
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar endereços.</p>";
  }
});

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

function exibirCamposCartao(mostrar) {
  document.getElementById("dados-cartao").style.display = mostrar ? "block" : "none";
}

function validarPagamento() {
  const formaPagamento = document.querySelector('input[name="pagamento"]:checked');

  if (!formaPagamento) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  localStorage.setItem("formaPagamento", formaPagamento.value);

  if (formaPagamento.value === "cartao") {
    const numero = document.getElementById("numero-cartao").value.trim();
    const nome = document.getElementById("nome-cartao").value.trim();
    const vencimento = document.getElementById("vencimento-cartao").value.trim();
    const codigo = document.getElementById("codigo-cartao").value.trim();
    const parcelas = document.getElementById("parcelas-cartao").value.trim();

    if (!numero || !nome || !vencimento || !codigo || !parcelas) {
      alert("Preencha todos os campos do cartão de crédito.");
      return;
    }

    const vencimentoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!vencimentoRegex.test(vencimento)) {
      alert("Data de vencimento inválida. Use o formato MM/AA.");
      return;
    }
  }

  proximaEtapa(3);
}

function carregarResumoPedido() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  const formaPagamento = localStorage.getItem("formaPagamento") || "Não informado";
  const endereco = JSON.parse(localStorage.getItem("enderecoEntrega") || "{}");
  const frete = JSON.parse(localStorage.getItem("freteSelecionado") || "{}");

  const resumoDiv = document.getElementById("resumoPedido");
  if (!resumoDiv) return;

  let html = "<h4>Produtos:</h4><ul>";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.valor * item.quantidade;
    total += subtotal;
    html += `<li>${item.nome} - R$ ${item.valor} x ${item.quantidade} = R$ ${subtotal.toFixed(2)}</li>`;
  });

  html += "</ul>";
  html += `<p><strong>Frete:</strong> ${frete.tipo || "Padrão"} - R$ ${frete.valor || "0,00"}</p>`;
  html += `<p><strong>Total Geral:</strong> R$ ${(total + parseFloat(frete.valor?.replace(",", ".") || "0")).toFixed(2)}</p>`;
  html += `<p><strong>Forma de Pagamento:</strong> ${formaPagamento}</p>`;

  if (endereco.logradouro) {
    html += `<p><strong>Entrega em:</strong> ${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf} (${endereco.cep})</p>`;
  }

  resumoDiv.innerHTML = html;
}

function proximaEtapa(numero) {
  document.querySelectorAll('.form-etapa').forEach(div => div.style.display = 'none');
  document.getElementById('etapa-' + numero).style.display = 'block';
  if (numero === 3) carregarResumoPedido();
}

function gerarNumeroPedido() {
  return `PED-${Date.now()}`;
}

async function finalizarPedido() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  const idCliente = localStorage.getItem("idCliente");
  const endereco = JSON.parse(localStorage.getItem("enderecoEntrega") || "{}");
  const formaPagamento = localStorage.getItem("formaPagamento") || "Indefinido";
  const frete = JSON.parse(localStorage.getItem("freteSelecionado") || "{}");

  if (!idCliente || !endereco.idEndereco || carrinho.length === 0) {
    alert("Dados incompletos para finalizar o pedido.");
    return;
  }

  const totalProdutos = carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  const valorFrete = parseFloat(frete.valor?.replace(",", ".") || "0");
  const valorTotal = (totalProdutos + valorFrete).toFixed(2);

  const pedido = {
    numeroPedido: gerarNumeroPedido(),
    dtPedido: new Date().toISOString().split("T")[0],
    formaPagamento,
    status: "AGUARDANDO PAGAMENTO",
    valorTotal,
    cliente: { idCliente: Number(idCliente) },
    endereco: { idEndereco: endereco.idEndereco },
    itens: carrinho.map(prod => ({
      produto: { idProduto: prod.idProduto },
      quantidade: prod.quantidade,
      valorUnitario: prod.valor
    }))
  };

  try {
    const response = await fetch("http://localhost:8080/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });

    if (!response.ok) throw new Error("Erro ao salvar o pedido.");

    const result = await response.json();
    alert(`✅ Pedido ${result.numeroPedido} criado com sucesso!\n💰 Total: R$ ${valorTotal}`);
    localStorage.removeItem("carrinho");
    window.location.href = "confirmacao.html";
  } catch (error) {
    console.error(error);
    alert("❌ Erro ao finalizar pedido. Tente novamente.");
  }
}
