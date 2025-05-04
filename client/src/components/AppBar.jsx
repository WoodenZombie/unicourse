import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AppBar() {
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          UniCourse
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/courses">
          Courses
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
}