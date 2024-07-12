"use client"
import React, {useEffect, useState} from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp"

import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {decryptKey, encryptKey} from "@/lib/utils";

const PasskeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");
    const closeModal = () => {
        setIsOpen(false);
        router.push("/");
    }

    const encryptedKey = typeof window !== "undefined" ? window.localStorage.getItem("accessKey") : null;

    useEffect(() => {
        if (!path) return;
        const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;
        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            setIsOpen(false);
            router.push("/admin")
        } else {
            setIsOpen(true);
        }

    }, [encryptedKey]);


    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedPasskey = encryptKey(passkey);
            localStorage.setItem("accessKey", encryptedPasskey);
            setIsOpen(false);
        } else {
            setError("Invalid passkey, please try again.");
        }


    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className={"shad-alert-dialog"}>
                <AlertDialogHeader>
                    <AlertDialogTitle className={"flex items-start justify-between"}>
                        Admin access verification
                        <Image
                            src={"/assets/icons/close.svg"}
                            alt={"close"}
                            height={20}
                            width={20}
                            onClick={() => closeModal()}
                            className={"cursor-pointer"}
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
                        <InputOTPGroup className={"shad-otp"}>
                            <InputOTPSlot index={0} className={"shad-otp-slot"}/>
                            <InputOTPSlot index={1} className={"shad-otp-slot"}/>
                            <InputOTPSlot index={2} className={"shad-otp-slot"}/>
                            <InputOTPSlot index={3} className={"shad-otp-slot"}/>
                            <InputOTPSlot index={4} className={"shad-otp-slot"}/>
                            <InputOTPSlot index={5} className={"shad-otp-slot"}/>
                        </InputOTPGroup>

                    </InputOTP>
                    {
                        error && <p className={"shad-error text-14-regular mt-4 flex justify-center"}>
                            {error}
                        </p>
                    }
                </div>

                <AlertDialogFooter>
                    <AlertDialogAction onClick={validatePasskey}>
                        Enter admin
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
};

export default PasskeyModal;