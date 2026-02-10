import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import YTDlpWrap from 'yt-dlp-wrap';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly ytDlp: YTDlpWrap;
  private readonly tmpDir = join(process.cwd(), 'tmp');

  constructor() {
    // 시스템에 설치된 yt-dlp 사용 (brew install yt-dlp)
    this.ytDlp = new YTDlpWrap('yt-dlp');
  }

  // 영상 다운로드 → 로컬 파일 경로 반환
  download = async (videoUrl: string): Promise<string> => {
    const filename = `${randomUUID()}.mp4`;
    const outputPath = join(this.tmpDir, filename);

    this.logger.log(`영상 다운로드 시작: ${videoUrl}`);

    try {
      await this.ytDlp.execPromise([
        videoUrl,
        '-f', 'worst[ext=mp4]', // 최소 품질 (분석에는 충분)
        '-o', outputPath,
        '--no-playlist',
        '--max-filesize', '50m',
      ]);

      this.logger.log(`영상 다운로드 완료: ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error(`영상 다운로드 실패: ${videoUrl}`, error);
      throw new Error('영상을 다운로드할 수 없습니다. URL을 확인해주세요.');
    }
  };

  // 임시 파일 삭제
  cleanup = (filePath: string): void => {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        this.logger.log(`임시 파일 삭제: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(`임시 파일 삭제 실패: ${filePath}`, error);
    }
  };
}
