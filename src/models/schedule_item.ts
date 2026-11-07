interface ScheduleItem{
    time:string
    day:string
    date:number
    month:string
    year:number
    is_cancelled:boolean
}

interface StoredScheduleItem{
    id:number
    counsellor_id:string
    time:string
    day:string
    date:number
    month:string
    year:number
    is_cancelled:boolean
}

export type {ScheduleItem,StoredScheduleItem}