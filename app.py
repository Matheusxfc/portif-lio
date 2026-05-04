from flask import Flask, request, jsonify

app = Flask(__name__)

# =======================================================
# BANCOS DE DADOS SIMULADOS (Listas)
# =======================================================

projetos_db = [
    {
        "id": 1,
        "titulo": "Planeja SJC",
        "descricao": "Este projeto teve como objetivo desenvolver um site visando o planejamento urbano.",
        "link": "https://github.com/Matheusxfc/planeja-sjc"
    }
]

formacao_db = [
    {
        "id": 1,
        "curso": "Desenvolvimento de Software Multiplataforma",
        "inst": "FATEC - São José dos Campos",
        "ano": "2024 - 2028 (Cursando)"
    },
    {
        "id": 2,
        "curso": "Ensino Médio",
        "inst": "Escola Prof. Francisco Pereira da Silva",
        "ano": "Concluído"
    }
]

certificados_db = [
    {
        "id": 1,
        "titulo": "Participação no Projeto em Parceria com ITA",
        "desc": "Experiência prática e colaboração acadêmica.",
        "link": "#"
    },
    {
        "id": 2,
        "titulo": "Curso de Metodologia SCRUM",
        "desc": "FGV - Fundação Getulio Vargas",
        "link": "certificações/14473084_certificado_Fgv.pdf"
    },
    {
        "id": 3,
        "titulo": "Escola de Inovadores",
        "desc": "Curso de empreendedorismo e inovação.",
        "link": "./certificações/CERTIFICADO_-_2025-2 (1).pdf"
    }
]

# Função genérica para encontrar o próximo ID disponível em qualquer lista
def gerar_id(lista_db):
    if len(lista_db) == 0:
        return 1
    return max(item["id"] for item in lista_db) + 1


# =======================================================
# ROTAS DE CORREÇÃO
# =======================================================
@app.route('/', methods=['GET'])
def pagina_inicial():
    return "API do Portfólio rodando! Rotas disponíveis: /projetos, /formacao, /certificados."

@app.route('/favicon.ico')
def favicon():
    return '', 204


# =======================================================
# 1. ROTAS: PROJETOS
# =======================================================
@app.route('/projetos', methods=['GET'])
def listar_projetos():
    return jsonify(projetos_db), 200

@app.route('/projetos', methods=['POST'])
def criar_projeto():
    dados = request.get_json() 
    novo_projeto = {
        "id": gerar_id(projetos_db),
        "titulo": dados.get("titulo"),
        "descricao": dados.get("descricao"),
        "link": dados.get("link")
    }
    projetos_db.append(novo_projeto)
    return jsonify({"mensagem": "Projeto criado com sucesso!", "projeto": novo_projeto}), 201

@app.route('/projetos/<int:id_item>', methods=['PUT'])
def atualizar_projeto(id_item):
    dados = request.get_json()
    for item in projetos_db:
        if item["id"] == id_item:
            item["titulo"] = dados.get("titulo", item["titulo"])
            item["descricao"] = dados.get("descricao", item["descricao"])
            item["link"] = dados.get("link", item["link"])
            return jsonify({"mensagem": "Projeto atualizado!", "projeto": item}), 200
    return jsonify({"erro": "Projeto não encontrado"}), 404

@app.route('/projetos/<int:id_item>', methods=['DELETE'])
def deletar_projeto(id_item):
    for item in projetos_db:
        if item["id"] == id_item:
            projetos_db.remove(item)
            return jsonify({"mensagem": "Projeto excluído!"}), 200
    return jsonify({"erro": "Projeto não encontrado"}), 404


# =======================================================
# 2. ROTAS: FORMAÇÃO
# =======================================================
@app.route('/formacao', methods=['GET'])
def listar_formacao():
    return jsonify(formacao_db), 200

@app.route('/formacao', methods=['POST'])
def criar_formacao():
    dados = request.get_json() 
    nova_formacao = {
        "id": gerar_id(formacao_db),
        "curso": dados.get("curso"),
        "inst": dados.get("inst"),
        "ano": dados.get("ano")
    }
    formacao_db.append(nova_formacao)
    return jsonify({"mensagem": "Formação criada com sucesso!", "formacao": nova_formacao}), 201

@app.route('/formacao/<int:id_item>', methods=['PUT'])
def atualizar_formacao(id_item):
    dados = request.get_json()
    for item in formacao_db:
        if item["id"] == id_item:
            item["curso"] = dados.get("curso", item["curso"])
            item["inst"] = dados.get("inst", item["inst"])
            item["ano"] = dados.get("ano", item["ano"])
            return jsonify({"mensagem": "Formação atualizada!", "formacao": item}), 200
    return jsonify({"erro": "Formação não encontrada"}), 404

@app.route('/formacao/<int:id_item>', methods=['DELETE'])
def deletar_formacao(id_item):
    for item in formacao_db:
        if item["id"] == id_item:
            formacao_db.remove(item)
            return jsonify({"mensagem": "Formação excluída!"}), 200
    return jsonify({"erro": "Formação não encontrada"}), 404


# =======================================================
# 3. ROTAS: CERTIFICADOS
# =======================================================
@app.route('/certificados', methods=['GET'])
def listar_certificados():
    return jsonify(certificados_db), 200

@app.route('/certificados', methods=['POST'])
def criar_certificado():
    dados = request.get_json() 
    novo_certificado = {
        "id": gerar_id(certificados_db),
        "titulo": dados.get("titulo"),
        "desc": dados.get("desc"),
        "link": dados.get("link")
    }
    certificados_db.append(novo_certificado)
    return jsonify({"mensagem": "Certificado criado com sucesso!", "certificado": novo_certificado}), 201

@app.route('/certificados/<int:id_item>', methods=['PUT'])
def atualizar_certificado(id_item):
    dados = request.get_json()
    for item in certificados_db:
        if item["id"] == id_item:
            item["titulo"] = dados.get("titulo", item["titulo"])
            item["desc"] = dados.get("desc", item["desc"])
            item["link"] = dados.get("link", item["link"])
            return jsonify({"mensagem": "Certificado atualizado!", "certificado": item}), 200
    return jsonify({"erro": "Certificado não encontrado"}), 404

@app.route('/certificados/<int:id_item>', methods=['DELETE'])
def deletar_certificado(id_item):
    for item in certificados_db:
        if item["id"] == id_item:
            certificados_db.remove(item)
            return jsonify({"mensagem": "Certificado excluído!"}), 200
    return jsonify({"erro": "Certificado não encontrado"}), 404


# =======================================================
# INICIALIZAÇÃO DO SERVIDOR
# =======================================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)