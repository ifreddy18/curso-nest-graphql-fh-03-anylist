import { Module } from '@nestjs/common'
import { EncryptAdapter } from './adapters'
import { CommonService } from './common.service'

@Module({
	providers: [EncryptAdapter, CommonService],
	exports: [EncryptAdapter, CommonService],
})
export class CommonModule {}
