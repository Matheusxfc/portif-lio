// ==========================================
// 1. VARIÁVEIS GLOBAIS
// ==========================================
const SENHA_ADMIN = "Bueno250307"; 
const btnAdmin = document.getElementById('btnAdmin');
const elementosEditaveis = document.querySelectorAll('.editavel');
let modoEdicaoAtivo = false;

// ==========================================
// 2. INICIALIZAÇÃO (Resolve o conflito de tempo)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // PASSO A: Primeiro, recuperamos tudo do LocalStorage
    elementosEditaveis.forEach(elemento => {
        const idElemento = elemento.id;
        const textoSalvo = localStorage.getItem('portfolio_' + idElemento);
        
        if (textoSalvo) {
            elemento.innerHTML = textoSalvo;
        }
    });

    // PASSO B: Agora que o texto certo já está na tela, iniciamos o Typewriter
    const subtitleElement = document.getElementById('perfil-titulo');
    
    if (subtitleElement) {
        // Pegamos o texto final e limpamos espaços extras
        const textoParaDigitar = subtitleElement.textContent.trim();
        
        // Esvaziamos a tela de forma limpa
        subtitleElement.textContent = ''; 
        
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < textoParaDigitar.length) {
                // textContent impede que o JS se confunda com tags HTML
                subtitleElement.textContent += textoParaDigitar.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50); // Velocidade
            }
        }
        
        // Espera 200ms por segurança antes de começar
        setTimeout(typeWriter, 200);
    }
});

// ==========================================
// 3. MODO ADMIN E SENHA
// ==========================================
if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        if (!modoEdicaoAtivo) {
            const senhaDigitada = prompt("Acesso restrito. Digite a senha do administrador:");

            if (senhaDigitada !== SENHA_ADMIN) {
                alert("Senha incorreta ou operação cancelada. Acesso negado.");
                return; 
            }
            
            modoEdicaoAtivo = true;
            btnAdmin.innerHTML = '<i class="fa-solid fa-check me-2"></i>Salvar Alterações';
            btnAdmin.classList.replace('btn-warning', 'btn-success');

            elementosEditaveis.forEach(elemento => {
                elemento.contentEditable = "true"; 
                elemento.style.border = "2px dashed #0d6efd"; 
                elemento.style.padding = "5px";
                elemento.style.borderRadius = "5px";
                elemento.style.backgroundColor = "rgba(13, 110, 253, 0.05)";
                elemento.style.outline = "none"; 
            });

        } else {
            modoEdicaoAtivo = false;
            btnAdmin.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i>Modo Editar';
            btnAdmin.classList.replace('btn-success', 'btn-warning');

            elementosEditaveis.forEach(elemento => {
                elemento.contentEditable = "false"; 
                elemento.style.border = "none";
                elemento.style.padding = "0";
                elemento.style.backgroundColor = "transparent";

                const idElemento = elemento.id;
                localStorage.setItem('portfolio_' + idElemento, elemento.innerHTML);
            });
            
            alert("Textos atualizados com sucesso no seu navegador!");
        }
    });
}

// ==========================================
// 4. NAVBAR DINÂMICA (Escurece ao rolar)
// ==========================================
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg'); 
            navbar.style.backgroundColor = '#212529'; 
            navbar.style.transition = 'all 0.3s ease-in-out';
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.backgroundColor = 'transparent'; 
        }
    });
}

// ==========================================
// 5. DARK MODE (Modo Escuro)
// ==========================================
const btnDark = document.getElementById('btnDark');
if (btnDark) {
    const iconeDark = btnDark.querySelector('i');

    btnDark.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            iconeDark.classList.replace('fa-moon', 'fa-sun');
            iconeDark.classList.add('text-warning'); 
        } else {
            iconeDark.classList.replace('fa-sun', 'fa-moon');
            iconeDark.classList.remove('text-warning');
        }
    });
}