async function carregarProdutos() {
    try {
        const token = localStorage.getItem('token'); // Ou onde o token for armazenado

        // Condicionalmente adiciona o token ao cabeçalho da requisição
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch('http://localhost:8080/produtos', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar os produtos');
        }

        const produtos = await response.json(); // Converte a resposta para JSON

        const container = document.querySelector('.produtos-container');
        container.innerHTML = '';

        for (const produto of produtos) {
            const produtoCard = document.createElement('div');
            produtoCard.classList.add('produto-card');

            // Para cada produto, buscar as imagens
            const imagensResponse = await fetch(`http://localhost:8080/produtos/${produto.codigo}/imagens`);
            const imagens = await imagensResponse.json();

            let imagemSrc = '';
            if (imagens.length > 0) {
                imagemSrc = imagens[0].imagem; // Pega a primeira imagem, se houver
            }

            produtoCard.innerHTML = `
                <img src="${imagemSrc}" alt="${produto.nome}" class="produto-imagem">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-preco">R$ ${produto.valor}</p>
                <button class="produto-btn">Exibir detalhes</button>
            `;

            container.appendChild(produtoCard);
        }
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
    }
}

window.onload = carregarProdutos;
