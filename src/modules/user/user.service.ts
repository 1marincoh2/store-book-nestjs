import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MapperService } from 'src/shared/mapper.service';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDto } from './dto/user.dto';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _UserRepository: UserRepository,
    private readonly _MapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user: User = await this._UserRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new BadRequestException('user not exist');
    }
    return this._MapperService.map<User, UserDto>(user, new UserDto());
  }
  async getAll(): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /*const users: User[] = await this._UserRepository.find({
      where: { status: 'ACTIVE' },
    });*/
    const users: User[] = await this._UserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany();

    return users;
    /* return this._MapperService.mapCollection<User, UserDto>(
      users,
      new UserDto(),
    );*/
  }

  async create(user: User): Promise<UserDto> {
    const details = new UserDetails();
    user.details = details;
    const repo = getConnection().getRepository(Role);
    const defaultRol = await repo.findOne({
      where: { name: 'GENERAL' },
    });
    user.roles = [defaultRol];
    const SaveUser = await this._UserRepository.save(user);
    return this._MapperService.map<User, UserDto>(SaveUser, new UserDto());
  }

  async update(id: number, user: User): Promise<void> {
    await this._UserRepository.update(id, user);
  }

  async delite(id: number): Promise<void> {
    const UserExists = this._UserRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!UserExists) {
      throw new BadRequestException();
    }

    await this._UserRepository.update(id, { status: 'INACTIVE' });
  }
}
