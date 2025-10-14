import { FC, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import Grid from '@mui/material/Grid';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BusinessIcon from '@mui/icons-material/Business';
import Edit from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import { useGetApiAuthUserByIdHistoryQuery } from '@cmrc/services/src/app/ssoapi/generated';
import { getStartOfMinute } from '@cmrc/ui/utils/date-utils';
import { dictionary } from './dictionary';
import { CronologiaCardContainer } from '../../components/CronologiaCardContainer';
import { EmptyCronologia } from '../../components/CronologiaEmpty';
import { useGetUtente } from './useGetUtente';
import LoadingContainer from '../../components/LoadingContainer';
import { CronologiaInnerCard } from '../../components/CronologiaInnerCard';

const CronologiaUtente: FC = () => {
  const { data: userData } = useGetUtente();

  const {
    data: historyData,
    isLoading,
    isUninitialized
  } = useGetApiAuthUserByIdHistoryQuery({
    id: userData?.id
  });

  const historyMemo = useMemo(() => {
    if (historyData && historyData.length) {
      return Object.values(
        groupBy(
          orderBy(
            historyData?.map((item) => ({
              ...item,
              created_at: getStartOfMinute(item?.created_at)
            })),
            'id',
            'desc'
          ),
          'created_at'
        )
      );
    }
    return [];
  }, [historyData]);

  const getRecord = (item) => {
    let record = null;
    switch (item.record_type) {
      case 'OFFICE':
        if (item.state === 'IN')
          record = (
            <CronologiaInnerCard
              key={`cronologia_item_${item?.id}`}
              record={item.officeName}
              recordLabel={dictionary.get('in')}
              icon={<BusinessIcon />}
            />
          );
        if (item.state === 'OUT')
          record = (
            <CronologiaInnerCard
              key={`cronologia_item_${item?.id}`}
              record={item.officeName}
              recordLabel={dictionary.get('out')}
              icon={<BusinessIcon />}
            />
          );
        break;
      case 'PERM':
        if (item.type === 'DELEGATION')
          record = (
            <CronologiaInnerCard
              key={`cronologia_item_${item?.id}`}
              record={item.sentUserName}
              recordLabel={dictionary.get('delegation')}
              icon={<SwapHorizIcon />}
            />
          );
        break;
      case 'UPDATE_ROW': 
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            record={item.note}
            recordLabel={dictionary.get('note_updated')}
            icon={<Edit />}
          />
        );
        break;
      default:
        record = null;
    }
    return record;
  };
  return (
    <Grid
      container
      direction="column"
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <LoadingContainer isLoading={isLoading || isUninitialized}>
        {historyMemo?.length > 0 ? (
          <List>
            {historyMemo?.map((history: any[]) => 
              history?.find(
                (item) => {
                  return (item?.record_type === 'OFFICE' &&
                    ['IN', 'OUT'].indexOf(item?.state)) ||
                  (item?.record_type === 'PERM' && item?.type === 'DELEGATION') || 
                  (item?.record_type === 'UPDATE_ROW' && item?.permit_id === null && item?.office_id === null && item?.role_id === null)
                }
              ) ? (
                <CronologiaCardContainer
                  key={`cronologia_${history[0]?.id}`}
                  date={history[0].created_at}
                >
                  <List>{history.map((item) => getRecord(item))}</List>
                </CronologiaCardContainer>
              ) : null
            )}
          </List>
        ) : (
          <EmptyCronologia />
        )}
      </LoadingContainer>
    </Grid>
  );
};

export default CronologiaUtente;
