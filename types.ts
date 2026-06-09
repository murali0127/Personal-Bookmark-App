/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Bookmark {
      id: string;
      title: string;
      description: string;
      category: string;
      url: string;
      author?: string;
      publishedAge?: string;
      isFeatured?: boolean;
      coverImage?: string;
      avatarText?: string;
      isSaved?: boolean;
      visibility: string
}

export type ActiveScreen = 'landing' | 'feed' | 'library' | 'profile';

export interface UserProfile {
      name: string;
      role: string;
      bookmarksCount: number;
      followersCount: number;
      avatarUrl: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AppState {
      currentScreen: ActiveScreen;
      user: UserProfile | null;
      theme: ThemeMode;
      accentColor: string;
}
