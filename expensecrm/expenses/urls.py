from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from . import api
from .forms import LoginForm

urlpatterns = [
    path('', views.expense_list, name='expense_list'),
    path('add/', views.expense_create, name='expense_add'),
    path('categories/add/', views.category_create, name='category_add'),
    path('<int:pk>/edit/', views.expense_update, name='expense_edit'),
    path('<int:pk>/delete/', views.expense_delete, name='expense_delete'),
    path('bulk-delete/', views.expense_bulk_delete, name='expense_bulk_delete'),
    path('summary/', views.expense_summary, name='expense_summary'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='registration/login.html',
        authentication_form=LoginForm
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('api/signup/', api.SignupAPIView.as_view(), name='api_signup'),
    path('api/login/', api.LoginAPIView.as_view(), name='api_login'),
]
