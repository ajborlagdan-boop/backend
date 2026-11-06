import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  // Get all customers (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.customerService.getAll();
  }

  // Get single customer by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.customerService.findById(+id);
  }

  // Create customer (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.customerService.createCustomer(body);
  }

  // Update customer (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.customerService.updateCustomer(+id, body);
  }

  // Delete customer (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(+id);
  }
}