import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-items')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  // Get all order items (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderItemService.getAll();
  }

  // Get single order item by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderItemService.findById(+id);
  }

  // Create order item (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      product_id: number;
      quantity?: number;
      unit_price: number;
    },
  ) {
    return this.orderItemService.createOrderItem(body);
  }

  // Update order item (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.orderItemService.updateOrderItem(+id, body);
  }

  // Delete order item (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderItemService.deleteOrderItem(+id);
  }
}