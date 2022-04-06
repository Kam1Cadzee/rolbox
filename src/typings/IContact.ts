import {IImage, IUser, UserExtension} from './IUser';
import Contacts from 'react-native-contacts';

export interface IContact {
  resourceName: string;
  etag: string;
  names?: IContactName[];
  photos?: IContactPhoto[];
  phoneNumbers?: IContactPhone[];
  hasApp: boolean;
  emailAddresses?: IContactEmail[];
  _id?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  image?: IImage;
}

export interface IContactName {
  displayName: string; // "Тьотя Оля"
  givenName: string; // "Тьотя"
  displayNameLastFirst: string; // "Оля, Тьотя"
  unstructuredName: string; //"Тьотя Оля"
  familyName: string;
  metadata?: IContactMetadata;
}

export interface IContactEmail {
  value: string;
  metadata?: IContactMetadata;
}

export interface IContactPhone {
  value: string; // "0972572478"
  canonicalForm?: string; // "+380972572478"
  type?: string; // "mobile"
  formattedType?: string; // formattedType
  metadata?: IContactMetadata;
}
export interface IContactPhoto {
  url: string;
  default: boolean;
  metadata?: IContactMetadata;
}

export interface IContactMetadata {
  primary: boolean;
  source: {
    type: 'OTHER_CONTACT' | 'CONTACT';
    id: string;
  };
}

export interface IMapContact {
  id: string;
  name: string;
  image: string;
  isOutApp: boolean;
  user: IUser;
}

export function contactInApp(contact: IContact) {
  return contact.hasApp && contact._id;
}

export const mapContactApp = (contact: IContact | IUser) => {
  const name = UserExtension.fullName(contact);
  const image = UserExtension.image(contact);

  return {
    id: contact._id!,
    name,
    image,
    isOutApp: false,
    user: contact,
  } as IMapContact;
};

export const mapContact = (contact: IContact) => {
  let dataName = '';
  let dataImage = '';

  if (contact.names && contact.names.length > 0) {
    const name = contact.names[0];
    dataName =
      name?.displayName ??
      name?.unstructuredName ??
      name?.displayNameLastFirst ??
      `${name?.givenName ?? ''} ${name?.familyName ?? ''}`;
  }
  dataName = dataName.trim();
  if (dataName.length === 0) {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const phone = contact.phoneNumbers[0];
      dataName = phone?.value ?? phone?.formattedType;
    }
  }
  if (dataName.length === 0) {
    if (contact.emailAddresses && contact.emailAddresses.length > 0) {
      const email = contact.emailAddresses[0];
      dataName = email.value;
    }
  }

  if (contact.photos && contact.photos.length > 0) {
    const image = contact.photos[0];
    dataImage = image.url;
  }

  return {
    name: dataName,
    image: dataImage,
    isOutApp: true,
  } as IMapContact;
};

export const exceptFriends = (friends: IUser[], contacts: IMapContact[]) => {
  return contacts.filter((c) => {
    return !friends.some((f) => f._id === c.id);
  });
};

export const exceptDuplicates = (items: IMapContact[]) => {
  const res: {[name: string]: IMapContact} = {};
  items.forEach((i) => (res[i.id] = i));

  return Object.values(res);
};

export const mapContactsFromPhone = (data: Contacts.Contact[]): IContact[] => {
  return data.map((d) => {
    const emailAddresses: IContactEmail[] = d.emailAddresses.map((e) => ({value: e.email}));
    const names: IContactName[] = [
      {
        displayName: d.displayName ?? d.givenName,
        displayNameLastFirst: '',
        familyName: d.familyName,
        givenName: d.givenName,
        unstructuredName: '',
      },
    ];
    const photos: IContactPhoto[] = [
      {
        default: true,
        url: d.thumbnailPath,
      },
    ];
    const phoneNumbers: IContactPhone[] = d.phoneNumbers.map((p) => ({
      value: p.number,
      type: p.label,
    }));
    return {
      etag: '',
      hasApp: false,
      resourceName: '',
      emailAddresses,
      names,
      photos,
      phoneNumbers,
    };
  });
};
