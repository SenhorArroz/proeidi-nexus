import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "../generated/prisma/index.js";

const scrypt = promisify(scryptCallback);
const db = new PrismaClient();

async function hashPassword(password) {
	const salt = randomBytes(16).toString("hex");
	const derived = await scrypt(password, salt, 64);
	return `scrypt$${salt}$${derived.toString("hex")}`;
}

const email = (process.env.COORDENADOR_EMAIL ?? "coordenador@proeidi.local").trim().toLowerCase();
const nome = (process.env.COORDENADOR_NOME ?? "Coordenador ProEIDI").trim();
const matricula = (process.env.COORDENADOR_MATRICULA ?? "COORDENADOR-001").trim();
const senha = process.env.COORDENADOR_SENHA;

if (!senha || senha.length < 10) {
	throw new Error("Defina COORDENADOR_SENHA com ao menos 10 caracteres antes de executar a seed.");
}

const senhaHash = await hashPassword(senha);
await db.user.upsert({
	where: { email },
	update: { nome, matricula, role: "COORDENADOR", senha: senhaHash },
	create: { nome, email, matricula, role: "COORDENADOR", senha: senhaHash },
});

console.log(`Coordenador provisionado: ${email}`);

const semestres = [];
for (let ano = 2026; ano <= 2099; ano += 1) {
	semestres.push({ codigo: `${ano}.1` }, { codigo: `${ano}.2` });
}

await db.semestre.createMany({ data: semestres, skipDuplicates: true });
const semestreAtivo = await db.semestre.findFirst({ where: { ativo: true }, select: { id: true } });
if (!semestreAtivo) {
	await db.semestre.update({ where: { codigo: "2026.1" }, data: { ativo: true } });
}

console.log(`Semestres provisionados: 2026.1 a 2099.2 (${semestres.length} períodos).`);
await db.$disconnect();
