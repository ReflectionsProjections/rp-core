import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  findAll() {
    return this.eventModel.find();
  }

  findOne(id: string) {
    return this.eventModel.findOne({ _id: id });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventModel.updateOne({ _id: id }, updateEventDto);
  }

  remove(id: string) {
    return this.eventModel.deleteOne({ _id: id });
  }

  async schedule() {
    try {
      const all_events = await this.eventModel.find().cursor();
      let twoDArray = [[], [], [], [], [], [], [], []]

      for await (const doc of all_events) {
        let num = doc.start_time.getDay();
        if(!twoDArray[num].includes(doc))
          twoDArray[num].push(doc);
      }
      
      return {
        "monday" : twoDArray[1],
        "tuesday" : twoDArray[2],
        "wednesday" : twoDArray[3],
        "thursday" : twoDArray[4],
        "friday" : twoDArray[5],
        "saturday" : twoDArray[6],
        "sunday" : twoDArray[0]
      };
    } catch (error) {
      console.error(error);
    }
  }
}
