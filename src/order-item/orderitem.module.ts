import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrderItemService } from './orderitem.service';
import { OrderItemController } from './orderitem.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}