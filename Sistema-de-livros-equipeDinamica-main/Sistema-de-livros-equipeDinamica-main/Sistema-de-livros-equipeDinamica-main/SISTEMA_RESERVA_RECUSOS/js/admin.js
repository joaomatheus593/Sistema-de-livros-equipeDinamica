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
        // Esconder todos os painéis
        document.querySelectorAll('.painel-conteudo').forEach(p => {
            p.classList.remove('ativo');
        });

        // Remover classe ativa de todos os itens do menu
        document.querySelectorAll('.item-menu').forEach(item => {
            item.classList.remove('ativo');
        });

        // Mostrar painel selecionado
        const painelElement = document.getElementById(`painel${this.capitalizar(painel)}`);
        if (painelElement) {
            painelElement.classList.add('ativo');
        }

        // Ativar item do menu
        const itemMenu = document.querySelector(`.item-menu[data-painel="${painel}"]`);
        if (itemMenu) {
            itemMenu.classList.add('ativo');
        }

        this.painelAtual = painel;

        // Carregar dados específicos do painel
        switch (painel) {
            case 'dashboard':
                this.carregarDadosDashboard();
                break;
            case 'livros':
                this.carregarTabelaLivros();
                break;
            case 'emprestimos':
                this.carregarEmprestimos();
                break;
            case 'comentarios':
                this.carregarComentariosAdmin();
                break;
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
        const reservasPendentes = 0; // Implementar reservas se necessário

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
        emprestimos.forEach(emp => {
            const mes = new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR', { month: 'short' });
            emprestimosPorMes[mes] = (emprestimosPorMes[mes] || 0) + 1;
        });

        container.innerHTML = `
            <div class="grafico-linha-simulacao">
                <p>Empréstimos nos últimos meses:</p>
                <div style="display: flex; align-items: flex-end; height: 150px; gap: 10px; margin-top: 20px;">
                    ${Object.entries(emprestimosPorMes).map(([mes, quantidade]) => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="background: var(--vinho-principal); width: 30px; height: ${quantidade * 10}px; border-radius: 4px 4px 0 0;"></div>
                            <span style="font-size: 12px; margin-top: 5px;">${mes}</span>
                            <span style="font-size: 10px;">${quantidade}</span>
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
                        <button class="botao-acao botao-visualizar" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')" title="Visualizar">
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

    adicionarLivro() {
        const form = document.getElementById('formAdicionarLivro');
        const formData = new FormData(form);

        // Validar campos obrigatórios
        const camposObrigatorios = ['tituloLivro', 'autorLivro', 'generoLivro', 'anoLivro', 'editoraLivro', 'descricaoLivro', 'estoqueLivro'];
        for (let campo of camposObrigatorios) {
            if (!document.getElementById(campo).value.trim()) {
                mensagens.erro(`O campo ${campo.replace('Livro', '')} é obrigatório.`);
                return;
            }
        }

        const novoLivro = {
            id: GeradorID.gerar(),
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: parseInt(document.getElementById('anoLivro').value),
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
        }
    }

    editarLivro(livroId) {
        mensagens.info('Funcionalidade de edição em desenvolvimento.');
        // Implementar edição de livro
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

        mensagens.sucesso(`Livro "${livro.titulo}" excluído com sucesso!`);
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
    }

    carregarEmprestimos() {
        // Implementar carregamento de empréstimos
        mensagens.info('Painel de empréstimos em desenvolvimento.');
    }

    carregarComentariosAdmin() {
        // Implementar carregamento de comentários para aprovação
        mensagens.info('Painel de comentários em desenvolvimento.');
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