import type { ScheduleItem, StoredScheduleItem } from '../models/schedule_item'
import type { Counsellor, CounsellorProfUpdate, CounsellorSchedule } from '../models/counsellor_model'
import { supabaseClient } from './supabaseConfig'
import type { UserProfile } from '../models/profile_model'





class Database{

    private supabase=supabaseClient
    private userId: string | null = null;
    private userIdPromise: Promise<string | null> | null = null;

    constructor() {}

    async getUserId(): Promise<string | null> {
        if (this.userId !== null) {
            return this.userId;
        }

        if (this.userIdPromise !== null) {
            return this.userIdPromise;
        }

        this.userIdPromise = (async () => {
            try {
                const { data, error } =
                    await this.supabase.auth.getUser();

                if (error) {
                    throw error;
                }

                this.userId = data.user?.id ?? null;

                return this.userId;

            } finally {
                this.userIdPromise = null;
            }
        })();

        return this.userIdPromise;
    }

    async adminSignIn(email:string,paswd:string):Promise<string |boolean >{
        try{
            const {data,error}=await this.supabase.auth.signInWithPassword({'email':email,'password':paswd})
            if (error){
                return false
            }
           return data.session.access_token
        }catch(err){
            return false
        }
    }

    //sign up
    async createAccount(details:Counsellor,passwd:string):Promise<string | boolean>{
        const {error}=await this.supabase.auth.signUp({email:details.email,password:passwd})
        
        if (error === null){
            const {error}=await this.supabase.from("counsellors").insert({
                'name':details.name,
                'email':details.email,
                'phone_number':details.phone_number
            }).select()
            if (error !== null){
                return error.message
            }
            return true
        }else{
            return error.message
        }
    }


    //login
    async loginCounsellor(cEmail:string,cPassword:string):Promise<string | boolean>{

        const {data,error}=await this.supabase.auth.signInWithPassword({'email':cEmail,'password':cPassword,})
        if(error !== null){
            return "Unable to login."+error.message
        }
        this.userId=data.user.id
        return true
    }


    //admin fetch all schedules
    async adminGetAllSchedules():Promise<string | CounsellorSchedule[]>{
            this.userId=await this.getUserId()
            const {data,error}=await this.supabase.from("counsellors").select("*").eq('id',this.userId)
            if (error){
                return error.message
            }
            
            if (data[0]['role'] === "admin"){
                const {data,error}=await this.supabase.from("schedules").select(`counsellor_id,time,date,day,month,year,counsellors(
                    id,name)`)
                if (error){
                    return "Schedules not fetched."
                }
                const rows: CounsellorSchedule[] =data
                return rows
            }
            return "Unauthorized Access."
        
    }

    //fetch schedules
    async getSchedules():Promise<StoredScheduleItem[] | string>{
        await this.getUserId()
        var rows:Array<StoredScheduleItem>=[]
        const {data,error}=await this.supabase.from("schedules").select("*").order('date',{ascending:true}).eq('counsellor_id',this.userId)
        if(error === null){
            rows=data            
            return rows
        }else{
            return "Error fetching your schedules."
        }
    }

    //post schedule
    async postSchedule(schedule:ScheduleItem):Promise<string | boolean>{

        if (this.userId === null){
            
            this.userId=await this.getUserId()

        }
        const { error}=await this.supabase.from("schedules").insert({
            
            'counsellor_id':this.userId,
            'time':schedule.time,
            'day':schedule.day,
            'date':schedule.date,
            'month':schedule.month,
            'year':schedule.year
        })
        if (error === null){
            return true
        }else{
            return error.message
        }
    }

    //cancel a schedule
    async cancelSchedule(scheduleId:number):Promise<string | boolean>{
        const id=await this.getUserId()
        if (id === null || id === undefined){
            return "Unauthenticated.Try to login first"
        }
        const {error}=await this.supabase.from("schedules").update({'is_cancelled':true}).eq('id',scheduleId).eq('counsellor_id',id)
        if (error !== null){
            return "Failed.Schedule NOT cancelled"
        }
        return true
    }



    //fetch single counsellor
    async fetchCounsellorById():Promise<string | UserProfile>{
        const id=await this.getUserId()
        if (id === null || id === undefined){
            return "Unauthenticated.Try to login first"
        }
        const {data,error}=await this.supabase.from("counsellors").select("*").eq('id',id)
        if(error !== null){
            return "Can't retrieve your profile"
        }
        const profile:UserProfile=data[0]

        return profile
    }



    //update profile
    async updateCounsellorProfile(details:CounsellorProfUpdate):Promise<string | boolean>{
        this.userId=await this.getUserId()
        if (this.userId === null || this.userId === undefined){
            return "Unauthenticated.Try to login first"
        }
        if(details.name !== null && details.name.length > 0 && details.phone_number !== null && details.phone_number?.length >=9){
            const {error}=await this.supabase.from("counsellors").update({
                        'name':details.name,
                        'phone_number':details.phone_number
                    }).eq('id',this.userId)
                    if (error){
                        return "Could not update name an phone number"
                    }
            return true
        
        
        }else if ( details.name !== null && details.name.length > 0){
            const {error}=await this.supabase.from("counsellors").update({
                        'name':details.name,
                    }).eq('id',this.userId)
                    if (error){
                        return `Could not update name.`
                    }
            return true
        }else if (details.phone_number?.length !== null){
        const {error}=await this.supabase.from("counsellors").update({
            'phone_number':details.phone_number
        }).eq('id',this.userId)
        if(error !== null){
            return "Could not update phone number"
        }
        return true
        
    }
    return "Could not update your profile"
}

}

export default Database;