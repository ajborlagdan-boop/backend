import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CustomerService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO customer (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [
        data.first_name,
        data.last_name,
        data.email,
        data.phone || null,
        data.address || null,
      ],
    );
    return { customer_id: result.insertId, ...data };
  }

  async findByEmail(email: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone, address FROM customer WHERE email = ?',
      [email],
    );
    return rows[0];
  }

  async findById(customer_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone, address FROM customer WHERE customer_id = ?',
      [customer_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone, address FROM customer',
    );
    return rows;
  }

  async updateCustomer(
    customer_id: number,
    partial: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(partial.first_name);
    }
    if (partial.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(partial.last_name);
    }
    if (partial.email !== undefined) {
      fields.push('email = ?');
      values.push(partial.email);
    }
    if (partial.phone !== undefined) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }
    if (partial.address !== undefined) {
      fields.push('address = ?');
      values.push(partial.address);
    }

    if (fields.length === 0) return await this.findById(customer_id);

    values.push(customer_id);
    const sql = `UPDATE customer SET ${fields.join(', ')} WHERE customer_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(customer_id);
  }

  async deleteCustomer(customer_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM customer WHERE customer_id = ?',
      [customer_id],
    );
    return res.affectedRows > 0;
  }
}