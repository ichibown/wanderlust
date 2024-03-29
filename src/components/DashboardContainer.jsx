import { useContext } from 'react';
import { ExpandContext } from '../App';
import { Card } from '@mui/material';
import Container from '@mui/material/Container';

export function DashboardContainer({ children }) {
  const expandState = useContext(ExpandContext);
  return (
    <Container
      maxWidth="md"
      sx={{
        position: 'absolute',
        top: '4%',
        right: '0%',
        left: '0%',
        maxHeight: '92%',
        pointerEvents: 'none',
        opacity: expandState.isExpanded ? 0.8 : 0.5,
        transition: 'opacity 0.3s',
        display: 'flex',
        justifyContent: 'center',
      }} >
      <Card sx={{ pointerEvents: 'auto', display: 'inline-block' }}>
        {children}
      </Card>
    </Container>
  );
}

export default DashboardContainer;
