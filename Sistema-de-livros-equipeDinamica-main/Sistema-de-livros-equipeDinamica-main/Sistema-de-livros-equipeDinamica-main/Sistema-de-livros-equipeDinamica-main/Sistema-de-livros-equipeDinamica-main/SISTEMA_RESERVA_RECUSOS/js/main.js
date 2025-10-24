
// Funções de login rápido CORRIGIDAS
function loginRapido(usuario) {
    console.log('Tentando login rápido para:', usuario);
    
    // Buscar o usuário no sistema de autenticação
    const usuarioEncontrado = sistemaAuth.usuarios.find(u => {
        console.log('Comparando:', u.usuario, 'com', usuario);
        return u.usuario === usuario;
    });

    console.log('Usuário encontrado:', usuarioEncontrado);

    if (usuarioEncontrado) {
        sistemaAuth.usuarioLogado = usuarioEncontrado;
        ArmazenamentoLocal.salvar('usuario_logado', usuarioEncontrado);
        mensagens.sucesso(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
        sistemaAuth.entrarNoSistema();
        sistemaAuth.fecharModal('modalLogin');
        return true;
    } else {
        mensagens.erro(`Usuário "${usuario}" não encontrado.`);
        return false;
    }
}

class SistemaTema {
    constructor() {
        this.temaAtual = this.carregarTema();
        this.aplicarTema();
    }

    carregarTema() {
        return ArmazenamentoLocal.carregar('tema') || 'claro';
    }

    aplicarTema() {
        if (this.temaAtual === 'escuro') {
            document.body.classList.add('tema-escuro');
        } else {
            document.body.classList.remove('tema-escuro');
        }
    }

    alternarTema() {
        this.temaAtual = this.temaAtual === 'claro' ? 'escuro' : 'claro';
        this.aplicarTema();
        ArmazenamentoLocal.salvar('tema', this.temaAtual);
        
        const icone = document.querySelector('.botao-icon[onclick="alternarTema()"] i');
        if (icone) {
            icone.className = this.temaAtual === 'claro' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        mensagens.info(`Tema ${this.temaAtual === 'claro' ? 'claro' : 'escuro'} ativado`);
    }
}

// Inicializar todos os sistemas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Biblioteca Cesf Online - Sistema carregado');
    
    // Inicializar sistema de tema
    window.sistemaTema = new SistemaTema();
    
    // Verificar se há usuário logado
    const usuarioLogado = sistemaAuth.getUsuarioLogado();
    if (usuarioLogado) {
        sistemaAuth.entrarNoSistema();
    }

    // Adicionar estilos dinâmicos para elementos específicos
    adicionarEstilosDinamicos();
    
    // Prevenir comportamento padrão de botões
    prevenirScrollBotao();
});

function prevenirScrollBotao() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.botao') || e.target.closest('.item-menu') || 
            e.target.closest('.pagina') || e.target.closest('.botao-tamanho') ||
            e.target.closest('.botao-acao')) {
            e.preventDefault();
        }
    });
}

function alternarTema() {
    sistemaTema.alternarTema();
}

// Adicionar estilos CSS dinâmicos para elementos específicos
function adicionarEstilosDinamicos() {
    const estilos = `
        .detalhes-livro {
            max-width: 100%;
        }
        
        .detalhes-cabecalho {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .detalhes-imagem {
            width: 300px;
            height: 400px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        
        .detalhes-info {
            flex: 1;
        }
        
        .detalhes-info h2 {
            color: var(--vinho-escuro);
            margin-bottom: 0.5rem;
            font-size: 2rem;
        }
        
        .detalhes-autor {
            color: var(--cinza-medio);
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        
        .detalhes-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .detalhes-avaliacao {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .detalhes-avaliacao .estrelas {
            color: var(--dourado);
        }
        
        .detalhes-status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
        
        .detalhes-status.disponivel {
            background: var(--verde);
            color: white;
        }
        
        .detalhes-status.indisponivel {
            background: var(--vermelho);
            color: white;
        }
        
        .detalhes-acoes {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .detalhes-secao {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--cinza-claro);
        }
        
        .detalhes-secao h3 {
            color: var(--vinho-principal);
            margin-bottom: 1rem;
            font-size: 1.4rem;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--cinza-muito-claro);
        }
        
        .condicoes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .condicao-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--cinza-muito-claro);
            border-radius: 8px;
        }
        
        .condicao-item i {
            font-size: 1.5rem;
            color: var(--vinho-principal);
        }
        
        .comentario-item {
            padding: 1.5rem;
            background: var(--cinza-muito-claro);
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .comentario-cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .comentario-usuario {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .comentario-estrelas {
            color: var(--dourado);
        }
        
        .comentario-data {
            color: var(--cinza-medio);
            font-size: 0.9rem;
        }
        
        .comentario-texto {
            line-height: 1.6;
        }
        
        .formulario-comentario {
            background: var(--branco);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--cinza-claro);
        }
        
        .campo-avaliacao {
            margin-bottom: 1rem;
        }
        
        .estrelas-avaliacao {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .estrelas-avaliacao .fas.fa-star {
            color: var(--cinza-claro);
            cursor: pointer;
            font-size: 1.5rem;
            transition: color 0.2s;
        }
        
        .estrelas-avaliacao .fas.fa-star.ativa {
            color: var(--dourado);
        }
        
        .avaliacao-livro {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            color: var(--cinza-medio);
            font-size: 0.9rem;
        }
        
        .sem-comentarios, .sem-alertas {
            text-align: center;
            color: var(--cinza-medio);
            font-style: italic;
            padding: 2rem;
        }
        
        .aviso-comentario {
            text-align: center;
            padding: 1rem;
            background: var(--vinho-suave);
            border-radius: 8px;
            color: var(--vinho-principal);
        }
        
        .acoes-tabela {
            display: flex;
            gap: 0.5rem;
        }
        
        .grafico-barras-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .barra-genero {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .barra-rotulo {
            width: 120px;
            font-weight: 600;
            color: var(--cinza-escuro);
        }
        
        .barra-container {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .barra {
            height: 20px;
            border-radius: 10px;
            transition: width 0.5s ease;
        }
        
        .barra-valor {
            width: 30px;
            text-align: right;
            font-weight: 600;
            color: var(--cinza-escuro);
        }
        
        .tabela-emprestimos {
            width: 100%;
            border-collapse: collapse;
        }
        
        .tabela-emprestimos th,
        .tabela-emprestimos td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--cinza-claro);
        }
        
        .tabela-emprestimos th {
            background: var(--vinho-principal);
            color: var(--branco);
        }
        
        .status-emprestimo {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-ativo {
            background: var(--verde);
            color: var(--branco);
        }
        
        .status-atrasado {
            background: var(--vermelho);
            color: var(--branco);
        }
        
        .status-finalizado {
            background: var(--cinza-medio);
            color: var(--branco);
        }
        
        .reserva-item {
            padding: 1rem;
            border: 1px solid var(--cinza-claro);
            border-radius: 8px;
            margin-bottom: 1rem;
            background: var(--branco);
        }
        
        .reserva-cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .reserva-livro {
            font-weight: 600;
            color: var(--vinho-principal);
        }
        
        .reserva-data {
            color: var(--cinza-medio);
            font-size: 0.9rem;
        }
        
        .reserva-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-pendente {
            background: var(--laranja);
            color: var(--branco);
        }
        
        .status-aprovada {
            background: var(--verde);
            color: var(--branco);
        }
        
        .status-cancelada {
            background: var(--vermelho);
            color: var(--branco);
        }
        
        @media (max-width: 768px) {
            .detalhes-cabecalho {
                flex-direction: column;
            }
            
            .detalhes-imagem {
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .detalhes-acoes {
                flex-direction: column;
            }
            
            .comentario-cabecalho {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .tabela-emprestimos {
                font-size: 0.8rem;
            }
            
            .reserva-cabecalho {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = estilos;
    document.head.appendChild(styleSheet);
}
