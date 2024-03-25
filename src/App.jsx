import { useState, createContext } from 'react';
import WorldMap from "./components/WorldMap";
import DashboardContaienr from "./components/DashboardContainer";
import UserInfoCard from "./components/UserInfoCard";
import { Card } from "@mui/material";

export const ExpandContext = createContext();

function App() {
  const [isExpanded, setExpand] = useState(true);
  return (
    <ExpandContext.Provider value={{ isExpanded, setExpand }}>
      <WorldMap />
      <DashboardContaienr>
        <Card>
          <UserInfoCard
            userInfo={{
              name: "BrownTheRunner",
              motto: "Better to run than curse the road.",
              avatar: "/avatar.jpg",
            }}
          />
        </Card>
      </DashboardContaienr>
    </ExpandContext.Provider>
  );
}

export default App
