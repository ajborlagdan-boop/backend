import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DeliveryService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createDelivery(data: {
    order_id: number;
    delivery_address: string;
    delivery_status?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO delivery (order_id, delivery_address, delivery_status) VALUES (?, ?, ?)',
      [
        data.order_id,
        data.delivery_address,
        data.delivery_status || 'Pending',
      ],
    );
    return { delivery_id: result.insertId, ...data };
  }

  async findById(delivery_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT delivery_id, order_id, delivery_address, delivery_status FROM delivery WHERE delivery_id = ?',
      [delivery_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Delivery with ID ${delivery_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT delivery_id, order_id, delivery_address, delivery_status FROM delivery',
    );
    return rows;
  }

  async updateDelivery(
    delivery_id: number,
    partial: {
      order_id?: number;
      delivery_address?: string;
      delivery_status?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.delivery_address !== undefined) {
      fields.push('delivery_address = ?');
      values.push(partial.delivery_address);
    }
    if (partial.delivery_status !== undefined) {
      fields.push('delivery_status = ?');
      values.push(partial.delivery_status);
    }

    if (fields.length === 0) return await this.findById(delivery_id);

    values.push(delivery_id);
    const sql = `UPDATE delivery SET ${fields.join(', ')} WHERE delivery_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(delivery_id);
  }

  async deleteDelivery(delivery_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM delivery WHERE delivery_id = ?',
      [delivery_id],
    );
    return res.affectedRows > 0;
  }
}