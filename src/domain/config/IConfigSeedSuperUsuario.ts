export interface IConfigSeedSuperUsuarioData {
  email: string;
  matriculaSiape: string;
  password: string;
}

export interface IConfigSeedSuperUsuario {
  getSeedSuperUsuarioEmail(): string | undefined;
  getSeedSuperUsuarioMatriculaSiape(): string | undefined;
  getSeedSuperUsuarioPassword(): string | undefined;
  getSeedSuperUsuario(): IConfigSeedSuperUsuarioData;
}
