import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Backdrop,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useExpenses } from '../../contexts/ExpenseContext';

interface SimpleAddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other',
];

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Check',
];

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxWidth: '100%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto',
};

const SimpleAddExpenseModal: React.FC<SimpleAddExpenseModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addExpense } = useExpenses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !category || !description || !amount || !paymentMethod) {
      setError('Please fill in all fields');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await addExpense({
        date: date.format('YYYY-MM-DD'),
        category,
        description,
        amount: amountNumber,
        paymentMethod,
      });

      if (success) {
        // Reset form
        setDate(dayjs());
        setCategory('');
        setDescription('');
        setAmount('');
        setPaymentMethod('');
        onSuccess();
        onClose();
      } else {
        setError('Failed to add expense. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while adding the expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Add New Expense
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={date}
                      onChange={setDate}
                      maxDate={dayjs()}
                      disabled={isSubmitting}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth required disabled={isSubmitting}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
                multiline
                rows={2}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                    inputProps={{
                      step: '0.01',
                      min: '0.01',
                    }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth required disabled={isSubmitting}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleClose}
                disabled={isSubmitting}
                variant="outlined"
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 100, position: 'relative' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Add Expense'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SimpleAddExpenseModal;