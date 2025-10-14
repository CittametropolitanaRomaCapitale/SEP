import { FCC } from '@cmrc/types/FCC';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useAnagrafica } from './useAnagrafica';

const TabsLayout: FCC<{
  children?: React.ReactNode;
  currentTab?: string;
}> = ({ children, currentTab }) => {
  const { changeTab, tabs } = useAnagrafica();

  return (
    <>
      <Tabs
        indicatorColor="primary"
        onChange={changeTab}
        scrollButtons="auto"
        sx={{ px: 3 }}
        textColor="primary"
        value={currentTab}
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
        <Box sx={{ padding: 3 }}>{children}</Box>
      </Card>
    </>
  );
};

export default TabsLayout;
