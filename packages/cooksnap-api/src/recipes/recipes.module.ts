import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { GeminiModule } from '../gemini/gemini.module';
import { KamisModule } from '../kamis/kamis.module';
import { CoupangModule } from '../coupang/coupang.module';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [GeminiModule, KamisModule, CoupangModule, VideoModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
