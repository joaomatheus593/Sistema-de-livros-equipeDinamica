class SistemaAdministrativo {
    constructor() {
        this.painelAtual = 'dashboard';
        this.filtroLivros = '';
        this.filtroUsuarios = '';
        this.filtroEmprestimos = '';
        this.ordenacao = {};
        this.inicializarEventos();
        console.log('👨‍💼 Sistema Administrativo inicializado');
    }

    inicializarEventos() {
        // Formulário de adicionar/editar livro
        const formAdicionarLivro = document.getElementById('formAdicionarLivro');
        if (formAdicionarLivro) {
            formAdicionarLivro.addEventListener('submit', (e) => {
                sistemaLivros.adicionarLivroFormulario(e);
                e.preventDefault();
                this.adicionarOuEditarLivro();
            });
        }

        // Filtros em tempo real
        document.addEventListener('input', (e) => {
            if (e.target.id === 'filtroLivrosAdmin') {
                this.filtroLivros = e.target.value.toLowerCase();
                this.carregarTabelaLivros();
            }
            if (e.target.id === 'filtroUsuariosAdmin') {
                this.filtroUsuarios = e.target.value.toLowerCase();
                this.carregarTabelaUsuarios();
            }
            if (e.target.id === 'filtroEmprestimosAdmin') {
                this.filtroEmprestimos = e.target.value.toLowerCase();
                this.carregarPainelEmprestimos();
            }
        });

        // Ordenação de tabelas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ordenavel')) {
                const th = e.target.closest('.ordenavel');
                const campo = th.dataset.campo;
                this.ordenarTabela(campo);
            }
        });

        // Carregar dados quando a área admin for acessada
        this.inicializarObservadorAdmin();
    }

    inicializarObservadorAdmin() {
        const areaAdmin = document.getElementById('areaAdministrativa');
        if (!areaAdmin) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const displayStyle = areaAdmin.style.display;
                    if (displayStyle !== 'none' && sistemaAuth.isAdmin()) {
                        console.log('🎯 Área admin ficou visível - carregando dados...');
                        setTimeout(() => {
                            this.carregarDadosDashboard();
                        }, 300);
                    }
                }
            });
        });

        observer.observe(areaAdmin, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }

    mostrarAreaAdmin() {
        const areaAdmin = document.getElementById('areaAdministrativa');
        if (areaAdmin && sistemaAuth.isAdmin()) {
            areaAdmin.style.display = 'block';
            this.carregarDadosDashboard();
            
            setTimeout(() => {
                areaAdmin.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    abrirPainelAdmin(painel) {
        console.log('📊 Abrindo painel administrativo:', painel);
        
        if (!sistemaAuth.isAdmin()) {
            mensagens.erro('Acesso restrito a administradores.');
            return;
        }

        // Esconder todos os painéis
        document.querySelectorAll('.painel-conteudo').forEach(p => {
            if (p.classList.contains('ativo')) {
                p.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    p.classList.remove('ativo');
                    p.style.display = 'none';
                    p.style.animation = '';
                }, 300);
            } else {
                p.classList.remove('ativo');
                p.style.display = 'none';
            }
        });

        // Remover classe ativa do menu
        document.querySelectorAll('.item-menu').forEach(item => {
            item.classList.remove('ativo');
        });

        // Mostrar painel selecionado
        const painelId = this.obterIdPainel(painel);
        const painelElement = document.getElementById(painelId);
        
        if (painelElement) {
            painelElement.style.display = 'block';
            setTimeout(() => {
                painelElement.classList.add('ativo');
                painelElement.style.animation = 'fadeIn 0.5s ease-out';
            }, 50);
        } else {
            console.error('❌ Painel não encontrado:', painelId);
            mensagens.erro(`Painel "${painel}" não encontrado.`);
            return;
        }

        // Ativar item do menu
        const itemMenu = document.querySelector(`.item-menu[data-painel="${painel}"]`);
        if (itemMenu) {
            itemMenu.classList.add('ativo');
        }

        this.painelAtual = painel;
        this.carregarDadosPainel(painel);
    }

    obterIdPainel(painel) {
        const mapeamento = {
            'dashboard': 'painelDashboard',
            'livros': 'painelLivros',
            'adicionar-livro': 'painelAdicionarLivro',
            'emprestimos': 'painelEmprestimos',
            'reservas': 'painelReservas',
            'usuarios': 'painelUsuarios',
            'comentarios': 'painelComentarios',
            'configuracoes': 'painelConfiguracoes',
            'agendamentos': 'painelAgendamentos',
            'relatorios': 'painelRelatorios'
        };
        return mapeamento[painel] || `painel${this.capitalizar(painel)}`;
    }

    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    carregarDadosPainel(painel) {
        console.log('📈 Carregando dados para painel:', painel);
        
        switch (painel) {
            case 'dashboard':
                this.carregarDadosDashboard();
                break;
            case 'livros':
                this.carregarTabelaLivros();
                break;
            case 'emprestimos':
                this.carregarPainelEmprestimos();
                break;
            case 'reservas':
                this.carregarPainelReservas();
                break;
            case 'usuarios':
                this.carregarTabelaUsuarios();
                break;
            case 'comentarios':
                this.carregarPainelComentarios();
                break;
            case 'agendamentos':
                this.carregarPainelAgendamentos();
                break;
            case 'relatorios':
                this.carregarPainelRelatorios();
                break;
            case 'configuracoes':
                this.carregarPainelConfiguracoes();
                break;
        }
    }

    // ========== DASHBOARD ==========
    carregarDadosDashboard() {
        if (!sistemaAuth.isAdmin()) return;

        console.log('📊 Carregando dashboard administrativo...');

        const totalLivros = sistemaLivros.getTotalLivros();
        const livrosDisponiveis = sistemaLivros.getLivrosDisponiveis();
        const usuarios = sistemaAuth.obterTodosUsuarios();
        const totalUsuarios = usuarios.length;
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo').length;
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const reservasPendentes = reservas.filter(r => r.status === 'pendente').length;
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentosAtivos = agendamentos.filter(a => a.status === 'agendado').length;
        const comentariosPendentes = sistemaComentarios.getComentariosPendentes().length;

        // Atualizar elementos
        this.atualizarElementoDashboard('totalLivrosAdmin', totalLivros);
        this.atualizarElementoDashboard('totalUsuariosAdmin', totalUsuarios);
        this.atualizarElementoDashboard('totalEmprestimosAdmin', emprestimosAtivos);
        this.atualizarElementoDashboard('totalReservasAdmin', reservasPendentes);
        this.atualizarElementoDashboard('totalAgendamentosAdmin', agendamentosAtivos);
        this.atualizarElementoDashboard('totalComentariosAdmin', comentariosPendentes);

        // Carregar componentes
        this.carregarGraficoGeneros();
        this.carregarGraficoEmprestimos();
        this.carregarAlertasDashboard();
        this.carregarAtividadesRecentes();
    }

    atualizarElementoDashboard(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            this.animarContagem(elemento, parseInt(elemento.textContent) || 0, valor);
        }
    }

    animarContagem(elemento, inicio, fim) {
        const duracao = 1000;
        const intervalo = 50;
        const passos = duracao / intervalo;
        const incremento = (fim - inicio) / passos;
        let atual = inicio;

        const timer = setInterval(() => {
            atual += incremento;
            if ((incremento > 0 && atual >= fim) || (incremento < 0 && atual <= fim)) {
                atual = fim;
                clearInterval(timer);
            }
            elemento.textContent = Math.round(atual).toLocaleString('pt-BR');
        }, intervalo);
    }

    carregarGraficoGeneros() {
        const container = document.getElementById('graficoGeneros');
        if (!container) return;

        const livrosPorGenero = sistemaLivros.getLivrosPorGenero();
        const generos = Object.keys(livrosPorGenero);
        const quantidades = Object.values(livrosPorGenero);

        if (generos.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhum dado disponível para gêneros.</p>';
            return;
        }

        let html = '<div class="grafico-barras-horizontal">';
        const maxQuantidade = Math.max(...quantidades);
        
        generos.forEach((genero, index) => {
            const porcentagem = (quantidades[index] / maxQuantidade) * 100;
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            const cor = this.obterCorGenero(index);
            
            html += `
                <div class="barra-genero-item">
                    <div class="barra-rotulo">${nomeGenero}</div>
                    <div class="barra-container">
                        <div class="barra" style="width: ${porcentagem}%; background-color: ${cor};">
                            <span class="barra-valor">${quantidades[index]}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    obterCorGenero(index) {
        const cores = [
            '#8B0000', '#A52A2A', '#D4AF37', '#B8860B',
            '#28a745', '#007bff', '#6f42c1', '#fd7e14',
            '#20c997', '#e83e8c', '#6c757d', '#0dcaf0'
        ];
        return cores[index % cores.length];
    }

    carregarGraficoEmprestimos() {
        const container = document.getElementById('graficoEmprestimos');
        if (!container) return;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        
        if (emprestimos.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhum dado de empréstimos disponível.</p>';
            return;
        }

        // Agrupar por mês dos últimos 6 meses
        const emprestimosPorMes = {};
        const meses = [];
        const hoje = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
            const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            meses.push({ mes, mesAno });
            emprestimosPorMes[mes] = 0;
        }

        // Contar empréstimos por mês
        emprestimos.forEach(emp => {
            const data = new Date(emp.dataEmprestimo);
            const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
            if (meses.find(m => m.mes === mes)) {
                emprestimosPorMes[mes]++;
            }
        });

        const maxEmprestimos = Math.max(...Object.values(emprestimosPorMes)) || 1;

        container.innerHTML = `
            <div class="grafico-barras-vertical">
                <div class="barras-container">
                    ${meses.map(item => {
                        const quantidade = emprestimosPorMes[item.mes];
                        const altura = (quantidade / maxEmprestimos) * 100;
                        return `
                            <div class="barra-mes">
                                <div class="barra-vertical" style="height: ${altura}%">
                                    <span class="barra-valor">${quantidade}</span>
                                </div>
                                <div class="mes-info">
                                    <span class="mes-nome">${item.mes}</span>
                                    <span class="mes-ano">${item.mesAno.split(' ')[1]}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    carregarAlertasDashboard() {
        const container = document.getElementById('listaAlertas');
        if (!container) return;

        const alertas = [];
        const livros = sistemaLivros.livros;
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const comentariosPendentes = sistemaComentarios.getComentariosPendentes().length;
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];

        // Alertas de estoque baixo
        const livrosEstoqueBaixo = livros.filter(l => l.estoque <= 2 && l.estoque > 0);
        livrosEstoqueBaixo.forEach(livro => {
            alertas.push({
                tipo: 'aviso',
                mensagem: `Estoque baixo: "${livro.titulo}" tem apenas ${livro.estoque} exemplar(es)`,
                icone: 'fa-exclamation-triangle',
                acao: () => this.editarLivro(livro.id)
            });
        });

        // Alertas de estoque zerado
        const livrosSemEstoque = livros.filter(l => l.estoque === 0);
        if (livrosSemEstoque.length > 0) {
            alertas.push({
                tipo: 'critico',
                mensagem: `${livrosSemEstoque.length} livro(s) sem estoque disponível`,
                icone: 'fa-times-circle',
                acao: () => this.abrirPainelAdmin('livros')
            });
        }

        // Alertas de comentários pendentes
        if (comentariosPendentes > 0) {
            alertas.push({
                tipo: 'info',
                mensagem: `${comentariosPendentes} comentário(s) aguardando aprovação`,
                icone: 'fa-comments',
                acao: () => this.abrirPainelAdmin('comentarios')
            });
        }

        // Alertas de empréstimos atrasados
        const hoje = new Date();
        const emprestimosAtrasados = emprestimos.filter(emp => {
            if (emp.status !== 'ativo') return false;
            const dataDevolucao = new Date(emp.dataDevolucaoPrevista);
            return dataDevolucao < hoje;
        });

        if (emprestimosAtrasados.length > 0) {
            alertas.push({
                tipo: 'critico',
                mensagem: `${emprestimosAtrasados.length} empréstimo(s) em atraso`,
                icone: 'fa-clock',
                acao: () => this.abrirPainelAdmin('emprestimos')
            });
        }

        if (alertas.length === 0) {
            container.innerHTML = `
                <div class="alerta-item sucesso">
                    <i class="fas fa-check-circle"></i>
                    <span>Nenhum alerta no momento. Sistema funcionando normalmente.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = alertas.map(alerta => `
            <div class="alerta-item ${alerta.tipo}" onclick="${alerta.acao ? `sistemaAdmin.executarAcaoAlerta('${alerta.mensagem}')` : ''}" style="${alerta.acao ? 'cursor: pointer;' : ''}">
                <i class="fas ${alerta.icone}"></i>
                <span>${alerta.mensagem}</span>
                ${alerta.acao ? '<i class="fas fa-chevron-right seta-acao"></i>' : ''}
            </div>
        `).join('');
    }

    executarAcaoAlerta(mensagem) {
        if (mensagem.includes('estoque')) {
            this.abrirPainelAdmin('livros');
        } else if (mensagem.includes('comentário')) {
            this.abrirPainelAdmin('comentarios');
        } else if (mensagem.includes('empréstimo')) {
            this.abrirPainelAdmin('emprestimos');
        } else if (mensagem.includes('agendamento')) {
            this.abrirPainelAdmin('agendamentos');
        }
    }

    carregarAtividadesRecentes() {
        const container = document.getElementById('atividadesRecentes');
        if (!container) return;

        const atividades = [];
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const comentarios = sistemaComentarios.comentarios;

        // Últimos empréstimos
        const ultimosEmprestimos = emprestimos
            .sort((a, b) => new Date(b.dataEmprestimo) - new Date(a.dataEmprestimo))
            .slice(0, 3);

        ultimosEmprestimos.forEach(emp => {
            atividades.push({
                tipo: 'emprestimo',
                mensagem: `<strong>${emp.usuarioNome}</strong> pegou "<strong>${emp.livroTitulo}</strong>" emprestado`,
                data: emp.dataEmprestimo,
                icone: 'fa-hand-holding',
                cor: 'var(--verde)'
            });
        });

        // Ordenar por data
        atividades.sort((a, b) => new Date(b.data) - new Date(a.data));
        const atividadesRecentes = atividades.slice(0, 6);

        if (atividadesRecentes.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhuma atividade recente.</p>';
            return;
        }

        container.innerHTML = atividadesRecentes.map(atividade => `
            <div class="atividade-item">
                <div class="atividade-icon" style="background-color: ${atividade.cor}">
                    <i class="fas ${atividade.icone}"></i>
                </div>
                <div class="atividade-info">
                    <div class="atividade-mensagem">${atividade.mensagem}</div>
                    <div class="atividade-data">${UtilitariosData.formatarTempoDecorrido(atividade.data)}</div>
                </div>
            </div>
        `).join('');
    }

    // ========== GERENCIAMENTO DE LIVROS ==========
    carregarTabelaLivros() {
        const tbody = document.getElementById('tabelaLivrosBody');
        if (!tbody) return;

        let livros = sistemaLivros.livros;

        // Aplicar filtro
        if (this.filtroLivros) {
            livros = livros.filter(livro => 
                livro.titulo.toLowerCase().includes(this.filtroLivros) ||
                livro.autor.toLowerCase().includes(this.filtroLivros) ||
                livro.genero.toLowerCase().includes(this.filtroLivros)
            );
        }

        if (livros.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="sem-dados">
                        ${this.filtroLivros ? 'Nenhum livro encontrado com o filtro aplicado.' : 'Nenhum livro cadastrado.'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = livros.map(livro => {
            const restricaoClasse = sistemaLivros.obterClasseRestricaoIdade(livro.restricaoIdade);
            const restricaoTexto = sistemaLivros.obterTextoRestricaoIdade(livro.restricaoIdade);
            
            return `
                <tr>
                    <td>
                        <div class="livro-info-rapida">
                            <img src="${livro.imagem}" alt="${livro.titulo}" class="livro-miniatura"
                                 onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100'">
                            <div>
                                <strong>${Formatadores.limitarTexto(livro.titulo, 40)}</strong>
                                <div class="livro-autor">${livro.autor}</div>
                            </div>
                        </div>
                    </td>
                    <td>${sistemaLivros.obterNomeGenero(livro.genero)}</td>
                    <td>${livro.ano}</td>
                    <td>
                        <span class="estoque-indicator ${livro.estoque <= 2 ? 'estoque-baixo' : ''}">
                            ${livro.estoque}
                        </span>
                    </td>
                    <td>
                        <span class="restricao-idade ${restricaoClasse}" title="${restricaoTexto}">
                            ${livro.restricaoIdade === 0 ? 'L' : livro.restricaoIdade}
                        </span>
                    </td>
                    <td>
                        <span class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                            <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                    </td>
                    <td>
                        <div class="avaliacao-rapida">
                            <div class="estrelas-pequenas">
                                ${sistemaLivros.gerarEstrelas(livro.avaliacao)}
                            </div>
                            <span>${livro.avaliacao.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>${livro.vezesEmprestado}</td>
                    <td>
                        <div class="acoes-tabela">
                            <button class="botao-acao botao-visualizar" onclick="sistemaAdmin.visualizarLivroAdmin('${livro.id}')" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarLivro('${livro.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="botao-acao botao-excluir" onclick="sistemaAdmin.excluirLivro('${livro.id}')" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        acaoBtn.innerHTML = `
    <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarLivro('${livro.id}')" title="Editar">
        <i class="fas fa-edit"></i>
    </button>
    <button class="botao-acao botao-visualizar" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')" title="Visualizar">
        <i class="fas fa-eye"></i>
    </button>
    <button class="botao-acao ${livro.destaque ? 'botao-destaque-ativo' : 'botao-destaque'}" 
            onclick="sistemaLivros.alternarDestaque('${livro.id}')" 
            title="${livro.destaque ? 'Remover dos' : 'Adicionar aos'} destaques">
        <i class="fas fa-star"></i>
    </button>
    <button class="botao-acao botao-excluir" onclick="sistemaAdmin.excluirLivro('${livro.id}')" title="Excluir">
        <i class="fas fa-trash"></i>
    </button>
`;
    }

    visualizarLivroAdmin(livroId) {
        sistemaLivros.abrirDetalhesLivro(livroId);
    }

    adicionarOuEditarLivro() {
        const form = document.getElementById('formAdicionarLivro');
        const estaEditando = form.dataset.editando;
        
        if (estaEditando) {
            this.salvarEdicaoLivro(estaEditando);
        } else {
            this.adicionarNovoLivro();
        }
    }

    adicionarNovoLivro() {
        const dadosLivro = this.coletarDadosFormularioLivro();
        
        if (!dadosLivro) return;

        const livroCompleto = {
            ...dadosLivro,
            destaque: document.getElementById('checkDestaque')?.checked || false,
            vezesEmprestado: 0
        };

        if (sistemaLivros.adicionarLivro(livroCompleto)) {
            this.limparFormularioLivro();
            this.carregarTabelaLivros();
            sistemaLivros.carregarDestaques();
            
            mensagens.sucesso(`Livro "${dadosLivro.titulo}" adicionado com sucesso!`);
            this.abrirPainelAdmin('livros');
        }
    }

    coletarDadosFormularioLivro() {
        const titulo = document.getElementById('tituloLivro').value.trim();
        const autor = document.getElementById('autorLivro').value.trim();
        const genero = document.getElementById('generoLivro').value;
        const ano = parseInt(document.getElementById('anoLivro').value);
        const editora = document.getElementById('editoraLivro').value.trim();
        const paginas = parseInt(document.getElementById('paginasLivro').value) || 0;
        const descricao = document.getElementById('descricaoLivro').value.trim();
        const imagem = document.getElementById('imagemLivro').value.trim() || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400';
        const estoque = parseInt(document.getElementById('estoqueLivro').value);
        const restricaoIdade = parseInt(document.getElementById('restricaoIdade').value) || 0;
        const tags = document.getElementById('tagsLivro').value.split(',').map(tag => tag.trim()).filter(tag => tag);

        // Validações básicas
        if (!titulo || !autor || !genero || !ano || !editora || !descricao) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return null;
        }

        if (ano < 1000 || ano > new Date().getFullYear()) {
            mensagens.erro('Ano de publicação inválido.');
            return null;
        }

        return {
            titulo,
            autor,
            genero,
            ano,
            editora,
            paginas,
            descricao,
            imagem,
            estoque,
            restricaoIdade,
            tags,
            disponivel: estoque > 0,
            avaliacao: 0,
            totalAvaliacoes: 0
        };
    }

    preencherFormularioLivro(livro) {
        document.getElementById('tituloLivro').value = livro.titulo;
        document.getElementById('autorLivro').value = livro.autor;
        document.getElementById('generoLivro').value = livro.genero;
        document.getElementById('anoLivro').value = livro.ano;
        document.getElementById('editoraLivro').value = livro.editora;
        document.getElementById('paginasLivro').value = livro.paginas;
        document.getElementById('descricaoLivro').value = livro.descricao;
        document.getElementById('imagemLivro').value = livro.imagem;
        document.getElementById('estoqueLivro').value = livro.estoque;
        document.getElementById('restricaoIdade').value = livro.restricaoIdade;
        document.getElementById('tagsLivro').value = livro.tags ? livro.tags.join(', ') : '';
        
        if (document.getElementById('checkDestaque')) {
            document.getElementById('checkDestaque').checked = livro.destaque || false;
        }
    }

    salvarEdicaoLivro(livroId) {
        const livroIndex = sistemaLivros.livros.findIndex(l => l.id === livroId);
        if (livroIndex === -1) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        const dadosAtualizados = this.coletarDadosFormularioLivro();
        if (!dadosAtualizados) return;

        // Atualizar livro mantendo dados imutáveis
        sistemaLivros.livros[livroIndex] = {
            ...sistemaLivros.livros[livroIndex],
            ...dadosAtualizados,
            destaque: document.getElementById('checkDestaque')?.checked || false
        };

        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
        this.limparFormularioLivro();
        
        mensagens.sucesso(`Livro "${sistemaLivros.livros[livroIndex].titulo}" atualizado com sucesso!`);
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
        this.abrirPainelAdmin('livros');
    }

    excluirLivro(livroId) {
        if (!confirm('Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.')) {
            return;
        }

        const livroIndex = sistemaLivros.livros.findIndex(l => l.id === livroId);
        if (livroIndex === -1) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        const livro = sistemaLivros.livros[livroIndex];
        
        // Verificar se há empréstimos ativos
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.livroId === livroId && e.status === 'ativo');
        
        if (emprestimosAtivos.length > 0) {
            mensagens.erro('Não é possível excluir este livro pois existem empréstimos ativos.');
            return;
        }

        sistemaLivros.livros.splice(livroIndex, 1);
        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        // Remover dados relacionados
        this.removerDadosRelacionados(livroId);

        mensagens.sucesso(`Livro "${livro.titulo}" excluído com sucesso!`);
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
    }

    removerDadosRelacionados(livroId) {
        // Remover comentários
        sistemaComentarios.comentarios = sistemaComentarios.comentarios.filter(c => c.livroId !== livroId);
        ArmazenamentoLocal.salvar('biblioteca_comentarios', sistemaComentarios.comentarios);

        // Remover de favoritos
        const favoritos = ArmazenamentoLocal.carregar('biblioteca_favoritos') || [];
        const favoritosAtualizados = favoritos.filter(f => f.livroId !== livroId);
        ArmazenamentoLocal.salvar('biblioteca_favoritos', favoritosAtualizados);

        // Remover agendamentos
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentosAtualizados = agendamentos.filter(a => a.livroId !== livroId);
        ArmazenamentoLocal.salvar('biblioteca_agendamentos', agendamentosAtualizados);
    }

    limparFormularioLivro() {
        const form = document.getElementById('formAdicionarLivro');
        if (form) {
            form.reset();
            delete form.dataset.editando;
            
            const botaoSubmit = form.querySelector('button[type="submit"]');
            const tituloForm = document.getElementById('tituloFormLivro');
            
            if (botaoSubmit) {
                botaoSubmit.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Livro';
            }
            if (tituloForm) {
                tituloForm.textContent = 'Adicionar Novo Livro';
            }
        }
    }

    // ========== GERENCIAMENTO DE USUÁRIOS ==========
    carregarTabelaUsuarios() {
        const tbody = document.getElementById('tabelaUsuariosBody');
        if (!tbody) return;

        let usuarios = sistemaAuth.obterTodosUsuarios();

        // Aplicar filtro
        if (this.filtroUsuarios) {
            usuarios = usuarios.filter(usuario => 
                usuario.nome.toLowerCase().includes(this.filtroUsuarios) ||
                usuario.usuario.toLowerCase().includes(this.filtroUsuarios) ||
                usuario.email.toLowerCase().includes(this.filtroUsuarios)
            );
        }

        if (usuarios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="sem-dados">
                        ${this.filtroUsuarios ? 'Nenhum usuário encontrado com o filtro aplicado.' : 'Nenhum usuário cadastrado.'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>
                    <div class="usuario-info-rapida">
                        <span class="avatar-usuario">${usuario.avatar || '👤'}</span>
                        <div>
                            <strong>${usuario.nome}</strong>
                            <div class="usuario-email">${usuario.email}</div>
                        </div>
                    </div>
                </td>
                <td>${usuario.usuario}</td>
                <td>${usuario.email}</td>
                <td>
                    <span class="tipo-usuario ${usuario.tipo}">
                        ${usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                </td>
                <td>${UtilitariosData.formatarData(usuario.dataCadastro)}</td>
                <td>
                    <span class="status-usuario ${usuario.ativo ? 'ativo' : 'inativo'}">
                        <i class="fas ${usuario.ativo ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarUsuario('${usuario.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="botao-acao ${usuario.ativo ? 'botao-desativar' : 'botao-ativar'}" onclick="sistemaAdmin.alterarStatusUsuario('${usuario.id}')" title="${usuario.ativo ? 'Desativar' : 'Ativar'}">
                            <i class="fas ${usuario.ativo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    editarUsuario(usuarioId) {
        const usuario = sistemaAuth.obterUsuarioPorId(usuarioId);
        if (!usuario) {
            mensagens.erro('Usuário não encontrado.');
            return;
        }

        // Criar modal de edição
        this.criarModalEdicaoUsuario(usuario);
    }

    criarModalEdicaoUsuario(usuario) {
        let modal = document.getElementById('modalEditarUsuario');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalEditarUsuario';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-conteudo">
                <div class="modal-cabecalho">
                    <h2>Editar Usuário</h2>
                    <button class="fechar-modal" onclick="fecharModal('modalEditarUsuario')">&times;</button>
                </div>
                <div class="modal-corpo">
                    <form id="formEditarUsuario" class="formulario-modal">
                        <div class="campo-formulario">
                            <label for="editarNome">Nome Completo</label>
                            <input type="text" id="editarNome" value="${usuario.nome}" required>
                        </div>
                        <div class="campo-formulario">
                            <label for="editarEmail">E-mail</label>
                            <input type="email" id="editarEmail" value="${usuario.email}" required>
                        </div>
                        <div class="campo-formulario">
                            <label for="editarTipo">Tipo de Usuário</label>
                            <select id="editarTipo">
                                <option value="usuario" ${usuario.tipo === 'usuario' ? 'selected' : ''}>Usuário</option>
                                <option value="admin" ${usuario.tipo === 'admin' ? 'selected' : ''}>Administrador</option>
                            </select>
                        </div>
                        <div class="campo-formulario">
                            <label class="checkbox">
                                <input type="checkbox" id="editarAtivo" ${usuario.ativo ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                Usuário Ativo
                            </label>
                        </div>
                        <div class="acoes-formulario">
                            <button type="submit" class="botao botao-primario">Salvar Alterações</button>
                            <button type="button" class="botao botao-secundario" onclick="fecharModal('modalEditarUsuario')">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Evento do formulário
        const form = document.getElementById('formEditarUsuario');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.salvarEdicaoUsuario(usuario.id);
        };

        this.abrirModal('modalEditarUsuario');
    }

    salvarEdicaoUsuario(usuarioId) {
        const nome = document.getElementById('editarNome').value.trim();
        const email = document.getElementById('editarEmail').value.trim();
        const tipo = document.getElementById('editarTipo').value;
        const ativo = document.getElementById('editarAtivo').checked;

        if (!nome || !email) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!Validacoes.validarEmail(email)) {
            mensagens.erro('Por favor, insira um e-mail válido.');
            return;
        }

        const dadosAtualizados = {
            nome,
            email,
            tipo,
            ativo
        };

        if (sistemaAuth.atualizarUsuario(usuarioId, dadosAtualizados)) {
            mensagens.sucesso('Usuário atualizado com sucesso!');
            this.fecharModal('modalEditarUsuario');
            this.carregarTabelaUsuarios();
        } else {
            mensagens.erro('Erro ao atualizar usuário.');
        }
    }

    alterarStatusUsuario(usuarioId) {
        const novoStatus = sistemaAuth.alternarStatusUsuario(usuarioId);
        const usuario = sistemaAuth.obterUsuarioPorId(usuarioId);
        
        if (usuario) {
            mensagens.sucesso(`Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`);
            this.carregarTabelaUsuarios();
        }
    }

    // ========== EMPRÉSTIMOS ==========
    carregarPainelEmprestimos() {
        const container = document.getElementById('conteudoEmprestimos');
        if (!container) return;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo');
        const emprestimosPendentes = emprestimos.filter(e => e.status === 'pendente');
        const emprestimosAtrasados = emprestimos.filter(e => {
            if (e.status !== 'ativo') return false;
            const dataDevolucao = new Date(e.dataDevolucaoPrevista);
            return dataDevolucao < new Date();
        });

        container.innerHTML = `
            <div class="estatisticas-emprestimos">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-hand-holding"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${emprestimosAtivos.length}</span>
                        <span class="estatistica-rotulo">Empréstimos Ativos</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${emprestimosAtrasados.length}</span>
                        <span class="estatistica-rotulo">Em Atraso</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${emprestimosPendentes.length}</span>
                        <span class="estatistica-rotulo">Pendentes</span>
                    </div>
                </div>
            </div>

            <div class="controles-painel">
                <div class="campo-pesquisa-admin">
                    <input type="text" id="filtroEmprestimosAdmin" placeholder="Filtrar empréstimos...">
                    <i class="fas fa-search"></i>
                </div>
            </div>

            <div class="lista-emprestimos-admin">
                ${this.criarListaEmprestimos(emprestimos)}
            </div>
        `;
    }

    criarListaEmprestimos(emprestimos) {
        if (emprestimos.length === 0) {
            return '<p class="sem-dados">Nenhum empréstimo encontrado.</p>';
        }

        // Aplicar filtro
        if (this.filtroEmprestimos) {
            emprestimos = emprestimos.filter(emp => 
                emp.usuarioNome.toLowerCase().includes(this.filtroEmprestimos) ||
                emp.livroTitulo.toLowerCase().includes(this.filtroEmprestimos)
            );
        }

        return emprestimos.map(emprestimo => this.criarItemEmprestimo(emprestimo)).join('');
    }

    criarItemEmprestimo(emprestimo) {
        const isAtrasado = new Date(emprestimo.dataDevolucaoPrevista) < new Date();
        const isPendente = emprestimo.status === 'pendente';
        
        return `
            <div class="emprestimo-item ${isAtrasado ? 'atrasado' : ''} ${isPendente ? 'pendente' : ''}">
                <div class="emprestimo-cabecalho">
                    <div>
                        <span class="emprestimo-livro">${emprestimo.livroTitulo}</span>
                        <div class="emprestimo-usuario">
                            <strong>${emprestimo.usuarioNome}</strong> • 
                            Emprestado em: ${UtilitariosData.formatarData(emprestimo.dataEmprestimo)}
                        </div>
                    </div>
                    <span class="emprestimo-status ${isAtrasado ? 'status-atrasado' : emprestimo.status}">
                        ${isAtrasado ? 'Atrasado' : emprestimo.status === 'ativo' ? 'Ativo' : 'Pendente'}
                    </span>
                </div>
                <div class="emprestimo-datas">
                    <div class="data-item">
                        <span class="data-rotulo">Data de Devolução:</span>
                        <span class="data-valor ${isAtrasado ? 'texto-atrasado' : ''}">
                            ${UtilitariosData.formatarData(emprestimo.dataDevolucaoPrevista)}
                        </span>
                    </div>
                    ${emprestimo.dataDevolucao ? `
                    <div class="data-item">
                        <span class="data-rotulo">Devolvido em:</span>
                        <span class="data-valor">${UtilitariosData.formatarData(emprestimo.dataDevolucao)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="emprestimo-acoes">
                    ${emprestimo.status === 'pendente' ? `
                        <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.aprovarEmprestimo('${emprestimo.id}')">
                            <i class="fas fa-check"></i>
                            Aprovar
                        </button>
                        <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.recusarEmprestimo('${emprestimo.id}')">
                            <i class="fas fa-times"></i>
                            Recusar
                        </button>
                    ` : emprestimo.status === 'ativo' ? `
                        <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.registrarDevolucao('${emprestimo.id}')">
                            <i class="fas fa-check"></i>
                            Registrar Devolução
                        </button>
                        ${isAtrasado ? `
                            <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.enviarLembrete('${emprestimo.id}')">
                                <i class="fas fa-bell"></i>
                                Enviar Lembrete
                            </button>
                        ` : ''}
                    ` : ''}
                </div>
            </div>
        `;
    }

    aprovarEmprestimo(emprestimoId) {
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoIndex = emprestimos.findIndex(e => e.id === emprestimoId);
        
        if (emprestimoIndex !== -1) {
            emprestimos[emprestimoIndex].status = 'ativo';
            ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);
            
            // Atualizar estoque do livro
            const livro = sistemaLivros.livros.find(l => l.id === emprestimos[emprestimoIndex].livroId);
            if (livro) {
                livro.estoque = Math.max(0, livro.estoque - 1);
                livro.disponivel = livro.estoque > 0;
                livro.vezesEmprestado++;
                ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
            }
            
            mensagens.sucesso('Empréstimo aprovado com sucesso!');
            this.carregarPainelEmprestimos();
        }
    }

    recusarEmprestimo(emprestimoId) {
        if (confirm('Tem certeza que deseja recusar este empréstimo?')) {
            const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
            const emprestimoIndex = emprestimos.findIndex(e => e.id === emprestimoId);
            
            if (emprestimoIndex !== -1) {
                emprestimos.splice(emprestimoIndex, 1);
                ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);
                
                mensagens.info('Empréstimo recusado.');
                this.carregarPainelEmprestimos();
            }
        }
    }

    registrarDevolucao(emprestimoId) {
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoIndex = emprestimos.findIndex(e => e.id === emprestimoId);
        
        if (emprestimoIndex !== -1) {
            emprestimos[emprestimoIndex].status = 'devolvido';
            emprestimos[emprestimoIndex].dataDevolucao = new Date().toISOString();
            ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);
            
            // Restaurar estoque do livro
            const livro = sistemaLivros.livros.find(l => l.id === emprestimos[emprestimoIndex].livroId);
            if (livro) {
                livro.estoque++;
                livro.disponivel = true;
                ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
            }
            
            mensagens.sucesso('Devolução registrada com sucesso!');
            this.carregarPainelEmprestimos();
        }
    }

    enviarLembrete(emprestimoId) {
        mensagens.info('Lembrete enviado para o usuário.');
    }

    // ========== COMENTÁRIOS ==========
    carregarPainelComentarios() {
        const container = document.getElementById('conteudoComentarios');
        if (!container) return;

        const comentariosPendentes = sistemaComentarios.getComentariosPendentes();
        const comentariosAprovados = sistemaComentarios.comentarios.filter(c => c.aprovado);

        container.innerHTML = `
            <div class="estatisticas-comentarios">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${comentariosPendentes.length}</span>
                        <span class="estatistica-rotulo">Comentários Pendentes</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${comentariosAprovados.length}</span>
                        <span class="estatistica-rotulo">Comentários Aprovados</span>
                    </div>
                </div>
            </div>

            <div class="secao-comentarios">
                <h4>Comentários Pendentes de Aprovação</h4>
                <div class="lista-comentarios-admin">
                    ${comentariosPendentes.length > 0 ? 
                        comentariosPendentes.map(comentario => this.criarItemComentario(comentario)).join('')
                        : '<p class="sem-dados">Nenhum comentário pendente de aprovação.</p>'
                    }
                </div>
            </div>
        `;
    }

    criarItemComentario(comentario) {
        const livro = sistemaLivros.livros.find(l => l.id === comentario.livroId);
        const livroTitulo = livro ? livro.titulo : 'Livro não encontrado';
        
        return `
            <div class="comentario-pendente">
                <div class="comentario-cabecalho">
                    <div>
                        <span class="comentario-usuario">${comentario.usuarioNome}</span>
                        <div class="comentario-livro">Livro: ${livroTitulo}</div>
                        <div class="comentario-estrelas">
                            ${sistemaLivros.gerarEstrelas(comentario.avaliacao)}
                        </div>
                    </div>
                    <span class="comentario-data">${UtilitariosData.formatarData(comentario.data)}</span>
                </div>
                <div class="comentario-texto">
                    ${comentario.comentario}
                </div>
                <div class="comentario-acoes">
                    <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.aprovarComentario('${comentario.id}')">
                        <i class="fas fa-check"></i>
                        Aprovar
                    </button>
                    <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.rejeitarComentario('${comentario.id}')">
                        <i class="fas fa-times"></i>
                        Rejeitar
                    </button>
                </div>
            </div>
        `;
    }

    aprovarComentario(comentarioId) {
        if (sistemaComentarios.aprovarComentario(comentarioId)) {
            mensagens.sucesso('Comentário aprovado com sucesso!');
            this.carregarPainelComentarios();
        }
    }

    rejeitarComentario(comentarioId) {
        if (confirm('Tem certeza que deseja rejeitar este comentário?')) {
            if (sistemaComentarios.rejeitarComentario(comentarioId)) {
                mensagens.info('Comentário rejeitado.');
                this.carregarPainelComentarios();
            }
        }
    }

    // ========== AGENDAMENTOS ==========
    carregarPainelAgendamentos() {
        const container = document.getElementById('conteudoAgendamentos');
        if (!container) return;

        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentosAtivos = agendamentos.filter(a => a.status === 'agendado');
        const agendamentosConcluidos = agendamentos.filter(a => a.status === 'retirado');

        container.innerHTML = `
            <div class="estatisticas-agendamentos">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${agendamentosAtivos.length}</span>
                        <span class="estatistica-rotulo">Agendamentos Ativos</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${agendamentosConcluidos.length}</span>
                        <span class="estatistica-rotulo">Concluídos</span>
                    </div>
                </div>
            </div>

            <div class="lista-agendamentos-admin">
                ${agendamentosAtivos.length > 0 ? 
                    agendamentosAtivos.map(agendamento => this.criarItemAgendamento(agendamento)).join('')
                    : '<p class="sem-dados">Nenhum agendamento ativo no momento.</p>'
                }
            </div>
        `;
    }

    criarItemAgendamento(agendamento) {
        const isVencendo = this.isAgendamentoVencendo(agendamento);
        
        return `
            <div class="agendamento-item ${isVencendo ? 'vencendo' : ''}">
                <div class="agendamento-cabecalho">
                    <div>
                        <span class="agendamento-livro">${agendamento.livroTitulo}</span>
                        <div class="agendamento-usuario">
                            <strong>${agendamento.usuarioNome}</strong> • 
                            Agendado em: ${UtilitariosData.formatarData(agendamento.dataAgendamento)}
                        </div>
                    </div>
                    <span class="agendamento-status ${isVencendo ? 'status-aviso' : 'status-info'}">
                        ${isVencendo ? 'Vencendo' : 'Ativo'}
                    </span>
                </div>
                <div class="agendamento-datas">
                    <div class="data-item">
                        <span class="data-rotulo">Retirar até:</span>
                        <span class="data-valor ${isVencendo ? 'texto-aviso' : ''}">
                            ${UtilitariosData.formatarData(agendamento.dataRetiradaPrevista)}
                        </span>
                    </div>
                    <div class="data-item">
                        <span class="data-rotulo">Local:</span>
                        <span class="data-valor">${agendamento.local}</span>
                    </div>
                </div>
                <div class="agendamento-acoes">
                    <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.confirmarRetiradaAgendamento('${agendamento.id}')">
                        <i class="fas fa-check"></i>
                        Confirmar Retirada
                    </button>
                    <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.cancelarAgendamentoAdmin('${agendamento.id}')">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `;
    }

    isAgendamentoVencendo(agendamento) {
        const hoje = new Date();
        const dataRetirada = new Date(agendamento.dataRetiradaPrevista);
        const diferencaDias = (dataRetirada - hoje) / (1000 * 60 * 60 * 24);
        return diferencaDias <= 2 && diferencaDias > 0;
    }

    confirmarRetiradaAgendamento(agendamentoId) {
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentoIndex = agendamentos.findIndex(a => a.id === agendamentoId);
        
        if (agendamentoIndex !== -1) {
            agendamentos[agendamentoIndex].status = 'retirado';
            agendamentos[agendamentoIndex].dataRetirada = new Date().toISOString();
            ArmazenamentoLocal.salvar('biblioteca_agendamentos', agendamentos);
            
            mensagens.sucesso('Retirada confirmada com sucesso!');
            this.carregarPainelAgendamentos();
        }
    }

    cancelarAgendamentoAdmin(agendamentoId) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
            const agendamentoIndex = agendamentos.findIndex(a => a.id === agendamentoId);
            
            if (agendamentoIndex !== -1) {
                agendamentos.splice(agendamentoIndex, 1);
                ArmazenamentoLocal.salvar('biblioteca_agendamentos', agendamentos);
                
                mensagens.info('Agendamento cancelado.');
                this.carregarPainelAgendamentos();
            }
        }
    }

    // ========== RELATÓRIOS ==========
    carregarPainelRelatorios() {
        const container = document.getElementById('conteudoRelatorios');
        if (!container) return;

        container.innerHTML = `
            <div class="relatorios-grid">
                <div class="relatorio-card">
                    <h4><i class="fas fa-file-export"></i> Relatório Completo</h4>
                    <p>Gere um relatório completo com todos os dados do sistema</p>
                    <button class="botao botao-primario" onclick="sistemaAdmin.gerarRelatorioCompleto()">
                        <i class="fas fa-download"></i>
                        Gerar Relatório
                    </button>
                </div>
                <div class="relatorio-card">
                    <h4><i class="fas fa-book"></i> Relatório de Livros</h4>
                    <p>Relatório específico sobre o acervo de livros</p>
                    <button class="botao botao-secundario" onclick="sistemaAdmin.gerarRelatorioLivros()">
                        <i class="fas fa-download"></i>
                        Gerar Relatório
                    </button>
                </div>
                <div class="relatorio-card">
                    <h4><i class="fas fa-users"></i> Relatório de Usuários</h4>
                    <p>Relatório sobre usuários e suas atividades</p>
                    <button class="botao botao-secundario" onclick="sistemaAdmin.gerarRelatorioUsuarios()">
                        <i class="fas fa-download"></i>
                        Gerar Relatório
                    </button>
                </div>
                <div class="relatorio-card">
                    <h4><i class="fas fa-chart-bar"></i> Estatísticas Detalhadas</h4>
                    <p>Visualize métricas detalhadas do sistema</p>
                    <button class="botao botao-primario" onclick="sistemaAdmin.mostrarEstatisticas()">
                        <i class="fas fa-chart-line"></i>
                        Ver Estatísticas
                    </button>
                </div>
            </div>
        `;
    }

    gerarRelatorioCompleto() {
        const dados = {
            sistema: 'Biblioteca CESF Online',
            dataGeracao: new Date().toISOString(),
            versao: '2.0',
            estatisticas: {
                livros: sistemaLivros.getEstatisticas(),
                usuarios: sistemaAuth.obterTodosUsuarios().length,
                emprestimos: ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [],
                agendamentos: ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [],
                comentarios: sistemaComentarios.comentarios.length
            },
            livros: sistemaLivros.livros,
            usuarios: sistemaAuth.obterTodosUsuarios()
        };

        this.exportarJSON(dados, 'relatorio-completo-biblioteca');
        mensagens.sucesso('Relatório completo gerado com sucesso!');
    }

    gerarRelatorioLivros() {
        const dados = {
            tipo: 'relatorio-livros',
            dataGeracao: new Date().toISOString(),
            livros: sistemaLivros.livros,
            estatisticas: sistemaLivros.getEstatisticas()
        };

        this.exportarJSON(dados, 'relatorio-livros');
        mensagens.sucesso('Relatório de livros gerado com sucesso!');
    }

    gerarRelatorioUsuarios() {
        const dados = {
            tipo: 'relatorio-usuarios',
            dataGeracao: new Date().toISOString(),
            usuarios: sistemaAuth.obterTodosUsuarios(),
            totalUsuarios: sistemaAuth.obterTodosUsuarios().length
        };

        this.exportarJSON(dados, 'relatorio-usuarios');
        mensagens.sucesso('Relatório de usuários gerado com sucesso!');
    }

    exportarJSON(dados, nomeArquivo) {
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nomeArquivo}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    mostrarEstatisticas() {
        const estatisticas = sistemaLivros.getEstatisticas();
        const usuarios = sistemaAuth.obterTodosUsuarios();
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        
        let html = `
            <div class="estatisticas-detalhadas">
                <h3>Estatísticas Detalhadas do Sistema</h3>
                <div class="estatisticas-grid">
                    <div class="estatistica-detalhada">
                        <h4>📊 Acervo</h4>
                        <p>Total de Livros: <strong>${estatisticas.totalLivros}</strong></p>
                        <p>Disponíveis: <strong>${estatisticas.livrosDisponiveis}</strong></p>
                        <p>Indisponíveis: <strong>${estatisticas.totalLivros - estatisticas.livrosDisponiveis}</strong></p>
                    </div>
                    <div class="estatistica-detalhada">
                        <h4>👥 Usuários</h4>
                        <p>Total: <strong>${usuarios.length}</strong></p>
                        <p>Administradores: <strong>${usuarios.filter(u => u.tipo === 'admin').length}</strong></p>
                        <p>Usuários Comuns: <strong>${usuarios.filter(u => u.tipo === 'usuario').length}</strong></p>
                    </div>
                    <div class="estatistica-detalhada">
                        <h4>📚 Empréstimos</h4>
                        <p>Total Realizados: <strong>${estatisticas.totalEmprestimos}</strong></p>
                        <p>Ativos: <strong>${emprestimos.filter(e => e.status === 'ativo').length}</strong></p>
                        <p>Pendentes: <strong>${emprestimos.filter(e => e.status === 'pendente').length}</strong></p>
                    </div>
                </div>
            </div>
        `;

        // Criar modal para estatísticas
        let modal = document.getElementById('modalEstatisticas');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalEstatisticas';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-conteudo modal-grande">
                <div class="modal-cabecalho">
                    <h2>Estatísticas Detalhadas</h2>
                    <button class="fechar-modal" onclick="fecharModal('modalEstatisticas')">&times;</button>
                </div>
                <div class="modal-corpo">
                    ${html}
                </div>
            </div>
        `;

        this.abrirModal('modalEstatisticas');
    }

    // ========== CONFIGURAÇÕES ==========
    carregarPainelConfiguracoes() {
        const container = document.getElementById('conteudoConfiguracoes');
        if (!container) return;

        container.innerHTML = `
            <div class="configuracoes-grid">
                <div class="configuracao-card">
                    <h4><i class="fas fa-book"></i> Configurações de Livros</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaAdmin.gerarRelatorioLivros()">
                            <i class="fas fa-file-export"></i>
                            Gerar Relatório de Livros
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.limparDadosLivros()">
                            <i class="fas fa-trash"></i>
                            Limpar Dados de Teste
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-users"></i> Configurações de Usuários</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaAdmin.gerarRelatorioUsuarios()">
                            <i class="fas fa-file-export"></i>
                            Gerar Relatório de Usuários
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.resetarSenhas()">
                            <i class="fas fa-key"></i>
                            Resetar Senhas Padrão
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-database"></i> Backup do Sistema</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaAdmin.fazerBackup()">
                            <i class="fas fa-download"></i>
                            Fazer Backup Completo
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.restaurarBackup()">
                            <i class="fas fa-upload"></i>
                            Restaurar Backup
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-cog"></i> Configurações Gerais</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaAdmin.limparCache()">
                            <i class="fas fa-broom"></i>
                            Limpar Cache do Sistema
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.reiniciarSistema()">
                            <i class="fas fa-redo"></i>
                            Reiniciar Sistema
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    fazerBackup() {
        const dados = {
            livros: sistemaLivros.livros,
            usuarios: sistemaAuth.usuarios,
            emprestimos: ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [],
            comentarios: sistemaComentarios.comentarios,
            favoritos: ArmazenamentoLocal.carregar('biblioteca_favoritos') || [],
            agendamentos: ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [],
            dataBackup: new Date().toISOString(),
            versao: '2.0'
        };

        this.exportarJSON(dados, 'backup-biblioteca');
        
        sistemaNotificacoes.adicionar(
            'Backup Realizado',
            'Backup do sistema realizado com sucesso!',
            'sucesso'
        );
        
        mensagens.sucesso('Backup realizado com sucesso!');
    }

    limparCache() {
        if (confirm('Tem certeza que deseja limpar o cache do sistema?')) {
            ArmazenamentoLocal.limparDadosTemporarios();
            mensagens.sucesso('Cache limpo com sucesso!');
        }
    }

    reiniciarSistema() {
        if (confirm('Tem certeza que deseja reiniciar o sistema? Isso irá recarregar a página.')) {
            location.reload();
        }
    }

    // ========== UTILITÁRIOS ==========
    ordenarTabela(campo) {
        if (!this.ordenacao[campo]) {
            this.ordenacao[campo] = 'asc';
        } else if (this.ordenacao[campo] === 'asc') {
            this.ordenacao[campo] = 'desc';
        } else {
            delete this.ordenacao[campo];
        }

        // Implementar lógica de ordenação específica
        this.carregarTabelaLivros();
    }

    ordenarDados(dados, campo, direcao) {
        return dados.sort((a, b) => {
            let valorA = a[campo];
            let valorB = b[campo];

            if (typeof valorA === 'string') {
                valorA = valorA.toLowerCase();
                valorB = valorB.toLowerCase();
            }

            if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
            if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
            return 0;
        });
    }

    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
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

    // Métodos placeholder para funcionalidades futuras
    limparDadosLivros() {
        mensagens.info('Funcionalidade de limpeza de dados em desenvolvimento...');
    }

    resetarSenhas() {
        mensagens.info('Funcionalidade de reset de senhas em desenvolvimento...');
    }

    restaurarBackup() {
        mensagens.info('Funcionalidade de restauração de backup em desenvolvimento...');
    }

    carregarPainelReservas() {
        const container = document.getElementById('conteudoReservas');
        if (container) {
            container.innerHTML = '<p class="sem-dados">Sistema de reservas em desenvolvimento...</p>';
        }
    }
}

// Inicializar sistema administrativo
const sistemaAdmin = new SistemaAdministrativo();

// Funções globais para eventos do HTML
function abrirPainelAdmin(painel) {
    sistemaAdmin.abrirPainelAdmin(painel);
}

function gerarRelatorio() {
    sistemaAdmin.gerarRelatorioCompleto();
}

function fazerBackup() {
    sistemaAdmin.fazerBackup();
}

function limparFormularioLivro() {
    sistemaAdmin.limparFormularioLivro();
}