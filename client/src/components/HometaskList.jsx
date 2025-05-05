import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip,
  Box,
  Button,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  CheckCircle, 
  Schedule, 
  Assignment,
  ArrowForward,
  Warning,
  Edit,
  Delete
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

export default function HometaskList({ hometasks, onTaskComplete, onEdit, onDelete, courses = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Safely handle hometasks and courses props
  const safeHometasks = Array.isArray(hometasks) ? hometasks : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  // Group tasks by status and due date
  const overdueTasks = safeHometasks.filter(task => 
    task?.status !== 'completed' && dayjs(task?.deadline).isBefore(dayjs())
  );
  const upcomingTasks = safeHometasks.filter(task => 
    task?.status !== 'completed' && dayjs(task?.deadline).isAfter(dayjs())
  );
  const completedTasks = safeHometasks.filter(task => task?.status === 'completed');

  // Handle both string and object course references
  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown Course';
    
    // Handle both populated and non-populated course references
    const actualCourseId = courseId._id || courseId;
    const course = safeCourses.find(c => c?._id?.toString() === actualCourseId?.toString());
    return course?.name || 'Unknown Course';
  };

  const getCourseId = (courseId) => {
    if (!courseId) return null;
    return courseId._id || courseId;
  };

  const renderTaskGroup = (tasks, title, color) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold"
          sx={{ 
            mb: 1,
            color: color || 'text.primary',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {title} ({tasks.length})
        </Typography>
        <List sx={{ py: 0 }}>
          {tasks.map(task => {
            const taskId = task?._id?.toString();
            if (!taskId) return null;

            return (
              <ListItem 
                key={taskId}
                sx={{ 
                  bgcolor: task?.status === 'completed' ? 'action.hover' : 'background.paper',
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: 1
                }}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    {onTaskComplete && task?.status !== 'completed' && (
                      <Tooltip title="Mark as completed">
                        <IconButton onClick={() => onTaskComplete(taskId)}>
                          <CheckCircle color="success" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onEdit && (
                      <Tooltip title="Edit task">
                        <IconButton onClick={() => onEdit(task)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete task">
                        <IconButton onClick={() => onDelete(taskId)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                }
              >
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  mr: 2,
                  width: 40,
                  height: 40
                }}>
                  <Assignment />
                </Avatar>
                <ListItemText
                  primary={
                    <Typography fontWeight="medium">
                      {task?.description || 'No description'}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      {task?.deadline && (
                        <Chip 
                          icon={<Schedule />}
                          label={dayjs(task.deadline).format('MMM D, YYYY h:mm A')}
                          size="small"
                          color={dayjs(task.deadline).isBefore(dayjs()) ? 'error' : 'default'}
                        />
                      )}
                      {task?.courseId && (
                        <Chip 
                          label={getCourseName(task.courseId)}
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const courseId = getCourseId(task.courseId);
                            if (courseId) navigate(`/courses/${courseId}`);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      )}
                      {task?.status === 'completed' && (
                        <Chip 
                          icon={<CheckCircle />}
                          label="Completed"
                          color="success"
                          size="small"
                        />
                      )}
                    </Stack>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Hometasks
      </Typography>

      {renderTaskGroup(overdueTasks, 'Overdue', theme.palette.error.main)}
      {renderTaskGroup(upcomingTasks, 'Upcoming', theme.palette.warning.main)}
      {renderTaskGroup(completedTasks, 'Completed', theme.palette.success.main)}

      {safeHometasks.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 1
        }}>
          <Typography variant="body1" color="text.secondary">
            No hometasks found. Add your first task!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/courses')}
          >
            View Courses
          </Button>
        </Box>
      )}
    </Box>
  );
}