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

export interface PreferencesBase {
  userId: string
  theme: themeType | null
  notifications: boolean
  language: languageType
  currency: currencyType
}

export interface PreferencesModel extends PreferencesBase {
  id: string
}

export class Preferences {
  public userId: string;
  public theme: themeType | null;
  public notifications: boolean;
  public language: languageType;
  public currency: currencyType;

  constructor(
    { userId, theme, notifications, language, currency }: PreferencesModel
  ) {
    this.userId = userId;
    this.theme = theme ?? themeType.LIGHT;
    this.notifications = notifications;
    this.language = language;
    this.currency = currency;
  }

  async update(updatedFields: Partial<PreferencesModel>): Promise<Preferences> {
    const updatedPreferences = await PreferencesService.updatePreferences(this.userId, updatedFields);
    return updatedPreferences;
  }

  // static
  static async create(preferencesData: PreferencesBase): Promise<Preferences> {
    const createdPreferences = await PreferencesService.createPreferences(preferencesData);
    return createdPreferences;
  }

  static async getByUserId(userId: string): Promise<Preferences | null> {
    const preferences = await PreferencesService.getPreferences(userId);
    return preferences;
  }
}