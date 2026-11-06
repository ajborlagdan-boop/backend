import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deliveries')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  // Get all deliveries (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.deliveryService.getAll();
  }

  // Get single delivery by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.deliveryService.findById(+id);
  }

  // Create delivery (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      delivery_address: string;
      delivery_status?: string;
    },
  ) {
    return this.deliveryService.createDelivery(body);
  }

  // Update delivery (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.deliveryService.updateDelivery(+id, body);
  }

  // Delete delivery (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deliveryService.deleteDelivery(+id);
  }
}