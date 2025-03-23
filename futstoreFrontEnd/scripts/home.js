
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

        const container = document.querySelector('.produtos-container');
        container.innerHTML = '';

        for (const produto of produtos) {
            const produtoCard = document.createElement('div');
            produtoCard.classList.add('produto-card');

            const imagensResponse = await fetch(`http://localhost:8080/produtos/${produto.codigo}/imagens`);
            const imagens = await imagensResponse.json();

            let imagemSrc = '';
            if (imagens.length > 0) {
                imagemSrc = imagens[0].imagem;
            }

            produto.imagemPrincipal = imagemSrc;

            produtoCard.innerHTML = `
                <img src="${imagemSrc}" alt="${produto.nome}" class="produto-imagem">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-preco">R$ ${produto.valor}</p>
                <button class="produto-btn">Exibir detalhes</button>
                <button class="carrinho-btn" onclick='adicionarProdutoCarrinho(${JSON.stringify(produto)})'>Comprar</button>
            `;
        
            container.appendChild(produtoCard);
        }
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
    }
}

window.onload = carregarProdutos;

