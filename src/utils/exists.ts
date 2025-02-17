import { promises as fs } from 'fs';

export async function checkFoldersExist(): Promise<boolean> {
    try {
        await fs.access('frontend');
        await fs.access('backend');
        return true;
    } catch {
        return false;
    }
}