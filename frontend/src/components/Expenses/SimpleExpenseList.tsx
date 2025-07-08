import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useExpenses, Expense } from '../../contexts/ExpenseContext';
import SimpleAddExpenseModal from './SimpleAddExpenseModal';
import SimpleEditExpenseModal from './SimpleEditExpenseModal';

const SimpleExpenseList: React.FC = () => {
  const {
    expenses,
    deleteExpense,
    getExpensesByDateRange,
  } = useExpenses();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories and payment methods
  const uniqueCategories = useMemo(
    () => [...new Set(expenses.map((expense) => expense.category))],
    [expenses]
  );

  const uniquePaymentMethods = useMemo(
    () => [...new Set(expenses.map((expense) => expense.paymentMethod))],
    [expenses]
  );

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Date range filter
    if (startDate && endDate) {
      filtered = getExpensesByDateRange(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((expense) => expense.category === categoryFilter);
    }

    // Payment method filter
    if (paymentMethodFilter) {
      filtered = filtered.filter(
        (expense) => expense.paymentMethod === paymentMethodFilter
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [
    expenses,
    startDate,
    endDate,
    categoryFilter,
    paymentMethodFilter,
    searchTerm,
    getExpensesByDateRange,
  ]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setCategoryFilter('');
    setPaymentMethodFilter('');
    setSearchTerm('');
  };

  const totalFiltered = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Fade in timeout={600}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Expenses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Add Expense
            </Button>
          </Box>
        </Fade>

        {/* Filters */}
        <Fade in timeout={800}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FilterIcon sx={{ mr: 1 }} />
                Filters
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ minWidth: 200 }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethodFilter}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniquePaymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                <Button onClick={clearFilters} variant="outlined" size="small">
                  Clear
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Summary */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${filteredExpenses.length} expenses`}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label={`Total: $${totalFiltered.toFixed(2)}`}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Fade>

        {/* Table */}
        <Fade in timeout={1200}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No expenses found matching your criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow
                        key={expense.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <TableCell>
                          {dayjs(expense.date).format('MMM DD, YYYY')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={expense.category}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(expense)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(expense.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Fade>

        {/* Modals and Dialogs */}
        <SimpleAddExpenseModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            // Refresh data is handled by context
          }}
        />

        {editingExpense && (
          <SimpleEditExpenseModal
            open={editModalOpen}
            expense={editingExpense}
            onClose={() => {
              setEditModalOpen(false);
              setEditingExpense(null);
            }}
            onSuccess={() => {
              // Refresh data is handled by context
            }}
          />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SimpleExpenseList;