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

    def test_expense_summary_date_filter(self):
        user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')

        category1 = Category.objects.create(name='Food')
        category2 = Category.objects.create(name='Travel')

        Expense.objects.create(
            date=date(2023, 1, 1),
            category=category1,
            description='Lunch',
            amount=Decimal('10.00'),
            payment_method='Cash',
        )
        Expense.objects.create(
            date=date(2023, 2, 1),
            category=category2,
            description='Taxi',
            amount=Decimal('20.00'),
            payment_method='Cash',
        )

        response = self.client.get(
            reverse('expense_summary'),
            {'start_date': '2023-01-15', 'end_date': '2023-12-31'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['overall'], Decimal('20.00'))
