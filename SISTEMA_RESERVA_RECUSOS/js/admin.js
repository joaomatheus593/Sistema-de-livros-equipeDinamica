class SistemaAdministrativo {
    constructor() {
        this.painelAtual = 'dashboard';
        this.filtroLivros = '';
        this.filtroUsuarios = '';
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Formulário de adicionar livro
        const formAdicionarLivro = document.getElementById('formAdicionarLivro');
        if (formAdicionarLivro) {
            formAdicionarLivro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarLivro();
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
                this.carregarPainelUsuarios();
            }
        });

        // Carregar dados quando a área admin for acessada
        if (sistemaAuth.isAdmin()) {
            this.carregarDadosDashboard();
        }
    }

    mostrarAreaAdmin() {
        document.getElementById('areaAdministrativa').style.display = 'block';
        this.carregarDadosDashboard();
        
        // Scroll suave para a área administrativa
        setTimeout(() => {
            document.getElementById('areaAdministrativa').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    abrirPainelAdmin(painel) {
        console.log('Abrindo painel:', painel);
        
        // Esconder todos os painéis com animação
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
    
        // Remover classe ativa de todos os itens do menu
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
            console.error('Painel não encontrado:', painelId);
            mensagens.erro(`Painel "${painel}" não encontrado.`);
            return;
        }
    
        // Ativar item do menu
        const itemMenu = document.querySelector(`.item-menu[data-painel="${painel}"]`);
        if (itemMenu) {
            itemMenu.classList.add('ativo');
        }
    
        this.painelAtual = painel;
    
        // Carregar dados específicos do painel
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
    
    carregarDadosPainel(painel) {
        console.log('Carregando dados para painel:', painel);
        
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
                this.carregarPainelUsuarios();
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
            default:
                console.log('Painel sem carregamento específico:', painel);
        }
    }

    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    carregarDadosDashboard() {
        if (!sistemaAuth.isAdmin()) return;

        // Estatísticas básicas
        const totalLivros = sistemaLivros.getTotalLivros();
        const livrosDisponiveis = sistemaLivros.getLivrosDisponiveis();
        
        const usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios') || [];
        const totalUsuarios = usuarios.length;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo').length;
        
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const reservasPendentes = reservas.filter(r => r.status === 'pendente').length;

        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentosAtivos = agendamentos.filter(a => a.status === 'agendado').length;

        // Atualizar elementos
        this.atualizarElemento('totalLivrosAdmin', totalLivros);
        this.atualizarElemento('totalUsuariosAdmin', totalUsuarios);
        this.atualizarElemento('totalEmprestimosAdmin', emprestimosAtivos);
        this.atualizarElemento('totalReservasAdmin', reservasPendentes);
        this.atualizarElemento('totalAgendamentosAdmin', agendamentosAtivos);

        // Carregar gráficos
        this.carregarGraficoGeneros();
        this.carregarGraficoEmprestimos();
        this.carregarAlertas();
        this.carregarAtividadesRecentes();
    }

    atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Animação de contagem
            this.animarContagem(elemento, parseInt(elemento.textContent) || 0, valor);
        }
    }

    animarContagem(elemento, inicio, fim) {
        const duracao = 1000; // 1 segundo
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
            elemento.textContent = Math.round(atual);
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

        // Criar gráfico de barras simples
        let html = '<div class="grafico-barras-container">';
        
        const maxQuantidade = Math.max(...quantidades);
        
        generos.forEach((genero, index) => {
            const porcentagem = (quantidades[index] / maxQuantidade) * 100;
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            
            html += `
                <div class="barra-genero">
                    <div class="barra-rotulo">${nomeGenero}</div>
                    <div class="barra-container">
                        <div class="barra" style="width: ${porcentagem}%; background-color: ${this.obterCorGenero(index)};"></div>
                        <div class="barra-valor">${quantidades[index]}</div>
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
            meses.push(mes);
            emprestimosPorMes[mes] = 0;
        }

        // Contar empréstimos por mês
        emprestimos.forEach(emp => {
            const data = new Date(emp.dataEmprestimo);
            const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
            if (meses.includes(mes)) {
                emprestimosPorMes[mes]++;
            }
        });

        const maxEmprestimos = Math.max(...Object.values(emprestimosPorMes)) || 1;

        container.innerHTML = `
            <div class="grafico-barras-vertical">
                <div class="barras-container" style="height: 150px; display: flex; align-items: end; gap: 15px; justify-content: center; margin-top: 20px;">
                    ${meses.map(mes => {
                        const quantidade = emprestimosPorMes[mes];
                        const altura = (quantidade / maxEmprestimos) * 100;
                        return `
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="background: var(--vinho-principal); width: 30px; height: ${altura}%; border-radius: 4px 4px 0 0; transition: height 0.5s ease;"></div>
                                <span style="font-size: 12px; margin-top: 5px;">${mes}</span>
                                <span style="font-size: 10px; font-weight: 600;">${quantidade}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    carregarAlertas() {
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

        // Alertas de agendamentos próximos do vencimento
        const agendamentosVencendo = agendamentos.filter(a => {
            if (a.status !== 'agendado') return false;
            const dataRetirada = new Date(a.dataRetiradaPrevista);
            const diferencaDias = (dataRetirada - hoje) / (1000 * 60 * 60 * 24);
            return diferencaDias <= 2 && diferencaDias > 0;
        });

        if (agendamentosVencendo.length > 0) {
            alertas.push({
                tipo: 'aviso',
                mensagem: `${agendamentosVencendo.length} agendamento(s) próximos do vencimento`,
                icone: 'fa-calendar-exclamation',
                acao: () => this.abrirPainelAdmin('agendamentos')
            });
        }

        if (alertas.length === 0) {
            container.innerHTML = '<div class="alerta-item info"><i class="fas fa-check-circle"></i><span>Nenhum alerta no momento. Sistema funcionando normalmente.</span></div>';
            return;
        }

        container.innerHTML = alertas.map(alerta => `
            <div class="alerta-item ${alerta.tipo}" onclick="${alerta.acao ? `sistemaAdmin.${alerta.acao.name}('${alerta.acao.length > 0 ? alerta.acao.arguments[0] : ''}')` : ''}" style="${alerta.acao ? 'cursor: pointer;' : ''}">
                <i class="fas ${alerta.icone}"></i>
                <span>${alerta.mensagem}</span>
                ${alerta.acao ? '<i class="fas fa-chevron-right" style="margin-left: auto;"></i>' : ''}
            </div>
        `).join('');
    }

    carregarAtividadesRecentes() {
        const container = document.getElementById('atividadesRecentes');
        if (!container) return;

        const atividades = [];
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];

        // Últimos empréstimos
        const ultimosEmprestimos = emprestimos
            .sort((a, b) => new Date(b.dataEmprestimo) - new Date(a.dataEmprestimo))
            .slice(0, 5);

        ultimosEmprestimos.forEach(emp => {
            atividades.push({
                tipo: 'emprestimo',
                mensagem: `${emp.usuarioNome} pegou "${emp.livroTitulo}" emprestado`,
                data: emp.dataEmprestimo,
                icone: 'fa-hand-holding'
            });
        });

        // Últimas reservas
        const ultimasReservas = reservas
            .sort((a, b) => new Date(b.dataReserva) - new Date(a.dataReserva))
            .slice(0, 3);

        ultimasReservas.forEach(res => {
            atividades.push({
                tipo: 'reserva',
                mensagem: `${res.usuarioNome} reservou um livro`,
                data: res.dataReserva,
                icone: 'fa-bookmark'
            });
        });

        // Últimos agendamentos
        const ultimosAgendamentos = agendamentos
            .sort((a, b) => new Date(b.dataAgendamento) - new Date(a.dataAgendamento))
            .slice(0, 3);

        ultimosAgendamentos.forEach(ag => {
            atividades.push({
                tipo: 'agendamento',
                mensagem: `${ag.usuarioNome} agendou retirada de "${ag.livroTitulo}"`,
                data: ag.dataAgendamento,
                icone: 'fa-calendar-check'
            });
        });

        // Ordenar por data e pegar as 8 mais recentes
        atividades.sort((a, b) => new Date(b.data) - new Date(a.data));
        const atividadesRecentes = atividades.slice(0, 8);

        if (atividadesRecentes.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhuma atividade recente.</p>';
            return;
        }

        container.innerHTML = atividadesRecentes.map(atividade => `
            <div class="atividade-item">
                <i class="fas ${atividade.icone}"></i>
                <div class="atividade-info">
                    <span class="atividade-mensagem">${atividade.mensagem}</span>
                    <span class="atividade-data">${UtilitariosData.formatarData(atividade.data)}</span>
                </div>
            </div>
        `).join('');
    }

    carregarTabelaLivros() {
        const tbody = document.getElementById('tabelaLivrosBody');
        if (!tbody) return;

        let livros = sistemaLivros.livros;

        // Aplicar filtro se existir
        if (this.filtroLivros) {
            livros = livros.filter(livro => 
                livro.titulo.toLowerCase().includes(this.filtroLivros) ||
                livro.autor.toLowerCase().includes(this.filtroLivros) ||
                livro.genero.toLowerCase().includes(this.filtroLivros) ||
                livro.isbn.toLowerCase().includes(this.filtroLivros)
            );
        }

        if (livros.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="sem-dados">
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
                            <img src="${livro.imagem}" alt="${livro.titulo}" class="livro-miniatura">
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
                    <td>${livro.avaliacao.toFixed(1)} ⭐</td>
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
    }

    visualizarLivroAdmin(livroId) {
        sistemaLivros.abrirDetalhesLivro(livroId);
    }

    adicionarLivro() {
        const form = document.getElementById('formAdicionarLivro');
        
        // Verificar se está em modo de edição
        if (form.dataset.editando) {
            this.salvarEdicaoLivro(form.dataset.editando);
            return;
        }

        // Coletar dados do formulário
        const dadosLivro = {
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: parseInt(document.getElementById('anoLivro').value),
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            descricao: document.getElementById('descricaoLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            estoque: parseInt(document.getElementById('estoqueLivro').value),
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            restricaoIdade: parseInt(document.getElementById('restricaoIdade').value) || 0,
            tags: document.getElementById('tagsLivro').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        // Validar e adicionar
        if (sistemaLivros.adicionarLivro(dadosLivro)) {
            this.limparFormularioLivro();
            this.carregarTabelaLivros();
            sistemaLivros.carregarDestaques();
            sistemaLivros.aplicarFiltros();
            
            // Voltar para o painel de gerenciamento
            this.abrirPainelAdmin('livros');
        }
    }

    editarLivro(livroId) {
        const livro = sistemaLivros.livros.find(l => l.id === livroId);
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        // Preencher formulário com dados do livro
        document.getElementById('tituloLivro').value = livro.titulo;
        document.getElementById('autorLivro').value = livro.autor;
        document.getElementById('generoLivro').value = livro.genero;
        document.getElementById('anoLivro').value = livro.ano;
        document.getElementById('editoraLivro').value = livro.editora;
        document.getElementById('paginasLivro').value = livro.paginas;
        document.getElementById('descricaoLivro').value = livro.descricao;
        document.getElementById('imagemLivro').value = livro.imagem;
        document.getElementById('estoqueLivro').value = livro.estoque;
        document.getElementById('valorEmprestimo').value = livro.valorEmprestimo;
        document.getElementById('taxaJuros').value = livro.taxaJuros;
        document.getElementById('prazoEmprestimo').value = livro.prazoEmprestimo;
        document.getElementById('restricaoIdade').value = livro.restricaoIdade;
        document.getElementById('tagsLivro').value = livro.tags ? livro.tags.join(', ') : '';

        // Alterar comportamento do formulário para edição
        const form = document.getElementById('formAdicionarLivro');
        const botaoSubmit = form.querySelector('button[type="submit"]');
        
        form.dataset.editando = livroId;
        botaoSubmit.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';

        // Ir para o painel de adicionar livro
        this.abrirPainelAdmin('adicionar-livro');
        
        mensagens.info(`Editando livro: "${livro.titulo}"`);
    }

    salvarEdicaoLivro(livroId) {
        const livroIndex = sistemaLivros.livros.findIndex(l => l.id === livroId);
        if (livroIndex === -1) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        // Coletar dados atualizados
        const dadosAtualizados = {
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: parseInt(document.getElementById('anoLivro').value),
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            descricao: document.getElementById('descricaoLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || sistemaLivros.livros[livroIndex].imagem,
            estoque: parseInt(document.getElementById('estoqueLivro').value),
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            restricaoIdade: parseInt(document.getElementById('restricaoIdade').value) || 0,
            tags: document.getElementById('tagsLivro').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        // Validar dados
        if (!sistemaLivros.validarLivro(dadosAtualizados)) {
            return;
        }

        // Atualizar livro mantendo dados imutáveis
        sistemaLivros.livros[livroIndex] = {
            ...sistemaLivros.livros[livroIndex],
            ...dadosAtualizados,
            disponivel: dadosAtualizados.estoque > 0
        };

        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        // Restaurar formulário para adição
        this.limparFormularioLivro();
        
        mensagens.sucesso(`Livro "${sistemaLivros.livros[livroIndex].titulo}" atualizado com sucesso!`);
        
        // Atualizar interfaces
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
        
        // Voltar para o painel de gerenciamento
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
        
        // Verificar se há empréstimos ativos para este livro
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.livroId === livroId && e.status === 'ativo');
        
        if (emprestimosAtivos.length > 0) {
            mensagens.erro('Não é possível excluir este livro pois existem empréstimos ativos.');
            return;
        }

        // Remover livro com animação
        const linha = document.querySelector(`[onclick*="${livroId}"]`).closest('tr');
        if (linha) {
            linha.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                sistemaLivros.livros.splice(livroIndex, 1);
                ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

                // Remover dados relacionados
                this.removerDadosRelacionados(livroId);

                mensagens.sucesso(`Livro "${livro.titulo}" excluído com sucesso!`);
                this.carregarTabelaLivros();
                sistemaLivros.carregarDestaques();
                sistemaLivros.aplicarFiltros();
            }, 300);
        }
    }

    removerDadosRelacionados(livroId) {
        // Remover comentários do livro
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
            botaoSubmit.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Livro';
        }
    }

    // ... (os métodos restantes para empréstimos, reservas, usuários, etc. serão similares mas melhorados)

    carregarPainelAgendamentos() {
        const container = document.getElementById('conteudoAgendamentos');
        if (!container) {
            console.error('Container de agendamentos não encontrado');
            return;
        }

        const agendamentos = ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
        const agendamentosAtivos = agendamentos.filter(a => a.status === 'agendado');

        container.innerHTML = `
            <div class="estatisticas-emprestimos">
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
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${agendamentos.filter(a => this.isAgendamentoVencendo(a)).length}</span>
                        <span class="estatistica-rotulo">Próximos do Vencimento</span>
                    </div>
                </div>
            </div>

            <div class="lista-agendamentos-admin">
                ${agendamentosAtivos.length > 0 ? 
                    agendamentosAtivos.map(agendamento => this.criarItemAgendamentoAdmin(agendamento)).join('')
                    : '<p class="sem-dados">Nenhum agendamento ativo no momento.</p>'
                }
            </div>
        `;
    }

    criarItemAgendamentoAdmin(agendamento) {
        const isVencendo = this.isAgendamentoVencendo(agendamento);
        
        return `
            <div class="agendamento-item ${isVencendo ? 'vencendo' : ''}">
                <div class="agendamento-cabecalho">
                    <div>
                        <span class="agendamento-livro">${agendamento.livroTitulo}</span>
                        <div class="agendamento-data">
                            Agendado por: ${agendamento.usuarioNome} • 
                            Data: ${UtilitariosData.formatarData(agendamento.dataAgendamento)}
                        </div>
                    </div>
                    <span class="agendamento-status ${isVencendo ? 'status-aviso' : 'status-info'}">
                        ${isVencendo ? 'Vencendo' : 'Ativo'}
                    </span>
                </div>
                <div class="agendamento-datas">
                    <div class="data-item">
                        <span class="data-rotulo">Retirar até:</span>
                        <span class="data-valor ${isVencendo ? 'texto-aviso' : ''}">${UtilitariosData.formatarData(agendamento.dataRetiradaPrevista)}</span>
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
        if (sistemaBibliotecaFisica.confirmarRetirada(agendamentoId)) {
            mensagens.sucesso('Retirada confirmada com sucesso!');
            this.carregarPainelAgendamentos();
        }
    }

    cancelarAgendamentoAdmin(agendamentoId) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            if (sistemaBibliotecaFisica.cancelarAgendamento(agendamentoId)) {
                mensagens.info('Agendamento cancelado.');
                this.carregarPainelAgendamentos();
            }
        }
    }

    // ... (implementar métodos similares para os outros painéis)

    fazerBackup() {
        const dados = {
            livros: sistemaLivros.livros,
            usuarios: ArmazenamentoLocal.carregar('biblioteca_usuarios'),
            emprestimos: ArmazenamentoLocal.carregar('biblioteca_emprestimos'),
            comentarios: sistemaComentarios.comentarios,
            favoritos: ArmazenamentoLocal.carregar('biblioteca_favoritos'),
            agendamentos: ArmazenamentoLocal.carregar('biblioteca_agendamentos'),
            notificacoes: sistemaNotificacoes.notificacoes,
            dataBackup: new Date().toISOString(),
            versao: '2.0'
        };

        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-biblioteca-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        sistemaNotificacoes.adicionar(
            'Backup Realizado',
            'Backup do sistema realizado com sucesso!',
            'sucesso'
        );
    }
}

// Inicializar sistema administrativo
const sistemaAdmin = new SistemaAdministrativo();

// Funções globais para eventos do HTML
function abrirPainelAdmin(painel) {
    sistemaAdmin.abrirPainelAdmin(painel);
}

function gerarRelatorio() {
    sistemaAdmin.gerarRelatorio();
}

function fazerBackup() {
    sistemaAdmin.fazerBackup();
}

function limparFormularioLivro() {
    sistemaAdmin.limparFormularioLivro();
}