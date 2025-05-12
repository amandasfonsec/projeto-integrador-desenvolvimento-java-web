document.addEventListener('DOMContentLoaded', function () {
    const idCliente = localStorage.getItem('idCliente');

    if (!idCliente) {
        alert('Usuário não está logado.');
        return;
    }

    fetch(`http://localhost:8080/pedidos/cliente/${idCliente}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pedidos');
            }
            return response.json();
        })
        .then(pedidos => {
            console.log(pedidos);
            const pedidosLista = document.querySelector('.pedidos-lista');
            pedidosLista.innerHTML = '';

            if (pedidos.length === 0) {
                pedidosLista.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
                return;
            }

            pedidos.forEach(pedido => {
                const pedidoItem = document.createElement('div');
                pedidoItem.classList.add('pedido-item');

                pedidoItem.innerHTML = `
                    <div class="pedido-info">
                        <p><strong>Pedido N°: </strong>${pedido.idPedido}</p>
                        <p><strong>Data: </strong>${pedido.dtPedido}</p>
                        <p><strong>Status: </strong>${pedido.statusPedido}</p>
                        <p><strong>Total R$: </strong>${pedido.valorTotalPedido != null ? pedido.valorTotalPedido.toFixed(2) : '0.00'}</p>

                    </div>
                    <a class="detalhes" href="#" data-id="${pedido.idPedido}">Ver detalhes</a>

                `;

                pedidosLista.appendChild(pedidoItem);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            const pedidosLista = document.querySelector('.pedidos-lista');
            pedidosLista.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
        });
});


