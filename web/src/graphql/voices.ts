export enum VoiceItalian {
  Bianca = "Bianca",
  Adriano = "Adriano",
}
export enum VoicePortuguese {
  Vitoria = "Vitoria",
  Thiago = "Thiago",
}
export enum VoiceFrench {
  Lea = "Lea",
  Remi = "Remi",
}
// export type VoiceEnglish = 'Joanna'|'Kendra'|'Kimberly'|'Salli'|'Joey'|'Matthew'|'Ruth'|'Stephen';
export enum VoiceEnglish {
  Ruth = "Ruth",
  Stephen = "Stephen",
}
export const Voices = { ...VoiceItalian, ...VoicePortuguese, ...VoiceFrench, ...VoiceEnglish };
type TVoicesKeys = keyof typeof Voices;
export type TVoices = (typeof Voices)[TVoicesKeys];
