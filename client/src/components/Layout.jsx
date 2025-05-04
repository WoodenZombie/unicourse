import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar'; 


const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <AppBar />
      {/* <Sidebar /> */}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {/* this empty Toolbar prevents content from being hidden behind AppBar */}
        <Toolbar /> 
        
        {/* this renders the child routes */}
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;