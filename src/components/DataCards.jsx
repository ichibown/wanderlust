import { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ExpandContext } from '../App';

export default function DataCards() {
  const expandState = useContext(ExpandContext);
  const expanded = expandState.isExpanded;
  return (
    <Box sx={{
      flexGrow: 1,
      margin: expanded ? '40px 12px 40px 12px' : '0',
      overflow: 'auto',
      width: expanded ? '100vh' : '0px',
      height: expanded ? '100vw' : '0px',
      maxHeight: 'calc(100vh - 120px)',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      transition: 'width 0.3s, height 0.3s, margin 0.3s',
    }}>
      <Grid container spacing={{ xs: 1, sm: 1, md: 2 }} columns={{ xs: 1, sm: 1, md: 2 }}>
        {Array.from(Array(14)).map((_, index) => (
          <Grid item xs={1} sm={1} md={1} key={index}>
            <Box sx={{
              height: '200px',
            }}>
              Data Card Place Holder
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
