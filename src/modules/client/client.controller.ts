import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import SignUpDto from './dto/sign-up.dto';
import SignInDto from './dto/sign-in.dto';
import ClientGuard from '../user/client.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.clientService.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.clientService.signIn(body);
  }

  @Post('pay-with-key/:key')
  @UseGuards(ClientGuard)
  payWithKey(@Param('key') key: string, @Req() req: Express.Request) {
    const client = req['client'];
    return this.clientService.payWithKey(key, +client['id']);
  }

  @Post('check-payment')
  @UseGuards(ClientGuard)
  checkPayment(@Req() req: Express.Request) {
    const client = req['client'];
    return this.clientService.checkPaymant(+client['id']);
  }
}
