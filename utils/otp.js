import crypto from "crypto";

export function generateOTP(){

  // 6 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export function hashOTP(otp, salt = null){
  // create salted hash (HMAC OR pbkdf2)
  salt = salt ||
  crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(otp,salt, 10000, 64, "sha512").toString("hex");
  return `${salt} : ${hash}`;
}

export function verifyOtpHash(otp,stored){
  const [salt, hash] = stored.split(":");
  const otpHash = crypto.pbkdf2Sync(otp, salt, 10000, 64, "sha512").toString("hex");

  return otpHash === hash
}