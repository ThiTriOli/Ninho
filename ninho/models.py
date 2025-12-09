from django.db import models
from django.utils import timezone


class UsuarioCadastro(models.Model):
    email = models.EmailField(unique=True, max_length=255)
    senha = models.CharField(max_length=50)
    termos_aceitos = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Usuário Cadastrado"
        verbose_name_plural = "Usuários Cadastrados"


class Personagem(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    especializacao = models.CharField(max_length=255, blank=True, null=True)
    gostos = models.TextField(blank=True, null=True)
    sugestoes = models.TextField(blank=True, null=True)
    similares = models.TextField(blank=True, null=True)
    classe_imagem = models.CharField(max_length=100, blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Personagem"
        verbose_name_plural = "Personagens"
        ordering = ['id']


class Chat(models.Model):
    usuario = models.ForeignKey(UsuarioCadastro, on_delete=models.CASCADE, related_name='chats')
    personagem = models.ForeignKey(Personagem, on_delete=models.CASCADE, related_name='chats')
    data_inicio = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    encerrado = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Chat {self.id} - {self.usuario.email} com {self.personagem.nome}"
    
    class Meta:
        verbose_name = "Chat"
        verbose_name_plural = "Chats"
        ordering = ['-data_atualizacao']


class Mensagem(models.Model):
    TIPO_CHOICES = [
        ('usuario', 'Usuário'),
        ('ia', 'IA'),
    ]
    
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='mensagens')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    conteudo = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.tipo.upper()} - {self.chat.id} - {self.timestamp}"
    
    class Meta:
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"
        ordering = ['timestamp']


class ConfiguracaoUsuario(models.Model):
    usuario = models.OneToOneField(UsuarioCadastro, on_delete=models.CASCADE, related_name='configuracao')
    nickname = models.CharField(max_length=100, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    tema = models.CharField(
        max_length=10,
        choices=[('light', 'Claro'), ('dark', 'Escuro')],
        default='light'
    )
    notificacoes_ativas = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Config de {self.usuario.email}"
    
    class Meta:
        verbose_name = "Configuração de Usuário"
        verbose_name_plural = "Configurações de Usuários"