import { Notification } from '../entities/notification';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract fetchAll(userId: string): Promise<Notification[]>;
  abstract fetchAllUnread(userId: string): Promise<Notification[]>;
  abstract read(id: string): Promise<void>;
}
