document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formCadastroProduto");

    if (!form) {
        console.error("Erro: O formulário não foi encontrado.");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o envio tradicional do formulário

        let formData = new FormData(form);

        // Captura a imagem
        const fileInput = document.getElementById("imagensProduto");
        if (fileInput.files.length > 0) {
            formData.append("imagensProduto", fileInput.files[0]);
        }

        fetch("http://localhost:8080/produtos", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Produto cadastrado:", data);
            alert("Produto cadastrado com sucesso!");
            window.location.href = "listaProdutos.html"; // Redireciona para a lista de produtos
        })
        .catch(error => console.error("Erro ao cadastrar:", error));
    });

    // Ação do botão Cancelar
    document.getElementById('btnCancelarProduto').addEventListener('click', function() {
        window.location.href = "listaProdutos.html";
    });
});
