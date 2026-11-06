import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customers/customer.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './orders/order.module';
import { OrderItemModule } from './order-item/orderitem.module';
import { PaymentModule } from './payments/payment.module';
import { DeliveryModule } from './delivery/delivery.module';


@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CustomerModule, CategoryModule, ProductModule, OrderModule, OrderItemModule, PaymentModule, DeliveryModule],
})
export class AppModule {}