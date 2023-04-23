import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (isMongoId(value)) {
        return value;
    }

    throw new BadRequestException('id must be a mongo id.');
  }
}
