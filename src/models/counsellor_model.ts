


interface Counsellor{
    id:string | null;
    name:string;
    phone_number:string;
    email:string;
}

interface CounsellorProfUpdate{
    name:string | null;
    phone_number:string | null;
}
interface mini_counsellor{
    id:string;
    name:string;
}

interface CounsellorSchedule {
    counsellor_id: string;
    day: string;
    month: number;
    date:number;
    time: string;
    year: string;
    counsellors: mini_counsellor[];
}[]
export type {Counsellor,CounsellorSchedule,CounsellorProfUpdate};