import { type ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { type FirebaseConfig, getFirebaseAuth } from '../utils/firebase';
import { getContext, hasContext, setContext } from 'svelte';
import type { Session } from '../..';

interface GetOTPClientAuthConfig {
  firebase: FirebaseConfig;
  apiRoutes: {
    login: string;
    logout: string;
  };
}

const AUTH_CONTEXT_KEY = 'context__auth';
const SESSION_CONTEXT_KEY = 'context__session';

export function getOTPClientAuth<UserType>(config: GetOTPClientAuthConfig) {
  function createCaptcha(id: string) {
    const auth = getFirebaseAuth(config.firebase);
    return new RecaptchaVerifier(auth, id, {
      size: 'invisible'
    });
  }

  function resetCaptcha(captcha: RecaptchaVerifier, id: string) {
    captcha.clear();
    return createCaptcha(id);
  }

  async function sendOTP(captcha: RecaptchaVerifier, phoneNumber: string) {
    const auth = getFirebaseAuth(config.firebase);
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, captcha);
    return confirmation;
  }

  async function confirmOTP(confirmation: ConfirmationResult, otp: string) {
    const result = await confirmation.confirm(otp);
    await fetch(config.apiRoutes.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: result.user.uid,
        token: await result.user.getIdToken()
      })
    });
  }

  function createAuthContext(user: UserType) {
    setContext(AUTH_CONTEXT_KEY, user);
  }

  function useAuth(): UserType {
    if (hasContext(AUTH_CONTEXT_KEY)) {
      return getContext<UserType>(AUTH_CONTEXT_KEY);
    } else {
      throw new Error(`context not initialized, key: ${AUTH_CONTEXT_KEY}`);
    }
  }

  function createSessionContext(session: Session) {
    setContext(SESSION_CONTEXT_KEY, session);
  }

  function useSession(): Session {
    if (hasContext(SESSION_CONTEXT_KEY)) {
      return getContext<Session>(SESSION_CONTEXT_KEY);
    } else {
      throw new Error(`context not initialized, key: ${SESSION_CONTEXT_KEY}`);
    }
  }

  return {
    createCaptcha,
    resetCaptcha,
    sendOTP,
    confirmOTP,
    createAuthContext,
    createSessionContext,
    useAuth,
    useSession
  };
}
