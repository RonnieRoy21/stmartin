interface ScheduleItem {
  time: string;
  day: string;
  date: number;
  month: string;
  year: number;
  is_cancelled: boolean;
}

interface StoredScheduleItem {
  id: number;
  counsellor_id: string;
  time: string;
  day: string;
  date: number;
  month: string;
  year: number;
  is_cancelled: boolean;
  cancel_reason: string;
}
interface Counsellor {
  name: string;
}

interface SetSchedules {
  counsellors: Counsellor;
  day: string;
  date: number;
  time: string;
  month: string;
  year: number;
  is_cancelled: boolean;
  cancel_reason: string;
}
export type { ScheduleItem, StoredScheduleItem, SetSchedules };
