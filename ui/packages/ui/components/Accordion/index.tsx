import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import UnfoldLess from '@mui/icons-material/UnfoldLess';
import { FCC } from '@cmrc/types/FCC';

export type AccordionProps = {
  title?: string;
  expanded?: boolean;
  rightElement?: JSX.Element;
  ref?: ForwardedRef<unknown>;
  onChangeExpand?: (expanded?: boolean) => void;
};

const Accordion: FCC<AccordionProps> = forwardRef(
  ({ title, expanded, rightElement, onChangeExpand, children }, ref) => {
    const [expand, setExpand] = useState(
      expanded !== undefined ? expanded : false
    );

    useImperativeHandle(ref, () => ({
      expandAccordion() {
        setExpand(true);
      },
      collapseAccordion() {
        setExpand(false);
      }
    }));

    const onExpand = (expand: boolean) => {
      setExpand(expand);
      onChangeExpand?.(expand);
    };

    return (
      <>
        <Grid
          sx={({ palette }) => ({
            mt: 3,
            mb: 1,
            background: expand
              ? palette.primary.main
              : palette.background.default,
            borderRadius: '5px',
            padding: '5px',
            border: `1px solid ${palette.divider}`,
            minHeight: '48px'
          })}
          container
          justifyContent="space-between"
        >
          <Stack
            alignItems={'center'}
            sx={{
              cursor: 'pointer',
              lineHeight: '36px',
              position: 'relative'
            }}
            width="100%"
            spacing="2"
            direction={'row'}
          >
            <Stack
              onClick={() => onExpand(!expand)}
              sx={{ flex: 1 }}
              direction="row"
              alignItems={'center'}
            >
              {expand ? (
                <UnfoldLess color="disabled" />
              ) : (
                <UnfoldMore color="disabled" />
              )}
              <Typography
                sx={{ marginLeft: 2 }}
                fontSize={'1rem'}
                fontWeight="600"
                color={expand ? 'white' : 'primary.main'}
              >
                {title}
              </Typography>
            </Stack>
            {rightElement && <Grid item>{rightElement}</Grid>}
          </Stack>
        </Grid>
        <Box style={{ height: expand ? 'auto' : '0', overflow: 'hidden' }}>
          {children}
        </Box>
      </>
    );
  }
);

export default Accordion;
