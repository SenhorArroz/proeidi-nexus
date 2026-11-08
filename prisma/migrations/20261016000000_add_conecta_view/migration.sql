CREATE TABLE "ConectaEquipe" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "corInicial" TEXT NOT NULL DEFAULT '#0284c7',
    "corFinal" TEXT NOT NULL DEFAULT '#0284c7',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConectaEquipe_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ConectaItem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "pontos" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConectaItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ConectaDoacao" (
    "id" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "nomeDoador" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConectaDoacao_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ConectaDoacaoItem" (
    "id" TEXT NOT NULL,
    "doacaoId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pontosUnitarios" INTEGER NOT NULL,
    CONSTRAINT "ConectaDoacaoItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ConectaProva" (
    "id" TEXT NOT NULL,
    "semestreId" TEXT NOT NULL,
    "equipeId" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "pontos" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConectaProva_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ConectaEquipe_turmaId_key" ON "ConectaEquipe"("turmaId");
CREATE UNIQUE INDEX "ConectaItem_nome_key" ON "ConectaItem"("nome");
CREATE INDEX "ConectaDoacao_equipeId_createdAt_idx" ON "ConectaDoacao"("equipeId", "createdAt");
CREATE UNIQUE INDEX "ConectaDoacaoItem_doacaoId_itemId_key" ON "ConectaDoacaoItem"("doacaoId", "itemId");
CREATE INDEX "ConectaProva_semestreId_createdAt_idx" ON "ConectaProva"("semestreId", "createdAt");
ALTER TABLE "ConectaEquipe" ADD CONSTRAINT "ConectaEquipe_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConectaDoacao" ADD CONSTRAINT "ConectaDoacao_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "ConectaEquipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConectaDoacaoItem" ADD CONSTRAINT "ConectaDoacaoItem_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "ConectaDoacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConectaDoacaoItem" ADD CONSTRAINT "ConectaDoacaoItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConectaItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ConectaProva" ADD CONSTRAINT "ConectaProva_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConectaProva" ADD CONSTRAINT "ConectaProva_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "ConectaEquipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
