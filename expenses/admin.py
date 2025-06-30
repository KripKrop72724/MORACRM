from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('date', 'category', 'description', 'amount', 'payment_method')
    list_filter = ('category', 'payment_method')
    search_fields = ('description',)
