import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Get all products (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  // Get single product by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productService.findById(+id);
  }

  // Create product (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      category_id: number;
      product_name: string;
      description?: string;
      price: number;
      stock_quantity?: number;
    },
  ) {
    return this.productService.createProduct(body);
  }

  // Update product (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productService.updateProduct(+id, body);
  }

  // Delete product (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.deleteProduct(+id);
  }
}