class CadastroUsuario {
    constructor() {
        this.formulario = document.getElementById('formCadastro');
        this.Inome = document.querySelector('#nomeCadastro');
        this.Iemail = document.querySelector('#emailCadastro');
        this.Isenha = document.querySelector('#senhaCadastro');
        this.Isenha2 = document.querySelector('#confirmaSenhaCadastro');
        this.Icpf = document.querySelector('#cpfCadastro');
        this.Igrupo = document.querySelector('#selectGrupoCadastro');
        this.token = localStorage.getItem('token');
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        if (usuarioId) {
            this.carregarUsuario(usuarioId);
            this.atualizarTextoModoEdicao();
        }

        this.formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (usuarioId) {
                this.editarUsuario(usuarioId);
            } else {
                await this.validarCadastro(); // faz a validação antes de criar o usuário
            }
        });
    }

    atualizarTextoModoEdicao() {
        document.querySelector('h2').textContent = 'Editar Usuário';
        document.getElementById('btnCadastro').textContent = 'Salvar';
    }

    carregarUsuario(id) {
        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(usuario => {
            this.Inome.value = usuario.nome;
            this.Iemail.value = usuario.email;
            this.Icpf.value = usuario.cpf;
            this.Igrupo.value = usuario.grupo;
            this.Isenha.value = '';
            this.Isenha2.value = '';
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            alert("Não foi possível carregar o usuário para edição.");
            window.location.href = 'listaUsuarios.html';
        });
    }

    // confere no banco se já tem um usuário com o mesmo email ou cpf
    async validarCadastro() {
        const email = this.Iemail.value;
        const cpf = this.Icpf.value;

        try {
            const response = await fetch(`http://localhost:8080/usuarios/verificar?email=${email}&cpf=${cpf}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.emailExistente) {
                alert("Já existe um usuário cadastrado com este e-mail.");
                return;
            }

            if (data.cpfExistente) {
                alert("Já existe um usuário cadastrado com este CPF.");
                return;
            }

            // cria o usuário se não tiver cpf e email iguais
            this.criarUsuario();

        } catch (error) {
            console.error("Erro ao validar usuário:", error);
            alert("⚠️ Erro ao verificar se o usuário já existe.");
        }
    }

    criarUsuario() {
        const usuario = this.getDadosFormulario();
        fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'listaUsuarios.html';
        })
        .catch(error => {
            console.error("Erro ao criar usuário:", error);
            alert("Não foi possível criar o usuário.");
        });
    }

    getDadosFormulario() {
        return {
            nome: this.Inome.value,
            email: this.Iemail.value,
            senha: this.Isenha.value,
            cpf: this.Icpf.value,
            grupo: this.Igrupo.value
        };
    }
}

// Instancia e inicializa a classe
const cadastroUsuario = new CadastroUsuario();
cadastroUsuario.init();
