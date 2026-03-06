import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  
  // Signal to track current theme
  public theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect to apply theme changes
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    
    // Remove existing theme classes
    htmlElement.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    htmlElement.classList.add(`${theme}-theme`);
    
    // Save to localStorage
    localStorage.setItem(this.THEME_KEY, theme);
    
    // Update PrimeNG theme
    this.updatePrimeNGTheme(theme);
  }

  /**
   * Update PrimeNG theme dynamically
   */
  private updatePrimeNGTheme(theme: Theme): void {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    
    if (themeLink) {
      // PrimeNG Aura theme has light and dark variants
      const newTheme = theme === 'dark'
        ? 'aura-dark-blue'
        : 'aura-light-blue';
      
      themeLink.href = `https://unpkg.com/primeng@latest/resources/themes/${newTheme}/theme.css`;
    }
  }

  /**
   * Toggle between light and dark theme
   */
  public toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  /**
   * Set specific theme
   */
  public setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): Theme {
    return this.theme();
  }

  /**
   * Check if dark mode is active
   */
  public isDarkMode(): boolean {
    return this.theme() === 'dark';
  }
}

