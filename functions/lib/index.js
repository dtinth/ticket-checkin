"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const authenticator_1 = __importDefault(require("otplib/authenticator"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
authenticator_1.default.options = { crypto: crypto_1.default, window: 6 };
admin.initializeApp();
exports.checkIn = functions.https.onRequest((request, response) => {
    cors_1.default()(request, response, () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventId, totp, refCode } = request.body;
            const eventRef = admin
                .database()
                .ref('events')
                .child(`${eventId}`);
            const key = (yield eventRef
                .child('keys')
                .child('attendee')
                .once('value')).val();
            if (!key) {
                throw new Error('WTF? No key is found!!');
            }
            const tokenValid = authenticator_1.default.check(`${totp}`, key);
            if (!tokenValid) {
                response.json({
                    error: 'ETOKEN'
                });
                return;
            }
            const attendee = (yield eventRef
                .child('attendees')
                .child(`${refCode}`)
                .once('value')).val();
            if (!attendee) {
                response.json({
                    error: 'EREF'
                });
                return;
            }
            const checkInRef = eventRef.child('checkins').child(`${refCode}`);
            let checkIn = (yield checkInRef.once('value')).val();
            if (checkIn) {
                response.json({ checkIn, attendee });
                return;
            }
            yield checkInRef.set({
                time: admin.database.ServerValue.TIMESTAMP,
                mode: 'self'
            });
            checkIn = (yield checkInRef.once('value')).val();
            response.json({ checkIn, attendee });
        }
        catch (e) {
            response.status(500).send('WTF?');
            console.error(e);
        }
    }));
});
exports.staffSignIn = functions.https.onCall((data, context) => { });
//# sourceMappingURL=index.js.map