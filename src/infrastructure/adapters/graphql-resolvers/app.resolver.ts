import { Query } from '@nestjs/graphql';

export class AppResolver {
  @Query(() => String)
  hello() {
    return 'world!';
  }
}
