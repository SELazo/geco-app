export interface INavigationService {
    goBack(): void;
    goFoward(): void;
    handleNavigation(route: string): () => void;
    navigateTo(route: string): void;
}