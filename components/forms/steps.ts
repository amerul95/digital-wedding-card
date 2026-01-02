import StepOne from "./features/stepOne";
import StepTwo from "./features/StepTwo";
import StepThree from "./features/StepThree";
import { WeddingFormSchema } from "@/lib/schema/schema";


export const steps : {
    id:number,
    component:React.FC,
    fields:(keyof WeddingFormSchema)[]
}[] = [
    {
        id:1,
        component:StepOne,
        fields:["groomName","brideName","choosedPackage"]
    },
    {
        id:2,
        component:StepTwo,
        fields:["eventDate","themeColor","ceremonyName","ceremonynameFontsize"]
    },
    {
        id:3,
        component:StepThree,
        fields:["message"]
    }
]