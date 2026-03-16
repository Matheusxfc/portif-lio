// ==========================================
// 1. VARIÁVEIS GLOBAIS
// ==========================================
const SENHA_ADMIN = "Bueno250307"; 
let modoEdicaoAtivo = false;

// Seleção de Botões
const btnAdmin = document.getElementById('btnAdmin');
const btnAddFormacao = document.getElementById('btnAddFormacao');
const btnAddCertificado = document.getElementById('btnAddCertificado');
const btnAddProjeto = document.getElementById('btnAddProjeto');

// Seleção de Containers (Listas)
const listaFormacao = document.getElementById('lista-formacao');
const listaCertificados = document.getElementById('lista-certificados');
const listaProjetos = document.getElementById('lista-projetos');

// ==========================================
// 2. FUNÇÕES DE ESTILIZAÇÃO E ANIMAÇÃO
// ==========================================
function aplicarEstiloEdicao(elemento) {
    elemento.contentEditable = "true"; 
    elemento.style.border = "2px dashed #0d6efd"; 
    elemento.style.padding = "5px";
    elemento.style.borderRadius = "5px";
    elemento.style.backgroundColor = "rgba(13, 110, 253, 0.05)";
    elemento.style.outline = "none"; 
}

function removerEstiloEdicao(elemento) {
    elemento.contentEditable = "false"; 
    elemento.style.border = "none";
    elemento.style.padding = "0";
    elemento.style.backgroundColor = "transparent";
}

function aplicarEfeito3D() {
    const cardsProjeto = document.querySelectorAll('.hover-card');
    cardsProjeto.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (((y - (rect.height / 2)) / (rect.height / 2)) * -10); 
            const rotateY = (((x - (rect.width / 2)) / (rect.width / 2)) * 10);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
            card.style.zIndex = '1';
        });
    });
}

// ==========================================
// 3. INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Carrega estruturas HTML dinâmicas
    if (localStorage.getItem('portfolio_estrutura_formacao') && listaFormacao) 
        listaFormacao.innerHTML = localStorage.getItem('portfolio_estrutura_formacao');
    if (localStorage.getItem('portfolio_estrutura_certificados') && listaCertificados) 
        listaCertificados.innerHTML = localStorage.getItem('portfolio_estrutura_certificados');
    if (localStorage.getItem('portfolio_estrutura_projetos') && listaProjetos) 
        listaProjetos.innerHTML = localStorage.getItem('portfolio_estrutura_projetos');

    // Carrega Textos
    document.querySelectorAll('.editavel').forEach(elemento => {
        const textoSalvo = localStorage.getItem('portfolio_' + elemento.id);
        if (textoSalvo) elemento.innerHTML = textoSalvo;
    });

    aplicarEfeito3D();

    // Typewriter
    const subtitleElement = document.getElementById('perfil-titulo');
    if (subtitleElement) {
        const textoParaDigitar = subtitleElement.textContent.trim();
        subtitleElement.textContent = ''; 
        let charIndex = 0;
        function typeWriter() {
            if (charIndex < textoParaDigitar.length) {
                subtitleElement.textContent += textoParaDigitar.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50); 
            }
        }
        setTimeout(typeWriter, 200);
    }

    // Fade-in Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('mostrar');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, footer').forEach((el) => {
        el.classList.add('oculto'); 
        observer.observe(el);
    });
});

// ==========================================
// 4. FUNÇÕES DE SENHA E EXCLUSÃO DE ITENS
// ==========================================

// Função que cria o pop-up (Modal) de senha censurada
function pedirSenhaSegura(callback) {
    let modalEl = document.getElementById('modalSenhaAdmin');
    
    // Se o modal não existir no HTML, o JS cria e injeta ele
    if (!modalEl) {
        const html = `
        <div class="modal fade" id="modalSenhaAdmin" tabindex="-1" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
              <div class="modal-header bg-warning text-dark">
                <h6 class="modal-title fw-bold"><i class="fa-solid fa-lock me-2"></i>Acesso Restrito</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <label class="form-label small text-muted">Digite a senha de administrador:</label>
                <input type="password" id="inputSenhaAdmin" class="form-control" placeholder="••••••••">
              </div>
              <div class="modal-footer p-2">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-warning btn-sm fw-bold" id="btnConfirmarSenha">Entrar</button>
              </div>
            </div>
          </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        modalEl = document.getElementById('modalSenhaAdmin');
    }
    
    const inputSenha = document.getElementById('inputSenhaAdmin');
    inputSenha.value = ''; // Limpa a senha anterior
    
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
    
    // Foca no input automaticamente ao abrir
    modalEl.addEventListener('shown.bs.modal', () => inputSenha.focus(), {once:true});
    
    const btnConfirmar = document.getElementById('btnConfirmarSenha');
    
    // Substitui o botão por um clone para evitar cliques duplicados
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);
    
    novoBtn.addEventListener('click', () => {
        if (inputSenha.value === SENHA_ADMIN) {
            bsModal.hide();
            callback(true); // Senha correta, prossegue!
        } else {
            alert('Senha incorreta! Acesso negado.');
            inputSenha.value = ''; // Esvazia o campo para tentar de novo
        }
    });
}

// Função para colocar ou tirar os botões vermelhos de Lixeira
function gerenciarBotoesExcluir(mostrar) {
    const listas = [listaFormacao, listaCertificados, listaProjetos];
    
    listas.forEach(lista => {
        if (!lista) return;
        Array.from(lista.children).forEach(item => {
            if (mostrar) {
                item.style.position = 'relative'; // Necessário para a lixeira ficar no canto
                
                // Se o item ainda não tem botão de deletar, cria um
                if (!item.querySelector('.btn-deletar-item')) {
                    const btnDel = document.createElement('button');
                    btnDel.className = 'btn btn-danger btn-sm btn-deletar-item position-absolute shadow';
                    btnDel.style.top = '10px';
                    btnDel.style.right = '10px';
                    btnDel.style.zIndex = '20';
                    btnDel.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    
                    // Ação de excluir o item
                    btnDel.onclick = function() {
                        if(confirm('Tem certeza que deseja excluir este item do portfólio?')) {
                            item.remove();
                        }
                    };
                    item.appendChild(btnDel);
                }
            } else {
                // Se for pra esconder, acha as lixeiras e remove do HTML
                const btnDel = item.querySelector('.btn-deletar-item');
                if (btnDel) btnDel.remove();
            }
        });
    });
}

// ==========================================
// 5. MODO ADMIN E SALVAMENTO
// ==========================================
if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        if (!modoEdicaoAtivo) {
            
            // Pede a senha usando o Modal Seguro
            pedirSenhaSegura((senhaCorreta) => {
                if (senhaCorreta) {
                    modoEdicaoAtivo = true;
                    btnAdmin.innerHTML = '<i class="fa-solid fa-check me-2"></i>Salvar Alterações';
                    btnAdmin.classList.replace('btn-warning', 'btn-success');
                    
                    if (btnAddFormacao) btnAddFormacao.style.display = 'inline-block';
                    if (btnAddCertificado) btnAddCertificado.style.display = 'inline-block';
                    if (btnAddProjeto) btnAddProjeto.style.display = 'inline-block';

                    document.querySelectorAll('.editavel').forEach(aplicarEstiloEdicao);
                    
                    // Coloca as lixeirinhas na tela
                    gerenciarBotoesExcluir(true);
                }
            });

        } else {
            modoEdicaoAtivo = false;
            btnAdmin.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i>Modo Editar';
            btnAdmin.classList.replace('btn-success', 'btn-warning');
            
            if (btnAddFormacao) btnAddFormacao.style.display = 'none';
            if (btnAddCertificado) btnAddCertificado.style.display = 'none';
            if (btnAddProjeto) btnAddProjeto.style.display = 'none';

            // Remove as lixeirinhas da tela antes de salvar
            gerenciarBotoesExcluir(false);

            document.querySelectorAll('.editavel').forEach(elemento => {
                removerEstiloEdicao(elemento);
                localStorage.setItem('portfolio_' + elemento.id, elemento.innerHTML);
            });
            
            if (listaFormacao) localStorage.setItem('portfolio_estrutura_formacao', listaFormacao.innerHTML);
            if (listaCertificados) localStorage.setItem('portfolio_estrutura_certificados', listaCertificados.innerHTML);
            if (listaProjetos) localStorage.setItem('portfolio_estrutura_projetos', listaProjetos.innerHTML);
            
            alert("Portfólio atualizado com sucesso!");
        }
    });
}

// ==========================================
// 6. SISTEMA DE FORMULÁRIOS DINÂMICOS (MODAIS)
// ==========================================
function abrirModalForm(tipo, callback) {
    const modalAntigo = document.getElementById('modalFormulario');
    if (modalAntigo) modalAntigo.remove();

    let tituloModal = '';
    let camposHTML = '';

    if (tipo === 'formacao') {
        tituloModal = 'Adicionar Formação';
        camposHTML = `
            <div class="mb-3"><label class="form-label fw-bold small">Curso</label><input type="text" id="inCurso" class="form-control" required placeholder="Ex: Ciência da Computação"></div>
            <div class="mb-3"><label class="form-label fw-bold small">Instituição</label><input type="text" id="inInst" class="form-control" required placeholder="Ex: Fatec SJC"></div>
            <div class="mb-3"><label class="form-label fw-bold small">Período/Ano</label><input type="text" id="inAno" class="form-control" required placeholder="Ex: 2024 - 2028"></div>
        `;
    } else if (tipo === 'certificado') {
        tituloModal = 'Adicionar Certificado';
        camposHTML = `
            <div class="mb-3"><label class="form-label fw-bold small">Título do Certificado</label><input type="text" id="inTitCert" class="form-control" required></div>
            <div class="mb-3"><label class="form-label fw-bold small">Instituição / Descrição</label><input type="text" id="inDescCert" class="form-control" required></div>
            <div class="mb-3"><label class="form-label fw-bold small">Link do Arquivo (Opcional)</label><input type="text" id="inLinkCert" class="form-control" placeholder="./certificacoes/arquivo.pdf"></div>
        `;
    } else if (tipo === 'projeto') {
        tituloModal = 'Adicionar Projeto';
        camposHTML = `
            <div class="mb-3"><label class="form-label fw-bold small">Nome do Projeto</label><input type="text" id="inTitProj" class="form-control" required></div>
            <div class="mb-3"><label class="form-label fw-bold small">Descrição</label><textarea id="inDescProj" class="form-control" rows="3" required></textarea></div>
            <div class="mb-3"><label class="form-label fw-bold small">Link do GitHub</label><input type="url" id="inLinkProj" class="form-control" required></div>
            <div class="mb-3"><label class="form-label fw-bold small">URL da Imagem (Opcional)</label><input type="text" id="inImgProj" class="form-control" placeholder="Deixe em branco para imagem padrão"></div>
        `;
    }

    const htmlModal = `
    <div class="modal fade" id="modalFormulario" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="fa-solid fa-plus me-2"></i>${tituloModal}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formDinamico">${camposHTML}</form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-success" id="btnSalvarModal">Adicionar</button>
          </div>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', htmlModal);

    const modalElement = document.getElementById('modalFormulario');
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();

    document.getElementById('btnSalvarModal').addEventListener('click', () => {
        const form = document.getElementById('formDinamico');
        if (!form.checkValidity()) {
            form.reportValidity(); 
            return;
        }

        let dados = {};
        if (tipo === 'formacao') {
            dados.curso = document.getElementById('inCurso').value;
            dados.inst = document.getElementById('inInst').value;
            dados.ano = document.getElementById('inAno').value;
        } else if (tipo === 'certificado') {
            dados.titulo = document.getElementById('inTitCert').value;
            dados.desc = document.getElementById('inDescCert').value;
            dados.link = document.getElementById('inLinkCert').value || '#';
        } else if (tipo === 'projeto') {
            dados.titulo = document.getElementById('inTitProj').value;
            dados.desc = document.getElementById('inDescProj').value;
            dados.link = document.getElementById('inLinkProj').value;
            dados.img = document.getElementById('inImgProj').value || 'https://via.placeholder.com/400x200?text=Capa+do+Projeto';
        }

        bsModal.hide(); 
        callback(dados); 
    });
}

// ==========================================
// 7. EVENTOS DE CLIQUE DOS BOTÕES "ADICIONAR"
// ==========================================

// Adicionar Formação
if (btnAddFormacao && listaFormacao) {
    btnAddFormacao.addEventListener('click', () => {
        abrirModalForm('formacao', (dados) => {
            const id = Date.now();
            const novoHTML = `
                <div class="mb-3 border-start border-4 border-primary ps-3 mt-3"> 
                  <h5 class="fw-bold mb-1 editavel" id="form-${id}-curso">${dados.curso}</h5>
                  <p class="text-muted mb-0 editavel" id="form-${id}-inst">${dados.inst}</p>
                  <small class="text-primary fw-bold editavel" id="form-${id}-ano">${dados.ano}</small>
                </div>`;
            listaFormacao.insertAdjacentHTML('beforeend', novoHTML);
            listaFormacao.querySelectorAll(`[id*="${id}"]`).forEach(aplicarEstiloEdicao);
            gerenciarBotoesExcluir(true); // Atualiza as lixeirinhas
        });
    });
}

// Adicionar Certificado
if (btnAddCertificado && listaCertificados) {
    btnAddCertificado.addEventListener('click', () => {
        abrirModalForm('certificado', (dados) => {
            const id = Date.now();
            const novoHTML = `
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-4">
                  <div>
                    <h5 class="mb-1 fw-bold editavel" id="cert-${id}-titulo">${dados.titulo}</h5>
                    <p class="mb-0 text-muted small editavel" id="cert-${id}-desc">${dados.desc}</p>
                  </div>
                  <a href="${dados.link}" target="_blank" class="btn btn-outline-primary btn-sm rounded-pill">Visualizar</a>
                </div>`;
            listaCertificados.insertAdjacentHTML('beforeend', novoHTML);
            listaCertificados.querySelectorAll(`[id*="${id}"]`).forEach(aplicarEstiloEdicao);
            gerenciarBotoesExcluir(true); // Atualiza as lixeirinhas
        });
    });
}

// Adicionar Projeto
if (btnAddProjeto && listaProjetos) {
    btnAddProjeto.addEventListener('click', () => {
        abrirModalForm('projeto', (dados) => {
            const id = Date.now();
            const novoHTML = `
                <div class="col-md-6">
                  <div class="card h-100 shadow border-0 hover-card">
                    <img class="card-img-top" src="${dados.img}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                      <h4 class="card-title fw-bold editavel" id="proj-${id}-titulo">${dados.titulo}</h4>
                      <p class="card-text text-muted editavel" id="proj-${id}-desc">${dados.desc}</p>
                      <div class="mt-auto text-center">
                        <a href="${dados.link}" target="_blank" class="btn btn-outline-primary w-100 editavel" id="proj-${id}-link">Ver no GitHub</a>
                      </div>
                    </div>
                  </div>
                </div>`;
            listaProjetos.insertAdjacentHTML('beforeend', novoHTML);
            listaProjetos.querySelectorAll(`[id*="${id}"]`).forEach(aplicarEstiloEdicao);
            aplicarEfeito3D(); 
            gerenciarBotoesExcluir(true); // Atualiza as lixeirinhas
        });
    });
}

// ==========================================
// 8. NAVBAR E DARK MODE
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