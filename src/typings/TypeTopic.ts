import StatusAnswerEvent from './StatusAnswerEvent';

enum TitleTopics {
  system = 'system',
  chat = 'chat',
}

enum TypeTopics {
  config = 'config',
  signOutGoogle = 'signOutGoogle',

  requestFriend = 'requestFriend',
  cancelFriend = 'cancelFriend', //when i cancel friend's request // CANCEL payload.responder === friendsResponses[].requester._id
  declineFriend = 'declineFriend', //DECLINE payload.responder === friendsRequests[].responder._id
  deleteFriend = 'deleteFriend',
  acceptFriend = 'acceptFriend', //ACCEPT payload.responder === friendsRequests[].responder._id

  receiveMessage = 'receiveMessage',
  invitationEvent = 'invitation',
  removeParticipantEvent = 'removeParticipant',
  deleteEventEvent = 'deleteEvent',
  answerEvent = 'answerEvent',

  newChat = 'newChat',
}

interface IDataMessage {
  type: TypeTopics;
  topic: TitleTopics;
  payload: string;
  badge: string;
}

interface IPayloadRequestFriend {
  requester: string;
}
interface IPayloadRejectFriend {
  responder: string;
}

interface IPayloadAnswerEvent {
  event: string;
  guest: string;
  answer: StatusAnswerEvent;
}

export {TitleTopics, TypeTopics, IPayloadRejectFriend, IPayloadAnswerEvent, IPayloadRequestFriend};
export default IDataMessage;
