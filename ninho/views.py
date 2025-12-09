from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .ollama_service import gerar_resposta
from .models import UsuarioCadastro, Personagem, Chat, Mensagem, ConfiguracaoUsuario
from django.db.utils import IntegrityError
from django.contrib.auth import login as django_login
import json


@login_required
def dashboard(request):
    return render(request, 'inicio.html', {'user': request.user})


def login_view(request):
    template_name = 'index.html' 
    
    if request.method == 'POST':
        email_digitado = request.POST.get('email')
        senha_digitada = request.POST.get('senha')
        
        if not email_digitado or not senha_digitada:
            messages.error(request, 'Por favor, preencha todos os campos.')
            return render(request, template_name)

        try:
            usuario = UsuarioCadastro.objects.get(email=email_digitado)
            if usuario.senha == senha_digitada:
                request.session['usuario_id'] = usuario.id
                request.session['usuario_email'] = usuario.email

                if not usuario.termos_aceitos:
                    request.session['show_terms_on_config'] = True
                    messages.success(request, f'Login realizado com sucesso! Bem-vindo(a), {usuario.email}.')
                    return redirect('ninho:configuracoes')

                messages.success(request, f'Login realizado com sucesso! Bem-vindo(a), {usuario.email}.')
                return redirect('dashboard') 
                
            else:
                messages.error(request, 'Senha incorreta.')
        except UsuarioCadastro.DoesNotExist:
            messages.error(request, 'Usuário não encontrado. Verifique o e-mail ou cadastre-se.')
        
        context = {'email_valor': email_digitado}
        return render(request, template_name, context)

    return render(request, template_name)


def home(request):
    return render(request, 'index.html')


def inicio(request):
    return render(request, 'inicio.html')


def cadastro(request):
    template_name = 'cadastro.html' 
    context = {}
    
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')
        
        if senha != confirmar_senha:
            messages.error(request, 'A senha e a confirmação de senha não coincidem.')
            context['email_valor'] = email
            return render(request, template_name, context)
        try:
            if UsuarioCadastro.objects.filter(email=email).exists():
                raise IntegrityError
            usuario = UsuarioCadastro.objects.create(
                email=email,
                senha=senha,
            )
            request.session['pending_user_id'] = usuario.id
            messages.success(request, 'Cadastro realizado com sucesso! Faça seu Login.')
            return redirect('ninho:home')
        except IntegrityError:
            messages.error(request, f'Erro ao cadastrar: O e-mail "{email}" já está registrado.')
            context['email_valor'] = email
            return render(request, template_name, context)
            
        except Exception as e:
            messages.error(request, f'Falha Crítica no Salvamento: {e}')
            return render(request, template_name, context)
    return render(request, template_name, context)


def configuracoes(request):
    user_id = request.session.get('usuario_id')
    show_terms = False
    config_data = {}
    
    if request.method == 'POST':
        try:
            import json as _json
            payload = _json.loads(request.body or b'{}')
        except Exception:
            payload = {}

        if user_id:
            try:
                usuario = UsuarioCadastro.objects.get(id=user_id)
                config, created = ConfiguracaoUsuario.objects.get_or_create(usuario=usuario)

                nickname = payload.get('nickname')
                telefone = payload.get('telefone')
                tema = payload.get('tema')

                changed = False
                if nickname is not None:
                    config.nickname = nickname
                    changed = True
                if telefone is not None:
                    config.telefone = telefone
                    changed = True
                if tema is not None:
                    config.tema = tema
                    changed = True

                if changed:
                    config.save()
                    try:
                        request.session['usuario_nickname'] = config.nickname or ''
                    except Exception:
                        pass

                return JsonResponse({'ok': True, 'nickname': config.nickname or ''})
            except UsuarioCadastro.DoesNotExist:
                return JsonResponse({'ok': False, 'error': 'user_not_found'}, status=400)
        return JsonResponse({'ok': False, 'error': 'no_user'}, status=400)

    if user_id:
        try:
            usuario = UsuarioCadastro.objects.get(id=user_id)
            
            config, created = ConfiguracaoUsuario.objects.get_or_create(usuario=usuario)
            config_data = {
                'nickname': config.nickname,
                'telefone': config.telefone,
                'tema': config.tema,
                'notificacoes_ativas': config.notificacoes_ativas,
            }
            
            if request.session.get('show_terms_on_config'):
                show_terms = True
                try:
                    del request.session['show_terms_on_config']
                except KeyError:
                    pass
            elif not usuario.termos_aceitos:
                show_terms = True
                
        except UsuarioCadastro.DoesNotExist:
            pass
    
    return render(request, 'configuracoes.html', {
        'show_terms': show_terms,
        'config': config_data
    })


def contato(request):
    return render(request, 'contato.html')


def perfil(request):
    nickname = request.session.get('usuario_nickname')
    email = request.session.get('usuario_email')

    if not nickname:
        user_id = request.session.get('usuario_id')
        if user_id:
            try:
                usuario = UsuarioCadastro.objects.get(id=user_id)
                config, created = ConfiguracaoUsuario.objects.get_or_create(usuario=usuario)
                nickname = config.nickname
            except UsuarioCadastro.DoesNotExist:
                nickname = ''

    return render(request, 'perfil.html', {
        'nickname': nickname or '',
        'email': email or ''
    })


def personagens(request):
    personagens_list = Personagem.objects.filter(ativo=True).all()
    return render(request, 'personagens.html', {'personagens': personagens_list})


def profissional(request):
    return render(request, 'profissional.html')


def redsenha(request):
    return render(request, 'redSenha.html')


def senhared(request):
    return render(request, 'senhaRed.html')


def sobrenos(request):
    return render(request, 'sobre_nos.html')


def personagem_info(request, id):
    try:
        personagem = Personagem.objects.get(id=id, ativo=True)
        context = {
            'name': personagem.nome,
            'description': personagem.descricao,
            'specialization': personagem.especializacao,
            'likes': personagem.gostos,
            'suggestions': personagem.sugestoes,
            'similar': personagem.similares,
            'image_class': personagem.classe_imagem,
        }
        return render(request, 'info_perso.html', context)
    except Personagem.DoesNotExist:
        return redirect('ninho:personagens')


def chat_ia(request):
    if request.method == "POST":
        prompt = request.POST.get("prompt", "")
        resposta = gerar_resposta(prompt)
        return JsonResponse({"resposta": resposta})
    return render(request, 'chat.html')


def chat_view(request):
    user_id = request.session.get('usuario_id')
    personagem_id = request.GET.get('personagem_id')
    chat_obj = None
    chat_history = []
    
    if user_id and personagem_id:
        try:
            usuario = UsuarioCadastro.objects.get(id=user_id)
            personagem = Personagem.objects.get(id=personagem_id, ativo=True)
            
            chat_obj, created = Chat.objects.get_or_create(
                usuario=usuario,
                personagem=personagem,
                encerrado=False
            )
            mensagens = Mensagem.objects.filter(chat=chat_obj).order_by('timestamp')
            chat_history = [
                {'user': m.conteudo if m.tipo == 'usuario' else '',
                 'ai': m.conteudo if m.tipo == 'ia' else ''}
                for m in mensagens
            ]
        except (UsuarioCadastro.DoesNotExist, Personagem.DoesNotExist):
            pass
    
    if request.method == 'POST':
        try:
            user_message = json.loads(request.body).get('message', '')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição JSON inválida.'}, status=400)
        if not user_message:
            return JsonResponse({'message': ''})

        try:
            from . import ai_service
            response_text = ai_service.generate_simple_response(user_message)
        except Exception:
            response_text = "Desculpe, não consegui gerar uma resposta no momento."
        if chat_obj:
            try:
                Mensagem.objects.create(chat=chat_obj, tipo='usuario', conteudo=user_message)
                Mensagem.objects.create(chat=chat_obj, tipo='ia', conteudo=response_text)
            except Exception:
                pass
        return JsonResponse({'message': response_text})
    
    return render(request, 'chat.html', {'chat_history': chat_history, 'chat_id': chat_obj.id if chat_obj else None})


def aceitar_termos(request):
    if request.method != 'POST':
        return JsonResponse({'ok': False, 'error': 'Method not allowed'}, status=405)

    user_id = request.session.get('pending_user_id') or request.session.get('usuario_id')
    if not user_id:
        return JsonResponse({'ok': False, 'error': 'no_user'}, status=400)

    try:
        UsuarioCadastro.objects.filter(id=user_id).update(termos_aceitos=True)
        if 'pending_user_id' in request.session:
            del request.session['pending_user_id']
        return JsonResponse({'ok': True})
    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)
