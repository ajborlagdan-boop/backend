import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createProduct(data: {
    category_id: number;
    product_name: string;
    description?: string;
    price: number;
    stock_quantity?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO product (category_id, product_name, description, price, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      [
        data.category_id,
        data.product_name,
        data.description || null,
        data.price,
        data.stock_quantity ?? 0,
      ],
    );
    return { product_id: result.insertId, ...data };
  }

  async findByName(product_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, stock_quantity FROM product WHERE product_name = ?',
      [product_name],
    );
    return rows[0];
  }

  async findById(product_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, stock_quantity FROM product WHERE product_id = ?',
      [product_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, stock_quantity FROM product',
    );
    return rows;
  }

  async updateProduct(
    product_id: number,
    partial: {
      category_id?: number;
      product_name?: string;
      description?: string;
      price?: number;
      stock_quantity?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }
    if (partial.product_name !== undefined) {
      fields.push('product_name = ?');
      values.push(partial.product_name);
    }
    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }
    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }
    if (partial.stock_quantity !== undefined) {
      fields.push('stock_quantity = ?');
      values.push(partial.stock_quantity);
    }

    if (fields.length === 0) return await this.findById(product_id);

    values.push(product_id);
    const sql = `UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(product_id);
  }

  async deleteProduct(product_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM product WHERE product_id = ?',
      [product_id],
    );
    return res.affectedRows > 0;
  }
}