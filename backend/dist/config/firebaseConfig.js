"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// firebaseConfig.js
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
