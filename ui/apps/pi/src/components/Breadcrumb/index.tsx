import React from 'react';
import { Breadcrumbs, Link, Container } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

interface BreadcrumbItem {
  id: number;
  name: string;
  path: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onItemClick }) => (
  <Container sx={{margin: 0}}>
    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
      {items.map((item, index) => (
        <Link
          underline="none"
            sx={{
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          key={item.id}
          color={index === items.length - 1 ? 'primary.main' : 'inherit'}
          href={item.path}
          onClick={(e) => {
            e.preventDefault();
            if (index < items.length - 1) {
              onItemClick(item);
            }
          }}
        >
          {item.name}
        </Link>
      ))}
    </Breadcrumbs>
  </Container>
);

export default Breadcrumb;
