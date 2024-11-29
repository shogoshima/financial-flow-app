import prisma from "@/bin/prisma";
import { Preferences, PreferencesModel, languageType, themeType, currencyType } from "@/models/preferences";

export class PreferencesService {
  static async createPreferences(userId: string, preferencesData: PreferencesModel): Promise<Preferences> {
    const preferences = await prisma.preferences.create({
      data: {
        userId,
        ...preferencesData,
      }
    });

    return this.mapToModel(preferences);
  }

  static async getPreferences(userId: string): Promise<Preferences | null> {
    const preferences = await prisma.preferences.findFirst({
      where: {
        userId
      }
    });

    if (!preferences)
      return null;

    return this.mapToModel(preferences);
  }

  static async updatePreferences(id: string, updatedFields: Partial<Preferences>): Promise<Preferences> {
    const preferences = await prisma.preferences.update({
      where: {
        id
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(preferences);
  }

  static mapToModel({
    currency, language, theme, notifications
  }: {
    currency: string;
    language: string;
    theme: string | null;
    notifications: boolean;
  }): Preferences {
    return new Preferences({
      currency: currencyType[currency as keyof typeof currencyType],
      language: languageType[language as keyof typeof languageType],
      theme: theme ? themeType[theme as keyof typeof themeType] : themeType.LIGHT,
      notifications
    });
  }
}