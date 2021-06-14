import { PartialType } from '@nestjs/mapped-types';
import { CreateTagNameDto } from './create-tag-name.dto';

export class UpdateTagNameDto extends PartialType(CreateTagNameDto) {}
