import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrderService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(data: {
    customer_id: number;
    status?: string;
    total_amount?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (customer_id, status, total_amount) VALUES (?, ?, ?)',
      [
        data.customer_id,
        data.status || 'Pending',
        data.total_amount ?? 0.00,
      ],
    );
    return { order_id: result.insertId, ...data };
  }

  async findById(order_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, status, total_amount FROM orders WHERE order_id = ?',
      [order_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, status, total_amount FROM orders',
    );
    return rows;
  }

  async updateOrder(
    order_id: number,
    partial: {
      customer_id?: number;
      status?: string;
      total_amount?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.customer_id !== undefined) {
      fields.push('customer_id = ?');
      values.push(partial.customer_id);
    }
    if (partial.status !== undefined) {
      fields.push('status = ?');
      values.push(partial.status);
    }
    if (partial.total_amount !== undefined) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }

    if (fields.length === 0) return await this.findById(order_id);

    values.push(order_id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(order_id);
  }

  async deleteOrder(order_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [order_id],
    );
    return res.affectedRows > 0;
  }
}