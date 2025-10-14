import { useContext } from 'react';
import { AuthContext } from '@cmrc/auth/jwt-context';

export const useAuth = () => useContext(AuthContext);
