document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = parseInt(urlParams.get("id"));
    
    if (!produtoId) {
        alert("Produto não encontrado.");
        return;
    }

    await carregarProduto(produtoId);

   
    document.getElementById("comprarBtn").addEventListener("click", () => {
        const produto = {
            codigo: produtoId,  
            nome: document.getElementById("produtoNome").textContent,
            valor: parseFloat(document.getElementById("produtoPreco").textContent.replace('R$', '').trim()),
            imagemPrincipal: imagemPassadaCarrinho.imagem,
        };

        window.adicionarAoCarrinho(produto);
    });
});
let imagemPassadaCarrinho;
async function carregarProduto(id) {
    const token = localStorage.getItem("token");

    try {
        let response = await fetch(`http://localhost:8080/produtos/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do produto: ${response.status}`);
        }

        let produto = await response.json();
        console.log("Detalhes do produto:", produto);

        
        document.getElementById("produtoNome").textContent = produto.nome;
        document.getElementById("produtoAvaliacao").textContent = produto.avaliacao;
        document.getElementById("produtoDescricao").textContent = produto.descricao;
        document.getElementById("produtoPreco").textContent = `R$ ${produto.valor.toFixed(2)}`;

        
        let imgResponse = await fetch(`http://localhost:8080/produtos/${id}/imagens`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (imgResponse.ok) {
            let imagensProduto = await imgResponse.json();
            
            if (imagensProduto.length > 0) {
                let imagemAtual = 0;
                
                for (let i = 0; i < imagensProduto.length; i++) {
                    const imagem = imagensProduto[i];
                    if (imagem.principal === "true") {
                        
                        imagemAtual = i;
                        break;
                    }
                }

                atualizarCarrossel(imagensProduto, imagemAtual);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        alert("Erro ao carregar detalhes do produto.");
    }
}

function atualizarCarrossel(imagensProduto, imagemAtual) {
    imagemPassadaCarrinho = imagensProduto[imagemAtual];
    const imagem = imagensProduto[imagemAtual];
    if (!imagem || !imagem.imagem) {
        console.warn("Imagem inválida no carrossel:", imagem);
        document.getElementById("produtoImagem").src = "placeholder.jpg";
        return;
    }
    document.getElementById("produtoImagem").src = imagem.imagem;

    
    document.getElementById("prevBtn").addEventListener("click", () => {
        imagemAtual = (imagemAtual - 1 + imagensProduto.length) % imagensProduto.length;
        document.getElementById("produtoImagem").src = imagensProduto[imagemAtual].imagem;
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        imagemAtual = (imagemAtual + 1) % imagensProduto.length;
        document.getElementById("produtoImagem").src = imagensProduto[imagemAtual].imagem;
    });
}

