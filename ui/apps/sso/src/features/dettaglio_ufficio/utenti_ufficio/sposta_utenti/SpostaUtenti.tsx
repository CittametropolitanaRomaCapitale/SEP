import { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { ListItemIcon } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useGetApiOfficeByIdQuery } from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { dictionary } from '../../dictionary';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { useSpostaUtentiForm } from './useSpostaUtentiForm';

export const SpostaUtenti: FC<{
  drawer_id: string;
  onSave: (any) => void;
  loading?: boolean;
  selectedUtenti: any[];
}> = ({ drawer_id, onSave, loading, selectedUtenti }) => {
  const [blockedUtenti, setBlockedUtenti] = useState([]);
  const [filteredUtenti, setFilteredUtenti] = useState([]);

  const { query } = useRouter();
  const { closeDrawer } = useDrawer({
    drawer_id
  });
  const { structure } = useSpostaUtentiForm();

  const methods = useForm({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const { data: officeData } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });

  const getBlockedUsers = () => {
    const usersWithDelegations = selectedUtenti.filter(
      (user) => user.delegations.length || user.delegationsSent.length
    );
    const blockedUsersArray = [];

    usersWithDelegations.forEach((userWithDelegation) => {
      if (userWithDelegation.delegations.length) {
        userWithDelegation.delegations.forEach((delegation) => {
          if (delegation.permits.length) {
            const hasPermits = delegation.permits.some(
              (permit) => permit.office_id === officeData?.id
            );

            if (hasPermits) {
              blockedUsersArray.push(userWithDelegation);
            }
          }
        });
      }

      if (userWithDelegation.delegationsSent.length) {
        userWithDelegation.delegationsSent.forEach((delegationSent) => {
          if (delegationSent.permits.length) {
            const hasPermits = delegationSent.permits.some(
              (permit) => permit.office_id === officeData?.id
            );

            if (hasPermits) {
              blockedUsersArray.push(userWithDelegation);
            }
          }
        });
      }
    });

    return blockedUsersArray;
  };

  useEffect(() => {
    const blockedUsers = getBlockedUsers();
    let filteredUsers = selectedUtenti;
    if (blockedUsers) {
      const blockedUsersIds = blockedUsers.map((blockedUser) => blockedUser.id);
      filteredUsers = selectedUtenti.filter(
        (selectedUser) => !blockedUsersIds.includes(selectedUser.id)
      );
    }
    setBlockedUtenti(blockedUsers);
    setFilteredUtenti(filteredUsers);
  }, []);

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid>
          <Alert severity="info" variant="standard" icon={false}>
            I seguenti utenti saranno spostati :
            <List dense>
              {filteredUtenti.map((utente) => (
                <ListItem sx={{ padding: 0 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={utente.username}
                    primaryTypographyProps={{
                      color: '',
                      fontWeight: 'bold',
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        </Grid>
      </Grid>
      {blockedUtenti && (
        <Grid item>
          <Grid>
            <Alert severity="error" variant="standard" icon={false}>
              I seguenti utenti non possono essere spostati :
              <List dense>
                {blockedUtenti.map((utente) => (
                  <ListItem sx={{ padding: 0 }}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={utente.username}
                      primaryTypographyProps={{
                        color: '',
                        fontWeight: 'bold',
                        variant: 'body2'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            onClick={closeDrawer}
            size="small"
            disabled={loading}
            sx={{ height: '30px', mr: 1 }}
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) =>
              onSave({ ...values, filteredUtenti })
            )}
            loading={loading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
