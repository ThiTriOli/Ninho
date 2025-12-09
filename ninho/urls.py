from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    
    path('home/', views.home, name='home'),
    path('inicio/', views.inicio, name='inicio'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('contato/', views.contato, name='contato'),


    path('info_personagem/<int:id>/', views.personagem_info, name='info_personagem'),
    path('info_perso/<int:id>/', views.personagem_info, name='info_perso'),

    path('configuracoes/', views.configuracoes, name='configuracoes'),
    path('perfil/', views.perfil, name='perfil'),
    path('personagens/', views.personagens, name='personagens'),
    path('profissional/', views.profissional, name='profissional'),
    path('redsenha/', views.redsenha, name='redsenha'),
    path('senhared/', views.senhared, name='senhared'),
    path('sobre_nos/', views.sobrenos, name='sobrenos'),
    path('personagem/<int:id>/', views.personagem_info, name='personagem_info'),
    
    path("", views.chat_ia, name="chat_ia"),
    path('chat/', views.chat_view, name='chat'),
    path('aceitar_termos/', views.aceitar_termos, name='aceitar_termos'),
]
