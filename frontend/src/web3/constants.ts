export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

if (!DEFAULT_CHAIN_ID) {
  throw new Error(
    "You should provide NEXT_PUBLIC_CHAIN_ID env to launch the app"
  );
}
