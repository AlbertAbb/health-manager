"use client"
import {Form} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import CustomFormField, {FORM_FIELD_TYPES} from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {createUser} from "@/lib/actions/patient.actions";


const PatientForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);


    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);
        try {
            const userData = {name, email, phone};
            const user = await createUser(userData);
            if (user) router.push(`/patients/${user.$id}/register`);
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
            <SubmitButton isLoading={isLoading}>Get Started!</SubmitButton>
        </form>
    </Form>

}

export default PatientForm;