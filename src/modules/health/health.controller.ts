import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	checkApp() {
		return this.healthService.checkApp();
	}

	@Get('db')
	checkDatabase() {
		return this.healthService.checkDatabase();
	}
}
