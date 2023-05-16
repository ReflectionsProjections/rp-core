import { PartialType } from '@nestjs/mapped-types';
import { CreateScanEventDto } from './create-scan-event.dto';

export class UpdateScanEventDto extends PartialType(CreateScanEventDto) {}
