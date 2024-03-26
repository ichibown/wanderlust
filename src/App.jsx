import { useState, createContext } from 'react';
import WorldMap from "./components/WorldMap";
import DashboardContaienr from "./components/DashboardContainer";
import UserInfoCard from "./components/UserInfoCard";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Box } from '@mui/material';

export const ExpandContext = createContext();

function App() {
  const [isExpanded, setExpand] = useState(false);
  const handleIconClick = () => {
    setExpand(!isExpanded);
  }
  return (
    <ExpandContext.Provider value={{ isExpanded, setExpand }}>
      <WorldMap />
      <DashboardContaienr>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <UserInfoCard
            userInfo={{
              name: "BrownTheRunner",
              motto: "Better to run than curse the road.",
              avatar: "/avatar.jpg",
            }}
          />
          <ExpandMoreRoundedIcon sx={{
            width: '24px',
            height: '24px',
            margin: '18px 12px 0 0',
            rotate: isExpanded ? '180deg' : '0deg',
            transition: 'rotate 0.3s',
          }}
            onClick={handleIconClick} />
        </Box>
      </DashboardContaienr>
    </ExpandContext.Provider>
  );
}

export default App
