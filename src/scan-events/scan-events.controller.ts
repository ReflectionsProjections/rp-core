import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScanEventsService } from './scan-events.service';
import { CreateScanEventDto } from './dto/create-scan-event.dto';
import { UpdateScanEventDto } from './dto/update-scan-event.dto';

@Controller('scan-events')
export class ScanEventsController {
  constructor(private readonly scanEventsService: ScanEventsService) {}

  @Post()
  create(@Body() createScanEventDto: CreateScanEventDto) {
    return this.scanEventsService.create(createScanEventDto);
  }

  @Get()
  findAll() {
    return this.scanEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scanEventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScanEventDto: UpdateScanEventDto,
  ) {
    return this.scanEventsService.update(id, updateScanEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scanEventsService.remove(id);
  }
}
