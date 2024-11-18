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
    this.notifications = notifications;
    this.theme = theme ?? themeType.LIGHT;
    this.language = language;
    this.currency = currency;
  }

  
}