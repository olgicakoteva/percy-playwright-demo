export type Environment = "QA" | "STAGE";

export const getEnv = (): Environment => {
  const env = process.env.ENV;

  return (env === "QA" || env === "STAGE") ? env : "STAGE";
};
