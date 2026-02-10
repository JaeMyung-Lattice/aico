import { IsString, IsUrl, Matches } from 'class-validator';

export class AnalyzeRecipeDto {
  @IsString()
  @IsUrl()
  @Matches(
    /^https?:\/\/(www\.)?(instagram\.com\/reels?\/|tiktok\.com\/|vm\.tiktok\.com\/|youtube\.com\/shorts|youtu\.be\/)/,
    { message: 'Instagram Reels, TikTok, YouTube Shorts URL만 지원합니다.' },
  )
  url!: string;
}
