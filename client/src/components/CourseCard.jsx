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
  Tooltip,
  Skeleton
} from '@mui/material';
import { 
  Schedule, 
  School, 
  Person, 
  Star, 
  Assignment, 
  ArrowForward,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function CourseCard({ course, hometasks = [], loading = false }) {
  const pendingTasks = hometasks?.filter(t => t?.status !== 'completed')?.length || 0;
  const overdueTasks = hometasks?.filter(t => 
    t?.status !== 'completed' && 
    t?.deadline && 
    dayjs(t.deadline).isBefore(dayjs())
  )?.length || 0;

  if (loading) {
    return (
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton width="60%" height={32} />
              <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                <Skeleton variant="rectangular" width={80} height={24} />
                <Skeleton variant="rectangular" width={100} height={24} />
                <Skeleton variant="rectangular" width={70} height={24} />
              </Stack>
              <Skeleton width="100%" height={20} />
              <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
              <Divider sx={{ my: 2 }} />
              <Skeleton width="40%" height={20} />
              <Skeleton width="100%" height={40} sx={{ mt: 2 }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!course) {
    return (
      <Card sx={{ mb: 3, borderRadius: 2, borderColor: 'error.main' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'error.main' }}>
              <ErrorIcon />
            </Avatar>
            <Typography color="error">Course data unavailable</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6
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
            
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
              <Tooltip title="Professor">
                <Chip 
                  icon={<Person fontSize="small" />}
                  label={course.professor || 'Unknown'}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>
              <Tooltip title="Schedule">
                <Chip 
                  icon={<Schedule fontSize="small" />}
                  label={course.schedule || 'No schedule'}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>
              <Tooltip title="Credits">
                <Chip 
                  icon={<Star fontSize="small" />}
                  label={`${course.credits || 0} Credits`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Tooltip>
            </Stack>
            
            {course.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {course.description}
              </Typography>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assignment color="action" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" component="div">
                Hometasks: 
                <Badge 
                  badgeContent={pendingTasks} 
                  color="error" 
                  sx={{ ml: 1.5, mr: 1.5 }}
                  max={99}
                />
                {overdueTasks > 0 && (
                  <Tooltip title={`${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`}>
                    <Warning color="error" fontSize="small" sx={{ mr: 1 }} />
                  </Tooltip>
                )}
              </Typography>
            </Box>
            
            {hometasks?.slice(0, 2).map(task => (
              <Box 
                key={task._id} 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  p: 1,
                  bgcolor: task.status === 'completed' ? 'action.hover' : 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                {task.status === 'completed' ? (
                  <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                ) : (
                  <Assignment color={task.deadline && dayjs(task.deadline).isBefore(dayjs()) ? 'error' : 'action'} 
                    fontSize="small" 
                    sx={{ mr: 1 }} 
                  />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flexGrow: 1,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {task.description || 'Untitled task'}
                </Typography>
                {task.deadline && (
                  <Typography 
                    variant="caption" 
                    color={task.deadline && dayjs(task.deadline).isBefore(dayjs()) ? 'error' : 'text.secondary'}
                  >
                    {dayjs(task.deadline).fromNow()}
                  </Typography>
                )}
              </Box>
            ))}
            
            {hometasks?.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{hometasks.length - 2} more task{hometasks.length - 2 !== 1 ? 's' : ''}
              </Typography>
            )}
            
                      <Button
            component={Link}
            to={`/courses/${course?._id || ''}`}  // Add null check
            variant="outlined"
            fullWidth
            endIcon={<ArrowForward />}
            sx={{ 
              mt: 2,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }
            }}
          >
            View Details
          </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}