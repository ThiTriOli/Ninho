from django.contrib import admin

from .models import UsuarioCadastro

@admin.register(UsuarioCadastro)
class UsuarioCadastroAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'senha') 
    search_fields = ('email',)
    search_fields = ('email',)

