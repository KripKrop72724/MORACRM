from django.db import models

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food'),
        ('travel', 'Travel'),
        ('utilities', 'Utilities'),
        ('other', 'Other'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit', 'Credit Card'),
        ('debit', 'Debit Card'),
        ('transfer', 'Transfer'),
    ]

    date = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    receipt_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.date} {self.category} {self.amount}"
