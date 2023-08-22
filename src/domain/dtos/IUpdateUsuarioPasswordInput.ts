export type IUpdateUsuarioPasswordInput = {
  id: number;

  currentPassword: string;

  newPassword: string;
  confirmNewPassword: string;
};
