class SistemaAdministrativo {
    constructor() {
        this.painelAtual = 'dashboard';
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

        // Carregar dados quando a área admin for acessada
        if (sistemaAuth.isAdmin()) {
            this.carregarDadosDashboard();
        }
    }

    mostrarAreaAdmin() {
        document.getElementById('areaAdministrativa').style.display = 'block';
        this.carregarDadosDashboard();
    }

    abrirPainelAdmin(painel) {
        console.log('Abrindo painel:', painel);
        
        // Esconder todos os painéis
        document.querySelectorAll('.painel-conteudo').forEach(p => {
            p.classList.remove('ativo');
            p.style.display = 'none';
        });
    
        // Remover classe ativa de todos os itens do menu
        document.querySelectorAll('.item-menu').forEach(item => {
            item.classList.remove('ativo');
        });
    
        // Mostrar painel selecionado
        const painelId = this.obterIdPainel(painel);
        const painelElement = document.getElementById(painelId);
        
        console.log('Procurando painel:', painelId, 'Elemento:', painelElement);
        
        if (painelElement) {
            painelElement.classList.add('ativo');
            painelElement.style.display = 'block';
            console.log('Painel encontrado e mostrado');
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
            'configuracoes': 'painelConfiguracoes'
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

        // Atualizar elementos
        this.atualizarElemento('totalLivrosAdmin', totalLivros);
        this.atualizarElemento('totalUsuariosAdmin', totalUsuarios);
        this.atualizarElemento('totalEmprestimosAdmin', emprestimosAtivos);
        this.atualizarElemento('totalReservasAdmin', reservasPendentes);

        // Carregar gráficos
        this.carregarGraficoGeneros();
        this.carregarGraficoEmprestimos();
        this.carregarAlertas();
    }

    atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    carregarGraficoGeneros() {
        const container = document.getElementById('graficoGeneros');
        if (!container) return;

        const livrosPorGenero = sistemaLivros.getLivrosPorGenero();
        const generos = Object.keys(livrosPorGenero);
        const quantidades = Object.values(livrosPorGenero);

        // Criar gráfico de barras simples (sem biblioteca externa)
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
            '#28a745', '#007bff', '#6f42c1', '#fd7e14'
        ];
        return cores[index % cores.length];
    }

    carregarGraficoEmprestimos() {
        const container = document.getElementById('graficoEmprestimos');
        if (!container) return;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        
        // Agrupar por mês (exemplo simplificado)
        const emprestimosPorMes = {};
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Inicializar todos os meses com 0
        meses.forEach(mes => {
            emprestimosPorMes[mes] = 0;
        });

        // Contar empréstimos por mês
        emprestimos.forEach(emp => {
            const data = new Date(emp.dataEmprestimo);
            const mes = meses[data.getMonth()];
            if (mes) {
                emprestimosPorMes[mes]++;
            }
        });

        container.innerHTML = `
            <div class="grafico-linha-simulacao">
                <p>Empréstimos nos últimos meses:</p>
                <div style="display: flex; align-items: flex-end; height: 150px; gap: 10px; margin-top: 20px; justify-content: center;">
                    ${meses.map(mes => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="background: var(--vinho-principal); width: 30px; height: ${emprestimosPorMes[mes] * 10}px; border-radius: 4px 4px 0 0;"></div>
                            <span style="font-size: 12px; margin-top: 5px;">${mes}</span>
                            <span style="font-size: 10px;">${emprestimosPorMes[mes]}</span>
                        </div>
                    `).join('')}
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

        // Alertas de estoque baixo
        const livrosEstoqueBaixo = livros.filter(l => l.estoque <= 2 && l.estoque > 0);
        livrosEstoqueBaixo.forEach(livro => {
            alertas.push({
                tipo: 'aviso',
                mensagem: `Estoque baixo: "${livro.titulo}" tem apenas ${livro.estoque} exemplar(es)`,
                icone: 'fa-exclamation-triangle'
            });
        });

        // Alertas de estoque zerado
        const livrosSemEstoque = livros.filter(l => l.estoque === 0);
        if (livrosSemEstoque.length > 0) {
            alertas.push({
                tipo: 'critico',
                mensagem: `${livrosSemEstoque.length} livro(s) sem estoque disponível`,
                icone: 'fa-times-circle'
            });
        }

        // Alertas de comentários pendentes
        if (comentariosPendentes > 0) {
            alertas.push({
                tipo: 'info',
                mensagem: `${comentariosPendentes} comentário(s) aguardando aprovação`,
                icone: 'fa-comments'
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
                icone: 'fa-clock'
            });
        }

        if (alertas.length === 0) {
            container.innerHTML = '<p class="sem-alertas">Nenhum alerta no momento. Sistema funcionando normalmente.</p>';
            return;
        }

        container.innerHTML = alertas.map(alerta => `
            <div class="alerta-item ${alerta.tipo}">
                <i class="fas ${alerta.icone}"></i>
                <span>${alerta.mensagem}</span>
            </div>
        `).join('');
    }

    carregarTabelaLivros() {
        const tbody = document.getElementById('tabelaLivrosBody');
        if (!tbody) return;

        const livros = sistemaLivros.livros;

        tbody.innerHTML = livros.map(livro => `
            <tr>
                <td>${Formatadores.limitarTexto(livro.titulo, 40)}</td>
                <td>${livro.autor}</td>
                <td>${sistemaLivros.obterNomeGenero(livro.genero)}</td>
                <td>${livro.ano}</td>
                <td>${livro.estoque}</td>
                <td>
                    <span class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </td>
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
        `).join('');
    }

    visualizarLivroAdmin(livroId) {
        // Usar o mesmo método do sistema de livros, mas garantir que não haja scroll
        const originalAbrirModal = sistemaLivros.abrirModal;
        sistemaLivros.abrirModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                // Não fazer scroll para o topo
            }
        };
        
        sistemaLivros.abrirDetalhesLivro(livroId);
        
        // Restaurar método original após um breve delay
        setTimeout(() => {
            sistemaLivros.abrirModal = originalAbrirModal;
        }, 100);
    }

    adicionarLivro() {
        const form = document.getElementById('formAdicionarLivro');
        
        // Verificar se está em modo de edição
        if (form.dataset.editando) {
            this.salvarEdicaoLivro(form.dataset.editando);
            return;
        }

        // Validar campos obrigatórios
        const camposObrigatorios = ['tituloLivro', 'autorLivro', 'generoLivro', 'anoLivro', 'editoraLivro', 'descricaoLivro', 'estoqueLivro'];
        for (let campo of camposObrigatorios) {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                mensagens.erro(`O campo ${campo.replace('Livro', '')} é obrigatório.`);
                elemento.focus();
                return;
            }
        }

        const ano = parseInt(document.getElementById('anoLivro').value);
        if (ano < 1000 || ano > new Date().getFullYear()) {
            mensagens.erro('Por favor, insira um ano válido.');
            document.getElementById('anoLivro').focus();
            return;
        }

        const novoLivro = {
            id: GeradorID.gerar(),
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: ano,
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            descricao: document.getElementById('descricaoLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            estoque: parseInt(document.getElementById('estoqueLivro').value),
            disponivel: parseInt(document.getElementById('estoqueLivro').value) > 0,
            isbn: GeradorID.gerarISBN(),
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0
        };

        // Adicionar ao sistema
        sistemaLivros.livros.push(novoLivro);
        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        mensagens.sucesso(`Livro "${novoLivro.titulo}" adicionado com sucesso!`);
        
        // Limpar formulário
        this.limparFormularioLivro();
        
        // Atualizar interface
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
        
        // Voltar para o painel de gerenciamento
        this.abrirPainelAdmin('livros');
    }

    limparFormularioLivro() {
        const form = document.getElementById('formAdicionarLivro');
        if (form) {
            form.reset();
            delete form.dataset.editando;
            
            const botaoSubmit = form.querySelector('button[type="submit"]');
            botaoSubmit.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Livro';
            // Restaurar o event listener original
            botaoSubmit.onclick = null;
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

        // Alterar comportamento do formulário para edição
        const form = document.getElementById('formAdicionarLivro');
        const botaoSubmit = form.querySelector('button[type="submit"]');
        
        // Salvar ID do livro sendo editado
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

        // Validar campos (usar mesma validação do adicionarLivro)
        const camposObrigatorios = ['tituloLivro', 'autorLivro', 'generoLivro', 'anoLivro', 'editoraLivro', 'descricaoLivro', 'estoqueLivro'];
        for (let campo of camposObrigatorios) {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                mensagens.erro(`O campo ${campo.replace('Livro', '')} é obrigatório.`);
                elemento.focus();
                return;
            }
        }

        const ano = parseInt(document.getElementById('anoLivro').value);
        if (ano < 1000 || ano > new Date().getFullYear()) {
            mensagens.erro('Por favor, insira um ano válido.');
            document.getElementById('anoLivro').focus();
            return;
        }

        // Atualizar livro
        sistemaLivros.livros[livroIndex] = {
            ...sistemaLivros.livros[livroIndex],
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: ano,
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            descricao: document.getElementById('descricaoLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || sistemaLivros.livros[livroIndex].imagem,
            estoque: parseInt(document.getElementById('estoqueLivro').value),
            disponivel: parseInt(document.getElementById('estoqueLivro').value) > 0,
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14
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

        // Remover livro
        sistemaLivros.livros.splice(livroIndex, 1);
        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        // Remover comentários do livro
        sistemaComentarios.comentarios = sistemaComentarios.comentarios.filter(c => c.livroId !== livroId);
        ArmazenamentoLocal.salvar('biblioteca_comentarios', sistemaComentarios.comentarios);

        // Remover de favoritos
        const favoritos = ArmazenamentoLocal.carregar('biblioteca_favoritos') || [];
        const favoritosAtualizados = favoritos.filter(f => f.livroId !== livroId);
        ArmazenamentoLocal.salvar('biblioteca_favoritos', favoritosAtualizados);

        mensagens.sucesso(`Livro "${livro.titulo}" excluído com sucesso!`);
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
    }

    carregarPainelEmprestimos() {
        const container = document.getElementById('conteudoEmprestimos');
        if (!container) {
            console.error('Container de empréstimos não encontrado');
            return;
        }

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo');

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
                        <span class="estatistica-valor">${emprestimos.filter(e => this.isEmprestimoAtrasado(e)).length}</span>
                        <span class="estatistica-rotulo">Em Atraso</span>
                    </div>
                </div>
            </div>

            <div class="tabela-container">
                <h4>Empréstimos Ativos</h4>
                ${emprestimosAtivos.length > 0 ? `
                    <table class="tabela-dados">
                        <thead>
                            <tr>
                                <th>Livro</th>
                                <th>Usuário</th>
                                <th>Data Empréstimo</th>
                                <th>Devolução Prevista</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${emprestimosAtivos.map(emp => `
                                <tr>
                                    <td>${emp.livroTitulo}</td>
                                    <td>${emp.usuarioNome}</td>
                                    <td>${UtilitariosData.formatarData(emp.dataEmprestimo)}</td>
                                    <td>${UtilitariosData.formatarData(emp.dataDevolucaoPrevista)}</td>
                                    <td>
                                        <span class="status-livro ${this.isEmprestimoAtrasado(emp) ? 'status-indisponivel' : 'status-disponivel'}">
                                            ${this.isEmprestimoAtrasado(emp) ? 'Atrasado' : 'No Prazo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="botao-acao botao-editar" onclick="sistemaAdmin.registrarDevolucao('${emp.id}')">
                                            <i class="fas fa-undo"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="sem-dados">Nenhum empréstimo ativo no momento.</p>'}
            </div>
        `;
    }

    isEmprestimoAtrasado(emprestimo) {
        if (emprestimo.status !== 'ativo') return false;
        const hoje = new Date();
        const dataDevolucao = new Date(emprestimo.dataDevolucaoPrevista);
        return dataDevolucao < hoje;
    }

    registrarDevolucao(emprestimoId) {
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoIndex = emprestimos.findIndex(e => e.id === emprestimoId);
        
        if (emprestimoIndex === -1) {
            mensagens.erro('Empréstimo não encontrado.');
            return;
        }

        emprestimos[emprestimoIndex].status = 'finalizado';
        emprestimos[emprestimoIndex].dataDevolucao = new Date().toISOString();
        
        ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);
        mensagens.sucesso('Devolução registrada com sucesso!');
        
        this.carregarPainelEmprestimos();
    }

    carregarPainelReservas() {
        const container = document.getElementById('conteudoReservas');
        if (!container) {
            console.error('Container de reservas não encontrado');
            return;
        }

        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const reservasPendentes = reservas.filter(r => r.status === 'pendente');

        container.innerHTML = `
            <div class="estatisticas-emprestimos">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-bookmark"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${reservasPendentes.length}</span>
                        <span class="estatistica-rotulo">Reservas Pendentes</span>
                    </div>
                </div>
            </div>

            <div class="lista-reservas">
                ${reservasPendentes.length > 0 ? 
                    reservasPendentes.map(reserva => this.criarItemReserva(reserva)).join('') 
                    : '<p class="sem-dados">Nenhuma reserva pendente.</p>'
                }
            </div>
        `;
    }

    criarItemReserva(reserva) {
        const livro = sistemaLivros.livros.find(l => l.id === reserva.livroId);
        if (!livro) return '';

        return `
            <div class="reserva-item">
                <div class="reserva-cabecalho">
                    <div>
                        <span class="reserva-livro">${livro.titulo}</span>
                        <div class="reserva-data">
                            Solicitado por: ${reserva.usuarioNome} • 
                            Data: ${UtilitariosData.formatarData(reserva.dataReserva)}
                        </div>
                    </div>
                    <span class="reserva-status status-pendente">Pendente</span>
                </div>
                <div class="reserva-acoes">
                    <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.aprovarReserva('${reserva.id}')">
                        <i class="fas fa-check"></i>
                        Aprovar
                    </button>
                    <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.cancelarReserva('${reserva.id}')">
                        <i class="fas fa-times"></i>
                        Recusar
                    </button>
                </div>
            </div>
        `;
    }

    aprovarReserva(reservaId) {
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const reservaIndex = reservas.findIndex(r => r.id === reservaId);
        
        if (reservaIndex === -1) return;

        reservas[reservaIndex].status = 'aprovada';
        reservas[reservaIndex].dataAprovacao = new Date().toISOString();
        
        ArmazenamentoLocal.salvar('biblioteca_reservas', reservas);
        mensagens.sucesso('Reserva aprovada com sucesso!');
        
        this.carregarPainelReservas();
    }

    cancelarReserva(reservaId) {
        const reservas = ArmazenamentoLocal.carregar('biblioteca_reservas') || [];
        const reservaIndex = reservas.findIndex(r => r.id === reservaId);
        
        if (reservaIndex === -1) return;

        reservas[reservaIndex].status = 'cancelada';
        ArmazenamentoLocal.salvar('biblioteca_reservas', reservas);
        mensagens.info('Reserva cancelada.');
        
        this.carregarPainelReservas();
    }

    carregarPainelUsuarios() {
        const tbody = document.getElementById('tabelaUsuariosBody');
        if (!tbody) {
            console.error('Tabela de usuários não encontrada');
            return;
        }

        const usuarios = sistemaAuth.usuarios;

        tbody.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.usuario}</td>
                <td>${usuario.email}</td>
                <td>
                    <span class="genero-livro ${usuario.tipo === 'admin' ? 'status-disponivel' : ''}">
                        ${usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                </td>
                <td>${UtilitariosData.formatarData(usuario.dataCadastro)}</td>
                <td>
                    <span class="status-livro ${usuario.ativo ? 'status-disponivel' : 'status-indisponivel'}">
                        ${usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarUsuario('${usuario.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${usuario.id !== sistemaAuth.usuarioLogado?.id ? `
                            <button class="botao-acao ${usuario.ativo ? 'botao-excluir' : 'botao-visualizar'}" 
                                    onclick="sistemaAdmin.${usuario.ativo ? 'desativarUsuario' : 'ativarUsuario'}('${usuario.id}')">
                                <i class="fas ${usuario.ativo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    editarUsuario(usuarioId) {
        mensagens.info('Funcionalidade de editar usuário em desenvolvimento.');
    }

    desativarUsuario(usuarioId) {
        const usuarioIndex = sistemaAuth.usuarios.findIndex(u => u.id === usuarioId);
        if (usuarioIndex === -1) return;

        sistemaAuth.usuarios[usuarioIndex].ativo = false;
        ArmazenamentoLocal.salvar('biblioteca_usuarios', sistemaAuth.usuarios);
        mensagens.sucesso('Usuário desativado com sucesso!');
        this.carregarPainelUsuarios();
    }

    ativarUsuario(usuarioId) {
        const usuarioIndex = sistemaAuth.usuarios.findIndex(u => u.id === usuarioId);
        if (usuarioIndex === -1) return;

        sistemaAuth.usuarios[usuarioIndex].ativo = true;
        ArmazenamentoLocal.salvar('biblioteca_usuarios', sistemaAuth.usuarios);
        mensagens.sucesso('Usuário ativado com sucesso!');
        this.carregarPainelUsuarios();
    }

    carregarPainelComentarios() {
        const container = document.getElementById('conteudoComentarios');
        if (!container) {
            console.error('Container de comentários não encontrado');
            return;
        }

        const comentariosPendentes = sistemaComentarios.getComentariosPendentes();

        container.innerHTML = `
            <div class="estatisticas-emprestimos">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${comentariosPendentes.length}</span>
                        <span class="estatistica-rotulo">Comentários Pendentes</span>
                    </div>
                </div>
            </div>

            <div class="lista-comentarios-admin">
                ${comentariosPendentes.length > 0 ? 
                    comentariosPendentes.map(comentario => this.criarItemComentarioAdmin(comentario)).join('')
                    : '<p class="sem-dados">Nenhum comentário pendente de aprovação.</p>'
                }
            </div>
        `;
    }

    criarItemComentarioAdmin(comentario) {
        const livro = sistemaLivros.livros.find(l => l.id === comentario.livroId);
        const livroTitulo = livro ? livro.titulo : 'Livro não encontrado';

        return `
            <div class="comentario-item comentario-pendente">
                <div class="comentario-cabecalho">
                    <div class="comentario-usuario">
                        <strong>${comentario.usuarioNome}</strong>
                        <div class="comentario-estrelas">
                            ${sistemaLivros.gerarEstrelas(comentario.avaliacao)}
                        </div>
                        <small>Livro: ${livroTitulo}</small>
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
        } else {
            mensagens.erro('Erro ao aprovar comentário.');
        }
    }

    rejeitarComentario(comentarioId) {
        if (sistemaComentarios.rejeitarComentario(comentarioId)) {
            mensagens.info('Comentário rejeitado.');
            this.carregarPainelComentarios();
        } else {
            mensagens.erro('Erro ao rejeitar comentário.');
        }
    }

    carregarPainelConfiguracoes() {
        const container = document.getElementById('conteudoConfiguracoes');
        if (!container) {
            console.error('Container de configurações não encontrado');
            return;
        }

        container.innerHTML = `
            <div class="configuracoes-grid">
                <div class="configuracao-card">
                    <h4><i class="fas fa-palette"></i> Aparência</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao ${sistemaTema.temaAtual === 'claro' ? 'botao-primario' : 'botao-secundario'}" 
                                onclick="sistemaTema.alternarTema()">
                            <i class="fas ${sistemaTema.temaAtual === 'claro' ? 'fa-moon' : 'fa-sun'}"></i>
                            Tema ${sistemaTema.temaAtual === 'claro' ? 'Escuro' : 'Claro'}
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-database"></i> Dados</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaAdmin.fazerBackup()">
                            <i class="fas fa-download"></i>
                            Fazer Backup
                        </button>
                        <button class="botao botao-backup" onclick="sistemaAdmin.restaurarBackup()">
                            <i class="fas fa-upload"></i>
                            Restaurar Backup
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.limparDados()">
                            <i class="fas fa-trash"></i>
                            Limpar Dados
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-book"></i> Catálogo</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaLivros.adicionarLivrosExemplo()">
                            <i class="fas fa-plus"></i>
                            Adicionar Livros de Exemplo
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    restaurarBackup() {
        // Criar input para upload de arquivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const dados = JSON.parse(event.target.result);
                    
                    // Validar estrutura do backup
                    if (!dados.livros || !dados.usuarios || !dados.emprestimos || !dados.comentarios) {
                        mensagens.erro('Arquivo de backup inválido.');
                        return;
                    }

                    // Restaurar dados
                    ArmazenamentoLocal.salvar('biblioteca_livros', dados.livros);
                    ArmazenamentoLocal.salvar('biblioteca_usuarios', dados.usuarios);
                    ArmazenamentoLocal.salvar('biblioteca_emprestimos', dados.emprestimos);
                    ArmazenamentoLocal.salvar('biblioteca_comentarios', dados.comentarios);
                    
                    if (dados.favoritos) {
                        ArmazenamentoLocal.salvar('biblioteca_favoritos', dados.favoritos);
                    }

                    // Atualizar sistemas
                    sistemaLivros.livros = dados.livros;
                    sistemaComentarios.comentarios = dados.comentarios;
                    
                    mensagens.sucesso('Backup restaurado com sucesso! Recarregando...');
                    
                    setTimeout(() => {
                        location.reload();
                    }, 2000);

                } catch (error) {
                    mensagens.erro('Erro ao restaurar backup: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    limparDados() {
        if (!confirm('ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema. Esta ação não pode ser desfeita. Tem certeza?')) {
            return;
        }

        if (!confirm('CONFIRMAÇÃO FINAL: Você realmente deseja apagar todos os dados da biblioteca?')) {
            return;
        }

        ArmazenamentoLocal.limpar();
        mensagens.info('Todos os dados foram apagados. A página será recarregada.');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    // Métodos para funcionalidades administrativas
    gerarRelatorio() {
        const livros = sistemaLivros.livros;
        const usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios') || [];
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];

        const relatorio = {
            dataGeracao: new Date().toISOString(),
            totalLivros: livros.length,
            totalUsuarios: usuarios.length,
            totalEmprestimos: emprestimos.length,
            emprestimosAtivos: emprestimos.filter(e => e.status === 'ativo').length,
            livrosPorGenero: sistemaLivros.getLivrosPorGenero(),
            livrosMaisEmprestados: this.obterLivrosMaisEmprestados(emprestimos)
        };

        // Simular download do relatório
        const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-biblioteca-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mensagens.sucesso('Relatório gerado e baixado com sucesso!');
    }

    obterLivrosMaisEmprestados(emprestimos) {
        const contagem = {};
        emprestimos.forEach(emp => {
            contagem[emp.livroId] = (contagem[emp.livroId] || 0) + 1;
        });

        return Object.entries(contagem)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([livroId, quantidade]) => {
                const livro = sistemaLivros.livros.find(l => l.id === livroId);
                return {
                    titulo: livro ? livro.titulo : 'Livro não encontrado',
                    quantidade: quantidade
                };
            });
    }

    fazerBackup() {
        const dados = {
            livros: sistemaLivros.livros,
            usuarios: ArmazenamentoLocal.carregar('biblioteca_usuarios'),
            emprestimos: ArmazenamentoLocal.carregar('biblioteca_emprestimos'),
            comentarios: sistemaComentarios.comentarios,
            favoritos: ArmazenamentoLocal.carregar('biblioteca_favoritos'),
            dataBackup: new Date().toISOString()
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

        mensagens.sucesso('Backup realizado com sucesso!');
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
