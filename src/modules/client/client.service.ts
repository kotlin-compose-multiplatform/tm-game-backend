import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import ClientEntity, { ClientType2 } from './entity/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SignUpDto from './dto/sign-up.dto';
import AppJwtService from '../jwt/jwt.service';
import SignInDto from './dto/sign-in.dto';
import { PayloadType } from '../jwt/jwt.payload';
import { Key } from '../key/entities/key.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepo: Repository<ClientEntity>,
    @InjectRepository(Key)
    private readonly keyRepo: Repository<Key>,
    private readonly jwt: AppJwtService,
  ) {}

  async signUp(body: SignUpDto): Promise<any> {
    try {
      console.log(body);
      const redirect = 'sign-in';
      const client = await this.clientRepo.findOneBy({
        username: body.username,
      });
      const client2 = await this.clientRepo.findOneBy({
        phone: body.phone,
      });
      if (client) {
        console.error('Username already exist');
        throw new BadRequestException('Username already exist!');
      } else if (client2) {
        console.error('Phone');
        throw new BadRequestException('Phone number already exist');
      } else {
        const newClient = new ClientEntity();
        newClient.email = body.email;
        newClient.fullname = body.fullname;
        newClient.password = body.password;
        newClient.phone = body.phone;
        newClient.stream_id = body.stream_id;
        newClient.username = body.username;
        const inserted = await this.clientRepo.save(newClient);
        return {
          ...inserted,
          redirect: redirect,
        };
      }
    } catch (err) {
      console.error(err.toString());
      throw new BadRequestException(err);
    }
  }

  async payWithKey(key: string, id: number) {
    const k = await this.keyRepo.findOneBy({
      key: key,
      used: false,
    });
    if (k) {
      const client = await this.clientRepo.findOneBy({
        id: id,
        deleted: false,
      });
      if (client) {
        client.clientType =
          k.client_type == ClientType2.ADVANCED
            ? ClientType2.ADVANCED
            : k.client_type == ClientType2.BUISNESS
              ? ClientType2.BUISNESS
              : ClientType2.BASIC;
        await this.clientRepo.save(client);
        k.used = true;
        await this.keyRepo.save(k);
        return {
          ...client,
          token: this.jwt.generateToken({
            type: PayloadType.CLIENT,
            data: {
              id: client.id,
            },
          }),
        };
      } else {
        throw new UnauthorizedException('User not found');
      }
    } else {
      throw new BadRequestException('Key not found');
    }
  }

  async signIn(body: SignInDto): Promise<any> {
    try {
      const client = await this.clientRepo.findOneBy({
        username: body.username,
        password: body.password,
      });
      if (client) {
        return {
          ...client,
          token: this.jwt.generateToken({
            type: PayloadType.CLIENT,
            data: {
              id: client.id,
            },
          }),
        };
      } else {
        throw new UnauthorizedException('User not found');
      }
    } catch (err) {
      throw err;
    }
  }
}
