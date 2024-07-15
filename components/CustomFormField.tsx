"use client";
import React, {ReactNode, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Control} from "react-hook-form";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import {E164Number} from "libphonenumber-js";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export enum FORM_FIELD_TYPES {
    INPUT = "input",
    SELECT = "select",
    DATE_PICKER = "datePicker",
    PHONE_INPUT = "phoneInput",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    SKELETON = "skeleton",
    PASSWORD = "password"
}

interface CustomFormFieldProps {
    control: Control<any>,
    name: string,
    fieldType: FORM_FIELD_TYPES,
    label?: string,
    placeholder?: string,
    description?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: ReactNode,
    renderSkeleton?: (field: any) => ReactNode,
}

const RenderField = ({field, props}: { field: any, props: CustomFormFieldProps }) => {
    switch (props.fieldType) {
        case FORM_FIELD_TYPES.INPUT:
            return (
                <div className={"flex rounded-md border border-dark-500 bg-dark-400"}>
                    {props.iconSrc && (
                        <Image
                            src={props.iconSrc}
                            width={24}
                            height={24}
                            alt={props.iconAlt || "Icon"}
                            className={"ml-2"}
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={props.placeholder}
                            {...field}
                            className={"shad-input border-0"}
                        />
                    </FormControl>
                </div>
            );
        case FORM_FIELD_TYPES.PHONE_INPUT:
            return <FormControl>
                <PhoneInput
                    defaultCountry="IT"
                    placeholder={props.placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className={"input-phone"}
                />
            </FormControl>
        case FORM_FIELD_TYPES.DATE_PICKER:
            return <div className={"flex rounded-md border border-dark-500 bg-dark-400"}>
                <Image
                    src={"/assets/icons/calendar.svg"}
                    alt={"calendar"}
                    width={24}
                    height={24}
                    className={"ml-2"}
                />
                <FormControl>
                    <ReactDatePicker
                        selected={field.value}
                        showYearDropdown
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect={props.showTimeSelect ?? false}
                        dateFormat={props.dateFormat ?? "dd/MM/YYYY"}
                        timeInputLabel={"Time:"}
                        wrapperClassName={"date-picker"}
                    />
                </FormControl>
            </div>
        case FORM_FIELD_TYPES.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null
        case FORM_FIELD_TYPES.SELECT:
            return <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className={"shad-select-trigger"}>
                            <SelectValue placeholder={props.placeholder}/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className={"shad-select-content"}>
                        {props.children}
                    </SelectContent>
                </Select>
            </FormControl>
        case FORM_FIELD_TYPES.TEXTAREA:
            return <FormControl>
                <Textarea
                    placeholder={props.placeholder}
                    className={"shad-textArea"}
                    disabled={props.disabled}
                    {...field}
                />
            </FormControl>
        case FORM_FIELD_TYPES.CHECKBOX:
            return <FormControl>
                <div className={"flex items-center gap-4"}>
                    <Checkbox
                        id={props.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <Label htmlFor={props.name} className={"checkbox-label"}>
                        {props.label}
                    </Label>
                </div>


            </FormControl>
        case FORM_FIELD_TYPES.PASSWORD:
            const [type, setType] = useState("password");
            return <div className={"flex rounded-md border border-dark-500 bg-dark-400"}>
                    {props.iconSrc && (
                        <Image
                            src={props.iconSrc}
                            width={24}
                            height={24}
                            alt={props.iconAlt || "Icon"}
                            className={"ml-2"}
                            onClick={() => {
                                type === "password" ? setType("text") : setType("password");
                            }}
                        />
                    )}
                <FormControl>
                    <Input
                        placeholder={props.placeholder}
                        {...field}
                        type={type}
                        className={"shad-input border-0"}
                    />
                </FormControl>
            </div>
        default:
            console.error(`This type of field :"${props.fieldType}" does not exist`)
    }
};


const CustomFormField = (props: CustomFormFieldProps) => {
    const {control, fieldType, name, label} = props;
    return <FormField
        control={control}
        name={name}
        render={({field}) => (
            <FormItem className={"flex-1"}>
                {
                    fieldType !== FORM_FIELD_TYPES.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )
                }
                <RenderField field={field} props={props}/>
                <FormMessage className={"shad-error"}/>
            </FormItem>
        )}
    />
}

export default CustomFormField