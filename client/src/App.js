import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles/index.js';
import CssBaseline from '@mui/material/CssBaseline/index.js';
import { SnackbarProvider } from 'notistack';
import theme from './theme.js';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import NotFound from './pages/NotFound.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';

// create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}
        >
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses/all" element={<CoursesPage />} />
              </Route>
              
              {/* fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;