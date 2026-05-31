export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}
