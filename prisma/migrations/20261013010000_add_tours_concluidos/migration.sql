CREATE TABLE "TourConcluido" (
    "userId" TEXT NOT NULL,
    "tela" TEXT NOT NULL,
    "concluidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TourConcluido_pkey" PRIMARY KEY ("userId","tela")
);

ALTER TABLE "TourConcluido" ADD CONSTRAINT "TourConcluido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
