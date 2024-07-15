"use server"
import {databases, storage, users} from "@/lib/appwrite.config";
import {ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {InputFile} from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        return await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name)

    } catch (e: any) {
        if (e && e?.code === 409) {
            const documents = await users.list([
                Query.equal("email", [user.email])
            ]);
            return documents?.users[0];
        }
    }


}
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return parseStringify(user);

    } catch (err) {
        console.error(err);
    }
}
export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get("blobFile") as Blob,
                identificationDocument?.get("fileName") as string,
            )
            file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
        }
        const newPatient = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${process.env.NEXT_PUBLIC_ENDPOINT!}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID!}/files/${file?.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
                ...patient,
            }
        )
        return parseStringify(newPatient);
    } catch (e) {
        console.error(e);
    }


}
export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
            [Query.equal("userId", userId)])
        return parseStringify(patients.documents[0]);

    } catch (err) {
        console.error(err);
    }
}