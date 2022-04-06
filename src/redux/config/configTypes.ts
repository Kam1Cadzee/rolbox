export interface IConfigActions {
  setData: (o: Partial<IConfigState>) => any;
}

export interface IConfigState {
  enabledLoadTranslations: boolean | null;

  enabledSharing: boolean;
  enabledDeeplink: boolean;
  enabledOptionalCheckVersion: boolean;
  enabledRequiredCheckVersion: boolean;
  optionalVersionAndroid: number;
  requiredVersionAndroid: number;
  optionalVersionIOS: string;
  requiredVersionIOS: string;
  fallbackUrlIOS: string;
  fallbackUrlAndroid: string;
}

export type ItemConfigState = keyof IConfigState;
