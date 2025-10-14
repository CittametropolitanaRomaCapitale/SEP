import { SyntheticEvent, useState } from 'react';
import type { AccordionProps } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUITypography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { FCC } from '@cmrc/types/FCC';

export type MUIAccordionProps = {
  name: string;
  title: JSX.Element | string;
} & AccordionProps;

const MUIAccordion: FCC<MUIAccordionProps> = ({
  name,
  title,
  children,
  expanded,
  ...props
}) => {
  const [expand, setExpand] = useState(expanded ? name : '');

  const onChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpand(newExpanded ? panel : '');
    };

  return (
    <Accordion {...props} expanded={expand === name} onChange={onChange(name)}>
      <MUIAccordionSummary
        expandIcon={expand ? <HorizontalRuleIcon /> : <AddIcon />}
      >
        <MUITypography>{title}</MUITypography>
      </MUIAccordionSummary>
      <MUIAccordionDetails>
        <MUITypography>{children}</MUITypography>
      </MUIAccordionDetails>
    </Accordion>
  );
};

export default MUIAccordion;
