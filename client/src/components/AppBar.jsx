import { 
  AppBar as MuiAppBar, 
  Toolbar, 
  Button,
  IconButton 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

export default function AppBar({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}
        >
          UniCourse
        </Button>
        <IconButton
          color="inherit"
          edge="end"
          onClick={toggleSidebar}
          sx={{ ml: 2 }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}