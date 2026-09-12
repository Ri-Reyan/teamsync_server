import crypto from "crypto";
export const genOtp = () => crypto.randomInt(100000, 1000000);
export const verifyOtp = (otp, expectedOtp) => otp === expectedOtp;
