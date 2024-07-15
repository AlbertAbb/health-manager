"use client"
import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import CustomFormField, {FORM_FIELD_TYPES} from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {LoginFormValidation} from "@/lib/validation";
import {useToast} from "@/components/ui/use-toast";

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast();
    const form = useForm<z.infer<typeof LoginFormValidation>>({
        resolver: zodResolver(LoginFormValidation),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({name, email, phone, password, confirm}: z.infer<typeof LoginFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);
        try {
            // TODO --> Style
            // toast({
            //     variant: "destructive",
            //     title: "Scheduled: Catch up",
            //     description: "Friday, February 10, 2023 at 5:57 PM",
            // })
            // const userData = {name, email, phone};
            // const user = await createUser(userData);
            // if (user) router.push(`/patients/${user.$id}/register`);
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
                <h1 className="header">Hi there!👋</h1>
                <p className="text-dark-700"> Schedule your first appointment.</p>
            </section>
            <CustomFormField
                iconSrc={"/assets/icons/user.svg"}
                iconAlt={"user"}
                placeholder={"John Connor"}
                name={"name"}
                label={"Full name"}
                fieldType={FORM_FIELD_TYPES.INPUT}
                control={form.control}/>
            <CustomFormField
                iconSrc={"/assets/icons/email.svg"}
                iconAlt={"email"}
                placeholder={"johnconnor@gmail.com"}
                name={"email"}
                label={"Email"}
                fieldType={FORM_FIELD_TYPES.INPUT}
                control={form.control}/>
            <CustomFormField
                placeholder={"+39 3478999920"}
                name={"phone"}
                label={"Phone number"}
                fieldType={FORM_FIELD_TYPES.PHONE_INPUT}
                control={form.control}/>
            <CustomFormField
                iconSrc={"/assets/icons/eye.svg"}
                iconAlt={"eye"}
                placeholder={"Insert secure password"}
                name={"password"}
                label={"Password"}
                fieldType={FORM_FIELD_TYPES.PASSWORD}
                control={form.control}/>
            <CustomFormField
                iconSrc={"/assets/icons/eye.svg"}
                iconAlt={"eye"}
                placeholder={"Confirm password"}
                name={"confirm"}
                label={"Confirm password"}
                fieldType={FORM_FIELD_TYPES.PASSWORD}
                control={form.control}/>
            <SubmitButton isLoading={isLoading}>Get Started!</SubmitButton>
        </form>
    </Form>
};

export default LoginForm;
