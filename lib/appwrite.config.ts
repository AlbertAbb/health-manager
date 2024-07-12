import * as sdk from "node-appwrite"
// Creates client
const client = new sdk.Client();
client.setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!).setProject(process.env.PROJECT_ID!).setKey(process.env.API_KEY!);
// Exposes everything
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
