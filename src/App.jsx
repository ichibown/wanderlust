import { useState, createContext, useEffect } from 'react';
import WorldMap from "./components/WorldMap";
import DashboardContaienr from "./components/DashboardContainer";
import UserInfoCard from "./components/UserInfoCard";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Box } from '@mui/material';
import { getHomeData } from './utils/requests';

export const ExpandContext = createContext();
export const HomeDataContext = createContext();

function App() {
  const [isExpanded, setExpand] = useState(false);
  const [homeData, setHomeData] = useState({});
  const handleIconClick = () => {
    setExpand(!isExpanded);
  }
  useEffect(() => {
    getHomeData((data) => { setHomeData(data); });
  }, []);
  return (
    <ExpandContext.Provider value={{ isExpanded, setExpand }}>
      <HomeDataContext.Provider value={{ homeData }}>
        <WorldMap />
        <DashboardContaienr>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <UserInfoCard />
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
      </HomeDataContext.Provider>
    </ExpandContext.Provider>
  );
}

export default App
