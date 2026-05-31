from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
# O CORS é essencial para permitir que o seu script.js (Front-End) acesse esta API
CORS(app)

# ==========================================
# 1. CONFIGURAÇÃO DE CONEXÃO COM O BANCO
# ==========================================
def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="portfolio_db"
    )

@app.route('/testar-conexao', methods=['GET'])
def testar_conexao():
    try:
        db = conectar_banco()
        return jsonify({"status": "sucesso", "mensagem": "Conectado ao MySQL do XAMPP com sucesso! 🎉"}), 200
    except mysql.connector.Error as err:
        return jsonify({"status": "erro", "mensagem": f"Erro ao conectar: {err}"}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            db.close()

# ==========================================
# 2. ROTAS PARA PROJETOS
# ==========================================
@app.route('/api/projetos', methods=['GET'])
def listar_projetos():
    try:
        db = conectar_banco()
        cursor = db.cursor(dictionary=True) # dictionary=True faz o MySQL retornar os dados formatados para JSON
        cursor.execute("SELECT * FROM projetos ORDER BY id DESC")
        projetos = cursor.fetchall()
        return jsonify(projetos), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/projetos', methods=['POST'])
def adicionar_projeto():
    try:
        dados = request.json
        db = conectar_banco()
        cursor = db.cursor()
        
        sql = "INSERT INTO projetos (titulo, descricao, link_github, url_imagem) VALUES (%s, %s, %s, %s)"
        valores = (dados['titulo'], dados['desc'], dados['link'], dados['img'])
        
        cursor.execute(sql, valores)
        db.commit()
        
        return jsonify({"mensagem": "Projeto adicionado com sucesso!", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/projetos/<int:id_projeto>', methods=['DELETE'])
def deletar_projeto(id_projeto):
    try:
        db = conectar_banco()
        cursor = db.cursor()
        cursor.execute("DELETE FROM projetos WHERE id = %s", (id_projeto,))
        db.commit()
        return jsonify({"mensagem": "Projeto excluído com sucesso!"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

# ==========================================
# 3. ROTAS PARA FORMAÇÃO
# ==========================================
@app.route('/api/formacao', methods=['GET'])
def listar_formacoes():
    try:
        db = conectar_banco()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM formacao ORDER BY id DESC")
        formacoes = cursor.fetchall()
        return jsonify(formacoes), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/formacao', methods=['POST'])
def adicionar_formacao():
    try:
        dados = request.json
        db = conectar_banco()
        cursor = db.cursor()
        
        sql = "INSERT INTO formacao (curso, instituicao, ano) VALUES (%s, %s, %s)"
        valores = (dados['curso'], dados['inst'], dados['ano'])
        
        cursor.execute(sql, valores)
        db.commit()
        
        return jsonify({"mensagem": "Formação adicionada com sucesso!", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/formacao/<int:id_formacao>', methods=['DELETE'])
def deletar_formacao(id_formacao):
    try:
        db = conectar_banco()
        cursor = db.cursor()
        cursor.execute("DELETE FROM formacao WHERE id = %s", (id_formacao,))
        db.commit()
        return jsonify({"mensagem": "Formação excluída com sucesso!"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

# ==========================================
# 4. ROTAS PARA CERTIFICADOS
# ==========================================
@app.route('/api/certificados', methods=['GET'])
def listar_certificados():
    try:
        db = conectar_banco()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM certificados ORDER BY id DESC")
        certificados = cursor.fetchall()
        return jsonify(certificados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/certificados', methods=['POST'])
def adicionar_certificado():
    try:
        dados = request.json
        db = conectar_banco()
        cursor = db.cursor()
        
        sql = "INSERT INTO certificados (titulo, descricao, link_arquivo) VALUES (%s, %s, %s)"
        valores = (dados['titulo'], dados['desc'], dados['link'])
        
        cursor.execute(sql, valores)
        db.commit()
        
        return jsonify({"mensagem": "Certificado adicionado com sucesso!", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

@app.route('/api/certificados/<int:id_certificado>', methods=['DELETE'])
def deletar_certificado(id_certificado):
    try:
        db = conectar_banco()
        cursor = db.cursor()
        cursor.execute("DELETE FROM certificados WHERE id = %s", (id_certificado,))
        db.commit()
        return jsonify({"mensagem": "Certificado excluído com sucesso!"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

# ==========================================
# INICIALIZAÇÃO DO SERVIDOR
# ==========================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)