import { createFcmECDH, generateFcmAuthSecret, registerToFCM, FcmClient, FcmRegistration } from '@aracna/fcm';
import { Notification } from 'electron';

export async function registerFCMToken() {
  const ecdh = createFcmECDH();
  const authSecret = generateFcmAuthSecret();

  try {
    const registration = await registerToFCM({
      appID: 'com.contler.hotel',
      ece: {
        authSecret: authSecret,
        publicKey: ecdh.getPublicKey()
      },
      firebase: {
        apiKey: 'AIzaSyC7-kFPHWTHaKaP2WFjIXWoAaf9QfSyr8Q',
        appID: '1:424830318314:web:aa057126d096f3d747c993',
        projectID: 'contler-dev'
      },
      vapidKey: 'BEaH17bewsmjQEDAmDgDi5B3pfHuNeuNvYTK25Wa8AP7tsVOy8jiP28uUvGh8r04PI93vbRaoIXOmgmmaNeIiLA'
    });
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
        title: data.notification?.title,
        body: data.notification?.body
      });
      notification.show();
    }
  });

  client.connect();
}
