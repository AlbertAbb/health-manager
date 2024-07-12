"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Appointment} from "@/types/appwrite.types";
import StatusBadge from "@/components/StatusBadge";
import {formatDateTime} from "@/lib/utils";
import {Doctors} from "@/constants";
import Image from "next/image"
import AppointmentModal from "@/components/AppointmentModal";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Appointment>[] = [
    {
        header: "ID",
        cell: (({row}) =>
            <p className={"text-14-medium"}>
                {row.index + 1}
            </p>)
    },
    {
        header: "Patient",
        accessorKey: "patient",
        cell: (({row}) =>
                <p className={"text-14-medium"}>{row.original.patient.name}</p>
        )
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: (({row}) =>
                <div className={"min-w-[115px]"}>
                    <StatusBadge status={row.original.status}/>
                </div>
        )
    },
    {
        header: "Appointment",
        accessorKey: "schedule",
        cell: (({row}) =>
                <p className={"text-14-regular min-w-[100px]"}>
                    {formatDateTime(row.original.schedule).dateTime}
                </p>
        )
    },
    {
        accessorKey: "primaryPhysician",
        header: "Doctor",
        cell: ({row}) => {
            const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician);
            return <div className="flex items-center gap-3">
                <Image
                    src={doctor?.image!}
                    alt={doctor?.name!}
                    width={100}
                    height={100}
                    className={"size-8"}
                />
                <p className={"whitespace-nowrap"}>
                    Dr. {doctor?.name}
                </p>
            </div>
        },
    },
    {
        id: "actions",
        header: () => <div className={"pl-4"}>Actions</div>,
        cell: ({row: {original: data}}) => {
            return <div className={"flex gap-1"}>
                <AppointmentModal
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointment={data}
                    title={"Schedule Appointment"}
                    description={"Please confirm the following details to schedule."}
                    type={"schedule"}
                />
                <AppointmentModal
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointment={data}
                    title={"Cancel Appointment"}
                    description={"Are you sure you want to cancel this appointment?"}
                    type={"cancel"}
                />
            </div>
        },
    },
]
