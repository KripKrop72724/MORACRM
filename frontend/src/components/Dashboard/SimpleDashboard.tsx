import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Fade,
  Grow,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useExpenses } from '../../contexts/ExpenseContext';
import ExpenseChart from './ExpenseChart';
import CategoryChart from './CategoryChart';
import dayjs from 'dayjs';

const SimpleDashboard: React.FC = () => {
  const { getTotalExpenses, getMonthlyTotal, getCategoryTotals, getExpensesByMonth } = useExpenses();

  const totalExpenses = getTotalExpenses();
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const monthlyTotal = getMonthlyTotal(currentMonth, currentYear);
  const categoryData = getCategoryTotals();
  const monthlyData = getExpensesByMonth();

  const summaryCards = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#000000',
    },
    {
      title: 'This Month',
      value: `$${monthlyTotal.toFixed(2)}`,
      icon: <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#333333',
    },
    {
      title: 'Categories',
      value: categoryData.length.toString(),
      icon: <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#666666',
    },
    {
      title: 'Avg/Month',
      value: `$${monthlyData.length > 0 ? (totalExpenses / monthlyData.length).toFixed(2) : '0.00'}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#999999',
    },
  ];

  return (
    <Box>
      <Fade in timeout={600}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
          Dashboard
        </Typography>
      </Fade>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Box key={card.title} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Grow in timeout={600 + index * 200}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                        gutterBottom
                        variant="overline"
                        sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          fontWeight: 'bold',
                          color: card.color,
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ opacity: 0.7 }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        ))}
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.67% - 12px)' } }}>
          <Fade in timeout={1000}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Monthly Expenses
                </Typography>
                <ExpenseChart data={monthlyData} />
              </CardContent>
            </Card>
          </Fade>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.33% - 12px)' } }}>
          <Fade in timeout={1200}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Expenses by Category
                </Typography>
                <CategoryChart data={categoryData} />
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleDashboard;