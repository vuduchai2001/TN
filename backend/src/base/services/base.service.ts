import { Injectable, LoggerService } from '@nestjs/common';
import { CNotFoundException } from 'src/common/exception/404.exception';
import { ErrorCode } from 'src/constant/error';
import { Repository } from 'typeorm';
import { FindReq } from '../dto/find.dto';
import { FindRes } from '../response/find.res';
import { CBadRequestException } from 'src/common/exception/400.exception';
import { SuccessResponse } from 'src/common/response/success.res';

@Injectable()
export abstract class BaseCrudService<T> {
  constructor(public repository: Repository<T>) {}

  async findAll(payload: FindReq): Promise<FindRes<T>> {
    let { page, size } = payload;
    if (!page) page = 1;
    if (!size) size = 100;

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data,
      page: +page,
      size: +data?.length,
      total: total,
    };
  }

  async findById(id?: number): Promise<T> {
    const res = await this.repository.findOne({ where: { id } });
    if (!res) {
      throw new CNotFoundException(
        `${ErrorCode.NOT_FOUND}_${this.repository.metadata.tableName.toLocaleUpperCase()}`,
      );
    }
    return res;
  }

  async create(payload?: any): Promise<T> {
    try {
      return await this.repository.save(payload);
    } catch {
      throw new CBadRequestException(ErrorCode.SAVE_FAILED);
    }
  }

  async update(id?: number, payload?: any): Promise<T> {
    const res = await this.repository.findOne({ where: { id } });
    if (!res) {
      throw new CNotFoundException(ErrorCode.NOT_FOUND_ID);
    }
    try {
      return await this.repository.save({ id, ...payload });
    } catch {
      throw new CBadRequestException(ErrorCode.UPDATE_FAILED);
    }
  }

  async delete(id?: number): Promise<SuccessResponse> {
    const res = await this.repository.findOne({ where: { id } });
    if (!res) {
      throw new CNotFoundException(ErrorCode.NOT_FOUND_ID);
    }
    try {
      const res = await this.repository.delete(id);
      if (res.affected) {
        return { success: true };
      }
    } catch {
      throw new CBadRequestException(ErrorCode.DELETE_FAILED);
    }
  }
}
