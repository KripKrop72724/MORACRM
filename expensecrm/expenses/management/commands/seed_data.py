from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from expenses.models import Category, Expense
from faker import Faker
from decimal import Decimal
import random

class Command(BaseCommand):
    help = "Seed the database with demo data"

    def handle(self, *args, **options):
        faker = Faker()
        categories = [
            "Food",
            "Travel",
            "Office",
            "Utilities",
            "Entertainment",
        ]
        category_objs = []
        for name in categories:
            obj, _ = Category.objects.get_or_create(name=name)
            category_objs.append(obj)

        users = []
        for i in range(10):
            username = f"user{i+1}"
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password("password")
                user.save()
            users.append(user)

        payment_methods = [choice[0] for choice in Expense.PAYMENT_METHOD_CHOICES]

        for _ in range(50):
            Expense.objects.create(
                user=random.choice(users),
                date=faker.date_between(start_date="-1y", end_date="today"),
                category=random.choice(category_objs),
                description=faker.sentence(),
                amount=Decimal(f"{random.uniform(5, 500):.2f}"),
                payment_method=random.choice(payment_methods),
                receipt_link=faker.url(),
            )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded."))
