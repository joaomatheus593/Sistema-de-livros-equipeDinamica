class SistemaAdministrativoCompacto {
    constructor() {
        this.painelAtual = 'dashboard';
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Configurar formulário de livros
        this.configurarFormularioLivros();
        
        // Carregar dados iniciais se for admin
        if (sistemaAuth.isAdmin()) {
            this.carregarDadosDashboard();
        }
    }

    carregarInterfaceAdmin() {
        const areaAdmin = document.getElementById('areaAdministrativa');
        if (!areaAdmin) return;

        areaAdmin.style.display = 'block';
        areaAdmin.innerHTML = this.gerarHTMLAdmin();
        this.configurarFormularioLivros();
        this.carregarDadosDashboard();
    }

    gerarHTMLAdmin() {
        return `
            <div class="cabecalho-admin">
                <h2 class="titulo-secao">
                    <i class="fas fa-cogs"></i>
                    Painel Administrativo
                </h2>
                <div class="controles-admin">
                    <button class="botao botao-primario" onclick="sistemaAdmin.gerarRelatorio()">
                        <i class="fas fa-file-export"></i>
                        Relatório
                    </button>
                    <button class="botao botao-secundario" onclick="sistemaAdmin.fazerBackup()">
                        <i class="fas fa-download"></i>
                        Backup
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
                                    <span>Livros</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="adicionar-livro" onclick="sistemaAdmin.abrirPainelAdmin('adicionar-livro')">
                                    <i class="fas fa-plus-circle"></i>
                                    <span>Adicionar</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="item-menu" data-painel="emprestimos" onclick="sistemaAdmin.abrirPainelAdmin('emprestimos')">
                                    <i class="fas fa-hand-holding"></i>
                                    <span>Empréstimos</span>
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
                    ${this.gerarPainelDashboard()}
                    ${this.gerarPainelLivros()}
                    ${this.gerarPainelAdicionarLivro()}
                    ${this.gerarPainelEmprestimos()}
                    ${this.gerarPainelUsuarios()}
                    ${this.gerarPainelComentarios()}
                    ${this.gerarPainelConfiguracoes()}
                </div>
            </div>
        `;
    }

    gerarPainelDashboard() {
        return `
            <div id="painelDashboard" class="painel-conteudo ativo">
                <div class="cabecalho-painel">
                    <h3>Visão Geral</h3>
                    <div class="controles-painel">
                        <button class="botao botao-primario" onclick="sistemaAdmin.atualizarDashboard()">
                            <i class="fas fa-sync-alt"></i>
                            Atualizar
                        </button>
                    </div>
                </div>
                <div id="conteudoDashboard">
                    <div class="carregando-compacto"></div>
                </div>
            </div>
        `;
    }

    gerarPainelLivros() {
        return `
            <div id="painelLivros" class="painel-conteudo">
                <div class="cabecalho-painel">
                    <h3>Gerenciar Livros</h3>
                    <div class="controles-painel">
                        <button class="botao botao-primario" onclick="sistemaAdmin.abrirPainelAdmin('adicionar-livro')">
                            <i class="fas fa-plus"></i>
                            Novo Livro
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
                                <th>Estoque</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="tabelaLivrosBody">
                            <tr>
                                <td colspan="5" class="carregando-compacto">Carregando livros...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    gerarPainelAdicionarLivro() {
        return `
            <div id="painelAdicionarLivro" class="painel-conteudo">
                <div class="cabecalho-painel">
                    <h3>Adicionar Livro</h3>
                    <div class="controles-painel">
                        <button class="botao botao-secundario" onclick="sistemaAdmin.limparFormularioLivro()">
                            <i class="fas fa-eraser"></i>
                            Limpar
                        </button>
                    </div>
                </div>
                <form id="formAdicionarLivro" class="formulario-admin-compacto">
                    <div class="formulario-linha-compacta">
                        <div class="campo-formulario-compacto">
                            <label for="tituloLivro">Título *</label>
                            <input type="text" id="tituloLivro" required>
                        </div>
                        <div class="campo-formulario-compacto">
                            <label for="autorLivro">Autor *</label>
                            <input type="text" id="autorLivro" required>
                        </div>
                    </div>

                    <div class="formulario-linha-compacta">
                        <div class="campo-formulario-compacto">
                            <label for="generoLivro">Gênero *</label>
                            <select id="generoLivro" required>
                                <option value="">Selecione...</option>
                                <option value="ficcao">Ficção</option>
                                <option value="romance">Romance</option>
                                <option value="fantasia">Fantasia</option>
                                <option value="aventura">Aventura</option>
                                <option value="misterio">Mistério</option>
                            </select>
                        </div>
                        <div class="campo-formulario-compacto">
                            <label for="anoLivro">Ano *</label>
                            <input type="number" id="anoLivro" min="1000" max="2024" required>
                        </div>
                    </div>

                    <div class="formulario-linha-compacta">
                        <div class="campo-formulario-compacto">
                            <label for="estoqueLivro">Estoque *</label>
                            <input type="number" id="estoqueLivro" min="0" value="1" required>
                        </div>
                        <div class="campo-formulario-compacto">
                            <label for="imagemLivro">Capa (URL)</label>
                            <input type="text" id="imagemLivro">
                        </div>
                    </div>

                    <div class="campo-formulario-compacto">
                        <label for="sinopseLivro">Sinopse *</label>
                        <textarea id="sinopseLivro" rows="3" required></textarea>
                    </div>

                    <div class="acoes-formulario-compacto">
                        <button type="submit" class="botao botao-primario">
                            <i class="fas fa-plus-circle"></i>
                            Adicionar Livro
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    gerarPainelEmprestimos() {
        return `
            <div id="painelEmprestimos" class="painel-conteudo">
                <div class="cabecalho-painel">
                    <h3>Empréstimos Ativos</h3>
                    <div class="controles-painel">
                        <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelEmprestimos()">
                            <i class="fas fa-sync-alt"></i>
                            Atualizar
                        </button>
                    </div>
                </div>
                <div id="conteudoEmprestimos">
                    <div class="carregando-compacto"></div>
                </div>
            </div>
        `;
    }

    gerarPainelUsuarios() {
        return `
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
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="tabelaUsuariosBody">
                            <tr>
                                <td colspan="5" class="carregando-compacto">Carregando usuários...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    gerarPainelComentarios() {
        return `
            <div id="painelComentarios" class="painel-conteudo">
                <div class="cabecalho-painel">
                    <h3>Comentários Pendentes</h3>
                    <div class="controles-painel">
                        <button class="botao botao-primario" onclick="sistemaAdmin.carregarPainelComentarios()">
                            <i class="fas fa-sync-alt"></i>
                            Atualizar
                        </button>
                    </div>
                </div>
                <div id="conteudoComentarios">
                    <div class="carregando-compacto"></div>
                </div>
            </div>
        `;
    }

    gerarPainelConfiguracoes() {
        return `
            <div id="painelConfiguracoes" class="painel-conteudo">
                <div class="cabecalho-painel">
                    <h3>Configurações</h3>
                </div>
                <div class="configuracoes-compactas">
                    <div class="configuracao-card-compacto">
                        <h4><i class="fas fa-palette"></i> Aparência</h4>
                        <div class="configuracao-opcoes-compactas">
                            <button class="botao ${sistemaTema.temaAtual === 'claro' ? 'botao-primario' : 'botao-secundario'}" 
                                    onclick="sistemaTema.alternarTema()">
                                <i class="fas ${sistemaTema.temaAtual === 'claro' ? 'fa-moon' : 'fa-sun'}"></i>
                                Tema ${sistemaTema.temaAtual === 'claro' ? 'Escuro' : 'Claro'}
                            </button>
                        </div>
                    </div>

                    <div class="configuracao-card-compacto">
                        <h4><i class="fas fa-database"></i> Dados</h4>
                        <div class="configuracao-opcoes-compactas">
                            <button class="botao botao-primario" onclick="sistemaAdmin.fazerBackup()">
                                <i class="fas fa-download"></i>
                                Fazer Backup
                            </button>
                            <button class="botao botao-secundario" onclick="sistemaAdmin.limparDados()">
                                <i class="fas fa-trash"></i>
                                Limpar Dados
                            </button>
                        </div>
                    </div>

                    <div class="configuracao-card-compacto">
                        <h4><i class="fas fa-book"></i> Catálogo</h4>
                        <div class="configuracao-opcoes-compactas">
                            <button class="botao botao-primario" onclick="sistemaLivros.carregarMaisLivrosExemplo()">
                                <i class="fas fa-plus"></i>
                                Livros Exemplo
                            </button>
                            <button class="botao botao-secundario" onclick="sistemaAdmin.exportarCatalogo()">
                                <i class="fas fa-file-csv"></i>
                                Exportar CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    configurarFormularioLivros() {
        const form = document.getElementById('formAdicionarLivro');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarLivro();
            });
        }
    }

    abrirPainelAdmin(painel) {
        // Esconder todos os painéis
        document.querySelectorAll('.painel-conteudo').forEach(p => {
            p.classList.remove('ativo');
        });

        // Remover classe ativa do menu
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
        this.carregarDadosPainel(painel);
    }

    carregarDadosPainel(painel) {
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
            case 'usuarios':
                this.carregarPainelUsuarios();
                break;
            case 'comentarios':
                this.carregarPainelComentarios();
                break;
        }
    }

    // ===== DASHBOARD =====
    carregarDadosDashboard() {
        const container = document.getElementById('conteudoDashboard');
        if (!container) return;

        setTimeout(() => {
            const totalLivros = sistemaLivros.getTotalLivros();
            const livrosDisponiveis = sistemaLivros.getLivrosDisponiveis();
            const usuarios = sistemaAuth.getTodosUsuarios();
            const usuariosAtivos = usuarios.filter(u => u.ativo).length;
            const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
            const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo').length;
            const emprestimosAtrasados = emprestimos.filter(e => 
                e.status === 'ativo' && new Date(e.dataDevolucaoPrevista) < new Date()
            ).length;

            container.innerHTML = `
                <div class="dashboard-compacto">
                    <div class="card-dashboard">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Total de Livros</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-book"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${totalLivros}</div>
                        <div class="card-dashboard-variacao positivo">
                            <i class="fas fa-check"></i>
                            ${livrosDisponiveis} disponíveis
                        </div>
                    </div>

                    <div class="card-dashboard">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Usuários Ativos</h4>
                            <div class="card-dashboard-icon">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="card-dashboard-valor">${usuariosAtivos}</div>
                        <div class="card-dashboard-variacao">
                            <i class="fas fa-user"></i>
                            Total: ${usuarios.length}
                        </div>
                    </div>

                    <div class="card-dashboard">
                        <div class="card-dashboard-header">
                            <h4 class="card-dashboard-titulo">Empréstimos</h4>
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
                </div>

                <div class="graficos-compactos">
                    <div class="grafico-card">
                        <h4>Livros por Gênero</h4>
                        <div class="grafico-barras-compacto">
                            ${this.gerarGraficoGenerosCompacto()}
                        </div>
                    </div>
                </div>

                <div class="alertas-compactos">
                    <h4>Alertas do Sistema</h4>
                    <div class="lista-alertas-compacta">
                        ${this.gerarAlertasSistemaCompacto(emprestimosAtrasados)}
                    </div>
                </div>
            `;
        }, 500);
    }

    gerarGraficoGenerosCompacto() {
        const livrosPorGenero = sistemaLivros.getLivrosPorGenero();
        const generos = Object.keys(livrosPorGenero);
        const maxQuantidade = Math.max(...Object.values(livrosPorGenero));

        return generos.map(genero => {
            const quantidade = livrosPorGenero[genero];
            const altura = maxQuantidade > 0 ? (quantidade / maxQuantidade) * 80 : 0;
            const nomeAbreviado = sistemaLivros.obterNomeGenero(genero).substring(0, 3);
            
            return `
                <div class="barra-genero-compacta">
                    <div class="barra" style="height: ${altura}px; background-color: ${this.obterCorGenero(generos.indexOf(genero))};"></div>
                    <div class="barra-valor-compacta">${nomeAbreviado}</div>
                    <div class="barra-valor-compacta">${quantidade}</div>
                </div>
            `;
        }).join('');
    }

    gerarAlertasSistemaCompacto(emprestimosAtrasados) {
        const alertas = [];

        if (emprestimosAtrasados > 0) {
            alertas.push(`
                <div class="alerta-item-compacto critico">
                    <i class="fas fa-clock"></i>
                    <span>${emprestimosAtrasados} empréstimo(s) em atraso</span>
                </div>
            `);
        }

        const comentariosPendentes = sistemaComentarios.getComentariosPendentes().length;
        if (comentariosPendentes > 0) {
            alertas.push(`
                <div class="alerta-item-compacto aviso">
                    <i class="fas fa-comments"></i>
                    <span>${comentariosPendentes} comentário(s) pendentes</span>
                </div>
            `);
        }

        if (alertas.length === 0) {
            return `
                <div class="alerta-item-compacto">
                    <i class="fas fa-check-circle"></i>
                    <span>Sistema funcionando normalmente</span>
                </div>
            `;
        }

        return alertas.join('');
    }

    // ===== LIVROS =====
    carregarTabelaLivros() {
        const tbody = document.getElementById('tabelaLivrosBody');
        if (!tbody) return;

        const livros = sistemaLivros.livros.slice(0, 10); // Mostrar apenas 10 livros

        if (livros.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="sem-dados-compacto">
                        <i class="fas fa-book"></i>
                        <p>Nenhum livro cadastrado</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = livros.map(livro => `
            <tr>
                <td>
                    <div class="livro-info-compacto">
                        <img src="${livro.imagem}" alt="${livro.titulo}" 
                             onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100'">
                        <div>
                            <strong>${Formatadores.limitarTexto(livro.titulo, 25)}</strong>
                        </div>
                    </div>
                </td>
                <td>${Formatadores.limitarTexto(livro.autor, 20)}</td>
                <td>
                    <span class="badge-compacto genero">${sistemaLivros.obterNomeGenero(livro.genero)}</span>
                </td>
                <td>
                    <span class="estoque-compacto ${livro.estoque > 0 ? 'disponivel' : 'indisponivel'}">
                        ${livro.estoque}
                    </span>
                </td>
                <td>
                    <div class="acoes-tabela-compacta">
                        <button class="botao-acao-compacto botao-editar-compacto" onclick="sistemaAdmin.editarLivro('${livro.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="botao-acao-compacto botao-excluir-compacto" onclick="sistemaAdmin.excluirLivro('${livro.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== EMPRÉSTIMOS =====
    carregarPainelEmprestimos() {
        const container = document.getElementById('conteudoEmprestimos');
        if (!container) return;

        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo').slice(0, 5); // Apenas 5

        if (emprestimosAtivos.length === 0) {
            container.innerHTML = '<div class="sem-dados-compacto">Nenhum empréstimo ativo</div>';
            return;
        }

        container.innerHTML = `
            <div class="lista-compacta">
                ${emprestimosAtivos.map(emp => `
                    <div class="item-lista-compacto">
                        <div class="cabecalho-item-compacto">
                            <h4 class="titulo-item-compacto">${emp.livroTitulo}</h4>
                            <span class="status-item-compacto ${this.isEmprestimoAtrasado(emp) ? 'status-pendente-compacto' : 'status-ativo-compacto'}">
                                ${this.isEmprestimoAtrasado(emp) ? 'Atrasado' : 'No Prazo'}
                            </span>
                        </div>
                        <div class="detalhes-item-compacto">
                            <span><strong>Usuário:</strong> ${emp.usuarioNome}</span>
                            <span><strong>Data:</strong> ${UtilitariosData.formatarData(emp.dataEmprestimo)}</span>
                            <span><strong>Devolução:</strong> ${UtilitariosData.formatarData(emp.dataDevolucaoPrevista)}</span>
                        </div>
                        <div class="acoes-item-compacto">
                            <button class="botao botao-primario botao-pequeno" onclick="sistemaAdmin.registrarDevolucao('${emp.id}')">
                                <i class="fas fa-undo"></i>
                                Devolver
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== USUÁRIOS =====
    carregarPainelUsuarios() {
        const tbody = document.getElementById('tabelaUsuariosBody');
        if (!tbody) return;

        const usuarios = sistemaAuth.getTodosUsuarios().slice(0, 10); // Apenas 10 usuários

        if (usuarios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="sem-dados-compacto">
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
                    <div class="usuario-info-compacto">
                        <div class="usuario-avatar-compacto">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <strong>${Formatadores.limitarTexto(usuario.nome, 20)}</strong>
                        </div>
                    </div>
                </td>
                <td>${usuario.usuario}</td>
                <td>
                    <span class="badge-compacto ${usuario.tipo === 'admin' ? 'admin' : 'usuario'}">
                        ${usuario.tipo === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                </td>
                <td>
                    <span class="estoque-compacto ${usuario.ativo ? 'disponivel' : 'indisponivel'}">
                        ${usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="acoes-tabela-compacta">
                        ${usuario.id !== usuarioLogado?.id ? `
                            <button class="botao-acao-compacto ${usuario.ativo ? 'botao-excluir-compacto' : 'botao-editar-compacto'}" 
                                    onclick="sistemaAdmin.${usuario.ativo ? 'desativarUsuario' : 'ativarUsuario'}('${usuario.id}')"
                                    title="${usuario.ativo ? 'Desativar' : 'Ativar'}">
                                <i class="fas ${usuario.ativo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== COMENTÁRIOS =====
    carregarPainelComentarios() {
        const container = document.getElementById('conteudoComentarios');
        if (!container) return;

        const comentariosPendentes = sistemaComentarios.getComentariosPendentes().slice(0, 5); // Apenas 5

        if (comentariosPendentes.length === 0) {
            container.innerHTML = '<div class="sem-dados-compacto">Nenhum comentário pendente</div>';
            return;
        }

        container.innerHTML = `
            <div class="lista-compacta">
                ${comentariosPendentes.map(comentario => {
                    const livro = sistemaLivros.livros.find(l => l.id === comentario.livroId);
                    const livroTitulo = livro ? livro.titulo : 'Livro não encontrado';
                    
                    return `
                        <div class="item-lista-compacto">
                            <div class="cabecalho-item-compacto">
                                <h4 class="titulo-item-compacto">${Formatadores.limitarTexto(livroTitulo, 30)}</h4>
                                <span class="status-item-compacto status-pendente-compacto">Pendente</span>
                            </div>
                            <div class="detalhes-item-compacto">
                                <span><strong>Usuário:</strong> ${comentario.usuarioNome}</span>
                                <span><strong>Avaliação:</strong> ${sistemaLivros.gerarEstrelas(comentario.avaliacao)}</span>
                            </div>
                            <div class="detalhes-item-compacto">
                                <span colspan="2"><strong>Comentário:</strong> ${Formatadores.limitarTexto(comentario.comentario, 50)}</span>
                            </div>
                            <div class="acoes-item-compacto">
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
                }).join('')}
            </div>
        `;
    }

    // ===== FUNÇÕES AUXILIARES =====
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    obterCorGenero(index) {
        const cores = ['#8B0000', '#A52A2A', '#D4AF37', '#B8860B', '#28a745', '#007bff'];
        return cores[index % cores.length];
    }

    isEmprestimoAtrasado(emprestimo) {
        if (emprestimo.status !== 'ativo') return false;
        const hoje = new Date();
        const dataDevolucao = new Date(emprestimo.dataDevolucaoPrevista);
        return dataDevolucao < hoje;
    }

    // ===== FUNÇÕES DE AÇÃO =====
    adicionarLivro() {
        const titulo = document.getElementById('tituloLivro').value.trim();
        const autor = document.getElementById('autorLivro').value.trim();
        const genero = document.getElementById('generoLivro').value;
        const ano = parseInt(document.getElementById('anoLivro').value);
        const estoque = parseInt(document.getElementById('estoqueLivro').value);
        const sinopse = document.getElementById('sinopseLivro').value.trim();
        const imagem = document.getElementById('imagemLivro').value.trim();

        if (!titulo || !autor || !genero || !ano || !sinopse) {
            mensagens.erro('Preencha todos os campos obrigatórios.');
            return;
        }

        const novoLivro = {
            id: GeradorID.gerar(),
            titulo: titulo,
            autor: autor,
            genero: genero,
            ano: ano,
            estoque: estoque,
            disponivel: estoque > 0,
            sinopse: sinopse,
            descricao: sinopse,
            imagem: imagem || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0
        };

        sistemaLivros.livros.push(novoLivro);
        ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);

        mensagens.sucesso(`Livro "${titulo}" adicionado com sucesso!`);
        this.limparFormularioLivro();
        this.abrirPainelAdmin('livros');
    }

    limparFormularioLivro() {
        const form = document.getElementById('formAdicionarLivro');
        if (form) {
            form.reset();
        }
    }

    editarLivro(livroId) {
        // Implementação simplificada - abrir no painel de adição com dados preenchidos
        const livro = sistemaLivros.livros.find(l => l.id === livroId);
        if (livro) {
            document.getElementById('tituloLivro').value = livro.titulo;
            document.getElementById('autorLivro').value = livro.autor;
            document.getElementById('generoLivro').value = livro.genero;
            document.getElementById('anoLivro').value = livro.ano;
            document.getElementById('estoqueLivro').value = livro.estoque;
            document.getElementById('sinopseLivro').value = livro.sinopse;
            document.getElementById('imagemLivro').value = livro.imagem;
            
            this.abrirPainelAdmin('adicionar-livro');
            mensagens.info(`Editando: ${livro.titulo}`);
        }
    }

    excluirLivro(livroId) {
        if (!confirm('Tem certeza que deseja excluir este livro?')) return;

        const livroIndex = sistemaLivros.livros.findIndex(l => l.id === livroId);
        if (livroIndex !== -1) {
            const livro = sistemaLivros.livros[livroIndex];
            sistemaLivros.livros.splice(livroIndex, 1);
            ArmazenamentoLocal.salvar('biblioteca_livros', sistemaLivros.livros);
            
            mensagens.sucesso(`Livro "${livro.titulo}" excluído!`);
            this.carregarTabelaLivros();
        }
    }

    registrarDevolucao(emprestimoId) {
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoIndex = emprestimos.findIndex(e => e.id === emprestimoId);
        
        if (emprestimoIndex !== -1) {
            emprestimos[emprestimoIndex].status = 'finalizado';
            emprestimos[emprestimoIndex].dataDevolucao = new Date().toISOString();
            ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);
            
            mensagens.sucesso('Devolução registrada!');
            this.carregarPainelEmprestimos();
        }
    }

    desativarUsuario(usuarioId) {
        if (sistemaAuth.desativarUsuario(usuarioId)) {
            mensagens.sucesso('Usuário desativado!');
            this.carregarPainelUsuarios();
        }
    }

    ativarUsuario(usuarioId) {
        if (sistemaAuth.ativarUsuario(usuarioId)) {
            mensagens.sucesso('Usuário ativado!');
            this.carregarPainelUsuarios();
        }
    }

    aprovarComentario(comentarioId) {
        if (sistemaComentarios.aprovarComentario(comentarioId)) {
            mensagens.sucesso('Comentário aprovado!');
            this.carregarPainelComentarios();
        }
    }

    rejeitarComentario(comentarioId) {
        if (sistemaComentarios.rejeitarComentario(comentarioId)) {
            mensagens.info('Comentário rejeitado!');
            this.carregarPainelComentarios();
        }
    }

    // ===== FUNÇÕES DO SISTEMA =====
    fazerBackup() {
        const dados = {
            livros: sistemaLivros.livros,
            usuarios: sistemaAuth.usuarios,
            dataBackup: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-biblioteca-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        mensagens.sucesso('Backup realizado!');
    }

    limparDados() {
        if (!confirm('ATENÇÃO: Isso apagará TODOS os dados. Continuar?')) return;
        
        ArmazenamentoLocal.limpar();
        mensagens.info('Dados limpos. Recarregando...');
        setTimeout(() => location.reload(), 2000);
    }

    exportarCatalogo() {
        const livros = sistemaLivros.livros;
        const csv = ['Título,Autor,Gênero,Ano,Estoque'].concat(
            livros.map(l => `"${l.titulo}","${l.autor}","${l.genero}",${l.ano},${l.estoque}`)
        ).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catalogo-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        mensagens.sucesso('Catálogo exportado!');
    }

    gerarRelatorio() {
        const livros = sistemaLivros.livros;
        const usuarios = sistemaAuth.getTodosUsuarios();
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];

        const relatorio = {
            data: new Date().toISOString(),
            totalLivros: livros.length,
            totalUsuarios: usuarios.length,
            totalEmprestimos: emprestimos.length,
            livrosPorGenero: sistemaLivros.getLivrosPorGenero()
        };

        const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        mensagens.sucesso('Relatório gerado!');
    }

    atualizarDashboard() {
        this.carregarDadosDashboard();
        mensagens.info('Dashboard atualizado!');
    }
}

// Inicializar o sistema administrativo compacto
const sistemaAdmin = new SistemaAdministrativoCompacto();

// Funções globais para o HTML
function abrirPainelAdmin(painel) {
    sistemaAdmin.abrirPainelAdmin(painel);
}

function mostrarAreaAdmin() {
    sistemaAdmin.carregarInterfaceAdmin();
}

