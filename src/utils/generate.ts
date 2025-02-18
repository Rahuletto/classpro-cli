import { execAsync } from "./execAsync.js";

export async function generateEncryptionKey(): Promise<string> {
    const { stdout } = await execAsync('openssl rand -hex 32');
    return stdout.trim();
}
