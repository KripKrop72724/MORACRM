from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Sum
from .models import Expense, Category
from .forms import ExpenseForm, CategoryForm


def expense_list(request):
    expenses = Expense.objects.select_related("category").all().order_by("-date")
    category = request.GET.get("category")
    if category:
        expenses = expenses.filter(category_id=category)
    total = expenses.aggregate(total=Sum("amount"))["total"] or 0
    categories = Category.objects.all()
    return render(
        request,
        "expenses/expense_list.html",
        {"expenses": expenses, "total": total, "categories": categories},
    )


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


def category_create(request):
    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("expense_add")
    else:
        form = CategoryForm()
    return render(request, "expenses/category_form.html", {"form": form})


def expense_delete(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    if request.method == 'POST':
        expense.delete()
        return redirect('expense_list')
    return render(request, 'expenses/expense_confirm_delete.html', {'expense': expense})


def expense_summary(request):
    summary = (
        Expense.objects.select_related("category")
        .values("category__name")
        .annotate(total=Sum("amount"))
    )
    overall = Expense.objects.aggregate(total=Sum("amount"))["total"] or 0
    return render(
        request,
        "expenses/summary.html",
        {"summary": summary, "overall": overall},
    )
