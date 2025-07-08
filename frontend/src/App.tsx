import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/muiTheme';
import { AuthProvider } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import SimpleDashboard from './components/Dashboard/SimpleDashboard';
import SimpleExpenseList from './components/Expenses/SimpleExpenseList';
import SimpleAddExpenseModal from './components/Expenses/SimpleAddExpenseModal';
import { useState } from 'react';

const App = () => {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <ExpenseProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navbar>
                        <SimpleDashboard />
                      </Navbar>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <Navbar>
                        <SimpleExpenseList />
                      </Navbar>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-expense"
                  element={
                    <ProtectedRoute>
                      <Navbar>
                        <SimpleDashboard />
                        <SimpleAddExpenseModal
                          open={true}
                          onClose={() => window.history.back()}
                          onSuccess={() => window.location.href = '/expenses'}
                        />
                      </Navbar>
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </ExpenseProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;