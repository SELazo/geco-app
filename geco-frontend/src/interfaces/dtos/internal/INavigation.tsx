export interface INavigationService {
  goBack(): void;
  goFoward(): void;
  handleNavigation(route: string): () => void;
  handleNavigationWithState(route: string, state: any): () => void;
  navigateTo(route: string): void;
}
