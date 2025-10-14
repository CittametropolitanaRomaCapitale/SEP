import useStorage from './useStorage';

export type MaintenanceMode = {
    enabled: string
    message?: string | undefined
}

export const useMaintenanceEnv = () => {
  const { getItem, setItem, removeItem } = useStorage();

  const setMaintenanceMode = (manitenceMode: MaintenanceMode) => {
    setItem('enabled', manitenceMode?.enabled);
    setItem('message',manitenceMode?.message);
  };

  const removeMaintenanceMode = () => {
    removeItem('enabled');
    removeItem('message');
  };

  return {
    maintenanceMode:{
        enabled: getItem('enabled'),
        message:getItem('message')
    },
    setMaintenanceMode,
    removeMaintenanceMode
  };
};