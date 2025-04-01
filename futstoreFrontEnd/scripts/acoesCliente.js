let btnLoginCadatro = document.getElementById('loginBtn');
let modalAcao = document.getElementById('modalAcao');

btnLoginCadatro.addEventListener("click", function(){
   modalAcao.style.display = "block";

    modalAcao.innerHTML=`
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br><br>
        <label for="password">Senha:</label><br>
        <input type="password" id="password" name="password"><br><br>
        <button type="submit">Entrar</button>
        <p>Não possui login? <a href="cadastroCliente.html">Cadastre-se</a></p>
        <button id="fecharModal">Fechar</button>
    `;

    document.getElementById('fecharModal').addEventListener("click", function() {
        modalAcao.style.display = "none";
    });
});

