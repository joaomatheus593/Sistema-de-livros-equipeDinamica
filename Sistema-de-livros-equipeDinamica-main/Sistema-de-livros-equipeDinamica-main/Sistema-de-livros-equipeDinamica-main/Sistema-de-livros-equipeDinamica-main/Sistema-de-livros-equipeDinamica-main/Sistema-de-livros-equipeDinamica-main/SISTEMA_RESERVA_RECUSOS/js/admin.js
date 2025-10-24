class SistemaAdministrativo {
    constructor() {
        this.painelAtual = 'dashboard';
        this.dadosDashboard = null;
        this.inicializarEventos();
        this.carregarInterfaceAdmin();
    }

    inicializarEventos() {
        // Formulário de adicionar livro será configurado dinamicamente
        this.configurarFormularioLivros();
        
        // Carregar dados quando a área admin for acessada
        if (sistemaAuth.isAdmin()) {
            setTimeout(() => {
                this.carregarDadosDashboard();
            }, 500);
        }
    }

    carregarInterfaceAdmin() {
        const areaAdmin = document.getElementById('areaAdministrativa');
        if (!areaAdmin) return;

        areaAdmin.innerHTML = `
            <div class="cabecalho-admin">
                <h2 class="titulo-secao">
                    <i class="fas fa-cogs"></i>
                    Painel Administrativo
                </h2>
                <div class="controles-admin">
                    <button class="botao botao-primario" onclick="sistemaAdmin.gerarRelatorio()">
                        <i class="fas fa-file-export"></i>
                        Exportar Relatório
                    </button>
                    <button class="botao botao-backup" onclick="sistemaAdmin.fazerBackup()">
                        <i class="fas fa-download"></i>
                        Backup
                    </button>
                    <button class="botao botao-restaurar" onclick="sistemaAdmin.restaurarBackup()">
                        <i class="fas fa-upload"></i>
                        Restaurar
                    </button>
                </div>
            </div>

            <div class="painel-admin">
                <div class="sidebar-admin">
                    <nav class="menu-admin">
                        <ul>
                            <li>
                                <a href="#" class="item-menu ativo" data-painel="dashboard" onclick="sistemaAdmin.abrirPainelAdmin('dashboard')">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="livros" onclick="sistemaAdmin.abrirPainelAdmin('livros')">
                                    <i class="fas fa-book"></i>
                                    <span>Gerenciar Livros</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="adicionar-livro" onclick="sistemaAdmin.abrirPainelAdmin('adicionar-livro')">
                                    <i class="fas fa-plus-circle"></i>
                                    <span>Adicionar Livro</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="emprestimos" onclick="sistemaAdmin.abrirPainelAdmin('emprestimos')">
                                    <i class="fas fa-hand-holding"></i>
                                    <span>Empréstimos</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="pedidos-fisicos" onclick="sistemaAdmin.abrirPainelAdmin('pedidos-fisicos')">
                                    <i class="fas fa-shipping-fast"></i>
                                    <span>Pedidos Físicos</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="usuarios" onclick="sistemaAdmin.abrirPainelAdmin('usuarios')">
                                    <i class="fas fa-users"></i>
                                    <span>Usuários</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="comentarios" onclick="sistemaAdmin.abrirPainelAdmin('comentarios')">
                                    <i class="fas fa-comments"></i>
                                    <span>Comentários</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="configuracoes" onclick="sistemaAdmin.abrirPainelAdmin('configuracoes')">
                                    <i class="fas fa-cog"></i>
                                    <span>Configurações</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="conteudo-admin">
                    <!-- Dashboard -->
                    <div id="painelDashboard" class="painel-conteudo ativo">
                        <div class="cabecalho-painel">
                            <h3>Dashboard - Visão Geral</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.atualizarDashboard()">
                                    <i class="fas fa-sync-alt"></i>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                        <div id="conteudoDashboard">
                            <div class="carregando"></div>
                        </div>
                    </div>

                    <!-- Gerenciar Livros -->
                    <div id="painelLivros" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Gerenciar Livros</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.abrirPainelAdmin('adicionar-livro')">
                                    <i class="fas fa-plus"></i>
                                    Novo Livro
                                </button>
                                <button class="botao botao-secundario" onclick="sistemaAdmin.exportarCatalogo()">
                                    <i class="fas fa-file-csv"></i>
                                    Exportar CSV
                                </button>
                            </div>
                        </div>
                        <div class="tabela-container">
                            <table class="tabela-admin">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Gênero</th>
                                        <th>Ano</th>
                                        <th>Estoque</th>
                                        <th>Status</th>
                                        <th>Físico</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tabelaLivrosBody">
                                    <tr>
                                        <td colspan="8" class="carregando-linha">Carregando livros...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Adicionar Livro -->
                    <div id="painelAdicionarLivro" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Adicionar Novo Livro</h3>
                            <div class="controles-painel">
                                <button class="botao botao-secundario" onclick="sistemaAdmin.limparFormularioLivro()">
                                    <i class="fas fa-eraser"></i>
                                    Limpar
                                </button>
                            </div>
                        </div>
                        <form id="formAdicionarLivro" class="formulario-admin">
                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="tituloLivro">Título do Livro *</label>
                                    <input type="text" id="tituloLivro" required placeholder="Digite o título completo">
                                </div>
                                <div class="campo-formulario">
                                    <label for="autorLivro">Autor *</label>
                                    <input type="text" id="autorLivro" required placeholder="Nome do autor">
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="generoLivro">Gênero *</label>
                                    <select id="generoLivro" required>
                                        <option value="">Selecione o gênero</option>
                                        <option value="ficcao">Ficção</option>
                                        <option value="romance">Romance</option>
                                        <option value="fantasia">Fantasia</option>
                                        <option value="aventura">Aventura</option>
                                        <option value="misterio">Mistério</option>
                                        <option value="biografia">Biografia</option>
                                        <option value="historia">História</option>
                                        <option value="ciencia">Ciência</option>
                                        <option value="tecnologia">Tecnologia</option>
                                        <option value="autoajuda">Autoajuda</option>
                                    </select>
                                </div>
                                <div class="campo-formulario">
                                    <label for="anoLivro">Ano de Publicação *</label>
                                    <input type="number" id="anoLivro" min="1000" max="2024" required placeholder="2024">
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="editoraLivro">Editora *</label>
                                    <input type="text" id="editoraLivro" required placeholder="Nome da editora">
                                </div>
                                <div class="campo-formulario">
                                    <label for="paginasLivro">Número de Páginas</label>
                                    <input type="number" id="paginasLivro" min="1" placeholder="Ex: 256">
                                </div>
                            </div>

                            <div class="campo-formulario campo-grande">
                                <label for="sinopseLivro">Sinopse *</label>
                                <textarea id="sinopseLivro" rows="4" required placeholder="Descreva a sinopse do livro..."></textarea>
                            </div>

                            <div class="campo-formulario campo-grande">
                                <label for="descricaoLivro">Descrição Detalhada</label>
                                <textarea id="descricaoLivro" rows="3" placeholder="Descrição adicional (opcional)..."></textarea>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="imagemLivro">URL da Capa</label>
                                    <input type="text" id="imagemLivro" placeholder="https://exemplo.com/capa.jpg">
                                    <small>Deixe em branco para usar imagem padrão</small>
                                </div>
                                <div class="campo-formulario">
                                    <label for="estoqueLivro">Quantidade em Estoque *</label>
                                    <input type="number" id="estoqueLivro" min="0" value="1" required>
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="classificacaoEtaria">Classificação Etária</label>
                                    <select id="classificacaoEtaria">
                                        <option value="L">L - Livre</option>
                                        <option value="10">10 anos</option>
                                        <option value="12">12 anos</option>
                                        <option value="14">14 anos</option>
                                        <option value="16">16 anos</option>
                                        <option value="18">18 anos</option>
                                    </select>
                                </div>
                                <div class="campo-formulario">
                                    <label for="isbnLivro">ISBN</label>
                                    <input type="text" id="isbnLivro" placeholder="ISBN do livro">
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="valorEmprestimo">Valor do Empréstimo (R$)</label>
                                    <input type="number" id="valorEmprestimo" min="0" step="0.01" value="0">
                                </div>
                                <div class="campo-formulario">
                                    <label for="taxaJuros">Taxa de Juros Diária (%)</label>
                                    <input type="number" id="taxaJuros" min="0" step="0.01" value="0.5">
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label for="prazoEmprestimo">Prazo de Empréstimo (dias)</label>
                                    <input type="number" id="prazoEmprestimo" min="1" value="14">
                                </div>
                                <div class="campo-formulario">
                                    <label for="localizacaoFisica">Localização Física</label>
                                    <input type="text" id="localizacaoFisica" placeholder="Ex: Prateleira A-12">
                                </div>
                            </div>

                            <div class="formulario-linha">
                                <div class="campo-formulario">
                                    <label class="checkbox">
                                        <input type="checkbox" id="destaqueLivro">
                                        <span class="checkmark"></span>
                                        Destacar este livro
                                    </label>
                                </div>
                                <div class="campo-formulario">
                                    <label class="checkbox">
                                        <input type="checkbox" id="fisicoDisponivel" checked>
                                        <span class="checkmark"></span>
                                        Disponível fisicamente
                                    </label>
                                </div>
                            </div>

                            <div class="campo-formulario">
                                <label for="tagsLivro">Tags (separadas por vírgula)</label>
                                <input type="text" id="tagsLivro" placeholder="Ex: fantasia, aventura, magia">
                                <small>Palavras-chave para melhorar a busca</small>
                            </div>

                            <div class="acoes-formulario">
                                <button type="submit" class="botao botao-primario">
                                    <i class="fas fa-plus-circle"></i>
                                    Adicionar Livro
                                </button>
                                <button type="button" class="botao botao-secundario" onclick="sistemaAdmin.limparFormularioLivro()">
                                    <i class="fas fa-eraser"></i>
                                    Limpar
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Empréstimos -->
                    <div id="painelEmprestimos" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Gerenciar Empréstimos</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelEmprestimos()">
                                    <i class="fas fa-sync-alt"></i>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                        <div id="conteudoEmprestimos">
                            <div class="carregando"></div>
                        </div>
                    </div>

                    <!-- Pedidos Físicos -->
                    <div id="painelPedidosFisicos" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Pedidos de Livros Físicos</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelPedidosFisicos()">
                                    <i class="fas fa-sync-alt"></i>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                        <div id="conteudoPedidosFisicos">
                            <div class="carregando"></div>
                        </div>
                    </div>

                    <!-- Usuários -->
                    <div id="painelUsuarios" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Gerenciar Usuários</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelUsuarios()">
                                    <i class="fas fa-sync-alt"></i>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                        <div class="tabela-container">
                            <table class="tabela-admin">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Usuário</th>
                                        <th>E-mail</th>
                                        <th>Tipo</th>
                                        <th>Data Cadastro</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tabelaUsuariosBody">
                                    <tr>
                                        <td colspan="7" class="carregando-linha">Carregando usuários...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Comentários -->
                    <div id="painelComentarios" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Gerenciar Comentários</h3>
                            <div class="controles-painel">
                                <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelComentarios()">
                                    <i class="fas fa-sync-alt"></i>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                        <div id="conteudoComentarios">
                            <div class="carregando"></div>
                        </div>
                    </div>

                    <!-- Configurações -->
                    <div id="painelConfiguracoes" class="painel-conteudo">
                        <div class="cabecalho-painel">
                            <h3>Configurações do Sistema</h3>
                        </div>
                        <div id="conteudoConfiguracoes">
                            <div class="carregando"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Configurar eventos após carregar a interface
        this.configurarFormularioLivros();
    }

    configurarFormularioLivros() {
        const formAdicionarLivro = document.getElementById('formAdicionarLivro');
        if (formAdicionarLivro) {
            formAdicionarLivro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarLivro();
            });
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
            'pedidos-fisicos': 'painelPedidosFisicos',
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
            case 'pedidos-fisicos':
                this.carregarPainelPedidosFisicos();
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

    // ========== DASHBOARD ==========
    carregarDadosDashboard() {
        const container = document.getElementById('conteudoDashboard');
        if (!container) return;

        // Simular carregamento
        container.innerHTML = '<div class="carregando"></div>';

        setTimeout(() => {
            // Coletar dados
            const totalLivros = sistemaLivros.getTotalLivros();
            const livrosDisponiveis = sistemaLivros.getLivrosDisponiveis();
            const livrosFisicos = sistemaLivros.getLivrosFisicosDisponiveis();
            const livrosDestaque = sistemaLivros.getLivrosEmDestaque();
            
            const usuarios = sistemaAuth.getTodosUsuarios();
            const totalUsuarios = usuarios.length;
            const usuariosAtivos = usuarios.filter(u => u.ativo).length;

            const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
            const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo').length;
            const emprestimosAtrasados = emprestimos.filter(e => 
                e.status === 'ativo' && new Date(e.dataDevolucaoPrevista) < new Date()
            ).length;

            const pedidosFisicos = ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];
            const pedidosPendentes = pedidosFisicos.filter(p => p.status === 'pendente').length;

            const comentarios = sistemaComentarios.getComentariosPendentes();
            const comentariosPendentes = comentarios.length;

            // Gerar HTML do dashboard
            container.innerHTML = `
                <div class="dashboard-admin">
                    <div class="card-dashboard estatistica">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Total de Livros</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-book"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${totalLivros}</div>
                        <div class="card-dashboard-variacao positivo">
                            <i class="fas fa-arrow-up"></i>
                            ${livrosDestaque} em destaque
                        </div>
                    </div>

                    <div class="card-dashboard usuarios">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Usuários Ativos</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${usuariosAtivos}</div>
                        <div class="card-dashboard-variacao">
                            <i class="fas fa-user"></i>
                            Total: ${totalUsuarios}
                        </div>
                    </div>

                    <div class="card-dashboard alertas">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Empréstimos Ativos</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-hand-holding"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${emprestimosAtivos}</div>
                        <div class="card-dashboard-variacao ${emprestimosAtrasados > 0 ? 'negativo' : ''}">
                            <i class="fas ${emprestimosAtrasados > 0 ? 'fa-exclamation-triangle' : 'fa-check'}"></i>
                            ${emprestimosAtrasados} atrasados
                        </div>
                    </div>

                    <div class="card-dashboard livros">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Livros Físicos</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${livrosFisicos}</div>
                        <div class="card-dashboard-variacao">
                            <i class="fas fa-shipping-fast"></i>
                            ${pedidosPendentes} pedidos
                        </div>
                    </div>
                </div>

                <div class="secao-admin">
                    <div class="secao-admin-header">
                        <h3><i class="fas fa-chart-pie"></i> Estatísticas por Gênero</h3>
                    </div>
                    <div class="secao-admin-corpo">
                        <div class="grafico-barras-container" id="graficoGeneros">
                            ${this.gerarGraficoGeneros()}
                        </div>
                    </div>
                </div>

                <div class="secao-admin">
                    <div class="secao-admin-header">
                        <h3><i class="fas fa-bell"></i> Alertas do Sistema</h3>
                    </div>
                    <div class="secao-admin-corpo">
                        <div class="lista-alertas" id="listaAlertas">
                            ${this.gerarAlertasSistema(
                                emprestimosAtrasados, 
                                comentariosPendentes, 
                                pedidosPendentes,
                                livrosDisponiveis
                            )}
                        </div>
                    </div>
                </div>

                <div class="secao-admin">
                    <div class="secao-admin-header">
                        <h3><i class="fas fa-clock"></i> Atividade Recente</h3>
                    </div>
                    <div class="secao-admin-corpo">
                        <div class="atividade-recente">
                            ${this.gerarAtividadeRecente(emprestimos)}
                        </div>
                    </div>
                </div>
            `;
        }, 1000);
    }

    gerarGraficoGeneros() {
        const livrosPorGenero = sistemaLivros.getLivrosPorGenero();
        const generos = Object.keys(livrosPorGenero);
        const totalLivros = sistemaLivros.getTotalLivros();

        if (generos.length === 0) {
            return '<p class="sem-dados">Nenhum dado disponível para gerar gráfico.</p>';
        }

        let html = '';
        generos.forEach(genero => {
            const quantidade = livrosPorGenero[genero];
            const porcentagem = ((quantidade / totalLivros) * 100).toFixed(1);
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            
            html += `
                <div class="barra-genero">
                    <div class="barra-rotulo">${nomeGenero}</div>
                    <div class="barra-container">
                        <div class="barra" style="width: ${porcentagem}%; background-color: ${this.obterCorGenero(generos.indexOf(genero))};"></div>
                        <div class="barra-valor">${quantidade} (${porcentagem}%)</div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    obterCorGenero(index) {
        const cores = [
            '#8B0000', '#A52A2A', '#D4AF37', '#B8860B',
            '#28a745', '#007bff', '#6f42c1', '#fd7e14',
            '#20c997', '#e83e8c'
        ];
        return cores[index % cores.length];
    }

    gerarAlertasSistema(emprestimosAtrasados, comentariosPendentes, pedidosPendentes, livrosDisponiveis) {
        const alertas = [];

        if (emprestimosAtrasados > 0) {
            alertas.push({
                tipo: 'critico',
                mensagem: `${emprestimosAtrasados} empréstimo(s) em atraso`,
                icone: 'fa-clock'
            });
        }

        if (comentariosPendentes > 0) {
            alertas.push({
                tipo: 'aviso',
                mensagem: `${comentariosPendentes} comentário(s) aguardando moderação`,
                icone: 'fa-comments'
            });
        }

        if (pedidosPendentes > 0) {
            alertas.push({
                tipo: 'info',
                mensagem: `${pedidosPendentes} pedido(s) de livro físico pendentes`,
                icone: 'fa-shipping-fast'
            });
        }

        if (livrosDisponiveis === 0) {
            alertas.push({
                tipo: 'critico',
                mensagem: 'Nenhum livro disponível para empréstimo',
                icone: 'fa-exclamation-triangle'
            });
        }

        if (alertas.length === 0) {
            return `
                <div class="alerta-item info">
                    <i class="fas fa-check-circle"></i>
                    <span>Sistema funcionando normalmente</span>
                </div>
            `;
        }

        return alertas.map(alerta => `
            <div class="alerta-item ${alerta.tipo}">
                <i class="fas ${alerta.icone}"></i>
                <span>${alerta.mensagem}</span>
            </div>
        `).join('');
    }

    gerarAtividadeRecente(emprestimos) {
        // Ordenar por data mais recente
        const atividadesRecentes = emprestimos
            .sort((a, b) => new Date(b.dataEmprestimo) - new Date(a.dataEmprestimo))
            .slice(0, 5);

        if (atividadesRecentes.length === 0) {
            return '<p class="sem-dados">Nenhuma atividade recente.</p>';
        }

        return atividadesRecentes.map(emp => `
            <div class="atividade-item">
                <div class="atividade-icon">
                    <i class="fas fa-hand-holding"></i>
                </div>
                <div class="atividade-conteudo">
                    <div class="atividade-descricao">
                        <strong>${emp.usuarioNome}</strong> emprestou <strong>${emp.livroTitulo}</strong>
                    </div>
                    <div class="atividade-data">
                        ${UtilitariosData.formatarData(emp.dataEmprestimo)}
                    </div>
                </div>
                <div class="atividade-status ${emp.status === 'ativo' ? 'ativo' : 'finalizado'}">
                    ${emp.status === 'ativo' ? 'Ativo' : 'Finalizado'}
                </div>
            </div>
        `).join('');
    }

    atualizarDashboard() {
        this.carregarDadosDashboard();
        mensagens.sucesso('Dashboard atualizado com sucesso!');
    }

    // ========== GERENCIAR LIVROS ==========
    carregarTabelaLivros() {
        const tbody = document.getElementById('tabelaLivrosBody');
        if (!tbody) return;

        const livros = sistemaLivros.livros;

        if (livros.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="sem-dados">
                        <i class="fas fa-book"></i>
                        <p>Nenhum livro cadastrado</p>
                        <button class="botao botao-primario" onclick="sistemaAdmin.abrirPainelAdmin('adicionar-livro')">
                            Adicionar Primeiro Livro
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = livros.map(livro => `
            <tr>
                <td>
                    <div class="livro-info">
                        <img src="${livro.imagem}" alt="${livro.titulo}" 
                             onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100'">
                        <div>
                            <strong>${Formatadores.limitarTexto(livro.titulo, 40)}</strong>
                            <div class="livro-isbn">${livro.isbn}</div>
                        </div>
                    </div>
                </td>
                <td>${livro.autor}</td>
                <td>
                    <span class="badge genero">${sistemaLivros.obterNomeGenero(livro.genero)}</span>
                </td>
                <td>${livro.ano}</td>
                <td>
                    <span class="estoque ${livro.estoque > 0 ? 'disponivel' : 'indisponivel'}">
                        ${livro.estoque}
                    </span>
                </td>
                <td>
                    <span class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </td>
                <td>
                    ${livro.fisicoDisponivel ? 
                        '<span class="badge-sucesso"><i class="fas fa-check"></i> Sim</span>' : 
                        '<span class="badge-erro"><i class="fas fa-times"></i> Não</span>'
                    }
                </td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao botao-visualizar" onclick="sistemaAdmin.visualizarLivroAdmin('${livro.id}')" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarLivro('${livro.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${livro.estoque === 0 ? `
                            <button class="botao-acao botao-sucesso" onclick="sistemaAdmin.reporEstoque('${livro.id}')" title="Repor Estoque">
                                <i class="fas fa-plus"></i>
                            </button>
                        ` : ''}
                        <button class="botao-acao botao-excluir" onclick="sistemaAdmin.excluirLivro('${livro.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    visualizarLivroAdmin(livroId) {
        sistemaLivros.abrirDetalhesLivro(livroId);
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
        document.getElementById('paginasLivro').value = livro.paginas || '';
        document.getElementById('sinopseLivro').value = livro.sinopse || livro.descricao;
        document.getElementById('descricaoLivro').value = livro.descricao || '';
        document.getElementById('imagemLivro').value = livro.imagem;
        document.getElementById('estoqueLivro').value = livro.estoque;
        document.getElementById('classificacaoEtaria').value = livro.classificacaoEtaria || 'L';
        document.getElementById('isbnLivro').value = livro.isbn || '';
        document.getElementById('valorEmprestimo').value = livro.valorEmprestimo || 0;
        document.getElementById('taxaJuros').value = livro.taxaJuros || 0.5;
        document.getElementById('prazoEmprestimo').value = livro.prazoEmprestimo || 14;
        document.getElementById('localizacaoFisica').value = livro.localizacaoFisica || '';
        document.getElementById('destaqueLivro').checked = livro.destaque || false;
        document.getElementById('fisicoDisponivel').checked = livro.fisicoDisponivel || false;
        document.getElementById('tagsLivro').value = livro.tags ? livro.tags.join(', ') : '';

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

    reporEstoque(livroId) {
        const livro = sistemaLivros.livros.find(l => l.id === livroId);
        if (!livro) return;

        const novaQuantidade = prompt(`Repor estoque para "${livro.titulo}":`, 1);
        if (novaQuantidade && !isNaN(novaQuantidade) && parseInt(novaQuantidade) > 0) {
            livro.estoque = parseInt(novaQuantidade);
            livro.disponivel = true;
            ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
            
            mensagens.sucesso(`Estoque de "${livro.titulo}" reposto para ${novaQuantidade} unidades.`);
            this.carregarTabelaLivros();
        }
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

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Livro Excluído',
            `"${livro.titulo}" foi removido do catálogo`,
            'aviso'
        );

        mensagens.sucesso(`Livro "${livro.titulo}" excluído com sucesso!`);
        this.carregarTabelaLivros();
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
    }

    // ========== ADICIONAR/EDITAR LIVRO ==========
    adicionarLivro() {
        const form = document.getElementById('formAdicionarLivro');
        const estaEditando = form.dataset.editando;
        
        if (estaEditando) {
            this.salvarEdicaoLivro(estaEditando);
            return;
        }

        // Validar campos obrigatórios
        const camposObrigatorios = [
            'tituloLivro', 'autorLivro', 'generoLivro', 'anoLivro', 
            'editoraLivro', 'sinopseLivro', 'estoqueLivro'
        ];

        for (let campoId of camposObrigatorios) {
            const campo = document.getElementById(campoId);
            if (!campo.value.trim()) {
                mensagens.erro(`O campo "${campo.previousElementSibling.textContent}" é obrigatório.`);
                campo.focus();
                return;
            }
        }

        const ano = parseInt(document.getElementById('anoLivro').value);
        if (ano < 1000 || ano > new Date().getFullYear()) {
            mensagens.erro('Por favor, insira um ano válido.');
            document.getElementById('anoLivro').focus();
            return;
        }

        const estoque = parseInt(document.getElementById('estoqueLivro').value);
        if (estoque < 0) {
            mensagens.erro('O estoque não pode ser negativo.');
            document.getElementById('estoqueLivro').focus();
            return;
        }

        // Coletar dados do formulário
        const tags = document.getElementById('tagsLivro').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const novoLivro = {
            id: GeradorID.gerar(),
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: ano,
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            sinopse: document.getElementById('sinopseLivro').value.trim(),
            descricao: document.getElementById('descricaoLivro').value.trim() || document.getElementById('sinopseLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            estoque: estoque,
            disponivel: estoque > 0,
            isbn: document.getElementById('isbnLivro').value.trim() || GeradorID.gerarISBN(),
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0,
            classificacaoEtaria: document.getElementById('classificacaoEtaria').value || 'L',
            destaque: document.getElementById('destaqueLivro').checked,
            fisicoDisponivel: document.getElementById('fisicoDisponivel').checked,
            localizacaoFisica: document.getElementById('localizacaoFisica').value.trim() || 'Prateleira A-01',
            tags: tags
        };

        // Adicionar ao sistema
        sistemaLivros.livros.push(novoLivro);
        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Novo Livro Adicionado',
            `"${novoLivro.titulo}" foi adicionado ao catálogo`,
            'sucesso'
        );

        mensagens.sucesso(`Livro "${novoLivro.titulo}" adicionado com sucesso!`);
        
        // Limpar formulário
        this.limparFormularioLivro();
        
        // Atualizar interfaces
        sistemaLivros.carregarDestaques();
        sistemaLivros.aplicarFiltros();
        
        // Voltar para o painel de gerenciamento
        this.abrirPainelAdmin('livros');
    }

    salvarEdicaoLivro(livroId) {
        const livroIndex = sistemaLivros.livros.findIndex(l => l.id === livroId);
        if (livroIndex === -1) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        // Validar campos (usar mesma validação do adicionarLivro)
        const camposObrigatorios = [
            'tituloLivro', 'autorLivro', 'generoLivro', 'anoLivro', 
            'editoraLivro', 'sinopseLivro', 'estoqueLivro'
        ];

        for (let campoId of camposObrigatorios) {
            const campo = document.getElementById(campoId);
            if (!campo.value.trim()) {
                mensagens.erro(`O campo "${campo.previousElementSibling.textContent}" é obrigatório.`);
                campo.focus();
                return;
            }
        }

        const ano = parseInt(document.getElementById('anoLivro').value);
        if (ano < 1000 || ano > new Date().getFullYear()) {
            mensagens.erro('Por favor, insira um ano válido.');
            document.getElementById('anoLivro').focus();
            return;
        }

        const estoque = parseInt(document.getElementById('estoqueLivro').value);
        if (estoque < 0) {
            mensagens.erro('O estoque não pode ser negativo.');
            document.getElementById('estoqueLivro').focus();
            return;
        }

        // Coletar dados do formulário
        const tags = document.getElementById('tagsLivro').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // Atualizar livro
        sistemaLivros.livros[livroIndex] = {
            ...sistemaLivros.livros[livroIndex],
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: ano,
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            sinopse: document.getElementById('sinopseLivro').value.trim(),
            descricao: document.getElementById('descricaoLivro').value.trim() || document.getElementById('sinopseLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim() || sistemaLivros.livros[livroIndex].imagem,
            estoque: estoque,
            disponivel: estoque > 0,
            isbn: document.getElementById('isbnLivro').value.trim() || sistemaLivros.livros[livroIndex].isbn,
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            classificacaoEtaria: document.getElementById('classificacaoEtaria').value || 'L',
            destaque: document.getElementById('destaqueLivro').checked,
            fisicoDisponivel: document.getElementById('fisicoDisponivel').checked,
            localizacaoFisica: document.getElementById('localizacaoFisica').value.trim() || sistemaLivros.livros[livroIndex].localizacaoFisica,
            tags: tags
        };

        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        // Restaurar formulário para adição
        this.limparFormularioLivro();
        
        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Livro Atualizado',
            `"${sistemaLivros.livros[livroIndex].titulo}" foi atualizado`,
            'sucesso'
        );

        mensagens.sucesso(`Livro "${sistemaLivros.livros[livroIndex].titulo}" atualizado com sucesso!`);
        
        // Atualizar interfaces
        this.carregarTabelaLivros();
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
        }
    }

    // ========== EMPRÉSTIMOS ==========
    carregarPainelEmprestimos() {
        const container = document.getElementById('conteudoEmprestimos');
        if (!container) return;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo');
        const emprestimosFinalizados = emprestimos.filter(e => e.status === 'finalizado');

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
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${emprestimosFinalizados.length}</span>
                        <span class="estatistica-rotulo">Finalizados</span>
                    </div>
                </div>
            </div>

            <div class="tabela-container">
                <h4>Empréstimos Ativos</h4>
                ${emprestimosAtivos.length > 0 ? `
                    <table class="tabela-admin">
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
                                    <td>
                                        <div class="livro-info">
                                            <img src="${emp.livroImagem}" alt="${emp.livroTitulo}" 
                                                 onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100'">
                                            <div>
                                                <strong>${emp.livroTitulo}</strong>
                                                <div>${emp.livroAutor}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${emp.usuarioNome}</td>
                                    <td>${UtilitariosData.formatarData(emp.dataEmprestimo)}</td>
                                    <td>${UtilitariosData.formatarData(emp.dataDevolucaoPrevista)}</td>
                                    <td>
                                        <span class="status-livro ${this.isEmprestimoAtrasado(emp) ? 'status-indisponivel' : 'status-disponivel'}">
                                            ${this.isEmprestimoAtrasado(emp) ? 'Atrasado' : 'No Prazo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="acoes-tabela">
                                            <button class="botao-acao botao-editar" onclick="sistemaAdmin.registrarDevolucao('${emp.id}')" title="Registrar Devolução">
                                                <i class="fas fa-undo"></i>
                                            </button>
                                            ${this.isEmprestimoAtrasado(emp) ? `
                                                <button class="botao-acao botao-aviso" onclick="sistemaAdmin.enviarLembrete('${emp.id}')" title="Enviar Lembrete">
                                                    <i class="fas fa-bell"></i>
                                                </button>
                                            ` : ''}
                                        </div>
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

        const emprestimo = emprestimos[emprestimoIndex];
        
        // Atualizar livro (aumentar estoque)
        const livro = sistemaLivros.livros.find(l => l.id === emprestimo.livroId);
        if (livro) {
            livro.estoque += 1;
            if (!livro.disponivel) {
                livro.disponivel = true;
            }
            ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
        }

        // Marcar empréstimo como finalizado
        emprestimos[emprestimoIndex].status = 'finalizado';
        emprestimos[emprestimoIndex].dataDevolucao = new Date().toISOString();
        
        ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Devolução Registrada',
            `"${emprestimo.livroTitulo}" foi devolvido por ${emprestimo.usuarioNome}`,
            'sucesso'
        );

        mensagens.sucesso('Devolução registrada com sucesso!');
        
        this.carregarPainelEmprestimos();
        sistemaLivros.carregarDestaques();
    }

    enviarLembrete(emprestimoId) {
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimo = emprestimos.find(e => e.id === emprestimoId);
        
        if (emprestimo) {
            // Simular envio de lembrete
            mensagens.info(`Lembrete enviado para ${emprestimo.usuarioNome} sobre a devolução de "${emprestimo.livroTitulo}"`);
            
            // Notificação no sistema
            sistemaNotificacoes.adicionarNotificacao(
                'Lembrete Enviado',
                `Lembrete de devolução enviado para ${emprestimo.usuarioNome}`,
                'info'
            );
        }
    }

    // ========== PEDIDOS FÍSICOS ==========
    carregarPainelPedidosFisicos() {
        const container = document.getElementById('conteudoPedidosFisicos');
        if (!container) return;

        const pedidos = ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];
        const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
        const pedidosProcessados = pedidos.filter(p => p.status === 'processando');
        const pedidosConcluidos = pedidos.filter(p => p.status === 'concluido');

        container.innerHTML = `
            <div class="estatisticas-emprestimos">
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${pedidosPendentes.length}</span>
                        <span class="estatistica-rotulo">Pendentes</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${pedidosProcessados.length}</span>
                        <span class="estatistica-rotulo">Processando</span>
                    </div>
                </div>
                <div class="estatistica-card">
                    <div class="estatistica-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="estatistica-info">
                        <span class="estatistica-valor">${pedidosConcluidos.length}</span>
                        <span class="estatistica-rotulo">Concluídos</span>
                    </div>
                </div>
            </div>

            <div class="lista-pedidos">
                <h4>Pedidos Pendentes</h4>
                ${pedidosPendentes.length > 0 ? 
                    pedidosPendentes.map(pedido => this.criarItemPedido(pedido)).join('')
                    : '<p class="sem-dados">Nenhum pedido pendente.</p>'
                }
            </div>
        `;
    }

    criarItemPedido(pedido) {
        const livro = sistemaLivros.livros.find(l => l.id === pedido.livroId);
        if (!livro) return '';

        return `
            <div class="pedido-item">
                <div class="pedido-cabecalho">
                    <div class="pedido-info">
                        <h4>${livro.titulo}</h4>
                        <div class="pedido-detalhes">
                            <span><strong>Solicitante:</strong> ${pedido.usuarioNome}</span>
                            <span><strong>Data:</strong> ${UtilitariosData.formatarData(pedido.dataPedido)}</span>
                            <span><strong>Localização:</strong> ${livro.localizacaoFisica}</span>
                        </div>
                    </div>
                    <span class="pedido-status status-pendente">Pendente</span>
                </div>
                <div class="pedido-acoes">
                    <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.processarPedido('${pedido.id}')">
                        <i class="fas fa-cog"></i>
                        Processar
                    </button>
                    <button class="botao botao-secundario botao-pequeno" onclick="sistemaAdmin.cancelarPedido('${pedido.id}')">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `;
    }

    processarPedido(pedidoId) {
        const pedidos = ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
        
        if (pedidoIndex === -1) return;

        pedidos[pedidoIndex].status = 'processando';
        pedidos[pedidoIndex].dataProcessamento = new Date().toISOString();
        
        ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', pedidos);

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Pedido Processado',
            `Pedido físico está sendo processado`,
            'info'
        );

        mensagens.sucesso('Pedido marcado como processando!');
        this.carregarPainelPedidosFisicos();
    }

    cancelarPedido(pedidoId) {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
            return;
        }

        const pedidos = ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];
        const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
        
        if (pedidoIndex === -1) return;

        pedidos[pedidoIndex].status = 'cancelado';
        ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', pedidos);

        mensagens.info('Pedido cancelado.');
        this.carregarPainelPedidosFisicos();
    }

    // ========== USUÁRIOS ==========
    carregarPainelUsuarios() {
        const tbody = document.getElementById('tabelaUsuariosBody');
        if (!tbody) return;

        const usuarios = sistemaAuth.getTodosUsuarios();

        if (usuarios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="sem-dados">
                        <i class="fas fa-users"></i>
                        <p>Nenhum usuário cadastrado</p>
                    </td>
                </tr>
            `;
            return;
        }

        const usuarioLogado = sistemaAuth.getUsuarioLogado();

        tbody.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>
                    <div class="usuario-info">
                        <div class="usuario-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <strong>${usuario.nome}</strong>
                            <div class="usuario-email">${usuario.email}</div>
                        </div>
                    </div>
                </td>
                <td>${usuario.usuario}</td>
                <td>${usuario.email}</td>
                <td>
                    <span class="badge ${usuario.tipo === 'admin' ? 'badge-admin' : 'badge-usuario'}">
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
                        <button class="botao-acao botao-editar" onclick="sistemaAdmin.editarUsuario('${usuario.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${usuario.id !== usuarioLogado?.id ? `
                            <button class="botao-acao ${usuario.ativo ? 'botao-excluir' : 'botao-sucesso'}" 
                                    onclick="sistemaAdmin.${usuario.ativo ? 'desativarUsuario' : 'ativarUsuario'}('${usuario.id}')"
                                    title="${usuario.ativo ? 'Desativar' : 'Ativar'}">
                                <i class="fas ${usuario.ativo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        ` : '<span class="acao-vazia"></span>'}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    editarUsuario(usuarioId) {
        const usuario = sistemaAuth.usuarios.find(u => u.id === usuarioId);
        if (!usuario) {
            mensagens.erro('Usuário não encontrado.');
            return;
        }

        const novoTipo = usuario.tipo === 'admin' ? 'usuario' : 'admin';
        const novoTipoTexto = novoTipo === 'admin' ? 'Administrador' : 'Usuário Normal';

        if (confirm(`Deseja alterar o tipo de ${usuario.nome} para ${novoTipoTexto}?`)) {
            usuario.tipo = novoTipo;
            ArmazenamentoLocal.salvar('biblioteca_usuarios', sistemaAuth.usuarios);
            
            mensagens.sucesso(`Tipo de usuário alterado para ${novoTipoTexto}`);
            this.carregarPainelUsuarios();
        }
    }

    desativarUsuario(usuarioId) {
        if (sistemaAuth.desativarUsuario(usuarioId)) {
            mensagens.sucesso('Usuário desativado com sucesso!');
            this.carregarPainelUsuarios();
        } else {
            mensagens.erro('Erro ao desativar usuário.');
        }
    }

    ativarUsuario(usuarioId) {
        if (sistemaAuth.ativarUsuario(usuarioId)) {
            mensagens.sucesso('Usuário ativado com sucesso!');
            this.carregarPainelUsuarios();
        } else {
            mensagens.erro('Erro ao ativar usuário.');
        }
    }

    // ========== COMENTÁRIOS ==========
    carregarPainelComentarios() {
        const container = document.getElementById('conteudoComentarios');
        if (!container) return;

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

    // ========== CONFIGURAÇÕES ==========
    carregarPainelConfiguracoes() {
        const container = document.getElementById('conteudoConfiguracoes');
        if (!container) return;

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
                        <button class="botao botao-restaurar" onclick="sistemaAdmin.restaurarBackup()">
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
                        <button class="botao botao-primario" onclick="sistemaLivros.carregarMaisLivrosExemplo()">
                            <i class="fas fa-plus"></i>
                            Adicionar Livros de Exemplo
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaAdmin.exportarCatalogo()">
                            <i class="fas fa-file-csv"></i>
                            Exportar Catálogo
                        </button>
                    </div>
                </div>

                <div class="configuracao-card">
                    <h4><i class="fas fa-bell"></i> Notificações</h4>
                    <div class="configuracao-opcoes">
                        <button class="botao botao-primario" onclick="sistemaNotificacoes.adicionarNotificacao('Teste', 'Esta é uma notificação de teste do sistema', 'info')">
                            <i class="fas fa-bell"></i>
                            Testar Notificação
                        </button>
                        <button class="botao botao-secundario" onclick="sistemaNotificacoes.marcarTodasComoLidas()">
                            <i class="fas fa-check-double"></i>
                            Marcar Todas como Lidas
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== BACKUP E RELATÓRIOS ==========
    fazerBackup() {
        const dados = {
            livros: sistemaLivros.livros,
            usuarios: sistemaAuth.usuarios,
            emprestimos: ArmazenamentoLocal.carregar('biblioteca_emprestimos'),
            comentarios: sistemaComentarios.comentarios,
            favoritos: ArmazenamentoLocal.carregar('biblioteca_favoritos'),
            pedidosFisicos: ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos'),
            dataBackup: new Date().toISOString(),
            versaoSistema: '2.0'
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

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Backup Realizado',
            'Backup do sistema realizado com sucesso',
            'sucesso'
        );

        mensagens.sucesso('Backup realizado com sucesso!');
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
                    if (!dados.livros || !dados.usuarios) {
                        mensagens.erro('Arquivo de backup inválido.');
                        return;
                    }

                    if (!confirm('ATENÇÃO: Esta ação irá substituir todos os dados atuais. Deseja continuar?')) {
                        return;
                    }

                    // Restaurar dados
                    ArmazenamentoLocal.salvar('biblioteca_livros', dados.livros);
                    ArmazenamentoLocal.salvar('biblioteca_usuarios', dados.usuarios);
                    
                    if (dados.emprestimos) {
                        ArmazenamentoLocal.salvar('biblioteca_emprestimos', dados.emprestimos);
                    }
                    if (dados.comentarios) {
                        ArmazenamentoLocal.salvar('biblioteca_comentarios', dados.comentarios);
                    }
                    if (dados.favoritos) {
                        ArmazenamentoLocal.salvar('biblioteca_favoritos', dados.favoritos);
                    }
                    if (dados.pedidosFisicos) {
                        ArmazenamentoLocal.salvar('biblioteca_pedidos_fisicos', dados.pedidosFisicos);
                    }

                    // Atualizar sistemas
                    sistemaLivros.livros = dados.livros;
                    sistemaAuth.usuarios = dados.usuarios;
                    sistemaComentarios.comentarios = dados.comentarios || [];
                    
                    // Notificação
                    sistemaNotificacoes.adicionarNotificacao(
                        'Backup Restaurado',
                        'Sistema restaurado do backup com sucesso',
                        'sucesso'
                    );

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
        
        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Dados Limpos',
            'Todos os dados do sistema foram apagados',
            'aviso'
        );

        mensagens.info('Todos os dados foram apagados. A página será recarregada.');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    gerarRelatorio() {
        const livros = sistemaLivros.livros;
        const usuarios = sistemaAuth.getTodosUsuarios();
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const pedidosFisicos = ArmazenamentoLocal.carregar('biblioteca_pedidos_fisicos') || [];

        const relatorio = {
            dataGeracao: new Date().toISOString(),
            totalLivros: livros.length,
            livrosDisponiveis: sistemaLivros.getLivrosDisponiveis(),
            livrosFisicos: sistemaLivros.getLivrosFisicosDisponiveis(),
            totalUsuarios: usuarios.length,
            usuariosAtivos: usuarios.filter(u => u.ativo).length,
            totalEmprestimos: emprestimos.length,
            emprestimosAtivos: emprestimos.filter(e => e.status === 'ativo').length,
            emprestimosAtrasados: emprestimos.filter(e => this.isEmprestimoAtrasado(e)).length,
            pedidosPendentes: pedidosFisicos.filter(p => p.status === 'pendente').length,
            livrosPorGenero: sistemaLivros.getLivrosPorGenero(),
            livrosMaisEmprestados: this.obterLivrosMaisEmprestados(emprestimos),
            usuariosMaisAtivos: this.obterUsuariosMaisAtivos(emprestimos, usuarios)
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

        // Notificação
        sistemaNotificacoes.adicionarNotificacao(
            'Relatório Gerado',
            'Relatório do sistema gerado com sucesso',
            'sucesso'
        );

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

    obterUsuariosMaisAtivos(emprestimos, usuarios) {
        const contagem = {};
        emprestimos.forEach(emp => {
            contagem[emp.usuarioId] = (contagem[emp.usuarioId] || 0) + 1;
        });

        return Object.entries(contagem)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([usuarioId, quantidade]) => {
                const usuario = usuarios.find(u => u.id === usuarioId);
                return {
                    nome: usuario ? usuario.nome : 'Usuário não encontrado',
                    quantidade: quantidade
                };
            });
    }

    exportarCatalogo() {
        const livros = sistemaLivros.livros;
        
        // Converter para CSV
        const cabecalho = ['Título', 'Autor', 'Gênero', 'Ano', 'Editora', 'ISBN', 'Estoque', 'Disponível', 'Classificação'];
        const linhas = livros.map(livro => [
            `"${livro.titulo}"`,
            `"${livro.autor}"`,
            `"${sistemaLivros.obterNomeGenero(livro.genero)}"`,
            livro.ano,
            `"${livro.editora}"`,
            `"${livro.isbn}"`,
            livro.estoque,
            livro.disponivel ? 'Sim' : 'Não',
            `"${livro.classificacaoEtaria === 'L' ? 'Livre' : livro.classificacaoEtaria + ' anos'}"`
        ]);

        const csv = [cabecalho, ...linhas].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catalogo-biblioteca-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mensagens.sucesso('Catálogo exportado com sucesso!');
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

function scrollParaAdmin() {
    document.getElementById('areaAdministrativa').scrollIntoView({ 
        behavior: 'smooth' 
    });
}