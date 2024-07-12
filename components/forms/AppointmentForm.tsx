"use client"
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {getAppointmentSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import CustomFormField, {FORM_FIELD_TYPES} from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {Doctors} from "@/constants";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import {createAppointment, updateAppointment} from "@/lib/actions/appointment.actions";
import {Appointment} from "@/types/appwrite.types";

interface AppointmentFormProps {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule",
    appointment?: Appointment,
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const AppointmentForm = (props: AppointmentFormProps) => {
    const {userId, patientId, type} = props;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const buttonLabel = () => {
        switch (type) {
            case "cancel":
                return "Cancel appointment"
            case "create":
                return "Create appointment"
            case "schedule":
                return "Schedule appointment"
            default:
                return ""
        }
    }
    const AppointmentFormValidation = getAppointmentSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: props?.appointment?.primaryPhysician ?? "",
            schedule: props?.appointment?.schedule ? new Date(props.appointment.schedule) : new Date(),
            reason: props?.appointment?.reason ?? "",
            note: props?.appointment?.note ?? "",
            cancellationReason: props?.appointment?.cancellationReason ?? ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);

        let status;
        switch (type) {
            case "cancel":
                status = "cancelled";
                break;
            case "schedule":
                status = "scheduled";
                break;
            default:
                status = "pending";
                break;
        }

        try {
            if (type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }
                const newAppointment = await createAppointment(appointmentData);
                if (newAppointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
                }
            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: props.appointment!.$id,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason
                    },
                    type
                }
                const updatedAppointment = await updateAppointment(appointmentToUpdate);
                if (updatedAppointment) {
                    props.setIsOpen && props.setIsOpen(false);
                    form.reset();
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            {type === "create" && <section className="mb-12 space-y-4">
                <h1 className="header">New appointment</h1>
                <p className="text-dark-700"> Request a new appointment in 10 seconds.</p>
            </section>}

            {
                type !== "cancel" && (
                    <>
                        <CustomFormField
                            placeholder={"Select a doctor"}
                            name={"primaryPhysician"}
                            label={"Doctor"}
                            fieldType={FORM_FIELD_TYPES.SELECT}
                            control={form.control}>
                            {Doctors.map((doctor) => (
                                <SelectItem key={doctor.name} value={doctor.name}>
                                    <div className={"flex cursor-pointer items-center gap-2"}>
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className={"rounded-full border border-dark-500"}
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <CustomFormField
                            control={form.control}
                            fieldType={FORM_FIELD_TYPES.DATE_PICKER}
                            name={"schedule"}
                            label={"Expected appointment date"}
                            showTimeSelect
                            dateFormat={"dd/MM/yy - hh:mm aa"}
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                control={form.control}
                                fieldType={FORM_FIELD_TYPES.TEXTAREA}
                                name={"reason"}
                                label={"Reason for appointment"}
                                placeholder={"Enter appointment reason"}
                            />
                            <CustomFormField
                                control={form.control}
                                fieldType={FORM_FIELD_TYPES.TEXTAREA}
                                name={"note"}
                                label={"Notes"}
                            />
                        </div>
                    </>
                )

            }
            {
                type === "cancel" && (
                    <>
                        <CustomFormField
                            control={form.control}
                            fieldType={FORM_FIELD_TYPES.TEXTAREA}
                            name={"cancellationReason"}
                            label={"Reason for cancellation"}
                            placeholder={"Enter reason for cancellation"}
                        />
                    </>
                )

            }
            <SubmitButton
                className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                isLoading={isLoading}
            >{buttonLabel()}</SubmitButton>
        </form>
    </Form>

};

export default AppointmentForm;