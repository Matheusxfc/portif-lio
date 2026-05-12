const express = require('express');
const cors = require('cors');

const app = express();

// Avisa ao Express para permitir a comunicação com o Front-end e para entender JSON
app.use(cors());
app.use(express.json());

// =======================================================
// BANCOS DE DADOS SIMULADOS (Arrays / Listas)
// =======================================================

let projetosDb = [
    {
        id: 1,
        titulo: "Planeja SJC",
        descricao: "Este projeto teve como objetivo desenvolver um site visando o planejamento urbano.",
        link: "https://github.com/Matheusxfc/planeja-sjc"
    }
];

let formacaoDb = [
    {
        id: 1,
        curso: "Desenvolvimento de Software Multiplataforma",
        inst: "FATEC - São José dos Campos",
        ano: "2024 - 2028 (Cursando)"
    },
    {
        id: 2,
        curso: "Ensino Médio",
        inst: "Escola Prof. Francisco Pereira da Silva",
        ano: "Concluído"
    }
];

let certificadosDb = [
    {
        id: 1,
        titulo: "Participação no Projeto em Parceria com ITA",
        desc: "Experiência prática e colaboração acadêmica.",
        link: "#"
    },
    {
        id: 2,
        titulo: "Curso de Metodologia SCRUM",
        desc: "FGV - Fundação Getulio Vargas",
        link: "certificações/14473084_certificado_Fgv.pdf"
    },
    {
        id: 3,
        titulo: "Escola de Inovadores",
        desc: "Curso de empreendedorismo e inovação.",
        link: "./certificações/CERTIFICADO_-_2025-2 (1).pdf"
    }
];

// Função genérica para encontrar o próximo ID disponível em qualquer lista
function gerarId(listaDb) {
    if (listaDb.length === 0) {
        return 1;
    }
    // Cria um array só com os IDs e pega o maior valor, depois soma 1
    return Math.max(...listaDb.map(item => item.id)) + 1;
}

// =======================================================
// ROTAS DE CORREÇÃO
// =======================================================
app.get('/', (req, res) => {
    res.send("API do Portfólio rodando em Node.js! Rotas disponíveis: /projetos, /formacao, /certificados.");
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// =======================================================
// 1. ROTAS: PROJETOS
// =======================================================
app.get('/projetos', (req, res) => {
    res.status(200).json(projetosDb);
});

app.post('/projetos', (req, res) => {
    const dados = req.body;
    const novoProjeto = {
        id: gerarId(projetosDb),
        titulo: dados.titulo,
        descricao: dados.descricao,
        link: dados.link
    };
    projetosDb.push(novoProjeto);
    res.status(201).json({ mensagem: "Projeto criado com sucesso!", projeto: novoProjeto });
});

app.put('/projetos/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const dados = req.body;
    
    // Encontra a posição (index) do item no array
    const index = projetosDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        projetosDb[index].titulo = dados.titulo || projetosDb[index].titulo;
        projetosDb[index].descricao = dados.descricao || projetosDb[index].descricao;
        projetosDb[index].link = dados.link || projetosDb[index].link;
        res.status(200).json({ mensagem: "Projeto atualizado!", projeto: projetosDb[index] });
    } else {
        res.status(404).json({ erro: "Projeto não encontrado" });
    }
});

app.delete('/projetos/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const index = projetosDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        projetosDb.splice(index, 1); // Remove 1 item a partir daquele índice
        res.status(200).json({ mensagem: "Projeto excluído!" });
    } else {
        res.status(404).json({ erro: "Projeto não encontrado" });
    }
});

// =======================================================
// 2. ROTAS: FORMAÇÃO
// =======================================================
app.get('/formacao', (req, res) => {
    res.status(200).json(formacaoDb);
});

app.post('/formacao', (req, res) => {
    const dados = req.body;
    const novaFormacao = {
        id: gerarId(formacaoDb),
        curso: dados.curso,
        inst: dados.inst,
        ano: dados.ano
    };
    formacaoDb.push(novaFormacao);
    res.status(201).json({ mensagem: "Formação criada com sucesso!", formacao: novaFormacao });
});

app.put('/formacao/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const dados = req.body;
    const index = formacaoDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        formacaoDb[index].curso = dados.curso || formacaoDb[index].curso;
        formacaoDb[index].inst = dados.inst || formacaoDb[index].inst;
        formacaoDb[index].ano = dados.ano || formacaoDb[index].ano;
        res.status(200).json({ mensagem: "Formação atualizada!", formacao: formacaoDb[index] });
    } else {
        res.status(404).json({ erro: "Formação não encontrada" });
    }
});

app.delete('/formacao/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const index = formacaoDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        formacaoDb.splice(index, 1);
        res.status(200).json({ mensagem: "Formação excluída!" });
    } else {
        res.status(404).json({ erro: "Formação não encontrada" });
    }
});

// =======================================================
// 3. ROTAS: CERTIFICADOS
// =======================================================
app.get('/certificados', (req, res) => {
    res.status(200).json(certificadosDb);
});

app.post('/certificados', (req, res) => {
    const dados = req.body;
    const novoCertificado = {
        id: gerarId(certificadosDb),
        titulo: dados.titulo,
        desc: dados.desc,
        link: dados.link
    };
    certificadosDb.push(novoCertificado);
    res.status(201).json({ mensagem: "Certificado criado com sucesso!", certificado: novoCertificado });
});

app.put('/certificados/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const dados = req.body;
    const index = certificadosDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        certificadosDb[index].titulo = dados.titulo || certificadosDb[index].titulo;
        certificadosDb[index].desc = dados.desc || certificadosDb[index].desc;
        certificadosDb[index].link = dados.link || certificadosDb[index].link;
        res.status(200).json({ mensagem: "Certificado atualizado!", certificado: certificadosDb[index] });
    } else {
        res.status(404).json({ erro: "Certificado não encontrado" });
    }
});

app.delete('/certificados/:idItem', (req, res) => {
    const idItem = parseInt(req.params.idItem);
    const index = certificadosDb.findIndex(item => item.id === idItem);
    
    if (index !== -1) {
        certificadosDb.splice(index, 1);
        res.status(200).json({ mensagem: "Certificado excluído!" });
    } else {
        res.status(404).json({ erro: "Certificado não encontrado" });
    }
});

// =======================================================
// INICIALIZAÇÃO DO SERVIDOR
// =======================================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - http://127.0.0.1:${PORT}`);
});