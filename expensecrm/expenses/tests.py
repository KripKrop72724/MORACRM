from django.test import TestCase
from .models import Expense, Category
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date
from decimal import Decimal

class ExpenseModelTest(TestCase):
    def test_create_expense(self):
        category = Category.objects.create(name='Food')
        expense = Expense.objects.create(
            date=date.today(),
            category=category,
            description='Lunch',
            amount=Decimal('10.00'),
            payment_method='Cash'
        )
        self.assertEqual(str(expense), f"{expense.date} - Food - 10.00")

class ExpenseViewsTest(TestCase):
    def test_expense_list_view(self):
        user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('expense_list'))
        self.assertEqual(response.status_code, 200)
