import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(data: {
    order_id: number;
    payment_method: string;
    payment_status?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payment (order_id, payment_method, payment_status) VALUES (?, ?, ?)',
      [
        data.order_id,
        data.payment_method,
        data.payment_status || 'Pending',
      ],
    );
    return { payment_id: result.insertId, ...data };
  }

  async findById(payment_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, payment_method, payment_status FROM payment WHERE payment_id = ?',
      [payment_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, payment_method, payment_status FROM payment',
    );
    return rows;
  }

  async updatePayment(
    payment_id: number,
    partial: {
      order_id?: number;
      payment_method?: string;
      payment_status?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.payment_method !== undefined) {
      fields.push('payment_method = ?');
      values.push(partial.payment_method);
    }
    if (partial.payment_status !== undefined) {
      fields.push('payment_status = ?');
      values.push(partial.payment_status);
    }

    if (fields.length === 0) return await this.findById(payment_id);

    values.push(payment_id);
    const sql = `UPDATE payment SET ${fields.join(', ')} WHERE payment_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(payment_id);
  }

  async deletePayment(payment_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM payment WHERE payment_id = ?',
      [payment_id],
    );
    return res.affectedRows > 0;
  }
}