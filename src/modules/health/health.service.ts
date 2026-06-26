import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class HealthService {
	constructor(private readonly prisma: PrismaService) {}

	checkApp() {
		return {
			status: 'ok',
			service: 'kanbunny-api',
			timestamp: new Date().toISOString(),
		};
	}

	async checkDatabase() {
		await this.prisma.$queryRaw`SELECT 1`;

		return {
			status: 'ok',
			database: 'connected',
			timestamp: new Date().toISOString(),
		};
	}
}
