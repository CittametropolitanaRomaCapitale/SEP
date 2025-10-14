import DescriptionIcon from '@mui/icons-material/Description';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import StyleIcon from '@mui/icons-material/Style';
import WarningIcon  from '@mui/icons-material/Warning';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import SettingsIcon from '@mui/icons-material/Settings';

import type { Section } from '@cmrc/ui/components/dashboard/dashboard-sidebar';
import { DashboardLayout as Layout } from '@cmrc/ui/components/dashboard/dashboard-layout';
import { DashboardNavbarProps } from '@cmrc/ui/components/dashboard/dashboard-navbar';
import { FCC } from '@cmrc/types/FCC';
import { useDashboardLayout } from './useDashboardLayout';

export const DashboardLayout: FCC<
  Pick<DashboardNavbarProps, 'title' | 'back'>
> = ({ children, title, back }) => {
  const { redirectToActivityList } = useDashboardLayout();

  const sections: Section[] = [
    {
      title: 'Scrivania',
      resourceIds: ['pi_user_resource'],
      items: [
        {
          title: 'Protocolli / Circolari',
          path: '/protocolli',
          icon: <DescriptionIcon fontSize="small" />,
          resourceIds: ['pi_user_resource']
        },
        {
          title: 'PEC',
          path: '/pec',
          icon: <MailIcon fontSize="small" />,
          resourceIds: ['pi_user_resource']
        }
      ]
    },
    {
      title: 'Gestione',
      resourceIds: ['pi_user_resource'],
      items: [
        {
          title: 'Anagrafica',
          path: '/anagrafica',
          icon: <PersonIcon fontSize="small" />,
          resourceIds: ['pi_user_resource']
        },
        {
          title: 'Titolario',
          path: '/titolario',
          icon: <FolderIcon fontSize="small" />,
          resourceIds: ['pi_user_resource']
        },
        {
          title: 'Modello automatico',
          path: '/modelli-automatici',
          icon: <StyleIcon fontSize="small" />,
          resourceIds: ['pi_admin_resource', 'PI_archivista']
        },
        {
          title: 'Protocolli di emergenza',
          path: '/emergenza',
          icon: <WarningIcon fontSize="small" />,
          resourceIds: ['pi_admin_resource', 'PI_archivista']
        },
        {
          title: 'Registro giornaliero',
          path: '/registro-giornaliero',
          icon: <CollectionsBookmarkIcon fontSize="small" />,
          resourceIds: ['pi_admin_resource']
        }
      ]
    },
    {
      title: 'Utilità',
      resourceIds: ['pi_admin_resource'],
      items: [
        {
          title: 'Configurazioni',
          path: '/configurazioni',
          icon: <SettingsIcon fontSize="small" />,
          resourceIds: ['pi_admin_resource']
        }
      ]
    }
  ];

  return (
    <Layout
      hideSideBar
      showShortDescription
      title={title}
      back={back}
      sections={sections}
      showOfficeSelector
      appTitle="PROTOCOLLO INFORMATICO"
      onOfficeSelected={redirectToActivityList}
      hideAllOfficesOption
    >
      {children}
    </Layout>
  );
};
