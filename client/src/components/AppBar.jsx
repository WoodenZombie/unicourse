import { AppBar as MuiAppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppBar({ toggleSidebar }) {
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          UniCourse
        </Typography>
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