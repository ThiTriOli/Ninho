from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ninho/', include(('ninho.urls', 'ninho'), namespace='ninho')),
    path('ia/', include('ninho.urls')),
]