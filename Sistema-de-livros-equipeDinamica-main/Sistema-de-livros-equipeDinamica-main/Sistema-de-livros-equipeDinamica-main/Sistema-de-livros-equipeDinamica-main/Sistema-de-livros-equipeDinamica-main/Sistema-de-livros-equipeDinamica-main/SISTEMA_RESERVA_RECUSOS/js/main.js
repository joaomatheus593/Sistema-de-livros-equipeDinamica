// ========== SISTEMA DE PARCERIA BIBLIOTECA CESTA ==========
class SistemaParceria {
    constructor() {
        this.pedidos = this.carregarPedidos();
        this.configuracoes = this.carregarConfiguracoes();
        this.inicializarEventos();
    }

    carregarPedidos() {
        return ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];
    }

    carregarConfiguracoes() {
        const padrao = {
            bibliotecaParceira: {
                nome: 'Biblioteca Cesta - Sagrada Família',
                endereco: 'Rua das Bibliotecas, 123 - Centro, Campo Largo - PR',
                telefone: '(41) 1234-5678',
                email: 'biblioteca@sagradafamilia.edu.br',
                horarioFuncionamento: 'Segunda a Sexta: 8h às 18h',
                responsavel: 'Maria da Silva',
                tempoProcessamento: '24-48 horas'
            },
            configuracoes: {
                notificarEmail: true,
                notificarWhatsapp: false,
                limitePedidosPorUsuario: 3,
                prazoRetirada: 7 // dias
            }
        };

        return ArmazenamentoLocal.carregar('configuracoes_parceria') || padrao;
    }

    inicializarEventos() {
        console.log('Sistema de Parceria inicializado com', this.pedidos.length, 'pedidos');
    }

    solicitarLivroFisico(livroId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        const livro = sistemaLivros.livros.find(l => l.id === livroId);

        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Faça login para solicitar livros físicos.');
            return;
        }

        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        if (!livro.fisicoDisponivel) {
            mensagens.erro('Este livro não está disponível para empréstimo físico.');
            return;
        }

        // Verificar se usuário já tem pedidos pendentes deste livro
        const pedidoPendente = this.pedidos.find(p => 
            p.livroId === livroId && 
            p.usuarioId === usuario.id && 
            ['pendente', 'processando'].includes(p.status)
        );

        if (pedidoPendente) {
            mensagens.erro('Você já tem um pedido pendente para este livro.');
            return;
        }

        // Verificar limite de pedidos
        const pedidosAtivos = this.pedidos.filter(p => 
            p.usuarioId === usuario.id && 
            ['pendente', 'processando'].includes(p.status)
        ).length;

        if (pedidosAtivos >= this.configuracoes.configuracoes.limitePedidosPorUsuario) {
            mensagens.erro(`Você atingiu o limite de ${this.configuracoes.configuracoes.limitePedidosPorUsuario} pedidos ativos.`);
            return;
        }

        // Criar modal de confirmação
        this.mostrarModalConfirmacao(livro, usuario);
    }

    mostrarModalConfirmacao(livro, usuario) {
        const modalContent = `
            <div class="modal-pedido-fisico">
                <div class="pedido-header">
                    <div class="pedido-livro-info">
                        <img src="${livro.imagem}" alt="${livro.titulo}" 
                             onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200'">
                        <div class="pedido-livro-detalhes">
                            <h3>${livro.titulo}</h3>
                            <p class="autor">${livro.autor}</p>
                            <p class="localizacao"><i class="fas fa-map-marker-alt"></i> ${livro.localizacaoFisica}</p>
                        </div>
                    </div>
                </div>

                <div class="pedido-info-parceira">
                    <h4><i class="fas fa-handshake"></i> Biblioteca Parceira</h4>
                    <div class="info-parceira">
                        <p><strong>${this.configuracoes.bibliotecaParceira.nome}</strong></p>
                        <p><i class="fas fa-map-marker-alt"></i> ${this.configuracoes.bibliotecaParceira.endereco}</p>
                        <p><i class="fas fa-clock"></i> ${this.configuracoes.bibliotecaParceira.horarioFuncionamento}</p>
                        <p><i class="fas fa-phone"></i> ${this.configuracoes.bibliotecaParceira.telefone}</p>
                    </div>
                </div>

                <div class="pedido-instrucoes">
                    <h4><i class="fas fa-info-circle"></i> Como Funciona</h4>
                    <ul>
                        <li>Seu pedido será enviado para a biblioteca parceira</li>
                        <li>Processamento em ${this.configuracoes.bibliotecaParceira.tempoProcessamento}</li>
                        <li>Você receberá uma confirmação quando o livro estiver disponível para retirada</li>
                        <li>Prazo para retirada: ${this.configuracoes.configuracoes.prazoRetirada} dias úteis</li>
                        <li>Documento de identificação necessário para retirada</li>
                    </ul>
                </div>

                <div class="pedido-confirmacao">
                    <label class="checkbox">
                        <input type="checkbox" id="confirmarTermosPedido" required>
                        <span class="checkmark"></span>
                        Confirmo que li e aceito as condições de empréstimo físico
                    </label>
                </div>
            </div>
        `;

        const modal = sistemaModal.criar('Solicitar Livro Físico', modalContent, {
            tamanho: 'medio',
            rodape: `
                <button class="botao botao-secundario" onclick="sistemaModal.fechar()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="botao botao-primario" id="btnConfirmarPedido" disabled>
                    <i class="fas fa-paper-plane"></i>
                    Confirmar Pedido
                </button>
            `
        });

        // Habilitar botão quando checkbox for marcado
        const checkbox = document.getElementById('confirmarTermosPedido');
        const btnConfirmar = document.getElementById('btnConfirmarPedido');

        checkbox.addEventListener('change', function() {
            btnConfirmar.disabled = !this.checked;
        });

        btnConfirmar.addEventListener('click', () => {
            this.processarPedido(livro, usuario);
            sistemaModal.fechar(modal);
        });
    }

    processarPedido(livro, usuario) {
        const novoPedido = {
            id: GeradorID.gerar(),
            livroId: livro.id,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            usuarioEmail: usuario.email,
            usuarioTelefone: usuario.telefone,
            livroTitulo: livro.titulo,
            livroAutor: livro.autor,
            livroImagem: livro.imagem,
            livroLocalizacao: livro.localizacaoFisica,
            bibliotecaParceira: this.configuracoes.bibliotecaParceira.nome,
            dataPedido: new Date().toISOString(),
            dataProcessamento: null,
            dataDisponivelRetirada: null,
            dataRetirada: null,
            dataDevolucaoPrevista: null,
            status: 'pendente',
            codigoRetirada: this.gerarCodigoRetirada(),
            observacoes: ''
        };

        this.pedidos.push(novoPedido);
        ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', this.pedidos);

        // Simular processamento assíncrono
        this.simularProcessamentoPedido(novoPedido.id);

        // Notificações
        sistemaNotificacoes.adicionarNotificacao(
            'Pedido Enviado!',
            `Seu pedido de "${livro.titulo}" foi enviado para ${this.configuracoes.bibliotecaParceira.nome}.`,
            'sucesso'
        );

        sistemaNotificacoes.adicionarNotificacaoAdmin(
            'Novo Pedido Físico',
            `${usuario.nome} solicitou o livro "${livro.titulo}"`,
            'info'
        );

        mensagens.sucesso(`Pedido enviado! Código de retirada: ${novoPedido.codigoRetirada}`);

        // Atualizar painel admin se estiver aberto
        if (typeof sistemaAdmin !== 'undefined' && sistemaAdmin.painelAtual === 'pedidos-fisicos') {
            sistemaAdmin.carregarPainelPedidosFisicos();
        }
    }

    simularProcessamentoPedido(pedidoId) {
        // Simular processamento após 2-5 segundos
        setTimeout(() => {
            const pedidoIndex = this.pedidos.findIndex(p => p.id === pedidoId);
            if (pedidoIndex === -1) return;

            this.pedidos[pedidoIndex].status = 'processando';
            this.pedidos[pedidoIndex].dataProcessamento = new Date().toISOString();
            ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', this.pedidos);

            // Simular disponibilidade após mais 3-8 segundos
            setTimeout(() => {
                const pedidoIndex = this.pedidos.findIndex(p => p.id === pedidoId);
                if (pedidoIndex === -1) return;

                this.pedidos[pedidoIndex].status = 'disponivel';
                this.pedidos[pedidoIndex].dataDisponivelRetirada = new Date().toISOString();
                this.pedidos[pedidoIndex].dataDevolucaoPrevista = UtilitariosData.adicionarDias(new Date(), 14).toISOString();
                ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', this.pedidos);

                // Notificar usuário
                sistemaNotificacoes.adicionarNotificacaoUsuario(
                    this.pedidos[pedidoIndex].usuarioId,
                    'Livro Disponível para Retirada!',
                    `Seu livro "${this.pedidos[pedidoIndex].livroTitulo}" está disponível para retirada. Código: ${this.pedidos[pedidoIndex].codigoRetirada}`,
                    'sucesso'
                );

            }, 3000 + Math.random() * 5000);

        }, 2000 + Math.random() * 3000);
    }

    gerarCodigoRetirada() {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789';
        let codigo = '';
        
        // 3 letras
        for (let i = 0; i < 3; i++) {
            codigo += letras.charAt(Math.floor(Math.random() * letras.length));
        }
        
        // 3 números
        for (let i = 0; i < 3; i++) {
            codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
        }
        
        return codigo;
    }

    getPedidosUsuario(usuarioId = null) {
        const usuario = usuarioId || (sistemaAuth.getUsuarioLogado()?.id);
        if (!usuario) return [];
        
        return this.pedidos.filter(p => p.usuarioId === usuario)
            .sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
    }

    cancelarPedido(pedidoId) {
        const pedidoIndex = this.pedidos.findIndex(p => p.id === pedidoId);
        if (pedidoIndex === -1) return false;

        const pedido = this.pedidos[pedidoIndex];
        
        if (!['pendente', 'processando'].includes(pedido.status)) {
            mensagens.erro('Não é possível cancelar pedidos que já estão disponíveis ou foram retirados.');
            return false;
        }

        this.pedidos[pedidoIndex].status = 'cancelado';
        this.pedidos[pedidoIndex].observacoes = 'Cancelado pelo usuário';
        ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', this.pedidos);

        mensagens.info('Pedido cancelado com sucesso.');
        return true;
    }

    // Métodos para administração
    getEstatisticasPedidos() {
        const total = this.pedidos.length;
        const pendentes = this.pedidos.filter(p => p.status === 'pendente').length;
        const processando = this.pedidos.filter(p => p.status === 'processando').length;
        const disponiveis = this.pedidos.filter(p => p.status === 'disponivel').length;
        const concluidos = this.pedidos.filter(p => p.status === 'concluido').length;
        const cancelados = this.pedidos.filter(p => p.status === 'cancelado').length;

        return {
            total,
            pendentes,
            processando,
            disponiveis,
            concluidos,
            cancelados
        };
    }
}

// ========== SISTEMA DE NOTIFICAÇÕES AVANÇADO ==========
class SistemaNotificacoes {
    constructor() {
        this.notificacoes = this.carregarNotificacoes();
        this.painelAberto = false;
        this.inicializarEventos();
    }

    carregarNotificacoes() {
        return ArmazenamentoLocal.carregar('biblioteca_notificacoes') || [];
    }

    inicializarEventos() {
        // Criar painel de notificações se não existir
        if (!document.getElementById('painelNotificacoes')) {
            this.criarPainelNotificacoes();
        }

        // Verificar notificações a cada 30 segundos
        setInterval(() => this.verificarNotificacoes(), 30000);
    }

    criarPainelNotificacoes() {
        const painelHTML = `
            <div id="painelNotificacoes" class="painel-notificacoes">
                <div class="cabecalho-notificacoes">
                    <h3><i class="fas fa-bell"></i> Notificações</h3>
                    <div class="controles-notificacoes">
                        <span id="contadorNotificacoes">${this.getNotificacoesNaoLidas().length}</span>
                        <button class="botao-limpar" onclick="sistemaNotificacoes.marcarTodasComoLidas()">
                            Marcar todas como lidas
                        </button>
                    </div>
                </div>
                <div class="lista-notificacoes" id="listaNotificacoes">
                    ${this.gerarListaNotificacoes()}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', painelHTML);
    }

    adicionarNotificacao(titulo, mensagem, tipo = 'info', usuarioId = null) {
        const notificacao = {
            id: GeradorID.gerar(),
            titulo: titulo,
            mensagem: mensagem,
            tipo: tipo,
            usuarioId: usuarioId,
            data: new Date().toISOString(),
            lida: false,
            ação: null
        };

        this.notificacoes.unshift(notificacao); // Adicionar no início
        ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);

        // Atualizar contador
        this.atualizarContador();

        // Mostrar notificação toast se o painel não estiver aberto
        if (!this.painelAberto) {
            this.mostrarNotificacaoToast(notificacao);
        }

        // Atualizar lista se o painel estiver aberto
        if (this.painelAberto) {
            this.atualizarListaNotificacoes();
        }

        return notificacao.id;
    }

    adicionarNotificacaoAdmin(titulo, mensagem, tipo = 'info') {
        // Encontrar todos os administradores
        const admins = sistemaAuth.usuarios.filter(u => u.tipo === 'admin' && u.ativo);
        
        admins.forEach(admin => {
            this.adicionarNotificacao(titulo, mensagem, tipo, admin.id);
        });
    }

    adicionarNotificacaoUsuario(usuarioId, titulo, mensagem, tipo = 'info') {
        return this.adicionarNotificacao(titulo, mensagem, tipo, usuarioId);
    }

    mostrarNotificacaoToast(notificacao) {
        const icones = {
            sucesso: 'fas fa-check-circle',
            erro: 'fas fa-exclamation-circle',
            aviso: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const toastHTML = `
            <div class="notificacao-toast notificacao-${notificacao.tipo}" data-id="${notificacao.id}">
                <div class="toast-icon">
                    <i class="${icones[notificacao.tipo]}"></i>
                </div>
                <div class="toast-conteudo">
                    <div class="toast-titulo">${notificacao.titulo}</div>
                    <div class="toast-mensagem">${notificacao.mensagem}</div>
                </div>
                <button class="toast-fechar" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Criar container de toasts se não existir
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.insertAdjacentHTML('beforeend', toastHTML);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            const toast = document.querySelector(`[data-id="${notificacao.id}"]`);
            if (toast) {
                toast.remove();
            }
        }, 5000);
    }

    abrirPainelNotificacoes() {
        const painel = document.getElementById('painelNotificacoes');
        if (!painel) return;

        this.painelAberto = true;
        painel.style.display = 'block';

        // Marcar como lidas ao abrir
        this.marcarComoLidasAoAbrir();

        // Atualizar lista
        this.atualizarListaNotificacoes();
    }

    fecharPainelNotificacoes() {
        const painel = document.getElementById('painelNotificacoes');
        if (painel) {
            painel.style.display = 'none';
            this.painelAberto = false;
        }
    }

    atualizarListaNotificacoes() {
        const container = document.getElementById('listaNotificacoes');
        if (!container) return;

        container.innerHTML = this.gerarListaNotificacoes();
    }

    gerarListaNotificacoes() {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) return '<div class="sem-notificacoes">Faça login para ver notificações</div>';

        // Filtrar notificações do usuário (ou todas se for admin)
        let notificacoesUsuario = this.notificacoes;
        if (usuario.tipo !== 'admin') {
            notificacoesUsuario = this.notificacoes.filter(n => 
                !n.usuarioId || n.usuarioId === usuario.id
            );
        }

        if (notificacoesUsuario.length === 0) {
            return '<div class="sem-notificacoes">Nenhuma notificação</div>';
        }

        return notificacoesUsuario.map(not => `
            <div class="notificacao-item ${not.lida ? '' : 'nao-lida'}" onclick="sistemaNotificacoes.marcarComoLida('${not.id}')">
                <div class="notificacao-icon">
                    <i class="${this.obterIconeTipo(not.tipo)} ${not.tipo}"></i>
                </div>
                <div class="notificacao-conteudo">
                    <div class="notificacao-titulo">${not.titulo}</div>
                    <div class="notificacao-mensagem">${not.mensagem}</div>
                    <div class="notificacao-data">${UtilitariosData.formatarDataRelativa(not.data)}</div>
                </div>
                ${!not.lida ? '<div class="notificacao-ponto"></div>' : ''}
            </div>
        `).join('');
    }

    obterIconeTipo(tipo) {
        const icones = {
            sucesso: 'fas fa-check-circle',
            erro: 'fas fa-exclamation-circle',
            aviso: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icones[tipo] || 'fas fa-bell';
    }

    marcarComoLida(notificacaoId) {
        const notificacaoIndex = this.notificacoes.findIndex(n => n.id === notificacaoId);
        if (notificacaoIndex !== -1) {
            this.notificacoes[notificacaoIndex].lida = true;
            ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);
            this.atualizarContador();
            this.atualizarListaNotificacoes();
        }
    }

    marcarComoLidasAoAbrir() {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) return;

        this.notificacoes.forEach(not => {
            if ((!not.usuarioId || not.usuarioId === usuario.id) && !not.lida) {
                not.lida = true;
            }
        });

        ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);
        this.atualizarContador();
    }

    marcarTodasComoLidas() {
        this.notificacoes.forEach(not => {
            not.lida = true;
        });

        ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);
        this.atualizarContador();
        this.atualizarListaNotificacoes();
        
        mensagens.sucesso('Todas as notificações marcadas como lidas.');
    }

    getNotificacoesNaoLidas() {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) return [];

        return this.notificacoes.filter(n => 
            (!n.usuarioId || n.usuarioId === usuario.id) && !n.lida
        );
    }

    atualizarContador() {
        const contador = document.getElementById('contadorNotificacoes');
        if (contador) {
            const naoLidas = this.getNotificacoesNaoLidas().length;
            contador.textContent = naoLidas;
            contador.style.display = naoLidas > 0 ? 'flex' : 'none';
        }
    }

    verificarNotificacoes() {
        // Verificar pedidos físicos com status atualizado
        const pedidos = sistemaParceria.getPedidosUsuario();
        pedidos.forEach(pedido => {
            if (pedido.status === 'disponivel') {
                const notificacaoExistente = this.notificacoes.find(n => 
                    n.mensagem.includes(pedido.codigoRetirada)
                );

                if (!notificacaoExistente) {
                    this.adicionarNotificacaoUsuario(
                        pedido.usuarioId,
                        'Livro Disponível para Retirada!',
                        `Seu livro "${pedido.livroTitulo}" está disponível. Código: ${pedido.codigoRetirada}`,
                        'sucesso'
                    );
                }
            }
        });

        this.atualizarContador();
    }

    limparTodas() {
        this.notificacoes = [];
        ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);
        this.atualizarContador();
        this.atualizarListaNotificacoes();
        mensagens.info('Todas as notificações foram removidas.');
    }
}

// ========== SISTEMA DE TEMA AVANÇADO ==========
class SistemaTema {
    constructor() {
        this.temaAtual = this.carregarTema();
        this.inicializarEventos();
        this.aplicarTema();
    }

    carregarTema() {
        return ArmazenamentoLocal.carregar('tema_sistema') || 'claro';
    }

    inicializarEventos() {
        // Detectar preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.temaAtual = 'escuro';
            this.aplicarTema();
        }

        // Observar mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!ArmazenamentoLocal.carregar('tema_sistema')) {
                this.temaAtual = e.matches ? 'escuro' : 'claro';
                this.aplicarTema();
            }
        });
    }

    aplicarTema() {
        document.body.classList.remove('tema-claro', 'tema-escuro', 'tema-auto');
        document.body.classList.add(`tema-${this.temaAtual}`);

        // Atualizar meta theme-color
        const themeColor = this.temaAtual === 'escuro' ? '#1a1a1a' : '#8B0000';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);

        // Salvar preferência
        ArmazenamentoLocal.salvar('tema_sistema', this.temaAtual);

        this.atualizarInterface();
    }

    alternarTema() {
        this.temaAtual = this.temaAtual === 'claro' ? 'escuro' : 'claro';
        this.aplicarTema();
        
        mensagens.info(`Tema ${this.temaAtual === 'claro' ? 'claro' : 'escuro'} ativado`);
    }

    atualizarInterface() {
        // Atualizar ícones nos botões
        const botoesTema = document.querySelectorAll('[onclick*="alternarTema"]');
        botoesTema.forEach(botao => {
            const icone = botao.querySelector('i');
            if (icone) {
                icone.className = this.temaAtual === 'claro' ? 'fas fa-moon' : 'fas fa-sun';
            }
        });

        // Atualizar favicon dinamicamente
        this.atualizarFavicon();
    }

    atualizarFavicon() {
        let favicon = document.querySelector("link[rel*='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }

        // Usar favicon diferente para tema escuro (simulação)
        if (this.temaAtual === 'escuro') {
            favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>';
        } else {
            favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>';
        }
    }

    // Métodos para temas customizados
    definirTemaPersonalizado(cores) {
        const root = document.documentElement;
        
        Object.entries(cores).forEach(([prop, valor]) => {
            root.style.setProperty(`--${prop}`, valor);
        });

        ArmazenamentoLocal.salvar('tema_personalizado', cores);
        mensagens.sucesso('Tema personalizado aplicado!');
    }

    resetarTema() {
        const root = document.documentElement;
        
        // Remover estilos customizados
        Array.from(root.style).forEach(prop => {
            if (prop.startsWith('--')) {
                root.style.removeProperty(prop);
            }
        });

        ArmazenamentoLocal.remover('tema_personalizado');
        this.aplicarTema();
        mensagens.info('Tema resetado para padrão.');
    }
}

// ========== INICIALIZAÇÃO DO SISTEMA ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Biblioteca Cesf Online - Sistema inicializando...');

    // Inicializar sistemas
    window.sistemaParceria = new SistemaParceria();
    window.sistemaNotificacoes = new SistemaNotificacoes();
    window.sistemaTema = new SistemaTema();

    // Verificar se há usuário logado
    const usuarioLogado = sistemaAuth.getUsuarioLogado();
    if (usuarioLogado) {
        sistemaAuth.entrarNoSistema();
    }

    // Adicionar estilos dinâmicos
    adicionarEstilosDinamicos();
    
    // Configurar eventos globais
    configurarEventosGlobais();

    // Pre-carregar recursos importantes
    preCarregarRecursos();

    console.log('✅ Sistema totalmente inicializado e pronto!');
});

function adicionarEstilosDinamicos() {
    const estilos = `
        /* Estilos para o sistema de parceria */
        .modal-pedido-fisico {
            max-width: 100%;
        }
        
        .pedido-header {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: var(--cinza-muito-claro);
            border-radius: var(--raio-borda);
        }
        
        .pedido-livro-info {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .pedido-livro-info img {
            width: 80px;
            height: 100px;
            object-fit: cover;
            border-radius: var(--raio-borda-pequeno);
        }
        
        .pedido-livro-detalhes h3 {
            margin: 0 0 0.5rem 0;
            color: var(--vinho-escuro);
        }
        
        .pedido-livro-detalhes .autor {
            color: var(--cinza-medio);
            margin: 0 0 0.5rem 0;
        }
        
        .pedido-livro-detalhes .localizacao {
            color: var(--vinho-principal);
            font-size: 0.9rem;
            margin: 0;
        }
        
        .pedido-info-parceira {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border: 1px solid var(--cinza-claro);
            border-radius: var(--raio-borda);
            background: var(--vinho-suave);
        }
        
        .pedido-info-parceira h4 {
            color: var(--vinho-principal);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .info-parceira p {
            margin: 0.25rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pedido-instrucoes {
            margin-bottom: 1.5rem;
        }
        
        .pedido-instrucoes h4 {
            color: var(--vinho-principal);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pedido-instrucoes ul {
            margin: 0;
            padding-left: 1.5rem;
        }
        
        .pedido-instrucoes li {
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }
        
        .pedido-confirmacao {
            margin-top: 1.5rem;
            padding: 1rem;
            background: var(--cinza-muito-claro);
            border-radius: var(--raio-borda);
        }

        /* Estilos para notificações toast */
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        }
        
        .notificacao-toast {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            border-radius: var(--raio-borda);
            box-shadow: var(--sombra-forte);
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            border-left: 4px solid;
            backdrop-filter: blur(10px);
            color: white;
        }
        
        .notificacao-toast.sucesso {
            background: var(--verde);
            border-left-color: var(--verde);
        }
        
        .notificacao-toast.erro {
            background: var(--vermelho);
            border-left-color: var(--vermelho);
        }
        
        .notificacao-toast.info {
            background: var(--azul);
            border-left-color: var(--azul);
        }
        
        .notificacao-toast.aviso {
            background: var(--laranja);
            border-left-color: var(--laranja);
        }
        
        .toast-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .toast-conteudo {
            flex: 1;
            min-width: 0;
        }
        
        .toast-titulo {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 0.95rem;
        }
        
        .toast-mensagem {
            font-size: 0.85rem;
            opacity: 0.9;
            line-height: 1.3;
        }
        
        .toast-fechar {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            flex-shrink: 0;
            opacity: 0.7;
            transition: var(--transicao-rapida);
        }
        
        .toast-fechar:hover {
            opacity: 1;
            background: rgba(255,255,255,0.1);
        }

        /* Loading overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        }
        
        .loading-overlay.ativo {
            display: flex;
        }
        
        .loading-container {
            background: var(--branco);
            padding: 2rem;
            border-radius: var(--raio-borda-grande);
            text-align: center;
            box-shadow: var(--sombra-forte);
            color: var(--preto);
        }
        
        .loading-spinner {
            margin-bottom: 1rem;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--cinza-claro);
            border-top: 4px solid var(--vinho-principal);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        .loading-text {
            font-weight: 600;
            color: var(--cinza-escuro);
        }

        /* Animações */
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .toast-container {
                right: 10px;
                left: 10px;
                max-width: none;
            }
            
            .notificacao-toast {
                max-width: none;
            }
            
            .pedido-livro-info {
                flex-direction: column;
                text-align: center;
            }
            
            .pedido-livro-info img {
                align-self: center;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = estilos;
    document.head.appendChild(styleSheet);
}

function configurarEventosGlobais() {
    // Fechar painel de notificações ao clicar fora
    document.addEventListener('click', function(e) {
        const painel = document.getElementById('painelNotificacoes');
        const botaoNotificacoes = document.querySelector('[onclick*="abrirNotificacoes"]');
        
        if (painel && painel.style.display === 'block' && 
            !painel.contains(e.target) && 
            !botaoNotificacoes.contains(e.target)) {
            sistemaNotificacoes.fecharPainelNotificacoes();
        }
    });

    // Prevenir comportamento padrão de botões
    document.addEventListener('click', function(e) {
        if (e.target.closest('.botao') || e.target.closest('.item-menu') || 
            e.target.closest('.pagina') || e.target.closest('.botao-tamanho') ||
            e.target.closest('.botao-acao')) {
            e.preventDefault();
        }
    });

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl + K para busca
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('campoPesquisa')?.focus();
        }
        
        // Esc para fechar modais e painéis
        if (e.key === 'Escape') {
            sistemaModal.fechar();
            sistemaNotificacoes.fecharPainelNotificacoes();
        }
    });

    // Melhorar performance com Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                }
            });
        });

        document.querySelectorAll('.cartao-livro, .cartao-destaque').forEach(el => {
            observer.observe(el);
        });
    }
}

function preCarregarRecursos() {
    // Pré-carregar imagens importantes
    const imagens = [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', // placeholder
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'   // livro genérico
    ];

    imagens.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Pré-carregar fonts do Font Awesome
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://cdnjs.cloudflare.com';
    document.head.appendChild(link);
}

// ========== FUNÇÕES GLOBAIS PARA HTML ==========
function scrollParaAdmin() {
    document.getElementById('areaAdministrativa')?.scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function abrirNotificacoes() {
    sistemaNotificacoes.abrirPainelNotificacoes();
}

function alternarTema() {
    sistemaTema.alternarTema();
}

// Funções de login rápido atualizadas
function loginRapido(usuario) {
    console.log('Tentando login rápido para:', usuario);
    
    const usuarioEncontrado = sistemaAuth.usuarios.find(u => {
        return u.usuario === usuario && u.ativo;
    });

    if (usuarioEncontrado) {
        // Preencher automaticamente o formulário
        document.getElementById('inputUsuario').value = usuarioEncontrado.usuario;
        document.getElementById('inputSenha').value = usuarioEncontrado.senha;
        document.getElementById('lembrarLogin').checked = true;
        
        // Realizar login automaticamente
        setTimeout(() => {
            sistemaAuth.realizarLogin();
        }, 500);
        
        return true;
    } else {
        mensagens.erro(`Usuário "${usuario}" não encontrado ou inativo.`);
        return false;
    }
}

// Inicialização final
setTimeout(() => {
    console.log('🎉 Sistema Biblioteca Cesf Online totalmente carregado!');
    console.log('📊 Estatísticas:');
    console.log('   📚 Livros:', sistemaLivros.livros.length);
    console.log('   👥 Usuários:', sistemaAuth.usuarios.length);
    console.log('   💬 Comentários:', sistemaComentarios.comentarios.length);
    console.log('   📦 Pedidos físicos:', sistemaParceria.pedidos.length);
    console.log('   🔔 Notificações:', sistemaNotificacoes.notificacoes.length);
    
    // Mostrar dicas de uso
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c💡 Dicas de Desenvolvimento:', 'color: #D4AF37; font-weight: bold;');
        console.log('%cCtrl+1,2,3 - Login rápido | Ctrl+K - Busca | Esc - Fechar modais', 'color: #8B0000;');
    }
}, 1000);