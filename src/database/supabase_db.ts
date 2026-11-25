import type { ScheduleItem, StoredScheduleItem } from '../models/schedule_item';
import type { CounsellorProfUpdate } from '../models/counsellor_model';
import { supabaseClient } from './supabaseConfig';
import type { UserProfile } from '../models/profile_model';
import type { EventItem } from '../models/event_model';
import type { ClientModel } from '../models/client_model';

class Database {
    private supabase = supabaseClient;
    private userId: string | null = null;
    private userIdPromise: Promise<string | null> | null = null;

    constructor() {}

    async logoutUser(): Promise<string | boolean> {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            return 'Sign out Failed';
        }
        return true;
    }
    async getUserId(): Promise<string | null> {
        if (this.userId !== null) {
            return this.userId;
        }

        if (this.userIdPromise !== null) {
            return this.userIdPromise;
        }

        this.userIdPromise = (async () => {
            try {
                const { data, error } = await this.supabase.auth.getUser();

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

    async getEvents(): Promise<EventItem[] | string> {
        try {
            const { data, error } = await this.supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });
            if (error) {
                return 'Error getting events.Try again later.';
            }
            var rows: EventItem[] = data;

            return rows;
        } catch (err) {
            return 'Something went wrong.Try again later.';
        }
    }

    async getToken(): Promise<boolean | string> {
        try {
            const { data, error } = await this.supabase.auth.getSession();
            if (error) {
                return false;
            }
            if (data.session !== null) {
                const token: string = data.session.access_token;
                return token;
            }
            return false;
        } catch (err) {
            return false;
        }
    }

    //sign up
    async createAccount(
        details: { email: string; phone_number: string; name: string },
        passwd: string
    ): Promise<string | boolean> {
        const { error } = await this.supabase.auth.signUp({
            email: details.email,
            password: passwd,
        });

        if (error === null) {
            const { error } = await this.supabase
                .from('counsellors')
                .insert({
                    name: details.name,
                    email: details.email,
                    phone_number: details.phone_number,
                })
                .select();
            if (error !== null) {
                return error.message;
            }
            return true;
        } else {
            return error.message;
        }
    }

    //login
    async loginCounsellor(
        cEmail: string,
        cPassword: string
    ): Promise<string | boolean> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: cEmail,
            password: cPassword,
        });
        if (error !== null) {
            return 'Unable to login.' + error.message;
        }
        this.userId = data.user.id;

        return this.userId !== null;
    }

    //fetch schedules
    async getSchedules(): Promise<StoredScheduleItem[] | string> {
        await this.getUserId();
        var rows: Array<StoredScheduleItem> = [];
        const { data, error } = await this.supabase
            .from('schedules')
            .select('*')
            .order('month', { ascending: true })
            .order('date', { ascending: true })
            .order('time', { ascending: true })
            .eq('counsellor_id', this.userId);
        if (error === null) {
            rows = data;
            return rows;
        } else {
            return 'Error fetching your schedules.';
        }
    }

    //post schedule
    async postSchedule(schedules: ScheduleItem[]): Promise<string | boolean> {
        this.userId = await this.getUserId();

        console.log(schedules);

        const { error } = await this.supabase
            .from('schedules')
            .insert(schedules)
            .eq('counsellor_id', this.userId);
        if (error === null) {
            return true;
        } else {
            console.log(error);

            return error.message;
        }
    }

    //cancel a schedule
    async cancelSchedule(
        scheduleId: number,
        reason: string
    ): Promise<string | boolean> {
        const id = await this.getUserId();
        if (id === null || id === undefined) {
            return 'Unauthenticated.Try to login first';
        }
        const { error } = await this.supabase
            .from('schedules')
            .update({ is_cancelled: true, cancel_reason: reason })
            .eq('id', scheduleId)
            .eq('counsellor_id', id);
        if (error !== null) {
            return 'Failed.Schedule NOT cancelled';
        }
        return true;
    }

    //fetch single counsellor
    async fetchCounsellorById(): Promise<string | UserProfile> {
        const id = await this.getUserId();
        if (id === null || id === undefined) {
            return 'Unauthenticated.Try to login first';
        }
        const { data, error } = await this.supabase
            .from('counsellors')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return "Can't retrieve your profile";
        }
        const profile: UserProfile = data;

        return profile;
    }

    //update profile
    async updateCounsellorProfile(
        details: CounsellorProfUpdate
    ): Promise<string> {
        this.userId = await this.getUserId();
        if (this.userId === null || this.userId === undefined) {
            return 'Unauthenticated.Try to login first';
        }
        if (details.photo !== null) {
            //update with photo
            var publicUrl: string = '';
            const { data, error } = await this.supabase.storage
                .from('profile_photos')
                .upload(`${this.userId}/${details.photo.name}`, details.photo, {
                    upsert: true,
                });
            if (error) {
                return 'unable to upload profile photo';
            }

            const response = this.supabase.storage
                .from('profile_photos')
                .getPublicUrl(data.path);

            publicUrl = response.data.publicUrl;
            const res = await this.supabase
                .from('counsellors')
                .update({
                    name: details.name,
                    phone_number: details.phone_number,
                    profile_photo_url: publicUrl,
                })
                .eq('id', this.userId);
            if (res.error) {
                return 'Unable to update profile';
            }
            return 'Profile updated';
        } else {
            //update without photo
            const { error } = await this.supabase
                .from('counsellors')
                .update({
                    name: details.name,
                    phone_number: details.phone_number,
                })
                .eq('id', this.userId);
            if (error) {
                console.log(error);

                return 'Profile not Updated.Server Error';
            }

            return 'Profile updated';
        }
    }

    async counsellorViewClients() {
        try {
            this.userId = await this.getUserId();
            const { data, error } = await this.supabase
                .from('clients')
                .select(
                    `id,name,age,gender,occupation,presenting_issue,counsellors(name,phone_number)`
                )
                .or(
                    `assigned_counsellor_id.eq.${this.userId},assigned_counsellor_id.is.null`
                );
            if (error) {
                return 'Failed to retrieve clients';
            }
            console.log(data);

            return data;
        } catch (err) {
            return String(err);
        }
    }
    async assignCounsellor(client: ClientModel) {
        try {
            const id = await this.getUserId();
            const { data, error } = await this.supabase
                .from('clients')
                .update({ assigned_counsellor_id: id })
                .eq('id', client.id)
                .select('*');
            if (error) {
                return 'Error occured.';
            }
            if (data.length > 0) {
                return 'Congratulations,you have been assigned a new client';
            }
            return 'Unable to assign you the selected client';
        } catch (err) {
            return String(err);
        }
    }
}

export default Database;
