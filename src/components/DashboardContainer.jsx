import { useContext } from 'react';
import Box from '@mui/material/Box';
import { ExpandContext } from '../App';
import { Card } from '@mui/material';

export function DashboardContainer({ children }) {
  const expandState = useContext(ExpandContext);
  return (
    <Box sx={{
      position: 'absolute',
      zIndex: 1,
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
      padding: '12px',
      backgroundColor: '#00000000',
      pointerEvents: 'none',
      opacity: expandState.isExpanded ? 0.8 : 0.5,
      transition: 'opacity 0.3s',
    }} >
      <Card sx={{ pointerEvents: 'auto' }}>
        {children}
      </Card>
    </Box>
  );
}

export default DashboardContainer;
