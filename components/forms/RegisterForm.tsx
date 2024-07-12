"use client"
import {Form, FormControl} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import CustomFormField, {FORM_FIELD_TYPES} from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {PatientFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues} from "@/constants";
import {Label} from "@/components/ui/label";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import FileUploader from "@/components/FileUploader";
import {registerPatient} from "@/lib/actions/patient.actions";

const PatientForm = ({user}: { user: User }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);


    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",

        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        // Ensures file exists
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {type: values.identificationDocument[0].type});
            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.identificationDocument[0].name);
        }
        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            }
            const patient = await registerPatient(patientData);
            if (patient) router.push(`/patients/${user.$id}/new-appointment`);
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
            <section className="space-y-4">
                <h1 className="header">Welcome!👋</h1>
                <p className="text-dark-700"> Let us know more about yourself.</p>
            </section>
            {/* Start Personal information*/}
            <section className="space-y-6">
                <div className={"mb-9 space-y-1"}>
                    <h2 className="sub-header">Personal information.</h2>
                </div>
            </section>
            <CustomFormField
                iconSrc={"/assets/icons/user.svg"}
                iconAlt={"user"}
                placeholder={"John Connor"}
                label={"Full name"}
                name={"name"}
                fieldType={FORM_FIELD_TYPES.INPUT}
                control={form.control}/>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
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
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    iconSrc={"/assets/icons/email.svg"}
                    iconAlt={"email"}
                    placeholder={"johnconnor@gmail.com"}
                    name={"birthDate"}
                    label={"Date of birth"}
                    fieldType={FORM_FIELD_TYPES.DATE_PICKER}
                    control={form.control}/>
                <CustomFormField
                    name={"gender"}
                    label={"Gender"}
                    fieldType={FORM_FIELD_TYPES.SKELETON}
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <RadioGroup className={"flex h-11 gap-6 xl:justify-between"}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                {GenderOptions.map((opt) => (
                                    <div key={opt} className={"radio-group"}>
                                        <RadioGroupItem
                                            value={opt}
                                            id={opt}/>
                                        <Label
                                            className={"cursor-pointer"}
                                            htmlFor={opt}>{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Via Rizzoli 12"}
                    label={"Address"}
                    name={"address"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
                <CustomFormField
                    placeholder={"Software Developer"}
                    label={"Occupation"}
                    name={"occupation"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Guardian's name"}
                    name={"emergencyContactName"}
                    label={"Emergency Contact Name"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
                <CustomFormField
                    placeholder={"+39 3471234567"}
                    name={"emergencyContactNumber"}
                    label={"Emergency Contact Number"}
                    fieldType={FORM_FIELD_TYPES.PHONE_INPUT}
                    control={form.control}/>
            </div>
            {/* End Personal information*/}
            {/* Start Medical Information*/}
            <section className="space-y-6">
                <div className={"mb-9 space-y-1"}>
                    <h2 className="sub-header">Medical Information.</h2>
                </div>
            </section>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Select a physician"}
                    name={"primaryPhysician"}
                    label={"Primary Physician"}
                    fieldType={FORM_FIELD_TYPES.SELECT}
                    control={form.control}>
                    {/*TODO --> Make Doctors an API and add possibility to add them from admin dashboard*/}

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
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Allianz"}
                    name={"insuranceProvider"}
                    label={"Insurance Provider"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
                <CustomFormField
                    placeholder={"ABC123456789"}
                    name={"insurancePolicyNumber"}
                    label={"Insurance Policy Number"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Peanuts, pollin..."}
                    name={"allergies"}
                    label={"Allergies(if any)"}
                    fieldType={FORM_FIELD_TYPES.TEXTAREA}
                    control={form.control}/>
                <CustomFormField
                    placeholder={"Ibuprofen(200mg), Paracetamol(500mg)..."}
                    name={"currentMedication"}
                    label={"Current Medication"}
                    fieldType={FORM_FIELD_TYPES.TEXTAREA}
                    control={form.control}/>
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Mother has diabetes, father has..."}
                    name={"familyMedicalHistory"}
                    label={"Family Medical History"}
                    fieldType={FORM_FIELD_TYPES.TEXTAREA}
                    control={form.control}/>
                <CustomFormField
                    placeholder={"Tonsillectomy, Appendectomy"}
                    name={"pastMedicalHistory"}
                    label={"Past Medical History"}
                    fieldType={FORM_FIELD_TYPES.TEXTAREA}
                    control={form.control}/>
            </div>
            {/* End Medical Information*/}
            {/* Start Identification and verification*/}
            <section className="space-y-6">
                <div className={"mb-9 space-y-1"}>
                    <h2 className="sub-header">Identification and Verification.</h2>
                </div>
            </section>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Select an identification type"}
                    name={"identificationType"}
                    label={"Identification Type"}
                    fieldType={FORM_FIELD_TYPES.SELECT}
                    control={form.control}>
                    {IdentificationTypes.map((type) => (
                        <SelectItem className={"cursor-pointer"} key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    placeholder={"AZ123456789"}
                    name={"identificationNumber"}
                    label={"Identification Number"}
                    fieldType={FORM_FIELD_TYPES.INPUT}
                    control={form.control}/>
            </div>
            <div className={"flex flex-col gap-6 xl:flex-row"}>
                <CustomFormField
                    placeholder={"Scanned copy of ID"}
                    name={"identificationDocument"}
                    label={"Identification Document"}
                    fieldType={FORM_FIELD_TYPES.SKELETON}
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}

                />
            </div>
            {/* End Identification and verification*/}
            {/* Start Consent and Privacy*/}
            <section className="space-y-6">
                <div className={"mb-9 space-y-1"}>
                    <h2 className="sub-header">Consent and Privacy.</h2>
                </div>
            </section>
            <CustomFormField
                control={form.control}
                name={"treatmentConsent"}
                label={"I consent to treatment "}
                fieldType={FORM_FIELD_TYPES.CHECKBOX}/>
            <CustomFormField
                control={form.control}
                label={"I consent to disclosure "}
                name={"disclosureConsent"}
                fieldType={FORM_FIELD_TYPES.CHECKBOX}/>
            <CustomFormField
                control={form.control}
                label={"I consent to privacy policy"}
                name={"privacyConsent"}
                fieldType={FORM_FIELD_TYPES.CHECKBOX}/>
            <SubmitButton isLoading={isLoading}>Get Started!</SubmitButton>
        </form>
    </Form>

}

export default PatientForm;