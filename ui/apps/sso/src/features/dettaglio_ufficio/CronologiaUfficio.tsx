import { FC, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import List from '@mui/material/List';
import {
  useGetApiOfficeByIdHistoryQuery,
  useGetApiOfficeByIdQuery
} from '@cmrc/services/src/app/ssoapi/generated';
import { useRouter } from 'next/router';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import WorkIcon from '@mui/icons-material/Work';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getStartOfMinute } from '@cmrc/ui/utils/date-utils';
import { dictionary } from './dictionary';
import { CronologiaCardContainer } from '../../components/CronologiaCardContainer';
import { EmptyCronologia } from '../../components/CronologiaEmpty';
import LoadingContainer from '../../components/LoadingContainer';
import { CronologiaInnerCard } from '../../components/CronologiaInnerCard';

const CronologiaUfficio: FC = () => {
  const { query } = useRouter();
  const { data: officeData } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });

  const {
    data: historyData,
    isLoading,
    isUninitialized
  } = useGetApiOfficeByIdHistoryQuery({
    id: officeData?.id
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
      // commentato in attesa di conferma
      // (utenti associati e eliminati da ufficio)
      case 'OFFICE':
        if (item.state === 'IN')
          record = (
            <CronologiaInnerCard
              key={`cronologia_item_${item?.id}`}
              value={item.userName}
              record={item.officeName}
              recordLabel={dictionary.get('in')}
              icon={<PersonAddIcon />}
            />
          );
        if (item.state === 'OUT')
          record = (
            <CronologiaInnerCard
              key={`cronologia_item_${item?.id}`}
              value={item.userName}
              record={item.officeName}
              recordLabel={dictionary.get('out')}
              icon={<PersonRemoveIcon />}
            />
          );
        break;
      case 'CREATE_OFFICE':
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            value={item.officeName}
            recordLabel={dictionary.get('createOffice')}
            icon={<WorkIcon />}
          />
        );
        break;
      case 'DELETE_OFFICE':
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            value={item.officeName}
            recordLabel={dictionary.get('deletedOffice')}
            icon={<WorkOffIcon />}
          />
        );
        break;
      case 'REOPEN_OFFICE':
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            value={item.officeName}
            recordLabel={dictionary.get('reopenedOffice')}
            icon={<WorkIcon />}
          />
        );
        break;
      case 'INHERIT':
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            value={item.officeName}
            recordLabel={dictionary.get('belongingOffice', {
              name: item?.oldOfficeName || ''
            })}
            icon={<CompareArrowsIcon />}
          />
        );
        break;
      default:
        record = (
          <CronologiaInnerCard
            key={`cronologia_item_${item?.id}`}
            value={item.userName}
            record={item.officeName}
            recordLabel=""
            icon={<BusinessIcon />}
          />
        );
        break;
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
            {historyMemo?.map((history: any[]) => (
              <CronologiaCardContainer
                key={`cronologia_${history[0]?.id}`}
                date={history[0].created_at}
              >
                <List>{history.map((item) => getRecord(item))}</List>
              </CronologiaCardContainer>
            ))}
          </List>
        ) : (
          <EmptyCronologia />
        )}
      </LoadingContainer>
    </Grid>
  );
};

export default CronologiaUfficio;
