document.addEventListener('DOMContentLoaded', function () {
    const idCliente = localStorage.getItem('idCliente');
    const tipoUsuario = localStorage.getItem('tipoUsuario'); // 'cliente' ou 'estoquista'

    if (!idCliente) {
        alert('Usuário não está logado.');
        return;
    }

    fetch(`http://localhost:8080/pedidos/cliente/${idCliente}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar pedidos');
            return response.json();
        })
        .then(pedidos => {
            const pedidosLista = document.querySelector('.pedidos-lista');
            pedidosLista.innerHTML = '';

            if (pedidos.length === 0) {
                pedidosLista.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
                return;
            }

            pedidos.forEach(pedido => {
                const pedidoItem = document.createElement('div');
                pedidoItem.classList.add('pedido-item');

                // HTML comum para todos os usuários
                let html = `
                    <div class="pedido-info">
                        <p><strong>Pedido N°: </strong>${pedido.idPedido}</p>
                        <p><strong>Data: </strong>${pedido.dtPedido}</p>
                        <p><strong>Status: </strong><span class="status-text">${pedido.statusPedido}</span></p>
                        <p><strong>Total R$: </strong>${pedido.valorTotalPedido?.toFixed(2) || '0.00'}</p>
                    </div>
                    <a class="detalhes" href="#" data-id="${pedido.idPedido}">Ver detalhes</a>
                `;

                // Se for estoquista, adiciona botões de edição
                if (tipoUsuario === 'estoquista') {
                    html += `
                        <button class="editar-status" data-id="${pedido.idPedido}">Editar Status</button>
                        <div class="status-edicao" style="display:none;" data-id="${pedido.idPedido}">
                            <select class="novo-status">
                                <option value="aguardando pagamento">Aguardando Pagamento</option>
                                <option value="pagamento rejeitado">Pagamento Rejeitado</option>
                                <option value="pagamento com sucesso">Pagamento com Sucesso</option>
                                <option value="aguardando retirada">Aguardando Retirada</option>
                                <option value="em transito">Em Trânsito</option>
                                <option value="entregue">Entregue</option>
                            </select>
                            <button class="salvar-status">Salvar</button>
                        </div>
                    `;
                }

                pedidoItem.innerHTML = html;
                pedidosLista.appendChild(pedidoItem);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            document.querySelector('.pedidos-lista').innerHTML = '<p>Erro ao buscar pedidos.</p>';
        });

    document.querySelector('.pedidos-lista').addEventListener('click', function (event) {
        const btn = event.target;

        if (btn.classList.contains('detalhes')) {
            event.preventDefault();
            const id = btn.dataset.id;
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
                                const imagem = item.produto.imagens.find(img => img.principal) || item.produto.imagens[0];
                                const src = `data:${imagem.tipoArquivo};base64,${imagem.dados}`;
                                return `<li><img src="${src}" width="100"><br>${item.produto.nome} - ${item.qtdProduto} x R$ ${item.valorUnitario.toFixed(2)} = R$ ${item.subTotal.toFixed(2)}</li>`;
                            }).join('')}
                        </ul>
                    `;
                    document.getElementById('modal-detalhes').style.display = 'block';
                });
        }

        if (btn.classList.contains('editar-status')) {
            const container = btn.nextElementSibling;
            container.style.display = 'block';
        }

        if (btn.classList.contains('salvar-status')) {
            const container = btn.parentElement;
            const idPedido = container.dataset.id;
            const novoStatus = container.querySelector('.novo-status').value;

            fetch(`http://localhost:8080/pedidos/${idPedido}/status?status=${encodeURIComponent(novoStatus)}`, {
                method: 'PUT'
            })
                .then(res => {
                    if (!res.ok) throw new Error('Erro ao atualizar status');
                    return res.json();
                })
                .then(data => {
                    alert('Status atualizado com sucesso!');
                    container.previousElementSibling.querySelector('.status-text').textContent = data.statusPedido;
                    container.style.display = 'none';
                })
                .catch(err => {
                    alert('Erro ao atualizar status: ' + err.message);
                });
        }
    });
});
