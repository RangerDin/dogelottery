export const getEnvOrThrowError = (
  env: string | undefined,
  envName: string
): string => {
  if (!env) {
    throw new Error(`You should set ${envName} env to launch the app`);
  }

  return env;
};
