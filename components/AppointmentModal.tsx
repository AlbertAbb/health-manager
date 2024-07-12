"use client"
import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import AppointmentForm from "@/components/forms/AppointmentForm";
import {Appointment} from "@/types/appwrite.types";

interface AppointmentModalProps {
    type: "schedule" | "cancel",
    patientId: string,
    userId: string,
    appointment: Appointment,
    description: string,
    title: string
}

const AppointmentModal = ({type, patientId, userId, appointment}: AppointmentModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} className={`capitalize ${type === "schedule" && "text-green-500"}`}>
                    {type}
                </Button>
            </DialogTrigger>
            <DialogContent className={"shad-dialog sm:max-w-md"}>
                <DialogHeader className={"mb-4 space-y-3"}>
                    <DialogTitle className={"capitalize"}>{type} Appointment</DialogTitle>
                    <DialogDescription>
                        Please fill in the following details to {type} an appointment.
                    </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                    setIsOpen={setIsOpen}
                    appointment={appointment}
                    patientId={patientId}
                    userId={userId}
                    type={type}
                />
            </DialogContent>
        </Dialog>

    );
};

export default AppointmentModal;