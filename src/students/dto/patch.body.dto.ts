import { CreateBodyDto } from 'students/dto/create.body.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchBodyDto extends PartialType(
  PickType(CreateBodyDto, ['firstName', 'lastName', 'patronymic', 'groupId']),
) {}
