import { getMessaging } from "firebase-admin/messaging";

class NotificationService {

  async sendPushNotification(
    token: string,
    title: string,
    body: string
  ) {
    return await getMessaging().send({
      token,
      notification: {
        title,
        body,
      },
    });
  }

}

export default new NotificationService();