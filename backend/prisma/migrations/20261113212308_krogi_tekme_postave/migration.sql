-- CreateEnum
CREATE TYPE "StatusTekme" AS ENUM ('napovedana', 'v_vnosu', 'potrjena');

-- CreateTable
CREATE TABLE "krog" (
    "id" TEXT NOT NULL,
    "stevilka" INTEGER NOT NULL,
    "rok" TIMESTAMP(3) NOT NULL,
    "obracunan" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "krog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tekma" (
    "id" TEXT NOT NULL,
    "krog_id" TEXT NOT NULL,
    "domaci_id" TEXT NOT NULL,
    "gostje_id" TEXT NOT NULL,
    "zacetek" TIMESTAMP(3) NOT NULL,
    "goli_domaci" INTEGER,
    "goli_gostje" INTEGER,
    "status" "StatusTekme" NOT NULL DEFAULT 'napovedana',
    "zunanji_id" INTEGER,

    CONSTRAINT "tekma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postava" (
    "id" TEXT NOT NULL,
    "mostvo_id" TEXT NOT NULL,
    "krog_id" TEXT NOT NULL,
    "nogometas_id" TEXT NOT NULL,
    "mesto" INTEGER NOT NULL,
    "kapetan" BOOLEAN NOT NULL DEFAULT false,
    "tocke" INTEGER,

    CONSTRAINT "postava_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "krog_stevilka_key" ON "krog"("stevilka");

-- CreateIndex
CREATE UNIQUE INDEX "tekma_zunanji_id_key" ON "tekma"("zunanji_id");

-- CreateIndex
CREATE INDEX "tekma_krog_id_idx" ON "tekma"("krog_id");

-- CreateIndex
CREATE INDEX "postava_krog_id_idx" ON "postava"("krog_id");

-- CreateIndex
CREATE INDEX "postava_nogometas_id_idx" ON "postava"("nogometas_id");

-- CreateIndex
CREATE UNIQUE INDEX "postava_mostvo_id_krog_id_nogometas_id_key" ON "postava"("mostvo_id", "krog_id", "nogometas_id");

-- CreateIndex
CREATE UNIQUE INDEX "postava_mostvo_id_krog_id_mesto_key" ON "postava"("mostvo_id", "krog_id", "mesto");

-- AddForeignKey
ALTER TABLE "tekma" ADD CONSTRAINT "tekma_krog_id_fkey" FOREIGN KEY ("krog_id") REFERENCES "krog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tekma" ADD CONSTRAINT "tekma_domaci_id_fkey" FOREIGN KEY ("domaci_id") REFERENCES "klub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tekma" ADD CONSTRAINT "tekma_gostje_id_fkey" FOREIGN KEY ("gostje_id") REFERENCES "klub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postava" ADD CONSTRAINT "postava_mostvo_id_fkey" FOREIGN KEY ("mostvo_id") REFERENCES "mostvo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postava" ADD CONSTRAINT "postava_krog_id_fkey" FOREIGN KEY ("krog_id") REFERENCES "krog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postava" ADD CONSTRAINT "postava_nogometas_id_fkey" FOREIGN KEY ("nogometas_id") REFERENCES "nogometas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
