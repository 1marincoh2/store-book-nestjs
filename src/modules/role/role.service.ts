import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _RoleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const role: Role = await this._RoleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new BadRequestException('role not exist');
    }
    return role;
  }

  async getAll(): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /*const roles: Role[] = await this._RoleRepository.find({
      where: { status: 'ACTIVE' },
    });*/
    const roles: Role[] = await this._RoleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .getMany();

    return roles;
    /* return this._MapperService.mapCollection<Role, Role>(
      roles,
      new Role(),
    );*/
  }

  async create(role: Role): Promise<Role> {
    const SaveRole = await this._RoleRepository.save(role);
    return SaveRole;
  }

  async update(id: number, role: Role): Promise<void> {
    await this._RoleRepository.update(id, role);
  }

  async delite(id: number): Promise<void> {
    const RoleExists = this._RoleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!RoleExists) {
      throw new BadRequestException();
    }

    await this._RoleRepository.update(id, { status: 'INACTIVE' });
  }
}
