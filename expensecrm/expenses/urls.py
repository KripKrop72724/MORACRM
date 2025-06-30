from django.urls import path
from . import views

urlpatterns = [
    path('', views.expense_list, name='expense_list'),
    path('add/', views.expense_create, name='expense_add'),
    path('<int:pk>/edit/', views.expense_update, name='expense_edit'),
    path('<int:pk>/delete/', views.expense_delete, name='expense_delete'),
    path('summary/', views.expense_summary, name='expense_summary'),
]
