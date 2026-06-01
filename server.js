const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middlewares: Permitem que o Front-End acesse a API e que o Node entenda JSON
app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONFIGURAÇÃO DE CONEXÃO COM O BANCO
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio_db'
});

// Testa a conexão assim que o servidor liga
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL do XAMPP com sucesso! 🎉');
});

// Rota de teste simples
app.get('/testar-conexao', (req, res) => {
    res.json({ mensagem: 'A API em Node.js está rodando perfeitamente!' });
});

// ==========================================
// 2. ROTAS PARA PROJETOS
// ==========================================
app.get('/api/projetos', (req, res) => {
    db.query('SELECT * FROM projetos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/projetos', (req, res) => {
    const { titulo, desc, link, img } = req.body;
    const sql = 'INSERT INTO projetos (titulo, descricao, link_github, url_imagem) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [titulo, desc, link, img], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Projeto adicionado com sucesso!', id: result.insertId });
    });
});

app.delete('/api/projetos/:id', (req, res) => {
    const sql = 'DELETE FROM projetos WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: 'Projeto excluído com sucesso!' });
    });
});

// ==========================================
// 3. ROTAS PARA FORMAÇÃO
// ==========================================
app.get('/api/formacao', (req, res) => {
    db.query('SELECT * FROM formacao ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/formacao', (req, res) => {
    const { curso, inst, ano } = req.body;
    const sql = 'INSERT INTO formacao (curso, instituicao, ano) VALUES (?, ?, ?)';
    
    db.query(sql, [curso, inst, ano], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Formação adicionada com sucesso!', id: result.insertId });
    });
});

app.delete('/api/formacao/:id', (req, res) => {
    const sql = 'DELETE FROM formacao WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: 'Formação excluída com sucesso!' });
    });
});

// ==========================================
// 4. ROTAS PARA CERTIFICADOS
// ==========================================
app.get('/api/certificados', (req, res) => {
    db.query('SELECT * FROM certificados ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/certificados', (req, res) => {
    const { titulo, desc, link } = req.body;
    const sql = 'INSERT INTO certificados (titulo, descricao, link_arquivo) VALUES (?, ?, ?)';
    
    db.query(sql, [titulo, desc, link], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Certificado adicionado com sucesso!', id: result.insertId });
    });
});

app.delete('/api/certificados/:id', (req, res) => {
    const sql = 'DELETE FROM certificados WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: 'Certificado excluído com sucesso!' });
    });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js rodando na porta ${PORT}`);
    console.log(`Teste a conexão em: http://localhost:${PORT}/testar-conexao`);
});