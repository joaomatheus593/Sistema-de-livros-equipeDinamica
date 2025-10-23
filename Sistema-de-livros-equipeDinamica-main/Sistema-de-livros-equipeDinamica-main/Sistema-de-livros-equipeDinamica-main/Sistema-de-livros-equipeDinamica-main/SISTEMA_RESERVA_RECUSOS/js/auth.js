class SistemaAutenticacao {
    constructor() {
        this.usuarios = this.carregarUsuarios();
        this.usuarioLogado = this.carregarUsuarioLogado();
        this.inicializarEventos();
    }

    carregarUsuarios() {
        let usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios');
        
        if (!usuarios) {
            console.log('Criando usuários pré-cadastrados...');
            // Usuários pré-cadastrados para facilitar os testes
            usuarios = [
                {
                    id: 'admin-001',
                    nome: 'Administrador',
                    email: 'admin@biblioteca.com',
                    usuario: 'admin',
                    senha: 'Admin123!',
                    tipo: 'admin',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                },
                {
                    id: 'user-001',
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    usuario: 'joao',
                    senha: 'Usuario123!',
                    tipo: 'usuario',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                },
                {
                    id: 'user-002', 
                    nome: 'Maria Santos',
                    email: 'maria@email.com',
                    usuario: 'maria',
                    senha: 'Usuario123!',
                    tipo: 'usuario',
                    dataCadastro: new Date().toISOString(),
                    ativo: true
                }
            ];
            ArmazenamentoLocal.salvar('biblioteca_usuarios', usuarios);
        } else {
            console.log('Usuários carregados do localStorage:', usuarios);
        }
        
        return usuarios;
    }

    carregarUsuarioLogado() {
        return ArmazenamentoLocal.carregar('usuario_logado');
    }

    inicializarEventos() {
        // Formulário de login
        const formLogin = document.getElementById('formLogin');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarLogin();
            });
        }

        // Formulário de cadastro
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarCadastro();
            });

            // Validação de senha em tempo real
            const senhaInput = document.getElementById('inputSenhaCadastro');
            if (senhaInput) {
                senhaInput.addEventListener('input', (e) => {
                    this.validarForcaSenha(e.target.value);
                });
            }

            const confirmarSenhaInput = document.getElementById('inputConfirmarSenha');
            if (confirmarSenhaInput) {
                confirmarSenhaInput.addEventListener('input', (e) => {
                    this.validarConfirmacaoSenha();
                });
            }
        }
    }

    validarForcaSenha(senha) {
        const forca = Validacoes.calcularForcaSenha(senha);
        const barraForca = document.getElementById('barraForcaSenha');
        const textoForca = document.getElementById('textoForcaSenha');

        if (barraForca && textoForca) {
            // Remover classes anteriores
            barraForca.className = 'barra-forca-senha';
            
            // Adicionar classe baseada na força
            if (forca <= 1) {
                barraForca.classList.add('senha-fraca');
            } else if (forca <= 3) {
                barraForca.classList.add('senha-media');
            } else if (forca <= 4) {
                barraForca.classList.add('senha-forte');
            } else {
                barraForca.classList.add('senha-muito-forte');
            }

            textoForca.textContent = Validacoes.obterTextoForcaSenha(forca);
        }
    }

    validarConfirmacaoSenha() {
        const senha = document.getElementById('inputSenhaCadastro').value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha').value;
        const confirmarSenhaInput = document.getElementById('inputConfirmarSenha');

        if (confirmarSenhaInput) {
            if (confirmarSenha && senha !== confirmarSenha) {
                confirmarSenhaInput.style.borderColor = 'var(--vermelho)';
            } else {
                confirmarSenhaInput.style.borderColor = 'var(--cinza-claro)';
            }
        }
    }

    realizarLogin() {
        const usuarioInput = document.getElementById('inputUsuario').value;
        const senhaInput = document.getElementById('inputSenha').value;
        const lembrarLogin = document.getElementById('lembrarLogin').checked;

        // Validar campos
        if (!usuarioInput || !senhaInput) {
            mensagens.erro('Por favor, preencha todos os campos.');
            return;
        }

        // Buscar usuário
        const usuario = this.usuarios.find(u => 
            (u.usuario === usuarioInput || u.email === usuarioInput) && 
            u.senha === senhaInput && 
            u.ativo
        );

        if (usuario) {
            this.usuarioLogado = usuario;
            
            // Salvar sessão
            if (lembrarLogin) {
                ArmazenamentoLocal.salvar('usuario_logado', usuario);
            } else {
                sessionStorage.setItem('usuario_logado', JSON.stringify(usuario));
            }

            mensagens.sucesso(`Bem-vindo(a) de volta, ${usuario.nome}!`);
            this.entrarNoSistema();
        } else {
            mensagens.erro('Usuário ou senha incorretos.');
        }
    }

    realizarCadastro() {
        const nome = document.getElementById('inputNomeCompleto').value;
        const email = document.getElementById('inputEmail').value;
        const usuario = document.getElementById('inputUsuarioCadastro').value;
        const senha = document.getElementById('inputSenhaCadastro').value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha').value;
        const tipo = document.getElementById('selectTipoUsuario').value;
        const termos = document.getElementById('checkTermos').checked;

        // Validações
        if (!nome || !email || !usuario || !senha || !confirmarSenha) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!Validacoes.validarEmail(email)) {
            mensagens.erro('Por favor, insira um e-mail válido.');
            return;
        }

        if (!Validacoes.validarSenha(senha)) {
            mensagens.erro('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
            return;
        }

        if (senha !== confirmarSenha) {
            mensagens.erro('As senhas não coincidem.');
            return;
        }

        if (!termos) {
            mensagens.erro('Você deve aceitar os termos de uso.');
            return;
        }

        // Verificar se usuário ou email já existem
        if (this.usuarios.find(u => u.usuario === usuario)) {
            mensagens.erro('Este nome de usuário já está em uso.');
            return;
        }

        if (this.usuarios.find(u => u.email === email)) {
            mensagens.erro('Este e-mail já está cadastrado.');
            return;
        }

        // Criar novo usuário
        const novoUsuario = {
            id: GeradorID.gerar(),
            nome: nome.trim(),
            email: email.toLowerCase().trim(),
            usuario: usuario.trim(),
            senha: senha,
            tipo: tipo,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };

        this.usuarios.push(novoUsuario);
        ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);

        mensagens.sucesso('Cadastro realizado com sucesso! Você já pode fazer login.');
        this.fecharModal('modalCadastro');
        this.mostrarLogin();
    }

    entrarNoSistema() {
        document.getElementById('telaInicio').style.display = 'none';
        document.getElementById('sistemaPrincipal').style.display = 'block';
        
        this.atualizarInterfaceUsuario();
        this.fecharModal('modalLogin');

        // Inicializar outros sistemas
        if (typeof sistemaLivros !== 'undefined') {
            sistemaLivros.carregarLivros();
        }

        if (typeof sistemaAdmin !== 'undefined' && this.usuarioLogado.tipo === 'admin') {
            sistemaAdmin.mostrarAreaAdmin();
        }
    }

    atualizarInterfaceUsuario() {
        const saudacao = document.getElementById('saudacaoUsuario');
        const areaAdmin = document.getElementById('areaAdministrativa');

        if (saudacao && this.usuarioLogado) {
            const hora = new Date().getHours();
            let cumprimento = 'Boa noite';
            
            if (hora < 12) cumprimento = 'Bom dia';
            else if (hora < 18) cumprimento = 'Boa tarde';

            saudacao.textContent = `${cumprimento}, ${this.usuarioLogado.nome.split(' ')[0]}!`;
        }

        // Mostrar/ocultar área administrativa
        if (areaAdmin) {
            if (this.usuarioLogado && this.usuarioLogado.tipo === 'admin') {
                areaAdmin.style.display = 'block';
            } else {
                areaAdmin.style.display = 'none';
            }
        }
    }

    sair() {
        this.usuarioLogado = null;
        ArmazenamentoLocal.remover('usuario_logado');
        sessionStorage.removeItem('usuario_logado');

        document.getElementById('sistemaPrincipal').style.display = 'none';
        document.getElementById('telaInicio').style.display = 'flex';

        mensagens.info('Você saiu do sistema.');
    }

    // Métodos para modais
    mostrarLogin() {
        this.abrirModal('modalLogin');
    }

    mostrarCadastro() {
        this.abrirModal('modalCadastro');
    }

    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    entrarComoConvidado() {
        this.usuarioLogado = {
            id: 'convidado',
            nome: 'Convidado',
            tipo: 'convidado'
        };

        mensagens.info('Entrando como convidado. Algumas funcionalidades estarão limitadas.');
        this.entrarNoSistema();
    }

    // Getters
    getUsuarioLogado() {
        return this.usuarioLogado;
    }

    isAdmin() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'admin';
    }

    isConvidado() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'convidado';
    }
    // Adicione este método à classe SistemaAutenticacao
verificarUsuariosPreCadastrados() {
    console.log('Usuários no sistema:', this.usuarios);
    
    const usuariosEsperados = ['admin', 'joao', 'maria'];
    usuariosEsperados.forEach(usuario => {
        const encontrado = this.usuarios.find(u => u.usuario === usuario);
        console.log(`Usuário ${usuario} encontrado:`, encontrado ? 'SIM' : 'NÃO');
        if (!encontrado) {
            console.log(`CRIANDO usuário ${usuario}...`);
            this.criarUsuarioPreCadastrado(usuario);
        }
    });
}

criarUsuarioPreCadastrado(usuario) {
    const usuariosBase = {
        'admin': {
            nome: 'Administrador',
            email: 'admin@biblioteca.com',
            senha: 'Admin123!',
            tipo: 'admin'
        },
        'joao': {
            nome: 'João Silva',
            email: 'joao@email.com',
            senha: 'Usuario123!',
            tipo: 'usuario'
        },
        'maria': {
            nome: 'Maria Santos',
            email: 'maria@email.com', 
            senha: 'Usuario123!',
            tipo: 'usuario'
        }
    };

    const dados = usuariosBase[usuario];
    if (dados) {
        const novoUsuario = {
            id: GeradorID.gerar(),
            nome: dados.nome,
            email: dados.email,
            usuario: usuario,
            senha: dados.senha,
            tipo: dados.tipo,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };

        this.usuarios.push(novoUsuario);
        console.log(`Usuário ${usuario} criado:`, novoUsuario);
    }
}
}

// Inicializar sistema de autenticação
const sistemaAuth = new SistemaAutenticacao();

// Funções globais para os eventos do HTML
function mostrarLogin() {
    sistemaAuth.mostrarLogin();
}

function mostrarCadastro() {
    sistemaAuth.mostrarCadastro();
}

function fecharModal(modalId) {
    sistemaAuth.fecharModal(modalId);
}

function entrarComoConvidado() {
    sistemaAuth.entrarComoConvidado();
}

function sair() {
    sistemaAuth.sair();
}

function alternarTema() {
    mensagens.info('Funcionalidade de tema em desenvolvimento.');
}

function abrirNotificacoes() {
    mensagens.info('Sistema de notificações em desenvolvimento.');
}
// SOLUÇÃO DE EMERGÊNCIA - Forçar criação dos usuários
setTimeout(() => {
    console.log('Verificando usuários...');
    const usuariosNecessarios = ['admin', 'joao', 'maria'];
    let usuariosFaltantes = [];
    
    usuariosNecessarios.forEach(usuario => {
        if (!sistemaAuth.usuarios.find(u => u.usuario === usuario)) {
            usuariosFaltantes.push(usuario);
        }
    });
    
    if (usuariosFaltantes.length > 0) {
        console.log('Criando usuários faltantes:', usuariosFaltantes);
        usuariosFaltantes.forEach(usuario => {
            sistemaAuth.criarUsuarioPreCadastrado(usuario);
        });
        // Salvar no localStorage
        ArmazenamentoLocal.salvar('biblioteca_usuarios', sistemaAuth.usuarios);
        console.log('Usuários criados com sucesso!');
    }
}, 1000);
// No final do construtor, adicione:
this.verificarUsuariosPreCadastrados();