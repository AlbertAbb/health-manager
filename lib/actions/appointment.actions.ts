"use server"
import {databases, messaging} from "@/lib/appwrite.config";
import {ID, Query} from "node-appwrite";
import {formatDateTime, parseStringify} from "@/lib/utils";
import {revalidatePath} from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            {
                ...appointment,
            }
        )
        return parseStringify(newAppointment);
    } catch (e) {
        console.log(e)
    }

}
export const getAppointment = async (appointmentId: string) => {
    try {
        const newAppointment = await databases.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )
        return parseStringify(newAppointment);
    } catch (e) {
        console.log(e)
    }


}
export const getRecentAppointments = async () => {
    try {
        const appointments = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt"), Query.limit(1000)]
        );
        const counts = appointments.documents
            .reduce((counts, doc) => {
                counts[`${doc.status as Status}Count`] = (counts[`${doc.status as Status}Count`] || 0) + 1;
                return counts;
            }, {
                scheduledCount: 0,
                pendingCount: 0,
                cancelledCount: 0,
            });
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data);
    } catch (e) {
        console.log(e)
    }


}
export const updateAppointment = async ({appointmentId, userId, appointment, type}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        );
        if (!updatedAppointment) {
            throw new Error("Appointment not found")
        }

        const smsMessage = `Hi, it's Health Manager. ${type === "schedule" ? `Your appointment has been scheduled for: ${formatDateTime(appointment.schedule).dateTime} with Dr. ${appointment.primaryPhysician}` :
            `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`}`;

        await sendSMSNotification(userId, smsMessage);

        revalidatePath("/admin");
        return parseStringify(updatedAppointment)
    } catch (e) {
        console.error(e);
    }


}
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        );
        return parseStringify(message);
    } catch (e) {
        console.error(e)
    }
}