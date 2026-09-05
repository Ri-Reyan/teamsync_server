export type RegisterPayloadType = {
  username: string;
  email: string;
  password: string;
};

export type VerifyOtpPayloadType = {
  email: string;
  otp: string;
};
