import { 
  Container, 
  Typography, 
  Button, 
  Box,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="sm" sx={{ 
      textAlign: 'center', 
      mt: isMobile ? 5 : 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '70vh'
    }}>
      <Box sx={{
        bgcolor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        width: 100,
        height: 100,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3
      }}>
        <ErrorOutlineIcon sx={{ fontSize: 60 }} />
      </Box>
      
      <Typography 
        variant={isMobile ? 'h4' : 'h3'} 
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        404 - Page Not Found
      </Typography>
      
      <Typography 
        variant={isMobile ? 'body1' : 'h6'} 
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        Oops! The page you're looking for doesn't exist or may have been moved.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ px: 4, py: 1.5 }}
        >
          Go to Home
        </Button>
        
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate(-1)}
          sx={{ px: 4, py: 1.5 }}
        >
          Go Back
        </Button>
      </Box>
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ mt: 4 }}
      >
        If you believe this is an error, please contact support.
      </Typography>
    </Container>
  );
}