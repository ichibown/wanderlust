import { useState, createContext, useEffect } from 'react';
import WorldMap from "./components/WorldMap";
import DashboardContaienr from "./components/DashboardContainer";
import UserInfoCard from "./components/UserInfoCard";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { getConfigData, getHomeData } from './utils/requests';
import DataCards from './components/DataCards';
import { Box } from '@mui/material';

export const ExpandContext = createContext();
export const HomeDataContext = createContext();

function App() {
  const [isExpanded, setExpand] = useState(false);
  const [configData, setConfigData] = useState({});
  const [homeData, setHomeData] = useState({});
  const handleIconClick = () => {
    setExpand(!isExpanded);
  }
  const refreshConfigData = () => {
    getConfigData((data) => { setConfigData(data); });
  }
  useEffect(() => {
    refreshConfigData();
    getHomeData((data) => { setHomeData(data); });
  }, []);
  return (
    <ExpandContext.Provider value={{ isExpanded, setExpand }}>
      <HomeDataContext.Provider value={{ configData, refreshConfigData, homeData }}>
        <WorldMap />
        <DashboardContaienr>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'normal',
            }}>
            <UserInfoCard />
            <DataCards />
            <ExpandMoreRoundedIcon
              sx={{
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
