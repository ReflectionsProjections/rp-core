import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScanEventDto } from './dto/create-scan-event.dto';
import { UpdateScanEventDto } from './dto/update-scan-event.dto';
import { ScanEvent, ScanEventDocument } from './scan-events.schema';

@Injectable()
export class ScanEventsService {
  constructor(
    @InjectModel(ScanEvent.name)
    private scanEventModel: Model<ScanEventDocument>,
  ) {}

  create(createScanEventDto: CreateScanEventDto) {
    const newScanEvent = new this.scanEventModel(createScanEventDto);
    return newScanEvent.save(); //Using save() pushes scanEvent to Mongo
  }

  findAll() {
    return this.scanEventModel.find();
  }

  findOne(id: string) {
    // console.log(id);
    return this.scanEventModel.findById(id);
  }

  update(id: string, updateScanEventDto: UpdateScanEventDto) {
    return this.scanEventModel.findByIdAndUpdate(id, updateScanEventDto);
  }

  remove(id: string) {
    return this.scanEventModel.findByIdAndDelete(id);
  }
}
