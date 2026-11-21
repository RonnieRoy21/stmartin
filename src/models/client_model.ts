interface AssignedCounsellor {
    name: string;
    phone_number: string;
}

interface ClientModel {
    id: string;
    name: string;
    age: number;
    gender: string;
    occupation: string;
    presenting_issue: string;
    counsellors: AssignedCounsellor[] | null;
}

export type { ClientModel };
