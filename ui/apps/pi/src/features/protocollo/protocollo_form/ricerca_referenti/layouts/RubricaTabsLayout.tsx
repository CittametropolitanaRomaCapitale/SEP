import { FCC } from '@cmrc/types/FCC';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useReferentiTabs } from '../hooks/useReferentiTabs';

const RubricaTabsLayout: FCC<{
  children?: React.ReactNode;
  currentTab?: string;
  onChangeTab?: any;
  metodoSpedizione: string
  isMittente?: boolean
}> = ({ children, currentTab, onChangeTab, metodoSpedizione, isMittente }) => {
  const [activeTab, setActiveTab] = useState(currentTab)
  const { tabs } = useReferentiTabs(metodoSpedizione, isMittente)

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleChangeTab = (e, value) => {
    onChangeTab(value)
  }

  return (
    <>
      <Tabs
        indicatorColor="primary"
        onChange={handleChangeTab}
        scrollButtons="auto"
        sx={{ px: 3 }}
        textColor="primary"
        value={activeTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            sx={{ minHeight: '48px' }}
          />
        ))}
      </Tabs>
      <Divider />
      <Card sx={{ padding: 0 }}>
        <Box sx={{ padding: 3 }}>
          {children}
        </Box>
      </Card>
    </>
  );
};

export default RubricaTabsLayout;


