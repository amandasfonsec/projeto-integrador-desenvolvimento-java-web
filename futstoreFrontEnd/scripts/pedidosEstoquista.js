document.addEventListener('DOMContentLoaded', function () {


  fetch(`http://localhost:8080/pedidos`)
    .then(resp => resp.json())
    .then(pedidos => {
      const lista = document.querySelector('.pedidos-lista');
      lista.innerHTML = '';

      // Ordenar por data decrescente (supondo que dtPedido seja string no formato "dd/MM/yyyy")
      pedidos.sort((a, b) => {
        const [diaA, mesA, anoA] = a.dtPedido.split('/');
        const [diaB, mesB, anoB] = b.dtPedido.split('/');
        const dataA = new Date(`${anoA}-${mesA}-${diaA}`);
        const dataB = new Date(`${anoB}-${mesB}-${diaB}`);
        return dataB - dataA;
      });

      pedidos.forEach(pedido => {
        const div = document.createElement('div');
        div.className = 'pedido-item';
        div.innerHTML = `
          <div class="pedido-info">
            <p><strong>Pedido N°:</strong> ${pedido.idPedido}</p>
            <p><strong>Data:</strong> ${pedido.dtPedido}</p>
            <p><strong>Status:</strong> <span class="status-text">${pedido.statusPedido}</span></p>
            <p><strong>Total:</strong> R$ ${pedido.valorTotalPedido?.toFixed(2) || '0.00'}</p>
          </div>
          <a class="detalhes" href="#" data-id="${pedido.idPedido}">Ver detalhes</a>
          <button class="editar-status" data-id="${pedido.idPedido}">Editar Status</button>
          <div class="status-edicao" style="display:none;" data-id="${pedido.idPedido}">
            <select class="novo-status">
              <option value="Aguardando pagamento">Aguardando Pagamento</option>
              <option value="Pagamento rejeitado">Pagamento Rejeitado</option>
              <option value="Pagamento com sucesso">Pagamento com Sucesso</option>
              <option value="Aguardando retirada">Aguardando Retirada</option>
              <option value="Em trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
            </select>
            <button class="salvar-status">Salvar</button>
          </div>
        `;
        lista.appendChild(div);
      });
    });

  document.querySelector('.pedidos-lista').addEventListener('click', function (e) {
    const el = e.target;

    if (el.classList.contains('detalhes')) {
      e.preventDefault();
      const id = el.dataset.id;

      fetch(`http://localhost:8080/pedidos/${id}`)
        .then(res => res.json())
        .then(data => {
          const detalhes = document.getElementById('detalhes-pedido');
          detalhes.innerHTML = `
            <p><strong>Pedido Nº:</strong> ${data.idPedido}</p>
            <p><strong>Data:</strong> ${data.dtPedido}</p>
            <p><strong>Status:</strong> ${data.statusPedido}</p>
            <p><strong>Forma de Pagamento:</strong> ${data.formaPagamento}</p>
            <p><strong>Total:</strong> R$ ${data.valorTotalPedido.toFixed(2)}</p>
            <h3>Itens:</h3>
            <ul>
              ${data.itensPedido.map(item => {
            const img = item.produto.imagens.find(i => i.principal) || item.produto.imagens[0];
            return `
                  <li>
                    <img src="data:${img.tipoArquivo};base64,${img.dados}" width="100">
                    <br>${item.produto.nome} - ${item.qtdProduto} x R$ ${item.valorUnitario.toFixed(2)} = R$ ${item.subTotal.toFixed(2)}
                  </li>`;
          }).join('')}
            </ul>`;
          document.getElementById('modal-detalhes').style.display = 'block';
        });
    }

    if (el.classList.contains('editar-status')) {
      const statusDiv = el.nextElementSibling;
      statusDiv.style.display = 'block';
    }

    if (el.classList.contains('salvar-status')) {
      const container = el.parentElement;
      const idPedido = container.dataset.id;
      const novoStatus = container.querySelector('.novo-status').value;

      fetch(`http://localhost:8080/pedidos/${idPedido}/status?status=${encodeURIComponent(novoStatus)}`, {
        method: 'PUT'
      })
        .then(resp => {
          if (!resp.ok) throw new Error('Erro ao atualizar status');
          return resp.json();
        })
        .then(data => {
          alert("Status atualizado com sucesso!");
          const pedidoId = container.dataset.id;
          const itemDiv = document.querySelector(`.editar-status[data-id="${pedidoId}"]`).closest('.pedido-item');
          const statusSpan = itemDiv.querySelector('.status-text');
          if (statusSpan) {
            statusSpan.textContent = data.statusPedido;
          }
          container.style.display = 'none';
        })
        .catch(err => alert("Erro: " + err.message));
    }
  });
});

function fecharModal() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("grupo");
    localStorage.removeItem("nome");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
  }
});