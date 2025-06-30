from django import forms
from .models import Expense

class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ['date', 'category', 'description', 'amount', 'payment_method', 'receipt_link']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }
