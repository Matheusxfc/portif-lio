// 1. Efeito de Máquina de Escrever (Typing Effect)
const subtitleElement = document.querySelector('.text-primary.mb-3');
const text = subtitleElement.innerHTML;
subtitleElement.innerHTML = ''; // Limpa o texto original
let i = 0;

function typeWriter() {
    if (i < text.length) {
        subtitleElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50); // Velocidade da digitação (50ms)
    }
}

// 2. Animação de Fade-in ao Rolar a Página (Intersection Observer)
// Isso fará com que os elementos apareçam suavemente quando entrarem na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('mostrar');
        }
    });
});

// Seleciona todos os elementos que terão a classe oculta inicialmente
const hiddenElements = document.querySelectorAll('.oculto');
hiddenElements.forEach((el) => observer.observe(el));

// Inicia os scripts quando a página carrega
window.onload = () => {
    typeWriter();
};