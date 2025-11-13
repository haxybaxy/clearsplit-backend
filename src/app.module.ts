import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TeamModule } from './modules/team/team.module';
import { ReportModule } from './modules/report/report.module';
import { PropertyModule } from './modules/property/property.module';
import { InvoiceFormModule } from './modules/invoice-form/invoice-form.module';
import { DataImportModule } from './modules/data-import/data-import.module';
import { ContactModule } from './modules/contact/contact.module';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

@Module({
  imports: [
    TransactionModule,
    TeamModule,
    ReportModule,
    PropertyModule,
    InvoiceFormModule,
    DataImportModule,
    ContactModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            `Config validation error: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
          );
        }
        return result.data;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
