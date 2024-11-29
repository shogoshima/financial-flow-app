import { PreferencesService } from "@/services"

export enum themeType {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum languageType {
  EN = 'en-US',
  PT = 'pt-br'
}

export enum currencyType {
  USD = 'USD',
  BRL = 'BRL'
}

export interface PreferencesModel {
  theme: themeType | null
  notifications: boolean
  language: languageType
  currency: currencyType
}

export class Preferences {
  public theme: themeType | null;
  public notifications: boolean;
  public language: languageType;
  public currency: currencyType;

  constructor(
    { theme, notifications, language, currency }: PreferencesModel
  ) {
    this.theme = theme ?? themeType.LIGHT;
    this.notifications = notifications;
    this.language = language;
    this.currency = currency;
  }

  async update(userId: string, updatedFields: Partial<PreferencesModel>): Promise<Preferences> {
    const updatedPreferences = await PreferencesService.updatePreferences(userId, updatedFields);
    return updatedPreferences;
  }

  // static
  static async create(userId: string, preferencesData: PreferencesModel): Promise<Preferences> {
    const createdPreferences = await PreferencesService.createPreferences(userId, preferencesData);
    return createdPreferences;
  }

  static async getByUserId(userId: string): Promise<Preferences | null> {
    const preferences = await PreferencesService.getPreferences(userId);
    return preferences;
  }
}