from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Sum
from django.contrib.auth.decorators import login_required
from .models import Expense, Category
from django.contrib.auth import login
from .forms import ExpenseForm, CategoryForm, RegisterForm


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("expense_list")
    else:
        form = RegisterForm()
    return render(request, "registration/register.html", {"form": form})


@login_required
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


@login_required
def expense_create(request):
    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            expense = form.save(commit=False)
            expense.user = request.user
            expense.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm()
    return render(request, 'expenses/expense_form.html', {'form': form})


@login_required
def expense_update(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    if request.method == 'POST':
        form = ExpenseForm(request.POST, instance=expense)
        if form.is_valid():
            expense = form.save(commit=False)
            expense.user = request.user
            expense.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm(instance=expense)
    return render(request, 'expenses/expense_form.html', {'form': form})


@login_required
def category_create(request):
    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("expense_add")
    else:
        form = CategoryForm()
    return render(request, "expenses/category_form.html", {"form": form})


@login_required
def expense_delete(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    if request.method == 'POST':
        expense.delete()
        return redirect('expense_list')
    return render(request, 'expenses/expense_confirm_delete.html', {'expense': expense})


@login_required
def expense_bulk_delete(request):
    if request.method == "POST":
        ids = request.POST.getlist("selected_expenses")
        if ids:
            Expense.objects.filter(id__in=ids).delete()
    return redirect("expense_list")


@login_required
def expense_summary(request):
    expenses = Expense.objects.select_related("category")
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if start_date:
        expenses = expenses.filter(date__gte=start_date)
    if end_date:
        expenses = expenses.filter(date__lte=end_date)

    summary = (
        expenses.values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("category__name")
    )
    overall = expenses.aggregate(total=Sum("amount"))["total"] or 0
    return render(
        request,
        "expenses/summary.html",
        {
            "summary": summary,
            "overall": overall,
            "start_date": start_date,
            "end_date": end_date,
        },
    )
