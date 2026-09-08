-- Additive change: existing and new classes default to 14 students.
ALTER TABLE "Turma" ADD COLUMN IF NOT EXISTS "limiteAlunos" INTEGER NOT NULL DEFAULT 14;
