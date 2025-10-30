class SistemaLivros {
    
    constructor() {
    this.livros = this.carregarLivros();
    this.livrosFiltrados = [];
    this.filtrosAtivos = {};
    this.paginaAtual = 1;
    this.livrosPorPagina = 16; // ✅ MAIS LIVROS POR PÁGINA
    this.tamanhoExibicao = 'pequeno'; // ✅ TAMANHO PEQUENO PADRÃO
        
        // ✅ AGUARDAR O DOM ESTAR PRONTO ANTES DE INICIALIZAR
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.inicializarEventos();
                this.verificarSistemaPrincipal();
            });
        } else {
            setTimeout(() => {
                this.inicializarEventos();
                this.verificarSistemaPrincipal();
            }, 100);
        }
        
        console.log('📚 Sistema de Livros inicializado com', this.livros.length, 'livros');
    }

    verificarSistemaPrincipal() {
        // ✅ VERIFICAR SE O SISTEMA PRINCIPAL JÁ ESTÁ VISÍVEL
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        if (sistemaPrincipal && sistemaPrincipal.style.display !== 'none') {
            console.log('🚀 Sistema principal já visível - carregando livros...');
            setTimeout(() => {
                this.carregarLivrosNaInterface();
            }, 300);
        }
    }


   arregarLivros() {
    let livros = ArmazenamentoLocal.carregar('biblioteca_livros');
    
    if (!livros || livros.length === 0) {
        console.log('📖 Criando catálogo de livros padrão...');
        livros = this.criarCatalogoComImagensCorretas();
        ArmazenamentoLocal.salvar('biblioteca_livros', livros);
    }
    
    return livros;
}

criarCatalogoComImagensCorretas() {
    // ✅ IMAGENS 100% FUNCIONAIS DO UNSPLASH
    const imagens = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1558901357-ca41e027e43a?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400'
    ];

    return [
        {
            id: GeradorID.gerar(),
            titulo: 'Dom Casmurro',
            autor: 'Machado de Assis',
            genero: 'romance',
            ano: 1899,
            editora: 'Editora Garnier',
            paginas: 256,
            descricao: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e Capitu com a famosa dúvida sobre traição.',
            imagem: imagens[0], // ✅ IMAGEM CORRETA
            estoque: 5,
            disponivel: true,
            isbn: GeradorID.gerarISBN(),
            valorEmprestimo: 0,
            taxaJuros: 0.5,
            prazoEmprestimo: 14,
            dataCadastro: new Date().toISOString(),
            avaliacao: 4.8,
            totalAvaliacoes: 124,
            restricaoIdade: 12,
            tags: ['clássico', 'literatura brasileira', 'machado de assis']
        },
        {
            id: GeradorID.gerar(),
            titulo: 'O Cortiço',
            autor: 'Aluísio Azevedo',
            genero: 'romance',
            ano: 1890,
            editora: 'Editora Garnier',
            paginas: 312,
            descricao: 'Romance naturalista que retrata a vida em um cortiço carioca do século XIX, mostrando as condições sociais da época.',
            imagem: imagens[1], // ✅ IMAGEM CORRETA
            estoque: 3,
            disponivel: true,
            isbn: GeradorID.gerarISBN(),
            valorEmprestimo: 2.50,
            taxaJuros: 0.5,
            prazoEmprestimo: 14,
            dataCadastro: new Date().toISOString(),
            avaliacao: 4.5,
            totalAvaliacoes: 89,
            restricaoIdade: 14,
            tags: ['naturalismo', 'romance social', 'século xix']
        },
        {
            id: GeradorID.gerar(),
            titulo: 'Vidas Secas',
            autor: 'Graciliano Ramos',
            genero: 'romance',
            ano: 1938,
            editora: 'Editora Record',
            paginas: 176,
            descricao: 'Obra-prima do modernismo brasileiro que retrata a vida difícil de uma família de retirantes no sertão nordestino.',
            imagem: imagens[2], // ✅ IMAGEM CORRETA
            estoque: 4,
            disponivel: true,
            isbn: GeradorID.gerarISBN(),
            valorEmprestimo: 0,
            taxaJuros: 0.5,
            prazoEmprestimo: 14,
            dataCadastro: new Date().toISOString(),
            avaliacao: 4.6,
            totalAvaliacoes: 78,
            restricaoIdade: 12,
            tags: ['modernismo', 'sertão', 'literatura social']
        },
        // ... (continue com os outros livros, usando imagens[3], imagens[4], etc.)
    ];
}
    inicializarEventos() {
    console.log('🔧 Inicializando eventos do sistema de livros...');
    
    // Pesquisa em tempo real
    const campoPesquisa = document.getElementById('campoPesquisa');
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', (e) => {
            clearTimeout(this.pesquisaTimeout);
            this.pesquisaTimeout = setTimeout(() => {
                this.aplicarFiltros();
            }, 500);
        });

        campoPesquisa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.aplicarFiltros();
            }
        });
    }

    // ✅ OBSERVAR MUDANÇAS NA VISIBILIDADE DO SISTEMA
    this.inicializarObservador();
}

inicializarObservador() {
    const sistemaPrincipal = document.getElementById('sistemaPrincipal');
    if (!sistemaPrincipal) {
        console.error('❌ Sistema principal não encontrado');
        return;
    }

    // ✅ OBSERVAR MUDANÇAS NO ESTILO DO SISTEMA PRINCIPAL
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const displayStyle = sistemaPrincipal.style.display;
                if (displayStyle !== 'none') {
                    console.log('🎯 Sistema principal ficou visível - carregando livros...');
                    setTimeout(() => {
                        this.carregarLivrosNaInterface();
                    }, 200);
                }
            }
        });
    });

    observer.observe(sistemaPrincipal, { 
        attributes: true, 
        attributeFilter: ['style'] 
    });

    console.log('👀 Observador do sistema principal inicializado');
}

   carregarLivrosNaInterface() {
    console.log('📚 Carregando livros na interface...');
    
    // ✅ VERIFICAR SE OS ELEMENTOS EXISTEM
    if (!this.verificarElementosDOM()) {
        console.error('❌ Elementos DOM não encontrados');
        return;
    }

    this.carregarDestaques();
    this.aplicarFiltros();
    
    console.log('✅ Livros carregados com sucesso na interface');
}

verificarElementosDOM() {
    const elementosNecessarios = [
        'carrosselDestaques',
        'gradeLivros',
        'totalLivrosEncontrados'
    ];

    for (const elementoId of elementosNecessarios) {
        if (!document.getElementById(elementoId)) {
            console.error(`❌ Elemento não encontrado: ${elementoId}`);
            return false;
        }
    }

    return true;
}
obterNomeGenero(genero) {
    const generos = {
        'ficcao': 'Ficção',
        'romance': 'Romance',
        'fantasia': 'Fantasia',
        'aventura': 'Aventura',
        'misterio': 'Mistério',
        'biografia': 'Biografia',
        'historia': 'História',
        'ciencia': 'Ciência',
        'tecnologia': 'Tecnologia',
        'autoajuda': 'Autoajuda'
    };
    return generos[genero] || genero;
}
atualizarPaginacao() {
    const container = document.getElementById('paginacao');
    if (!container) return;

    const totalPaginas = Math.ceil(this.livrosFiltrados.length / this.livrosPorPagina);
    
    if (totalPaginas <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginacaoHTML = '';
    
    // Botão anterior
    if (this.paginaAtual > 1) {
        paginacaoHTML += `<button class="pagina" onclick="sistemaLivros.irParaPagina(${this.paginaAtual - 1})">‹</button>`;
    }

    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= this.paginaAtual - 1 && i <= this.paginaAtual + 1)) {
            paginacaoHTML += `
                <button class="pagina ${i === this.paginaAtual ? 'ativa' : ''}" 
                        onclick="sistemaLivros.irParaPagina(${i})">
                    ${i}
                </button>
            `;
        } else if (i === this.paginaAtual - 2 || i === this.paginaAtual + 2) {
            paginacaoHTML += `<span class="pagina">...</span>`;
        }
    }

    // Botão próximo
    if (this.paginaAtual < totalPaginas) {
        paginacaoHTML += `<button class="pagina" onclick="sistemaLivros.irParaPagina(${this.paginaAtual + 1})">›</button>`;
    }

    container.innerHTML = paginacaoHTML;
}

irParaPagina(pagina) {
    this.paginaAtual = pagina;
    this.atualizarGradeLivros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
    carregarDestaques() {
        const container = document.getElementById('carrosselDestaques');
        if (!container) return;

        // Selecionar livros em destaque (os mais bem avaliados)
        const destaques = [...this.livros]
            .sort((a, b) => b.avaliacao - a.avaliacao)
            .slice(0, 6);

        container.innerHTML = destaques.map(livro => `
            <div class="cartao-destaque" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="overlay-destaque">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 40)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="avaliacao-livro">
                        <i class="fas fa-star" style="color: var(--dourado);"></i>
                        <span>${livro.avaliacao.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    aplicarFiltros() {
        const termoPesquisa = document.getElementById('campoPesquisa')?.value.toLowerCase() || '';
        const genero = document.getElementById('filtroGenero')?.value || '';
        const ano = document.getElementById('filtroAno')?.value || '';
        const disponibilidade = document.getElementById('filtroDisponibilidade')?.value || '';
        const ordenacao = document.getElementById('filtroOrdenacao')?.value || 'relevancia';
        const restricaoIdade = document.getElementById('filtroIdade')?.value || '';

        // Aplicar filtros
        this.livrosFiltrados = this.livros.filter(livro => {
            const correspondePesquisa = 
                livro.titulo.toLowerCase().includes(termoPesquisa) ||
                livro.autor.toLowerCase().includes(termoPesquisa) ||
                livro.genero.toLowerCase().includes(termoPesquisa) ||
                livro.descricao.toLowerCase().includes(termoPesquisa) ||
                (livro.tags && livro.tags.some(tag => tag.toLowerCase().includes(termoPesquisa)));

            const correspondeGenero = !genero || livro.genero === genero;
            const correspondeAno = !ano || livro.ano.toString() === ano;
            const correspondeDisponibilidade = 
                !disponibilidade || 
                (disponibilidade === 'disponivel' && livro.disponivel) ||
                (disponibilidade === 'indisponivel' && !livro.disponivel);
            
            const correspondeIdade = !restricaoIdade || livro.restricaoIdade <= parseInt(restricaoIdade);

            return correspondePesquisa && correspondeGenero && correspondeAno && correspondeDisponibilidade && correspondeIdade;
        });

        // Aplicar ordenação
        this.ordenarLivros(ordenacao);

        this.paginaAtual = 1;
        this.atualizarGradeLivros();
    }

    ordenarLivros(ordenacao) {
        switch (ordenacao) {
            case 'titulo':
                this.livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'titulo-desc':
                this.livrosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
                break;
            case 'ano':
                this.livrosFiltrados.sort((a, b) => b.ano - a.ano);
                break;
            case 'ano-desc':
                this.livrosFiltrados.sort((a, b) => a.ano - b.ano);
                break;
            case 'avaliacao':
                this.livrosFiltrados.sort((a, b) => b.avaliacao - a.avaliacao);
                break;
            case 'relevancia':
            default:
                // Manter ordem original para relevância
                break;
        }
    }

    atualizarGradeLivros() {
    const container = document.getElementById('gradeLivros');
    const totalElement = document.getElementById('totalLivrosEncontrados');
    
    if (!container) {
        console.error('❌ Container gradeLivros não encontrado');
        return;
    }

    // Atualizar contador
    if (totalElement) {
        totalElement.textContent = this.livrosFiltrados.length;
    }

    // Calcular livros para a página atual
    const inicio = (this.paginaAtual - 1) * this.livrosPorPagina;
    const fim = inicio + this.livrosPorPagina;
    const livrosPagina = this.livrosFiltrados.slice(inicio, fim);

    // Aplicar classe de tamanho
    container.className = `grade-livros tamanho-${this.tamanhoExibicao}`;

    // Gerar HTML dos livros
    if (livrosPagina.length === 0) {
        container.innerHTML = `
            <div class="sem-dados" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-book" style="font-size: 3rem; color: var(--cinza-medio); margin-bottom: 20px;"></i>
                <h3 style="color: var(--cinza-medio); margin-bottom: 10px;">Nenhum livro encontrado</h3>
                <p style="color: var(--cinza-medio);">Tente ajustar os filtros de pesquisa.</p>
            </div>
        `;
    } else {
        container.innerHTML = livrosPagina.map(livro => this.criarCartaoLivro(livro)).join('');
    }

    // Atualizar paginação
    this.atualizarPaginacao();
    
    console.log('✅ Grade de livros atualizada:', this.livrosFiltrados.length, 'livros encontrados');
}

// ✅ CORRIJA O método irParaPagina() para não fazer scroll
irParaPagina(pagina) {
    this.paginaAtual = pagina;
    this.atualizarGradeLivros();
    // ✅ REMOVA O SCROLL AUTOMÁTICO
    // window.scrollTo({ top: 0, behavior: 'smooth' });
}

    criarCartaoLivro(livro) {
    const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
    const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);
    
    // ✅ CORREÇÃO DAS IMAGENS - URLs válidas do Unsplash
    const imagensPadrao = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400&h=250&fit=crop'
    ];
    
    // ✅ SELEÇÃO ALEATÓRIA DE CAPA SE A IMAGEM ORIGINAL NÃO CARREGAR
    const imagemAleatoria = imagensPadrao[Math.floor(Math.random() * imagensPadrao.length)];
    
    return `
        <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
            <div class="container-imagem-livro">
                <img src="${livro.imagem}" alt="${livro.titulo}" 
                     onerror="this.src='${imagemAleatoria}'"
                     class="imagem-livro">
                <div class="overlay-imagem"></div>
            </div>
            <div class="info-livro">
                <h3 class="titulo-livro">${Formatadores.limitarTexto(livro.titulo, 50)}</h3>
                <p class="autor-livro">${livro.autor}</p>
                <div class="meta-livro">
                    <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                    <span class="restricao-idade ${restricaoClasse}" title="${restricaoTexto}">
                        ${livro.restricaoIdade === 0 ? 'L' : livro.restricaoIdade}
                    </span>
                </div>
                <div class="avaliacao-livro">
                    <div class="estrelas">
                        ${this.gerarEstrelas(livro.avaliacao)}
                    </div>
                    <span class="nota-livro">${livro.avaliacao.toFixed(1)} (${livro.totalAvaliacoes})</span>
                </div>
                <div class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                    <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                </div>
                ${livro.disponivel ? `
                    <div class="acoes-livro">
                        <button class="botao botao-primario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.solicitarEmprestimo('${livro.id}')">
                            <i class="fas fa-hand-holding"></i>
                            Emprestar
                        </button>
                        <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.agendarRetirada('${livro.id}')">
                            <i class="fas fa-calendar-check"></i>
                            Agendar
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ✅ MÉTODO PARA GERAR ESTRELAS DE AVALIAÇÃO
gerarEstrelas(avaliacao) {
    const estrelasCheias = Math.floor(avaliacao);
    const meiaEstrela = avaliacao % 1 >= 0.5;
    const estrelasVazias = 5 - estrelasCheias - (meiaEstrela ? 1 : 0);
    
    let html = '';
    
    // Estrelas cheias
    for (let i = 0; i < estrelasCheias; i++) {
        html += '<i class="fas fa-star estrela-cheia"></i>';
    }
    
    // Meia estrela
    if (meiaEstrela) {
        html += '<i class="fas fa-star-half-alt estrela-meia"></i>';
    }
    
    // Estrelas vazias
    for (let i = 0; i < estrelasVazias; i++) {
        html += '<i class="far fa-star estrela-vazia"></i>';
    }
    
    return html;
}
    obterClasseRestricaoIdade(idade) {
        if (idade === 0) return 'restricao-livre';
        if (idade <= 10) return 'restricao-10';
        if (idade <= 12) return 'restricao-12';
        if (idade <= 14) return 'restricao-14';
        if (idade <= 16) return 'restricao-16';
        return 'restricao-18';
    }

    obterTextoRestricaoIdade(idade) {
        if (idade === 0) return 'Livre para todas as idades';
        if (idade <= 10) return 'Recomendado para maiores de 10 anos';
        if (idade <= 12) return 'Recomendado para maiores de 12 anos';
        if (idade <= 14) return 'Recomendado para maiores de 14 anos';
        if (idade <= 16) return 'Recomendado para maiores de 16 anos';
        return 'Recomendado para maiores de 18 anos';
    }

    // ... (o restante dos métodos permanece similar, mas atualizado para incluir a restrição de idade)

   abrirDetalhesLivro(livroId) {
    console.log('📖 Abrindo detalhes do livro:', livroId);
    
    const livro = this.livros.find(l => l.id === livroId);
    if (!livro) {
        mensagens.erro('Livro não encontrado.');
        return;
    }

    const modal = document.getElementById('modalDetalhesLivro');
    const conteudo = document.getElementById('conteudoDetalhesLivro');

    if (!modal || !conteudo) {
        console.error('❌ Modal de detalhes não encontrado');
        return;
    }

    // ✅ CORREÇÃO DO MODAL - CONTEÚDO MAIS COMPACTO
    const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
    const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);

    conteudo.innerHTML = `
        <div class="detalhes-livro-compacto">
            <div class="detalhes-cabecalho-compacto">
                <div class="imagem-container-compacto">
                    <img src="${livro.imagem}" alt="${livro.titulo}" 
                         class="imagem-livro-compacto"
                         onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=300'">
                </div>
                <div class="info-principal-compacto">
                    <h2 class="titulo-compacto">${livro.titulo}</h2>
                    <p class="autor-compacto">por <strong>${livro.autor}</strong></p>
                    
                    <div class="metadados-compacto">
                        <span class="badge genero">${this.obterNomeGenero(livro.genero)}</span>
                        <span class="badge ano">${livro.ano}</span>
                        <span class="badge classificacao ${restricaoClasse}">${livro.restricaoIdade === 0 ? 'L' : livro.restricaoIdade}+</span>
                    </div>
                    
                    <div class="avaliacao-compacto">
                        <div class="estrelas">
                            ${this.gerarEstrelas(livro.avaliacao)}
                        </div>
                        <span class="nota">${livro.avaliacao.toFixed(1)} (${livro.totalAvaliacoes})</span>
                    </div>
                    
                    <div class="status-compacto ${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? `Disponível - ${livro.estoque} unidade(s)` : 'Indisponível'}
                    </div>
                    
                    <div class="acoes-compacto">
                        ${livro.disponivel ? `
                            <button class="botao botao-primario btn-acao" onclick="sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                <i class="fas fa-hand-holding"></i>
                                Emprestar
                            </button>
                            <button class="botao botao-secundario btn-acao" onclick="sistemaLivros.agendarRetirada('${livro.id}')">
                                <i class="fas fa-calendar-check"></i>
                                Agendar
                            </button>
                        ` : `
                            <button class="botao botao-secundario btn-acao" onclick="sistemaLivros.notificarDisponibilidade('${livro.id}')">
                                <i class="fas fa-bell"></i>
                                Notificar
                            </button>
                        `}
                        <button class="botao botao-secundario btn-acao" onclick="sistemaLivros.adicionarAosFavoritos('${livro.id}')">
                            <i class="fas fa-heart"></i>
                            Favoritar
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-conteudo-compacto">
                <div class="secao">
                    <h3 class="titulo-secao">📖 Sinopse</h3>
                    <p class="texto-sinopse">${livro.descricao}</p>
                </div>
                
                <div class="secao">
                    <h3 class="titulo-secao">ℹ️ Informações</h3>
                    <div class="grid-info">
                        <div class="info-item">
                            <span class="label">Editora:</span>
                            <span class="valor">${livro.editora}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">ISBN:</span>
                            <span class="valor">${livro.isbn}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Páginas:</span>
                            <span class="valor">${livro.paginas || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Classificação:</span>
                            <span class="valor ${restricaoClasse}">${restricaoTexto}</span>
                        </div>
                    </div>
                </div>

                <div class="secao">
                    <h3 class="titulo-secao">💰 Condições</h3>
                    <div class="grid-condicoes">
                        <div class="condicao-item">
                            <i class="fas fa-calendar"></i>
                            <span>${livro.prazoEmprestimo} dias</span>
                        </div>
                        <div class="condicao-item">
                            <i class="fas fa-money-bill"></i>
                            <span>${livro.valorEmprestimo > 0 ? Formatadores.formatarMoeda(livro.valorEmprestimo) : 'Grátis'}</span>
                        </div>
                        <div class="condicao-item">
                            <i class="fas fa-percentage"></i>
                            <span>${livro.taxaJuros}% dia</span>
                        </div>
                    </div>
                </div>

                <div class="secao" id="secao-comentarios">
                    <h3 class="titulo-secao">💬 Avaliações</h3>
                    <div id="lista-comentarios" class="comentarios-container">
                        <div class="carregando">
                            <i class="fas fa-spinner fa-spin"></i>
                            Carregando comentários...
                        </div>
                    </div>
                    
                    ${sistemaAuth.getUsuarioLogado() && sistemaAuth.getUsuarioLogado().tipo !== 'convidado' ? `
                        <div class="form-comentario">
                            <h4>Deixe sua avaliação</h4>
                            <div class="estrelas-avaliacao">
                                ${[1,2,3,4,5].map(star => `
                                    <i class="fas fa-star" data-rating="${star}" 
                                       onclick="sistemaComentarios.selecionarAvaliacao(${star})"></i>
                                `).join('')}
                            </div>
                            <textarea placeholder="Seu comentário..." rows="3"></textarea>
                            <button class="botao botao-primario" onclick="sistemaComentarios.adicionarComentario(event, '${livro.id}')">
                                Enviar
                            </button>
                        </div>
                    ` : `
                        <p class="aviso-login">
                            <a href="#" onclick="fecharModal('modalDetalhesLivro'); mostrarLogin()">Faça login</a> para comentar
                        </p>
                    `}
                </div>
            </div>
        </div>
    `;

    // ✅ CARREGAR COMENTÁRIOS
    if (typeof sistemaComentarios !== 'undefined') {
        setTimeout(() => {
            sistemaComentarios.carregarComentariosLivro(livroId);
        }, 100);
    }

    // ✅ ABRIR MODAL
    this.abrirModal('modalDetalhesLivro');
}
// ✅ MÉTODO PARA ABRIR MODAL
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
// ✅ MÉTODOS AUXILIARES PARA AÇÕES
adicionarAosFavoritos(livroId) {
    const livro = this.livros.find(l => l.id === livroId);
    if (livro) {
        mensagens.sucesso(`"${livro.titulo}" adicionado aos favoritos! 💖`);
    }
}

notificarDisponibilidade(livroId) {
    const livro = this.livros.find(l => l.id === livroId);
    if (livro) {
        mensagens.info(`Você será notificado quando "${livro.titulo}" estiver disponível! 🔔`);
    }
}

// ✅ MÉTODO PARA INICIALIZAR ESTRELAS DE AVALIAÇÃO
inicializarEstrelasAvaliacao() {
    const estrelas = document.querySelectorAll('.estrelas-avaliacao .fas.fa-star');
    estrelas.forEach(estrela => {
        estrela.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            sistemaComentarios.selecionarAvaliacao(parseInt(rating));
        });
    });
}
    adicionarLivro(novoLivro) {
        // Validar dados do livro
        if (!this.validarLivro(novoLivro)) {
            return false;
        }

        // Adicionar dados padrão
        const livroCompleto = {
            ...novoLivro,
            id: GeradorID.gerar(),
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0,
            restricaoIdade: novoLivro.restricaoIdade || 0,
            tags: novoLivro.tags || []
        };

        this.livros.push(livroCompleto);
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);

        // Notificação
        sistemaNotificacoes.adicionar(
            'Novo Livro Adicionado',
            `"${livroCompleto.titulo}" foi adicionado ao catálogo.`,
            'sucesso'
        );

        return true;
    }

    validarLivro(livro) {
        const camposObrigatorios = ['titulo', 'autor', 'genero', 'ano', 'editora', 'descricao'];
        
        for (let campo of camposObrigatorios) {
            if (!livro[campo] || livro[campo].toString().trim() === '') {
                mensagens.erro(`O campo ${campo} é obrigatório.`);
                return false;
            }
        }

        if (livro.ano < 1000 || livro.ano > new Date().getFullYear()) {
            mensagens.erro('Ano de publicação inválido.');
            return false;
        }

        if (livro.paginas && livro.paginas < 1) {
            mensagens.erro('Número de páginas deve ser maior que zero.');
            return false;
        }

        if (livro.estoque < 0) {
            mensagens.erro('Estoque não pode ser negativo.');
            return false;
        }

        return true;
    }
}

// Inicializar sistema de livros
const sistemaLivros = new SistemaLivros();

// Busca Inteligente Melhorada
class BuscaInteligente {
    constructor() {
        this.sugestoesContainer = null;
        this.inicializarBusca();
    }

    inicializarBusca() {
        const campoPesquisa = document.getElementById('campoPesquisa');
        if (!campoPesquisa) return;

        // Criar container de sugestões
        this.sugestoesContainer = document.createElement('div');
        this.sugestoesContainer.className = 'sugestoes-busca';
        campoPesquisa.parentNode.appendChild(this.sugestoesContainer);

        campoPesquisa.addEventListener('input', (e) => {
            this.mostrarSugestoes(e.target.value);
        });

        campoPesquisa.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.mostrarSugestoes(e.target.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.campo-pesquisa-principal')) {
                this.ocultarSugestoes();
            }
        });
    }

    mostrarSugestoes(termo) {
        if (!termo || termo.length < 2) {
            this.ocultarSugestoes();
            return;
        }

        const sugestoes = this.gerarSugestoes(termo.toLowerCase());
        
        if (sugestoes.length === 0) {
            this.ocultarSugestoes();
            return;
        }

        this.sugestoesContainer.innerHTML = sugestoes.map(sugestao => `
            <div class="sugestao-item" onclick="buscaInteligente.selecionarSugestao('${sugestao.termo.replace(/'/g, "\\'")}')">
                <i class="fas ${sugestao.icone}"></i>
                ${sugestao.termo}
                <small>${sugestao.tipo}</small>
            </div>
        `).join('');

        this.sugestoesContainer.style.display = 'block';
    }

    gerarSugestoes(termo) {
        const sugestoes = new Set();
        const livros = sistemaLivros.livros;

        // Sugestões por título
        livros.forEach(livro => {
            if (livro.titulo.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: livro.titulo, 
                    tipo: 'Título',
                    icone: 'fa-book'
                }));
            }
        });

        // Sugestões por autor
        livros.forEach(livro => {
            if (livro.autor.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: livro.autor, 
                    tipo: 'Autor',
                    icone: 'fa-user'
                }));
            }
        });

        // Sugestões por gênero
        const generos = Object.keys(sistemaLivros.getLivrosPorGenero());
        generos.forEach(genero => {
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            if (nomeGenero.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: nomeGenero, 
                    tipo: 'Gênero',
                    icone: 'fa-tag'
                }));
            }
        });

        // Sugestões por tags
        livros.forEach(livro => {
            if (livro.tags) {
                livro.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(termo)) {
                        sugestoes.add(JSON.stringify({ 
                            termo: tag, 
                            tipo: 'Tag',
                            icone: 'fa-hashtag'
                        }));
                    }
                });
            }
        });

        return Array.from(sugestoes).map(s => JSON.parse(s)).slice(0, 8);
    }

    selecionarSugestao(termo) {
        document.getElementById('campoPesquisa').value = termo;
        this.ocultarSugestoes();
        sistemaLivros.aplicarFiltros();
    }

    ocultarSugestoes() {
        if (this.sugestoesContainer) {
            this.sugestoesContainer.style.display = 'none';
        }
    }
}

// Inicializar busca inteligente
const buscaInteligente = new BuscaInteligente();

// Adicionar mais livros de exemplo automaticamente
sistemaLivros.adicionarLivrosExemplo = function() {
    const novosLivros = [
        // ... (lista adicional de livros)
    ];

    let adicionados = 0;
    novosLivros.forEach(livro => {
        if (!this.livros.find(l => l.titulo === livro.titulo && l.autor === livro.autor)) {
            this.livros.push(livro);
            adicionados++;
        }
    });

    if (adicionados > 0) {
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);
        this.carregarDestaques();
        this.aplicarFiltros();
        
        mensagens.sucesso(`${adicionados} novos livros adicionados ao catálogo!`);
    }
};

// Carregar livros de exemplo automaticamente se o catálogo estiver pequeno
if (sistemaLivros.livros.length <= 20) {
    setTimeout(() => {
        sistemaLivros.adicionarLivrosExemplo();
    }, 2000);
}
// ✅ EXPORTAR PARA USO GLOBAL
window.sistemaLivros = sistemaLivros;

// ✅ FUNÇÕES GLOBAIS
function alterarTamanhoExibicao(tamanho) {
    sistemaLivros.tamanhoExibicao = tamanho;
    
    // Atualizar botões ativos
    document.querySelectorAll('.botao-tamanho').forEach(botao => {
        botao.classList.remove('ativo');
    });
    const botaoAtivo = document.querySelector(`.botao-tamanho[data-tamanho="${tamanho}"]`);
    if (botaoAtivo) {
        botaoAtivo.classList.add('ativo');
    }
    
    sistemaLivros.atualizarGradeLivros();
}

function realizarPesquisa() {
    sistemaLivros.aplicarFiltros();
}

function aplicarFiltros() {
    sistemaLivros.aplicarFiltros();
}

function agendarRetirada(livroId) {
    sistemaLivros.agendarRetirada(livroId);
}

// ✅ MÉTODO SIMPLES PARA AGENDAR RETIRADA
sistemaLivros.agendarRetirada = function(livroId) {
    const livro = this.livros.find(l => l.id === livroId);
    if (livro) {
        mensagens.info(`Agendamento para: ${livro.titulo}`);
    }
}

// ✅ MÉTODO SIMPLES PARA SOLICITAR EMPRÉSTIMO
sistemaLivros.solicitarEmprestimo = function(livroId) {
    const livro = this.livros.find(l => l.id === livroId);
    if (livro) {
        mensagens.sucesso(`Empréstimo solicitado para: ${livro.titulo}`);
    }
}