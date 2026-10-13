-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COORDENADOR', 'DIRETOR', 'PROFESSOR', 'MONITOR');

-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('LINK', 'PDF', 'SLIDE', 'IMAGEM');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('AULA', 'FERIADO', 'CANCELADA', 'ESPECIAL');

-- CreateEnum
CREATE TYPE "EstadoPresenca" AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADO');

-- CreateEnum
CREATE TYPE "CursoSorteio" AS ENUM ('SMARTPHONE', 'COMPUTADOR');

-- CreateEnum
CREATE TYPE "TipoPergunta" AS ENUM ('SHORT_TEXT', 'PARAGRAPH', 'MULTIPLE_CHOICE', 'CHECKBOX');

-- CreateEnum
CREATE TYPE "StatusMatricula" AS ENUM ('ATIVO', 'CONCLUIDO', 'DESISTENTE', 'TRANSFERIDO');

-- CreateEnum
CREATE TYPE "ModoRespostaFormulario" AS ENUM ('ANONIMO', 'IDENTIFICADO_POR_COOKIE');

-- CreateEnum
CREATE TYPE "VisibilidadeFormulario" AS ENUM ('COMPARTILHADO', 'DIRETORIA');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "senhaAlteradaEm" TIMESTAMP(3),
    "matricula" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "codigoHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semestre" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemanaImpressao" (
    "id" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataAula" TIMESTAMP(3),
    "aulaRealizada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemanaImpressao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApostilaImpressao" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "dataEntrega" TIMESTAMP(3),
    "pronta" BOOLEAN NOT NULL DEFAULT false,
    "impressa" BOOLEAN NOT NULL DEFAULT false,
    "qtdImpressa" INTEGER NOT NULL DEFAULT 0,
    "qtdAlvo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApostilaImpressao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsavelApostila" (
    "apostilaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResponsavelApostila_pkey" PRIMARY KEY ("apostilaId","userId")
);

-- CreateTable
CREATE TABLE "MaterialAtualizacao" (
    "id" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataEntrega" TIMESTAMP(3),
    "revisado" BOOLEAN NOT NULL DEFAULT false,
    "precisaAjuste" BOOLEAN NOT NULL DEFAULT false,
    "ajustado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialAtualizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsavelMaterialAtualizacao" (
    "materialId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResponsavelMaterialAtualizacao_pkey" PRIMARY KEY ("materialId","userId")
);

-- CreateTable
CREATE TABLE "Turma" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "sala" TEXT,
    "horario" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#1A73E8',
    "corDestaque" TEXT NOT NULL DEFAULT '#ea580c',
    "corFundo" TEXT NOT NULL DEFAULT '#f8fafc',
    "corTexto" TEXT NOT NULL DEFAULT '#0f172a',
    "corTitulo" TEXT NOT NULL DEFAULT '#ffffff',
    "corDescricao" TEXT NOT NULL DEFAULT '#64748b',
    "fonte" TEXT NOT NULL DEFAULT 'SANS',
    "semestreId" TEXT NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorTurma" (
    "userId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "ProfessorTurma_pkey" PRIMARY KEY ("userId","turmaId")
);

-- CreateTable
CREATE TABLE "MonitorTurma" (
    "userId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "MonitorTurma_pkey" PRIMARY KEY ("userId","turmaId")
);

-- CreateTable
CREATE TABLE "AlunoTurma" (
    "alunoId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "AlunoTurma_pkey" PRIMARY KEY ("alunoId","turmaId")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "alunoOrigemId" TEXT,
    "etapaTrilha" TEXT,
    "statusMatricula" "StatusMatricula" NOT NULL DEFAULT 'ATIVO',
    "corRaca" TEXT NOT NULL,
    "identidadeGenero" TEXT NOT NULL,
    "lgbtqiapn" TEXT NOT NULL,
    "telefone" TEXT,
    "contatoEmergencia" TEXT,
    "email" TEXT,
    "escolaridade" TEXT NOT NULL,
    "cuidaTerceiros" BOOLEAN NOT NULL DEFAULT false,
    "trabalha" BOOLEAN NOT NULL DEFAULT false,
    "trabalhoLocal" TEXT,
    "trabalhoFuncao" TEXT,
    "estuda" BOOLEAN NOT NULL DEFAULT false,
    "estudoLocal" TEXT,
    "estudoCurso" TEXT,
    "problemaSaude" BOOLEAN NOT NULL DEFAULT false,
    "problemaSaudeQual" TEXT,
    "necessidadeEspecial" BOOLEAN NOT NULL DEFAULT false,
    "necessidadeEspecialQual" TEXT,
    "acessoInternet" BOOLEAN NOT NULL DEFAULT false,
    "temComputador" BOOLEAN NOT NULL DEFAULT false,
    "temSmartphone" BOOLEAN NOT NULL DEFAULT false,
    "sistemaSmartphone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoEquipeSemestre" (
    "userId" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,

    CONSTRAINT "VinculoEquipeSemestre_pkey" PRIMARY KEY ("userId","semestreId")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoMaterial" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoCalendario" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoEvento" NOT NULL,

    CONSTRAINT "EventoCalendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aviso" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "linkUrl" TEXT,
    "fixado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aviso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anotacao" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anotacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroPresenca" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistroPresenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresencaAluno" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "estado" "EstadoPresenca" NOT NULL,

    CONSTRAINT "PresencaAluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresencaMonitor" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "estado" "EstadoPresenca" NOT NULL,

    CONSTRAINT "PresencaMonitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresencaProfessor" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "estado" "EstadoPresenca" NOT NULL,

    CONSTRAINT "PresencaProfessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,
    "ficha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "emergencia" TEXT NOT NULL,
    "curso" "CursoSorteio" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formulario" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "slug" TEXT NOT NULL,
    "conteudo" JSONB NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "modoResposta" "ModoRespostaFormulario" NOT NULL DEFAULT 'ANONIMO',
    "limitarPorNavegador" BOOLEAN NOT NULL DEFAULT false,
    "configuracao" JSONB,
    "visibilidade" "VisibilidadeFormulario" NOT NULL DEFAULT 'COMPARTILHADO',
    "autorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormularioResposta" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "nomeRespondente" TEXT,
    "identificadorCookie" TEXT,
    "pontuacao" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormularioResposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoPergunta" NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Pergunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcao" (
    "id" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Opcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_matricula_key" ON "User"("matricula");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_userId_expiresAt_idx" ON "PasswordResetRequest"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_requestedById_idx" ON "PasswordResetRequest"("requestedById");

-- CreateIndex
CREATE UNIQUE INDEX "Semestre_codigo_key" ON "Semestre"("codigo");

-- CreateIndex
CREATE INDEX "SemanaImpressao_semestreId_idx" ON "SemanaImpressao"("semestreId");

-- CreateIndex
CREATE UNIQUE INDEX "SemanaImpressao_semestreId_numero_key" ON "SemanaImpressao"("semestreId", "numero");

-- CreateIndex
CREATE INDEX "ApostilaImpressao_semanaId_idx" ON "ApostilaImpressao"("semanaId");

-- CreateIndex
CREATE INDEX "ResponsavelApostila_userId_idx" ON "ResponsavelApostila"("userId");

-- CreateIndex
CREATE INDEX "MaterialAtualizacao_semestreId_idx" ON "MaterialAtualizacao"("semestreId");

-- CreateIndex
CREATE INDEX "ResponsavelMaterialAtualizacao_userId_idx" ON "ResponsavelMaterialAtualizacao"("userId");

-- CreateIndex
CREATE INDEX "Turma_semestreId_idx" ON "Turma"("semestreId");

-- CreateIndex
CREATE INDEX "Aluno_semestreId_idx" ON "Aluno"("semestreId");

-- CreateIndex
CREATE INDEX "Aluno_cpf_idx" ON "Aluno"("cpf");

-- CreateIndex
CREATE INDEX "Aluno_alunoOrigemId_idx" ON "Aluno"("alunoOrigemId");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpf_semestreId_key" ON "Aluno"("cpf", "semestreId");

-- CreateIndex
CREATE INDEX "VinculoEquipeSemestre_semestreId_idx" ON "VinculoEquipeSemestre"("semestreId");

-- CreateIndex
CREATE INDEX "Material_turmaId_idx" ON "Material"("turmaId");

-- CreateIndex
CREATE INDEX "EventoCalendario_turmaId_data_idx" ON "EventoCalendario"("turmaId", "data");

-- CreateIndex
CREATE INDEX "Aviso_turmaId_idx" ON "Aviso"("turmaId");

-- CreateIndex
CREATE INDEX "Anotacao_turmaId_idx" ON "Anotacao"("turmaId");

-- CreateIndex
CREATE INDEX "RegistroPresenca_turmaId_idx" ON "RegistroPresenca"("turmaId");

-- CreateIndex
CREATE UNIQUE INDEX "RegistroPresenca_turmaId_data_key" ON "RegistroPresenca"("turmaId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "PresencaAluno_registroId_alunoId_key" ON "PresencaAluno"("registroId", "alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "PresencaMonitor_registroId_monitorId_key" ON "PresencaMonitor"("registroId", "monitorId");

-- CreateIndex
CREATE UNIQUE INDEX "PresencaProfessor_registroId_professorId_key" ON "PresencaProfessor"("registroId", "professorId");

-- CreateIndex
CREATE INDEX "Candidato_semestreId_idx" ON "Candidato"("semestreId");

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_slug_key" ON "Formulario"("slug");

-- CreateIndex
CREATE INDEX "Formulario_visibilidade_updatedAt_idx" ON "Formulario"("visibilidade", "updatedAt");

-- CreateIndex
CREATE INDEX "Formulario_autorId_idx" ON "Formulario"("autorId");

-- CreateIndex
CREATE INDEX "FormularioResposta_formularioId_createdAt_idx" ON "FormularioResposta"("formularioId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FormularioResposta_formularioId_identificadorCookie_key" ON "FormularioResposta"("formularioId", "identificadorCookie");

-- CreateIndex
CREATE INDEX "Pergunta_formularioId_idx" ON "Pergunta"("formularioId");

-- CreateIndex
CREATE INDEX "Opcao_perguntaId_idx" ON "Opcao"("perguntaId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemanaImpressao" ADD CONSTRAINT "SemanaImpressao_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApostilaImpressao" ADD CONSTRAINT "ApostilaImpressao_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "SemanaImpressao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsavelApostila" ADD CONSTRAINT "ResponsavelApostila_apostilaId_fkey" FOREIGN KEY ("apostilaId") REFERENCES "ApostilaImpressao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsavelApostila" ADD CONSTRAINT "ResponsavelApostila_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialAtualizacao" ADD CONSTRAINT "MaterialAtualizacao_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsavelMaterialAtualizacao" ADD CONSTRAINT "ResponsavelMaterialAtualizacao_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "MaterialAtualizacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsavelMaterialAtualizacao" ADD CONSTRAINT "ResponsavelMaterialAtualizacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorTurma" ADD CONSTRAINT "ProfessorTurma_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorTurma" ADD CONSTRAINT "ProfessorTurma_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorTurma" ADD CONSTRAINT "MonitorTurma_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorTurma" ADD CONSTRAINT "MonitorTurma_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunoTurma" ADD CONSTRAINT "AlunoTurma_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunoTurma" ADD CONSTRAINT "AlunoTurma_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_alunoOrigemId_fkey" FOREIGN KEY ("alunoOrigemId") REFERENCES "Aluno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoEquipeSemestre" ADD CONSTRAINT "VinculoEquipeSemestre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoEquipeSemestre" ADD CONSTRAINT "VinculoEquipeSemestre_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoCalendario" ADD CONSTRAINT "EventoCalendario_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anotacao" ADD CONSTRAINT "Anotacao_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anotacao" ADD CONSTRAINT "Anotacao_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroPresenca" ADD CONSTRAINT "RegistroPresenca_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaAluno" ADD CONSTRAINT "PresencaAluno_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "RegistroPresenca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaAluno" ADD CONSTRAINT "PresencaAluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaMonitor" ADD CONSTRAINT "PresencaMonitor_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "RegistroPresenca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaMonitor" ADD CONSTRAINT "PresencaMonitor_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaProfessor" ADD CONSTRAINT "PresencaProfessor_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "RegistroPresenca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaProfessor" ADD CONSTRAINT "PresencaProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formulario" ADD CONSTRAINT "Formulario_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormularioResposta" ADD CONSTRAINT "FormularioResposta_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pergunta" ADD CONSTRAINT "Pergunta_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcao" ADD CONSTRAINT "Opcao_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
