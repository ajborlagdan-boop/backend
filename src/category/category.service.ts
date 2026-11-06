import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CategoryService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCategory(data: {
    category_name: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO category (category_name) VALUES (?)',
      [data.category_name],
    );
    return { category_id: result.insertId, ...data };
  }

  async findByName(category_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name FROM category WHERE category_name = ?',
      [category_name],
    );
    return rows[0];
  }

  async findById(category_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name FROM category WHERE category_id = ?',
      [category_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name FROM category',
    );
    return rows;
  }

  async updateCategory(
    category_id: number,
    partial: {
      category_name?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_name !== undefined) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }

    if (fields.length === 0) return await this.findById(category_id);

    values.push(category_id);
    const sql = `UPDATE category SET ${fields.join(', ')} WHERE category_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(category_id);
  }

  async deleteCategory(category_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM category WHERE category_id = ?',
      [category_id],
    );
    return res.affectedRows > 0;
  }
}