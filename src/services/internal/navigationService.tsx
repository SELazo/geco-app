import { useNavigate } from 'react-router-dom';
import { INavigationService } from '../../interfaces/dtos/internal/INavigation';

export const NavigationService: INavigationService = {
  goBack: (): void => {
    window.history.back();
  },
  goFoward: (): void => {
    window.history.forward();
  },
  handleNavigation: (route: string): (() => void) => {
    const navigate = useNavigate();
    return () => navigate(route);
  },
  handleNavigationWithState: (route: string, state: any): (() => void) => {
    const navigate = useNavigate();
    return () => navigate(route, { state });
  },
  navigateTo: (route: string): void => {
    const navigate = useNavigate();
    navigate(route);
  },
};
