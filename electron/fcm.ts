import { createFcmECDH, generateFcmAuthSecret, registerToFCM, FcmClient, FcmRegistration } from '@aracna/fcm';
import { Notification } from 'electron';
import * as dotenv from 'dotenv';
dotenv.config();

export async function registerFCMToken() {
  const ecdh = createFcmECDH();
  const authSecret = generateFcmAuthSecret();

  try {
    const tokenData = {
      appID: 'com.contler.hotel',
      ece: {
        authSecret: authSecret,
        publicKey: ecdh.getPublicKey()
      },
      firebase: {
        apiKey: process.env['API_KEY'] as string,
        appID: process.env['APP_ID'] as string,
        projectID: process.env['PROJECT_ID'] as string
      },
      vapidKey: process.env['VAPID_KEY'] as string
    }
    console.log(tokenData);
    const registration = await registerToFCM(tokenData);
    return {
      token: (registration as FcmRegistration).token,
      acg: {
        id: BigInt((registration as FcmRegistration).acg.id),
        securityToken: BigInt((registration as FcmRegistration).acg.securityToken)
      },
      authSecret: authSecret,
      privateKey: ecdh.getPrivateKey()
    };
  } catch (error) {
    console.error('Error registering to FCM:', error);
    throw error;
  }
}

export function listenToFCMMessages(acg: {id: bigint, securityToken: bigint}, authSecret: any, privateKey: any) {
  const client = new FcmClient({
    acg: {
      id: acg.id,
      securityToken: acg.securityToken
    },
    ece: {
      authSecret: authSecret,
      privateKey: privateKey
    }
  });

  client.on('message-data', (data) => {
    if (Notification.isSupported()) {
      let notification = new Notification({
        title: data.data?.['title'] ?? data.notification?.title,
        body: data.data?.['body'] ?? data.notification?.body
      });

      notification.show();
    }
  });

  client.connect();
}
