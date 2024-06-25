import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './modules/client/client.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { ServerModule } from './modules/server/server.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { PaymantHistoryModule } from './modules/paymant-history/paymant-history.module';
import { GameModule } from './modules/game/game.module';
import CategoryEntity from './modules/category/entity/category.entity';
import ServerEntity from './modules/server/entity/server.entity';
import PricingEntity from './modules/pricing/entity/pricing.entity';
import ClientEntity from './modules/client/entity/client.entity';
import UserEntity from './modules/user/entity/user.entity';
import GameEntity from './modules/game/entity/game.entity';
import GameAssets from './modules/game/entity/game-assets.entity';
import PaymantHistoryEntity from './modules/paymant-history/entity/payment-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'QwertyWeb123',
      database: 'tmgame',
      entities: [
        CategoryEntity,
        ServerEntity,
        PricingEntity,
        ClientEntity,
        UserEntity,
        GameEntity,
        GameAssets,
        PaymantHistoryEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    ClientModule,
    PricingModule,
    ServerModule,
    CategoryModule,
    UserModule,
    PaymantHistoryModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
