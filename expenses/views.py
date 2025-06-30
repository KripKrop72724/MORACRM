from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Sum
from .models import Expense
from .forms import ExpenseForm


def expense_list(request):
    expenses = Expense.objects.all().order_by('-date')
    category = request.GET.get('category')
    if category:
        expenses = expenses.filter(category=category)
    total = expenses.aggregate(total=Sum('amount'))['total'] or 0
    expense_form = ExpenseForm()
    return render(request, 'expenses/expense_list.html', {
        'expenses': expenses,
        'total': total,
        'category': category or '',
        'expense_form': expense_form,
    })


def expense_create(request):
    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm()
    return render(request, 'expenses/expense_form.html', {'form': form})


def expense_update(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    if request.method == 'POST':
        form = ExpenseForm(request.POST, instance=expense)
        if form.is_valid():
            form.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm(instance=expense)
    return render(request, 'expenses/expense_form.html', {'form': form})


def expense_delete(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    if request.method == 'POST':
        expense.delete()
        return redirect('expense_list')
    return render(request, 'expenses/expense_confirm_delete.html', {'expense': expense})
