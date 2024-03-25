import React from 'react';
import { useContext } from 'react';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ExpandContext } from '../App';

const UserTextContent = ({ name, motto, fontSize, center }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: center ? 'center' : 'start',
      marginLeft: center ? '0' : '12px',
      opacity: fontSize > 0 ? 1 : 0,
      transition: 'opacity 0.3s',
    }}  >
      <Typography color="text.primary"
        sx={{
          fontSize: fontSize,
          maxLines: 1,
          transition: 'font-size 0.3s'
        }} >
        {name}
      </Typography>
      <Typography color="text.secondary"
        sx={{
          fontSize: fontSize * 0.75,
          textAlign: 'center',
          transition: 'font-size 0.3s'
        }} >
        {motto}
      </Typography>
    </Box>
  );
}

const UserAvatarContent = ({ avatar, isExpanded }) => {
  return (
    <Avatar
      alt="avatar"
      src={avatar}
      sx={{
        width: isExpanded ? '72px' : '32px',
        height: isExpanded ? '72px' : '32px',
        margin: isExpanded ? '8px 0 8px 0' : '0',
        transition: 'width 0.3s, height 0.3s, margin 0.3s',
      }} />
  );
}

const UserInfoCard = ({ userInfo }) => {
  const expandState = useContext(ExpandContext);
  const isExpanded = expandState.isExpanded;
  return (
    <Box sx={{ padding: '12px' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Box sx={{
          maxWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <UserAvatarContent avatar={userInfo.avatar} isExpanded={isExpanded} />
          <UserTextContent
            name={userInfo.name}
            motto={userInfo.motto}
            isExpanded={isExpanded}
            fontSize={isExpanded ? 20 : 0}
            center={true} />
        </Box>
        <UserTextContent
          name={userInfo.name}
          motto={userInfo.motto}
          isExpanded={isExpanded}
          fontSize={isExpanded ? 0 : 14} center={false} />
      </Box>
    </Box>
  );
};

export default UserInfoCard;
