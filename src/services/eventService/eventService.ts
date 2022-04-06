import customFetch from '../customFetch';
import eventInstance from './eventInstance';
import {IEvent, IEventPost} from '../../typings/IEvent';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';

// /api/event
const eventService = {
  createEvent: (data: IEventPost) => {
    return customFetch<IEvent>(() => eventInstance.post('/', data));
  },
  updateEvent: ({data, id}: {id: any; data: IEventPost}) => {
    return customFetch<IEvent>(() => eventInstance.put(`/${id}`, data));
  },
  getEvents: () => {
    return customFetch<IEvent[]>(() => eventInstance.get('/'));
  },
  getEventById: (id: string) => {
    return customFetch<IEvent>(() => eventInstance.get('/' + id));
  },
  changeStatus: ({answer, id}: {id: string; answer: StatusAnswerEvent}) => {
    return customFetch<IEvent>(() =>
      eventInstance.put(`/${id}/answer`, {
        answer,
      }),
    );
  },
  deleteEventById: (id: string) => {
    return customFetch<IEvent>(() => eventInstance.delete('/' + id));
  },
};

export default eventService;
