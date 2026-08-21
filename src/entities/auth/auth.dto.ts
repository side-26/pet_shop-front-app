export type RegisterUserDTO = {
  phoneNumber: string;
  password: string;
};

export type LoginUserDTO = {
  phoneNumber: string;
  password: string;
};

export type SendOtpDTO = {
  phoneNumber: string;
};

export type SendOtpResponseDTO = {
  remainingSeconds: number;
};

export type LoginUserResponseDTO = {
  accessToken: string;
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: string;
  accessExp: number;
};
