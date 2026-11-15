-- CreateTable
CREATE TABLE "nastop" (
    "id" TEXT NOT NULL,
    "tekma_id" TEXT NOT NULL,
    "nogometas_id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL DEFAULT 0,
    "goli" INTEGER NOT NULL DEFAULT 0,
    "asistence" INTEGER NOT NULL DEFAULT 0,
    "avtogoli" INTEGER NOT NULL DEFAULT 0,
    "rumeni" INTEGER NOT NULL DEFAULT 0,
    "rdeci" INTEGER NOT NULL DEFAULT 0,
    "tocke" INTEGER,

    CONSTRAINT "nastop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nastop_nogometas_id_idx" ON "nastop"("nogometas_id");

-- CreateIndex
CREATE UNIQUE INDEX "nastop_tekma_id_nogometas_id_key" ON "nastop"("tekma_id", "nogometas_id");

-- AddForeignKey
ALTER TABLE "nastop" ADD CONSTRAINT "nastop_tekma_id_fkey" FOREIGN KEY ("tekma_id") REFERENCES "tekma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nastop" ADD CONSTRAINT "nastop_nogometas_id_fkey" FOREIGN KEY ("nogometas_id") REFERENCES "nogometas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
