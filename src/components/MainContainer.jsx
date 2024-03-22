import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';

import { useState } from 'react';

const FloatingCard = styled(Card)(({ isExpanded }) => ({
  position: 'absolute',
  top: isExpanded ? '50%' : '10%',
  left: isExpanded ? '50%' : '10%',
  transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
  width: isExpanded ? '80%' : '100px',
  height: isExpanded ? '80%' : '100px',
  zIndex: 1,
  opacity: 0.8,
  transition: 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, transform 0.3s',
}));

export function MainContainer() {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAvatarClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <FloatingCard isExpanded={isExpanded}>
      <Box padding={2}>
        <CardContent>
          <Avatar alt="Avatar" src="https://brown-1300926339.cos.ap-beijing.myqcloud.com/uPic/2024-01-12-WechatIMG490-yqBXoR.jpg" onClick={handleAvatarClick} />
        </CardContent>
      </Box>
    </FloatingCard>
  );
}
