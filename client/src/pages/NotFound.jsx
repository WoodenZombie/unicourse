import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Container>
  );
}
