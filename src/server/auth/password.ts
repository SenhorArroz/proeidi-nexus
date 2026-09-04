import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import bcrypt from "bcryptjs";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, stored: string) {
	if (stored.startsWith("$2")) return bcrypt.compare(password, stored);

	// Mantém o acesso das contas existentes até a próxima troca de senha.
	const [algorithm, salt, encoded] = stored.split("$");
	if (algorithm !== "scrypt" || !salt || !encoded) return false;
	const expected = Buffer.from(encoded, "hex");
	const actual = (await scrypt(password, salt, expected.length)) as Buffer;
	return expected.length === actual.length && timingSafeEqual(expected, actual);
}
