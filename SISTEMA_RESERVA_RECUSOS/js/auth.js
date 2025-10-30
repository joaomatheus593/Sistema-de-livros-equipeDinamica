// ========== SISTEMA DE AUTENTICAÇÃO INTEGRADO ==========
class SistemaAutenticacao {
    constructor() {
        this.usuarios = this.carregarUsuarios();
        this.usuarioLogado = this.carregarUsuarioLogado();
        this.tentativasLogin = 0;
        this.bloqueioTemporario = false;
        this.inicializarEventos();
        this.verificarUsuariosPreCadastrados();
        console.log('🔐 Sistema de Autenticação inicializado');
    }

    carregarUsuarios() {
        let usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios');
        
        if (!usuarios || usuarios.length === 0) {
            console.log('📝 Criando usuários pré-cadastrados...');
            usuarios = this.criarUsuariosPadrao();
            ArmazenamentoLocal.salvar('biblioteca_usuarios', usuarios);
        }
        
        return usuarios;
    }

    criarUsuariosPadrao() {
        const timestamp = new Date().toISOString();
        return [
            {
                id: 'admin-001',
                nome: 'Administrador Principal',
                email: 'admin@bibliotecacesf.com',
                usuario: 'admin',
                senha: 'Admin123!',
                tipo: 'admin',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👑',
                temaPreferido: 'claro',
                notificacoes: true
            },
            {
                id: 'user-001',
                nome: 'João Silva Santos',
                email: 'joao.silva@email.com',
                usuario: 'joao',
                senha: 'Usuario123!',
                tipo: 'usuario',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👨‍💼',
                temaPreferido: 'claro',
                notificacoes: true
            },
            {
                id: 'user-002',
                nome: 'Maria Oliveira Costa',
                email: 'maria.costa@email.com',
                usuario: 'maria',
                senha: 'Usuario123!',
                tipo: 'usuario',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👩‍🎓',
                temaPreferido: 'claro',
                notificacoes: true
            }
        ];
    }

    carregarUsuarioLogado() {
        const usuarioSession = sessionStorage.getItem('usuario_logado');
        const usuarioLocal = localStorage.getItem('usuario_logado');
        
        if (usuarioSession) {
            return JSON.parse(usuarioSession);
        } else if (usuarioLocal) {
            return JSON.parse(usuarioLocal);
        }
        
        return null;
    }

    inicializarEventos() {
        // Eventos de formulário
        const formLogin = document.getElementById('formLogin');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarLogin();
            });
        }

        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarCadastro();
            });

            // Validação em tempo real
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

        // Eventos de teclado para atalhos
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && !e.shiftKey) {
                switch(e.key) {
                    case '1': e.preventDefault(); this.loginRapido('admin'); break;
                    case '2': e.preventDefault(); this.loginRapido('joao'); break;
                    case '3': e.preventDefault(); this.loginRapido('maria'); break;
                }
            }
        });
    }

    realizarLogin() {
        if (this.bloqueioTemporario) {
            mensagens.erro('Sistema temporariamente bloqueado. Tente novamente em alguns minutos.');
            return;
        }

        const usuarioInput = document.getElementById('inputUsuario');
        const senhaInput = document.getElementById('inputSenha');
        const lembrarLogin = document.getElementById('lembrarLogin');

        if (!usuarioInput || !senhaInput) {
            mensagens.erro('Erro: Campos de login não encontrados.');
            return;
        }

        const credencial = usuarioInput.value.trim();
        const senha = senhaInput.value;
        const lembrar = lembrarLogin ? lembrarLogin.checked : false;

        // Validações básicas
        if (!credencial || !senha) {
            this.animacaoErroLogin();
            mensagens.erro('Por favor, preencha todos os campos.');
            return;
        }

        // Buscar usuário
        const usuarioEncontrado = this.usuarios.find(u => 
            (u.usuario === credencial || u.email === credencial) && 
            u.senha === senha && 
            u.ativo === true
        );

        if (usuarioEncontrado) {
            // Login bem-sucedido
            this.tentativasLogin = 0;
            this.usuarioLogado = usuarioEncontrado;
            
            // Atualizar último acesso
            usuarioEncontrado.ultimoAcesso = new Date().toISOString();
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);

            // Salvar sessão
            if (lembrar) {
                localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            } else {
                sessionStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            }

            this.animacaoSucessoLogin();
            mensagens.sucesso(`Bem-vindo(a) de volta, ${usuarioEncontrado.nome.split(' ')[0]}! 🎉`);
            
            setTimeout(() => {
                this.entrarNoSistema();
            }, 1000);

        } else {
            // Login falhou
            this.tentativasLogin++;
            this.animacaoErroLogin();
            
            if (this.tentativasLogin >= 5) {
                this.bloqueioTemporario = true;
                mensagens.erro('Muitas tentativas falhas. Sistema bloqueado por 2 minutos.');
                setTimeout(() => {
                    this.bloqueioTemporario = false;
                    this.tentativasLogin = 0;
                    mensagens.info('Sistema desbloqueado. Você pode tentar novamente.');
                }, 120000);
            } else {
                const tentativasRestantes = 5 - this.tentativasLogin;
                mensagens.erro(`Credenciais inválidas. ${tentativasRestantes} tentativas restantes.`);
            }
        }
    }

    realizarCadastro() {
        const nome = document.getElementById('inputNomeCompleto')?.value.trim();
        const email = document.getElementById('inputEmail')?.value.trim();
        const usuario = document.getElementById('inputUsuarioCadastro')?.value.trim();
        const senha = document.getElementById('inputSenhaCadastro')?.value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha')?.value;
        const termos = document.getElementById('checkTermos')?.checked;

        // Validações
        if (!nome || !email || !usuario || !senha || !confirmarSenha) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!this.validarNomeCompleto(nome)) {
            mensagens.erro('Por favor, insira seu nome completo (mínimo 2 palavras).');
            return;
        }

        if (!Validacoes.validarEmail(email)) {
            mensagens.erro('Por favor, insira um e-mail válido.');
            return;
        }

        if (!this.validarUsuario(usuario)) {
            mensagens.erro('Nome de usuário deve ter entre 3 e 20 caracteres e conter apenas letras, números e underline.');
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
            mensagens.erro('Você deve aceitar os termos de uso e política de privacidade.');
            return;
        }

        // Verificar duplicatas
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
            nome: nome,
            email: email.toLowerCase(),
            usuario: usuario.toLowerCase(),
            senha: senha,
            tipo: 'usuario',
            dataCadastro: new Date().toISOString(),
            ultimoAcesso: null,
            ativo: true,
            avatar: this.gerarAvatarAleatorio(),
            temaPreferido: 'claro',
            notificacoes: true,
            livrosFavoritos: [],
            historicoBusca: []
        };

        this.usuarios.push(novoUsuario);
        ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);

        mensagens.sucesso('Cadastro realizado com sucesso! 🎊 Você já pode fazer login.');
        
        // Animação de sucesso
        this.animacaoSucessoCadastro();
        
        setTimeout(() => {
            this.fecharModal('modalCadastro');
            this.mostrarLogin();
        }, 1500);
    }

    validarNomeCompleto(nome) {
        return nome.split(' ').length >= 2 && nome.length >= 5;
    }

    validarUsuario(usuario) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(usuario);
    }

    validarForcaSenha(senha) {
        const forca = Validacoes.calcularForcaSenha(senha);
        const barraForca = document.getElementById('barraForcaSenha');
        const textoForca = document.getElementById('textoForcaSenha');

        if (barraForca && textoForca) {
            // Resetar classes
            barraForca.className = 'barra-forca-senha';
            textoForca.className = 'texto-forca-senha';
            
            // Adicionar classes baseadas na força
            if (forca <= 1) {
                barraForca.classList.add('senha-fraca');
                textoForca.classList.add('senha-fraca');
                textoForca.textContent = 'Senha fraca';
            } else if (forca <= 2) {
                barraForca.classList.add('senha-media');
                textoForca.classList.add('senha-media');
                textoForca.textContent = 'Senha média';
            } else if (forca <= 3) {
                barraForca.classList.add('senha-forte');
                textoForca.classList.add('senha-forte');
                textoForca.textContent = 'Senha forte';
            } else {
                barraForca.classList.add('senha-muito-forte');
                textoForca.classList.add('senha-muito-forte');
                textoForca.textContent = 'Senha muito forte';
            }
        }
    }

    validarConfirmacaoSenha() {
        const senha = document.getElementById('inputSenhaCadastro')?.value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha')?.value;
        const confirmarInput = document.getElementById('inputConfirmarSenha');

        if (confirmarInput) {
            if (confirmarSenha && senha !== confirmarSenha) {
                confirmarInput.classList.add('erro-validacao');
            } else {
                confirmarInput.classList.remove('erro-validacao');
            }
        }
    }

    entrarNoSistema() {
        const telaInicio = document.getElementById('telaInicio');
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        
        if (telaInicio && sistemaPrincipal) {
            // Animação de saída
            telaInicio.style.opacity = '0';
            telaInicio.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                telaInicio.style.display = 'none';
                sistemaPrincipal.style.display = 'block';
                
                // Animação de entrada
                sistemaPrincipal.style.opacity = '0';
                sistemaPrincipal.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    sistemaPrincipal.style.opacity = '1';
                    sistemaPrincipal.style.transform = 'translateY(0)';
                    sistemaPrincipal.style.transition = 'all 0.5s ease';
                }, 50);
                
                this.atualizarInterfaceUsuario();
                this.fecharModal('modalLogin');
                
                // Inicializar sistemas dependentes
                if (typeof sistemaLivros !== 'undefined') {
                    sistemaLivros.carregarLivros();
                }
                
                if (typeof sistemaAdmin !== 'undefined' && this.isAdmin()) {
                    sistemaAdmin.mostrarAreaAdmin();
                }

            }, 300);
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

            saudacao.innerHTML = `
                <span class="avatar-usuario">${this.usuarioLogado.avatar}</span>
                <span class="texto-saudacao">${cumprimento}, <strong>${this.usuarioLogado.nome.split(' ')[0]}</strong>!</span>
            `;
        }

        // Controles administrativos
        if (this.isAdmin()) {
            if (areaAdmin) areaAdmin.style.display = 'block';
        } else {
            if (areaAdmin) areaAdmin.style.display = 'none';
        }

        // Aplicar tema preferido do usuário
        if (this.usuarioLogado.temaPreferido && typeof sistemaTema !== 'undefined') {
            sistemaTema.temaAtual = this.usuarioLogado.temaPreferido;
            sistemaTema.aplicarTema();
        }
    }

    sair() {
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        const telaInicio = document.getElementById('telaInicio');
        
        if (sistemaPrincipal && telaInicio) {
            // Animação de saída
            sistemaPrincipal.style.opacity = '0';
            sistemaPrincipal.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                // Limpar dados de sessão
                this.usuarioLogado = null;
                sessionStorage.removeItem('usuario_logado');
                localStorage.removeItem('usuario_logado');
                
                sistemaPrincipal.style.display = 'none';
                telaInicio.style.display = 'flex';
                
                // Animação de entrada
                telaInicio.style.opacity = '0';
                telaInicio.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    telaInicio.style.opacity = '1';
                    telaInicio.style.transform = 'translateY(0)';
                    telaInicio.style.transition = 'all 0.5s ease';
                }, 50);
                
                mensagens.info('Você saiu do sistema. Até logo! 👋');
            }, 300);
        }
    }

    // Sistema de Modais
    mostrarLogin() {
        this.abrirModal('modalLogin');
        setTimeout(() => {
            document.getElementById('inputUsuario')?.focus();
        }, 300);
    }

    mostrarCadastro() {
        this.abrirModal('modalCadastro');
        this.resetarFormularioCadastro();
    }

    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Animação de entrada
            setTimeout(() => {
                modal.classList.add('mostrar');
                const conteudo = modal.querySelector('.modal-conteudo');
                if (conteudo) conteudo.classList.add('mostrar');
            }, 10);
        }
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const conteudo = modal.querySelector('.modal-conteudo');
            if (conteudo) conteudo.classList.remove('mostrar');
            
            modal.classList.remove('mostrar');
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    entrarComoConvidado() {
        this.usuarioLogado = {
            id: 'convidado-' + Date.now(),
            nome: 'Visitante Convidado',
            tipo: 'convidado',
            avatar: '👀',
            dataCadastro: new Date().toISOString()
        };

        mensagens.info('Entrando como convidado. Algumas funcionalidades estarão limitadas.');
        
        setTimeout(() => {
            this.entrarNoSistema();
        }, 1000);
    }

    // Login Rápido para Desenvolvimento
    loginRapido(usuario) {
        const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.ativo);
        
        if (usuarioEncontrado) {
            // Preencher formulário automaticamente
            const usuarioInput = document.getElementById('inputUsuario');
            const senhaInput = document.getElementById('inputSenha');
            const lembrarInput = document.getElementById('lembrarLogin');
            
            if (usuarioInput && senhaInput) {
                usuarioInput.value = usuarioEncontrado.usuario;
                senhaInput.value = usuarioEncontrado.senha;
                if (lembrarInput) lembrarInput.checked = true;
                
                mensagens.info(`Preenchido: ${usuarioEncontrado.nome} - Pressione Enter para logar`);
                
                // Focar no campo de senha para facilitar Enter
                senhaInput.focus();
            }
        } else {
            mensagens.erro(`Usuário "${usuario}" não encontrado.`);
        }
    }

    // Animações
    animacaoSucessoLogin() {
        const modal = document.getElementById('modalLogin');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.animation = 'pulseSuccess 0.5s ease-out';
            setTimeout(() => {
                conteudo.style.animation = '';
            }, 500);
        }
    }

    animacaoErroLogin() {
        const modal = document.getElementById('modalLogin');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.animation = 'shake 0.5s ease-out';
            setTimeout(() => {
                conteudo.style.animation = '';
            }, 500);
        }
    }

    animacaoSucessoCadastro() {
        const modal = document.getElementById('modalCadastro');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.transform = 'scale(1.02)';
            setTimeout(() => {
                conteudo.style.transform = 'scale(1)';
            }, 300);
        }
    }

    resetarFormularioCadastro() {
        const form = document.getElementById('formCadastro');
        if (form) form.reset();
        
        this.validarForcaSenha('');
        this.validarConfirmacaoSenha();
    }

    gerarAvatarAleatorio() {
        const avatares = ['👦', '👧', '👨', '👩', '🧑', '👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼'];
        return avatares[Math.floor(Math.random() * avatares.length)];
    }

    // Getters e verificações
    getUsuarioLogado() {
        return this.usuarioLogado;
    }

    isAdmin() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'admin';
    }

    isConvidado() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'convidado';
    }

    isUsuarioComum() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'usuario';
    }

    // Verificação e criação de usuários pré-cadastrados
    verificarUsuariosPreCadastrados() {
        const usuariosEsperados = ['admin', 'joao', 'maria'];
        let usuariosFaltantes = [];
        
        usuariosEsperados.forEach(usuario => {
            if (!this.usuarios.find(u => u.usuario === usuario)) {
                usuariosFaltantes.push(usuario);
            }
        });
        
        if (usuariosFaltantes.length > 0) {
            console.log('🔧 Criando usuários faltantes:', usuariosFaltantes);
            usuariosFaltantes.forEach(usuario => {
                this.criarUsuarioPreCadastrado(usuario);
            });
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
        }
    }

    criarUsuarioPreCadastrado(usuario) {
        const usuariosBase = {
            'admin': {
                nome: 'Administrador Principal',
                email: 'admin@bibliotecacesf.com',
                senha: 'Admin123!',
                tipo: 'admin',
                avatar: '👑'
            },
            'joao': {
                nome: 'João Silva Santos',
                email: 'joao.silva@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                avatar: '👨‍💼'
            },
            'maria': {
                nome: 'Maria Oliveira Costa',
                email: 'maria.costa@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                avatar: '👩‍🎓'
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
                ultimoAcesso: null,
                ativo: true,
                avatar: dados.avatar,
                temaPreferido: 'claro',
                notificacoes: true
            };

            this.usuarios.push(novoUsuario);
            console.log(`✅ Usuário ${usuario} criado com sucesso`);
        }
    }
}

// ========== INICIALIZAÇÃO DO SISTEMA ==========
const sistemaAuth = new SistemaAutenticacao();

// ========== FUNÇÕES GLOBAIS PARA HTML ==========
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

function loginRapido(usuario) {
    sistemaAuth.loginRapido(usuario);
}

// ========== INICIALIZAÇÃO E CONFIGURAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Autenticação carregado com sucesso!');
    
    // Verificar se há usuário logado ao carregar a página
    if (sistemaAuth.getUsuarioLogado()) {
        sistemaAuth.entrarNoSistema();
    }
});

// ========== CONSOLE HELPER ==========
console.log('%c🔐 Sistema de Autenticação Pronto!', 'color: #8B0000; font-weight: bold; font-size: 16px;');
console.log('%cAtalhos de Desenvolvimento:', 'color: #D4AF37; font-weight: bold;');
console.log('%cCtrl+1 - Admin | Ctrl+2 - João | Ctrl+3 - Maria', 'color: #8B0000;');