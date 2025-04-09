import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';

export default function HometaskList({ hometasks }) {
  return (
    <div>
      <Typography variant="h5" gutterBottom>Upcoming Hometasks</Typography>
      
      <List>
        {hometasks.map(task => (
          <ListItem key={task._id} divider>
            <ListItemText
              primary={task.description}
              secondary={
                <>
                  <Chip 
                    icon={<Schedule />}
                    label={new Date(task.deadline).toLocaleString()} 
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {task.status === 'completed' && (
                    <Chip 
                      icon={<CheckCircle />}
                      label="Completed"
                      color="success"
                      size="small"
                    />
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
