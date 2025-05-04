import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  Box, 
  Stack,
  Badge,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Schedule, 
  School, 
  Person, 
  Star, 
  Assignment, 
  ArrowForward,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { Link } from 'react-router-dom'; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function CourseCard({ course, hometasks = [] }) {
  const pendingTasks = hometasks.filter(t => t.status !== 'completed').length;
  const overdueTasks = hometasks.filter(t => 
    t.status !== 'completed' && 
    dayjs(t.deadline).isBefore(dayjs())
  ).length;

  return (
    <Card 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            width: 56, 
            height: 56,
            mt: 1
          }}>
            <School fontSize="large" />
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {course.name}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Chip 
                icon={<Person fontSize="small" />}
                label={course.professor}
                size="small"
                variant="outlined"
              />
              <Chip 
                icon={<Schedule fontSize="small" />}
                label={course.schedule}
                size="small"
                variant="outlined"
              />
              <Chip 
                icon={<Star fontSize="small" />}
                label={`${course.credits} Credits`}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Stack>
            
            {course.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {course.description}
              </Typography>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assignment color="action" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">
                Hometasks: 
                <Badge 
                  badgeContent={pendingTasks} 
                  color="error" 
                  sx={{ ml: 1.5, mr: 1.5 }}
                />
                {overdueTasks > 0 && (
                  <Tooltip title={`${overdueTasks} overdue tasks`}>
                    <Warning color="error" fontSize="small" sx={{ mr: 1 }} />
                  </Tooltip>
                )}
              </Typography>
            </Box>
            
            {hometasks.slice(0, 2).map(task => (
              <Box 
                key={task._id} 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  p: 1,
                  bgcolor: task.status === 'completed' ? 'action.hover' : 'background.paper',
                  borderRadius: 1
                }}
              >
                {task.status === 'completed' ? (
                  <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                ) : (
                  <Assignment color="action" fontSize="small" sx={{ mr: 1 }} />
                )}
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {task.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(task.deadline).fromNow()}
                </Typography>
              </Box>
            ))}
            
            {hometasks.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{hometasks.length - 2} more tasks
              </Typography>
            )}
            
            <Button
              component={Link}
              to={`/courses/${course._id}`}
              variant="outlined"
              fullWidth
              endIcon={<ArrowForward />}
              sx={{ mt: 2 }}
            >
              View Details
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}