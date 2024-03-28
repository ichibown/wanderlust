import React from 'react';
import { useContext } from 'react';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ConfigDialog from './ConfigDialog';
import { ExpandContext, HomeDataContext } from '../App';

const UserTextContent = ({ name, motto, fontSize, center }) => {
  const isExpanded = fontSize > 0;
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: center ? 'center' : 'start',
      marginLeft: center ? '0' : '12px',
      opacity: isExpanded ? 1 : 0,
      transform: isExpanded ? 'translateY(0)' : (center ? 'translateY(-20px)' : 'translateY(20px)'),
      transition: 'opacity 0.3s 0.3s, transform 0.3s 0.3s',
    }}  >
      <Typography color="text.primary"
        sx={{
          fontSize: fontSize,
          maxLines: 1,
        }} >
        {name}
      </Typography>
      <Typography color="text.secondary"
        sx={{
          fontSize: fontSize * 0.75,
          maxLines: 1,
          textAlign: 'center',
        }} >
        {motto}
      </Typography>
    </Box>
  );
}

const UserInfoCard = () => {
  const expandState = useContext(ExpandContext);
  const homeDataState = useContext(HomeDataContext);
  const userInfo = homeDataState.configData.userInfo || {};
  const isExpanded = expandState.isExpanded;
  const [configOpen, setConfigOpen] = React.useState(false);
  const handleAvatarClick = () => {
    setConfigOpen(!configOpen);
  }
  return (
    <Box sx={{
      padding: '12px',
      maxWidth: isExpanded ? '280px' : '100%',
      height: isExpanded ? '180px' : '64px',
      transition: 'max-width 0.3s, height 0.3s',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Box
          sx={{
            maxWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Avatar
            alt="avatar"
            src={userInfo.avatar || '/avatar.jpg'}
            onClick={handleAvatarClick}
            sx={{
              width: isExpanded ? '72px' : '32px',
              height: isExpanded ? '72px' : '32px',
              margin: isExpanded ? '8px 0 8px 72px' : '0',
              transition: 'width 0.3s, height 0.3s, margin 0.3s',
            }} />
          <UserTextContent
            name={userInfo.name || 'Anonymous'}
            motto={userInfo.motto || 'None'}
            fontSize={isExpanded ? 20 : 0}
            center={true} />
        </Box>
        <UserTextContent
          name={userInfo.name || 'Anonymous'}
          motto={userInfo.motto || 'None'}
          fontSize={isExpanded ? 0 : 14}
          center={false} />
      </Box>
      <ConfigDialog
        userInfo={userInfo}
        open={configOpen}
        hasStrava={homeDataState.configData.hasStrava}
        setOpen={setConfigOpen} />
    </Box>
  );
};

export default UserInfoCard;
