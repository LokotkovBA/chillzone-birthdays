import { env } from '@/utils/env';
import ky from 'ky';
import { z } from 'zod';

const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    birthday: z.string().optional().nullable(),
    discord: z.string().optional().nullable(),
    join: z.string().optional().nullable(),
});

export type User = z.infer<typeof userSchema>;

const responseSchema = z.array(userSchema);

const API_URL = env.VITE_API_URL;

export async function getUsersByMonth(month: number) {
    const bdays = responseSchema.parse(await (await ky.get(`${API_URL}/users/${month}`)).json());

    return bdays;
}

export async function addUser(user: User) {
    try {
        return userSchema.parse(await ky.post(`${API_URL}/user`, { json: user }));
    } catch (e) {
        console.error(e);
    }
}

export async function editUser(user: User) {
    try {
        if (!user.id) throw Error('No user id');

        return userSchema.parse(await ky.patch(`${API_URL}/user/${user.id}`, { json: user }));
    } catch (e) {
        console.error(e);
    }
}

export async function deleteUser(id: number) {
    try {
        return await ky.delete(`${API_URL}/user/${id}`);
    } catch (e) {
        console.error(e);
    }
}
