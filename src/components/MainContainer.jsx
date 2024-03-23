import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';

import { useState } from 'react';

const FloatingCard = styled(Card)(({ isExpanded }) => ({
  position: 'absolute',
  top: isExpanded ? '50%' : '15%',
  left: isExpanded ? '50%' : '50%',
  transform: 'translate(-50%, -50%)',
  width: isExpanded ? '66%' : '420px',
  height: isExpanded ? '80%' : '70px',
  zIndex: 1,
  opacity: isExpanded ? 0.8 : 0.3,
  transition: 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, transform 0.3s, opacity 0.3s',
}));

export function MainContainer() {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAvatarClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <FloatingCard isExpanded={isExpanded}>
      <Box onClick={handleAvatarClick} >
        <CardContent>
          <Avatar
            alt="Avatar"
            src="https://brown-1300926339.cos.ap-beijing.myqcloud.com/uPic/2024-01-12-WechatIMG490-yqBXoR.jpg"
            sx={{
              width: isExpanded ? '72px' : '36px',
              height: isExpanded ? '72px' : '36px',
              transition: 'width 0.3s, height 0.3s',
            }} />
        </CardContent>
      </Box>
    </FloatingCard>
  );
}
