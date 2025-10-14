import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

import type { ListProps } from '@mui/material';
import { DashboardSidebarItem } from './dashboard-sidebar-item';
import CanRole from '../CanRole';

interface Item {
  path?: string;
  icon?: ReactNode;
  chip?: ReactNode;
  info?: ReactNode;
  children?: Item[];
  title?: string;
  resourceIds?: string[];
}

interface DashboardSidebarSectionProps extends ListProps {
  items: Item[];
  path: string;
  title?: string;
  resourceIds?: string[];
}

const renderNavItems = ({
  depth = 0,
  items,
  path
}: {
  depth?: number;
  items: Item[];
  path: string;
}): JSX.Element => (
  <List disablePadding>
    {items.reduce(
      (acc, item) =>
        reduceChildRoutes({
          acc,
          item,
          depth,
          path
        }),
      []
    )}
  </List>
);

const reduceChildRoutes = ({
  acc,
  item,
  depth,
  path
}: {
  acc: JSX.Element[];
  depth: number;
  item: Item;
  path: string;
}): Array<JSX.Element> => {
  const key = `${item.title}-${depth}`;
  const partialMatch = path.includes(item.path);
  const exactMatch = path === item.path;

  if (item.children) {
    acc.push(
      <CanRole
        roleIds={item?.resourceIds || []}
        key={`menu_section_item_${key}`}
        resourceIds={item?.resourceIds || []}
      >
        <DashboardSidebarItem
          active={partialMatch}
          chip={item.chip}
          depth={depth}
          icon={item.icon}
          info={item.info}
          key={key}
          open={partialMatch}
          path={item.path}
          title={item.title}
        >
          {renderNavItems({
            depth: depth + 1,
            items: item.children,
            path
          })}
        </DashboardSidebarItem>
      </CanRole>
    );
  } else {
    acc.push(
      <CanRole
        roleIds={item?.resourceIds || []}
        key={`menu_section_item_${key}`}
        resourceIds={item?.resourceIds || []}
      >
        <DashboardSidebarItem
          active={exactMatch}
          chip={item.chip}
          depth={depth}
          icon={item.icon}
          info={item.info}
          key={key}
          path={item.path}
          title={item.title}
        />
      </CanRole>
    );
  }

  return acc;
};

export const DashboardSidebarSection: FC<DashboardSidebarSectionProps> = (
  props
) => {
  const { items, path, title, resourceIds, ...other } = props;

  return (
    <List
      subheader={
        <ListSubheader
          disableGutters
          disableSticky
          sx={{
            color: 'primary.dark',
            fontSize: '0.75rem',
            fontWeight: 700,
            lineHeight: 2.5,
            ml: 4,
            textTransform: 'uppercase'
          }}
        >
          {title}
        </ListSubheader>
      }
      {...other}
    >
      {renderNavItems({
        items,
        path
      })}
    </List>
  );
};

DashboardSidebarSection.propTypes = {
  items: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};
