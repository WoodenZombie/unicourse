import { Box, CssBaseline, Toolbar, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';

const drawerWidth = 240;

const Layout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

const toggleSidebar = () => {
setSidebarOpen(!sidebarOpen);
};

return (
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
<CssBaseline />

<AppBar toggleSidebar={toggleSidebar} />

{/* Main content */}
<Box
 component="main"
 sx={{
   flexGrow: 1,
   p: 3,
   width: '100%',
   backgroundColor: (theme) => theme.palette.background.default,
 }}
>
 <Toolbar /> {/* Spacer for AppBar */}
 <Outlet />
</Box>

{/* Right-side sliding drawer */}
<Drawer
 anchor="right"
 open={sidebarOpen}
 onClose={toggleSidebar}
 sx={{
   width: drawerWidth,
   flexShrink: 0,
   '& .MuiDrawer-paper': {
     width: drawerWidth,
   },
 }}
>

 <Box sx={{ overflow: 'auto', mt: 7 }}>
 <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" component="div">
              Menu
            </Typography>
          </Box>
   <List>
     <ListItem disablePadding>
       <ListItemButton component={Link} to="/" onClick={toggleSidebar}>
         <ListItemIcon>
           <HomeIcon />
         </ListItemIcon>
         <ListItemText primary="Dashboard" />
       </ListItemButton>
     </ListItem>
     
     <ListItem disablePadding>
       <ListItemButton component={Link} to="/hometasks/all" onClick={toggleSidebar}>
         <ListItemIcon>
           <AssignmentIcon />
         </ListItemIcon>
         <ListItemText primary="Hometasks" />
       </ListItemButton>
     </ListItem>
     
     <ListItem disablePadding>
       <ListItemButton component={Link} to="/courses/all" onClick={toggleSidebar}>
         <ListItemIcon>
           <SchoolIcon />
         </ListItemIcon>
         <ListItemText primary="Courses" />
       </ListItemButton>
     </ListItem>
   </List>
 </Box>
</Drawer>
</Box>
);
};

export default Layout;