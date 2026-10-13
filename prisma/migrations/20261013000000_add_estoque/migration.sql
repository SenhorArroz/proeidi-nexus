CREATE TABLE "CategoriaItemEstoque" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CategoriaItemEstoque_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ItemEstoque" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "validade" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ItemEstoque_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_CategoriaItemEstoqueToItemEstoque" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "CategoriaItemEstoque_nome_key" ON "CategoriaItemEstoque"("nome");
CREATE INDEX "ItemEstoque_nome_idx" ON "ItemEstoque"("nome");
CREATE INDEX "ItemEstoque_validade_idx" ON "ItemEstoque"("validade");
CREATE UNIQUE INDEX "_CategoriaItemEstoqueToItemEstoque_AB_unique" ON "_CategoriaItemEstoqueToItemEstoque"("A","B");
CREATE INDEX "_CategoriaItemEstoqueToItemEstoque_B_index" ON "_CategoriaItemEstoqueToItemEstoque"("B");
ALTER TABLE "_CategoriaItemEstoqueToItemEstoque" ADD CONSTRAINT "_CategoriaItemEstoqueToItemEstoque_A_fkey" FOREIGN KEY ("A") REFERENCES "CategoriaItemEstoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoriaItemEstoqueToItemEstoque" ADD CONSTRAINT "_CategoriaItemEstoqueToItemEstoque_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemEstoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
