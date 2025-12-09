<a href="https://www.figma.com/design/12h2biXwM44raaOLk5Fea5/Untitled?node-id=0-1&p=f&t=XHIvR8AcQq844Dj9-0"> ***Ninho*** </a>

***SOBRE O PROJETO:***
- O projeto NINHO foi trabalhado ao longo do ano como uma iniciativa minha de compreender como trabalhar com IA e implementa-la no codigo. A aplicação NINHO tem como objetivo ser uma ponte entre psicólogos e seus clientes, de forma que possa substituir o método tradicional de diário emocional.

<h2>3A1</h2>

<h1>*É de suma importância ler todo o tutorial antes de começar a inicialização do projeto*</h1>


1 - Copiar o link https do GitHub do projeto ninho <br>

2 - crie uma pasta e abra no vscode. <br>

3 - pre-requesitos para rodar o projeto, ter as extenções python e Django instalados no vscode e o python em sua máquina <br>

4 - inicie um terminal e digite o comando: *git clone (link https copiado do git hub)* <br>

5- Delete a pasta venv atual e crie um novo: *python -m venv venv* <br>

6 - Ative seu ambiente virtual no terminal novoninho usando o comando: *source venv/bin/activate* <br>

7 - Agora vamos instalar as extensões necessárias: <br>
Instale o framework: *pip install django* <br>
Instale a extensão do python: *pip install python-decouple* <br>
Instale as requests: *pip install requests* <br>
Baixe a IA que usaremos: *pip install google-genai* <br>

8 - Em um terminal novoninho: use o comando python3 manage.py runserver <br>
Com isso você vai rodar o servidor, após isso, entre no seu localhost e altere a url depois de 8000 escrevendo ninho/home, assim você vai cair na página inicial de cadastro e login <br>

9 - Caso haja necessidade de acessar o banco de dados, com o servidor do django ativo entre na url: *http://127.0.0.1:8000/admin/*

| Requisito | Implementado? |
|-----------|----------------|
| Cadastro de usuários | ✔️ |
| Login com validação | ✔️ |
| CRUD de funcionários | ✔️ |
| Tela de perfil | ✔️ |
| Logout | ✔️ |
| Termo de Uso na primeira execução | ✔️ |
| Responsividade | ✔️ |
| Chat de IA✦ | ✔️ |
| Área do terapeuta | ❌ |
| Escolha de personagens | ✔️ |
