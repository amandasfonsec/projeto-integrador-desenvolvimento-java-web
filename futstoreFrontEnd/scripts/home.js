async function carregarProdutos() {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch('http://localhost:8080/produtos', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar os produtos');
        }

        const produtos = await response.json();
        produtos.sort((a, b) => b.codigo - a.codigo);

        const todosProdutos = await Promise.all(produtos.map(async (produto) => {
            const imagensResponse = await fetch(`http://localhost:8080/produtos/${produto.codigo}/imagens`);
            const imagens = await imagensResponse.json();
            const imagemPrincipal = imagens.find(img => img.principal === "true") || imagens[0];
            produto.imagemPrincipal = imagemPrincipal ? imagemPrincipal.imagem : 'caminho/padrao.png';
            return produto;
        }));

        const container = document.querySelector('.produtos-container');
        const campoBusca = document.getElementById('buscaProduto');

        // Função para renderizar os cards dos produtos
        function renderizar(produtosParaExibir) {
            container.innerHTML = '';

            for (const produto of produtosParaExibir) {
                const produtoCard = document.createElement('div');
                produtoCard.classList.add('produto-card');

                produtoCard.innerHTML = `
                    <img src="${produto.imagemPrincipal}" alt="${produto.nome}" class="produto-imagem">
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-preco">R$ ${produto.valor}</p>
                    <button class="produto-btn" data-id="${produto.codigo}">Exibir detalhes</button>
                    <button class="carrinho-btn" onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>Comprar</button>
                `;

                container.appendChild(produtoCard);
            }

            document.querySelectorAll('.produto-btn').forEach(botao => {
                botao.addEventListener('click', function () {
                    const produtoId = this.getAttribute('data-id');
                    window.location.href = `produto.html?id=${produtoId}`;
                });
            });
        }

        // Filtro em tempo real
        campoBusca.addEventListener('input', () => {
            const termo = campoBusca.value.toLowerCase();
            const filtrados = todosProdutos.filter(p =>
                p.nome.toLowerCase().includes(termo)
            );
            renderizar(filtrados);
        });

        // Exibe todos os produtos inicialmente
        renderizar(todosProdutos);

    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        document.querySelector('.produtos-container').innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

window.onload = carregarProdutos;
