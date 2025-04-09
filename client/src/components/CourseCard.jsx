import { Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { Schedule, School } from '@mui/icons-material';

export default function CourseCard({ course, hometasks }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{course.name}</Typography>
        <Typography color="text.secondary">
          <School fontSize="small" /> {course.professor}
        </Typography>
        
        <Chip 
          icon={<Schedule />} 
          label={course.schedule} 
          sx={{ mt: 1, mb: 1 }} 
        />
        
        <Typography>Credits: {course.credits}</Typography>
        
        {hometasks.map(task => (
          <div key={task._id} style={{ marginTop: '8px' }}>
            <Typography variant="body2">
              {task.description}
            </Typography>
            <Typography variant="caption">
              Due: {new Date(task.deadline).toLocaleDateString()}
              {task.status === 'completed' && ' ✔️'}
            </Typography>
          </div>
        ))}
        
        <Button 
          size="small" 
          sx={{ mt: 1 }}
          href={`/courses/${course._id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
