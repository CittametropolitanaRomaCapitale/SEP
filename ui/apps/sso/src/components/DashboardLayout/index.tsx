import { FCC } from '@cmrc/types/FCC';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import type { Section } from '@cmrc/ui/components/dashboard/dashboard-sidebar';
import { DashboardLayout as Layout } from '@cmrc/ui/components/dashboard/dashboard-layout';
import { DashboardNavbarProps } from '@cmrc/ui/components/dashboard/dashboard-navbar';

const sections: Section[] = [
  {
    title: 'Menu',
    items: [
      {
        title: 'Utenti ',
        path: '/',
        icon: <FormatListBulletedIcon fontSize="small" />
      },
      {
        title: 'Uffici',
        path: '/uffici',
        icon: <DescriptionIcon fontSize="small" />
      }
    ]
  }
];
export const DashboardLayout: FCC<
  Pick<DashboardNavbarProps, 'title' | 'back'>
> = ({ children, title, back }) => (
  <Layout
    title={title}
    sections={sections}
    showOfficeSelector={false}
    appTitle="Single sign on"
    back={back}
  >
    {children}
  </Layout>
);
