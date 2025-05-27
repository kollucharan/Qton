
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';

export default function MyCard({

  title,
   icon,
  children,

   sx
}) {
  return (
   <Card sx={{borderRadius:3, maxWidth: 320, transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },fontFamily: 'Mulish', ...sx }}>
     {icon && (
        <CardMedia
          component="img"
          image={icon}
          alt="card icon"
          sx={{ width: 45, height: 45, objectFit: 'contain', m: 2 }}
        />
      )}
      <CardContent>
        {title && (
          <Typography variant="h6" >
            {title}
          </Typography>
        )}
        <Typography variant="body2">
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}
