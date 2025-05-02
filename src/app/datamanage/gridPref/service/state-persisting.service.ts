import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { GridSettings } from '../grid-settings.interface';
import { isPlatformBrowser } from '@angular/common'; //with Angu Universal,Ang runs code on server first to render the initial HTML which throws errors when using localStorage directly.

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export interface SavedPreference {
  id: string;
  name: string;
  gridConfig: GridSettings; //GridSettings is an interface that defines state,gridData,colConfig.
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StatePersistingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

  }
  //The key used to store grid preferences in local storage
  private readonly PREFERENCES_KEY = 'gridPreferences';
  public savePreference(name: string, gridConfig: GridSettings): void {
    if (isPlatformBrowser(this.platformId)) //returns true only in the browser, so code won't break during server-side rendering
      { 
      const preferences = this.getAllPreferences();
      const newPreference: SavedPreference = {
        id: crypto.randomUUID(), // Generate a uuid => 5 groups of hexadecimal digits
        name,
        gridConfig,
        timestamp: new Date()
      };
      preferences.push(newPreference);
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences, getCircularReplacer()));
    }
  }

  public getAllPreferences(): SavedPreference[] {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.PREFERENCES_KEY);
      return saved ? JSON.parse(saved) : []; //If saved is truthy (i.e., not null):Parse the saved JSON else return an empty array.
    }
    return [];
  }

  public getPreferenceById(id: string): GridSettings | null {
    const preferences = this.getAllPreferences();
    const preference = preferences.find(p => p.id === id);
    return preference ? preference.gridConfig : null;
  }

  public deletePreference(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const preferences = this.getAllPreferences().filter(p => p.id !== id);
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences, getCircularReplacer()));
    }
  }


  // ---- Give the specific config to the grid ----
  public get<T>(token: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const settings = localStorage.getItem(token);
      return settings ? JSON.parse(settings) as T : null;
    }
    return null;
  }

  // public set<T>(token: string, gridConfig: GridSettings): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem(
  //       token,
  //       JSON.stringify(gridConfig, getCircularReplacer())
  //     );
  //   }
  // }

  // public hasState(token: string): boolean {
  //   if (isPlatformBrowser(this.platformId)) {
  //     return localStorage.getItem(token) !== null;
  //   }
  //   return false;
  // }
}