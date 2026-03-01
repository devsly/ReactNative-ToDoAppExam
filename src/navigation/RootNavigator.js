
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useAuth } from '../context/AuthContext';

export default function RootNavigator() {
  const { user } = useAuth();

  return user ? <AppTabs /> : <AuthStack />;
}
