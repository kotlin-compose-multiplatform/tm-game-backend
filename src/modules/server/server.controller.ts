import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServerService } from './server.service';
import CreateServerDto from './dto/create-server.dto';
import CreateGameServerDto from './dto/create-game-server.dto';
import UpdateServerDto from './dto/update-server.dto';
import UserGuard from '../user/user.guard';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post('add-server')
  @UseGuards(UserGuard)
  addServer(@Body() body: CreateServerDto) {
    return this.serverService.addServer(body);
  }

  @Post('add-server-to-game')
  @UseGuards(UserGuard)
  addServerToGame(@Body() body: CreateGameServerDto) {
    return this.serverService.addServerToGame(body);
  }

  @Post('delete-server-from-game')
  @UseGuards(UserGuard)
  deleteServerFromGame(@Body() body: CreateGameServerDto) {
    return this.serverService.deleteServerFromGame(body);
  }

  @Delete('delete-server/:id')
  @UseGuards(UserGuard)
  deleteServer(@Param('id') id: string) {
    return this.serverService.deleteServer(+id);
  }

  @Patch('update-server/:id')
  @UseGuards(UserGuard)
  updateServer(@Param('id') id: string, @Body() body: UpdateServerDto) {
    return this.serverService.updateServer(+id, body);
  }

  @Get('get-servers')
  @UseGuards(UserGuard)
  getServers() {
    return this.serverService.getServers();
  }
}
