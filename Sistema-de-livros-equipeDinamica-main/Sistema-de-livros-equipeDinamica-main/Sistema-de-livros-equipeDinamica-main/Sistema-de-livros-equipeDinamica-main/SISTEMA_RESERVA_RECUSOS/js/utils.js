// Sistema de Mensagens Toast
class SistemaMensagens {
    constructor() {
        this.container = document.getElementById('sistemaMensagens');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'sistemaMensagens';
            this.container.className = 'sistema-mensagens';
            document.body.appendChild(this.container);
        }
    }

    mostrar(mensagem, tipo = 'info', duracao = 5000) {
        const mensagemElement = document.createElement('div');
        mensagemElement.className = `mensagem ${tipo}`;
        
        const icones = {
            'sucesso': 'fas fa-check-circle',
            'erro': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle',
            'aviso': 'fas fa-exclamation-triangle'
        };

        mensagemElement.innerHTML = `
            <i class="${icones[tipo] || icones.info}"></i>
            <span>${mensagem}</span>
        `;

        this.container.appendChild(mensagemElement);

        // Animação de entrada
        setTimeout(() => {
            mensagemElement.style.animation = 'slideInRight 0.3s ease-out';
        }, 100);

        // Remover após a duração
        setTimeout(() => {
            mensagemElement.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (mensagemElement.parentNode) {
                    mensagemElement.parentNode.removeChild(mensagemElement);
                }
            }, 300);
        }, duracao);
    }

    sucesso(mensagem, duracao = 5000) {
        this.mostrar(mensagem, 'sucesso', duracao);
    }

    erro(mensagem, duracao = 5000) {
        this.mostrar(mensagem, 'erro', duracao);
    }

    info(mensagem, duracao = 5000) {
        this.mostrar(mensagem, 'info', duracao);
    }

    aviso(mensagem, duracao = 5000) {
        this.mostrar(mensagem, 'aviso', duracao);
    }
}

// Instância global do sistema de mensagens
const mensagens = new SistemaMensagens();

// Utilitários de data
class UtilitariosData {
    static formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    static calcularDiferencaDias(data1, data2) {
        const umDia = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((data1 - data2) / umDia));
    }

    static adicionarDias(data, dias) {
        const resultado = new Date(data);
        resultado.setDate(resultado.getDate() + dias);
        return resultado;
    }
}

// Utilitários de localStorage
class ArmazenamentoLocal {
    static salvar(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    static carregar(chave) {
        try {
            const dados = localStorage.getItem(chave);
            return dados ? JSON.parse(dados) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    static remover(chave) {
        try {
            localStorage.removeItem(chave);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    static limpar() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
}

// Validações
class Validacoes {
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarSenha(senha) {
        // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(senha);
    }

    static calcularForcaSenha(senha) {
        let forca = 0;
        
        if (senha.length >= 8) forca++;
        if (/[a-z]/.test(senha)) forca++;
        if (/[A-Z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[^A-Za-z0-9]/.test(senha)) forca++;
        
        return forca;
    }

    static obterTextoForcaSenha(forca) {
        const textos = [
            'Muito fraca',
            'Fraca',
            'Moderada',
            'Forte',
            'Muito forte'
        ];
        return textos[forca - 1] || 'Muito fraca';
    }

    static validarISBN(isbn) {
        // Validação básica de ISBN (10 ou 13 dígitos)
        const regex = /^(?:\d{9}[\dX]|\d{13})$/;
        return regex.test(isbn.replace(/[- ]/g, ''));
    }
}

// Gerador de IDs únicos
class GeradorID {
    static gerar() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static gerarISBN() {
        // Gera um ISBN fictício para demonstração
        const parte1 = Math.floor(100 + Math.random() * 900);
        const parte2 = Math.floor(100 + Math.random() * 900);
        const parte3 = Math.floor(10 + Math.random() * 90);
        const parte4 = Math.floor(1 + Math.random() * 9);
        
        return `${parte1}-${parte2}-${parte3}-${parte4}`;
    }
}

// Utilitários de formatação
class Formatadores {
    static formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    static formatarNumero(numero) {
        return new Intl.NumberFormat('pt-BR').format(numero);
    }

    static limitarTexto(texto, limite) {
        if (texto.length <= limite) return texto;
        return texto.substr(0, limite) + '...';
    }

    static capitalizarTexto(texto) {
        return texto.replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Exportar utilitários para uso global
window.mensagens = mensagens;
window.UtilitariosData = UtilitariosData;
window.ArmazenamentoLocal = ArmazenamentoLocal;
window.Validacoes = Validacoes;
window.GeradorID = GeradorID;
window.Formatadores = Formatadores;