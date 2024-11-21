import prisma from "@/bin/prisma";
import { Preferences, PreferencesBase, languageType, themeType, currencyType } from "@/models/preferences";

export class PreferencesService {
  static async createPreferences(preferencesData: PreferencesBase): Promise<Preferences> {
    const preferences = await prisma.preferences.create({
      data: {
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
    id, userId, currency, language, theme, notifications
  }: {
    id: string;
    userId: string;
    currency: string;
    language: string;
    theme: string | null;
    notifications: boolean;
  }): Preferences {
    return new Preferences({
      id,
      userId,
      currency: currencyType[currency as keyof typeof currencyType],
      language: languageType[language as keyof typeof languageType],
      theme: theme ? themeType[theme as keyof typeof themeType] : themeType.LIGHT,
      notifications
    });
  }
}