import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import YTDlpWrap from 'yt-dlp-wrap';

@Injectable()
export class VideoService implements OnModuleInit {
  private readonly logger = new Logger(VideoService.name);
  private ytDlp: YTDlpWrap | null = null;
  private readonly tmpDir = join(process.cwd(), 'tmp');
  private readonly ytDlpPath = join(process.cwd(), 'yt-dlp');

  // 앱 시작 시 yt-dlp 바이너리 확인 및 다운로드
  onModuleInit = async () => {
    // tmp 디렉토리 생성
    if (!existsSync(this.tmpDir)) {
      mkdirSync(this.tmpDir, { recursive: true });
    }

    // 로컬 바이너리가 있으면 사용
    if (existsSync(this.ytDlpPath)) {
      this.logger.log(`로컬 yt-dlp 바이너리 사용: ${this.ytDlpPath}`);
      this.ytDlp = new YTDlpWrap(this.ytDlpPath);
      return;
    }

    // 시스템 yt-dlp 확인
    try {
      const systemYtDlp = new YTDlpWrap('yt-dlp');
      await systemYtDlp.execPromise(['--version']);
      this.logger.log('시스템 yt-dlp 사용');
      this.ytDlp = systemYtDlp;
      return;
    } catch {
      this.logger.log('시스템 yt-dlp 미발견, GitHub에서 다운로드 시작...');
    }

    // GitHub에서 yt-dlp 바이너리 다운로드
    try {
      await YTDlpWrap.downloadFromGithub(this.ytDlpPath);
      this.logger.log(`yt-dlp 다운로드 완료: ${this.ytDlpPath}`);
      this.ytDlp = new YTDlpWrap(this.ytDlpPath);
    } catch (error) {
      this.logger.error('yt-dlp 다운로드 실패', error);
      throw new Error('yt-dlp 바이너리를 설치할 수 없습니다.');
    }
  };

  // 영상 다운로드 → 로컬 파일 경로 반환
  download = async (videoUrl: string): Promise<string> => {
    if (!this.ytDlp) {
      throw new Error('yt-dlp가 초기화되지 않았습니다.');
    }

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
