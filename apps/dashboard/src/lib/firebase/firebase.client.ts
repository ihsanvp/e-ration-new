import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, initializeAuth } from 'firebase/auth';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET
} from '$env/static/public';

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;

export function getFirebaseApp() {
	if (!firebaseApp) {
		firebaseApp = initializeApp({
			apiKey: PUBLIC_FIREBASE_API_KEY,
			authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: PUBLIC_FIREBASE_APP_ID,
			measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
		});
	}
	return firebaseApp;
}

export function getFirebaseAuth() {
	if (!firebaseAuth) {
		firebaseAuth = initializeAuth(getFirebaseApp());
	}
	return firebaseAuth;
}
