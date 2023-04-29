import { useNavigate } from 'react-router-dom';

interface INavigationService {
  goBack(): void;
  goFoward(): void;
  navigate(route: string): () => void;
}

const navigate = useNavigate();

export const NavigationService: INavigationService = {
  goBack: (): void => {
    window.history.back();
  },
  goFoward: (): void => {
    window.history.forward();
  },
  navigate: (route: string): (() => void) => {
    return () => navigate(route);
  },
};
