-- CreateEnum
CREATE TYPE "Pozicija" AS ENUM ('VR', 'OB', 'VE', 'NA');

-- CreateEnum
CREATE TYPE "StatusNogometasa" AS ENUM ('na_voljo', 'poskodovan', 'kaznovan');

-- CreateTable
CREATE TABLE "klub" (
    "id" TEXT NOT NULL,
    "naziv" TEXT NOT NULL,
    "kratica" TEXT NOT NULL,

    CONSTRAINT "klub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nogometas" (
    "id" TEXT NOT NULL,
    "klub_id" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "priimek" TEXT NOT NULL,
    "pozicija" "Pozicija" NOT NULL,
    "cena" DECIMAL(4,1) NOT NULL,
    "status" "StatusNogometasa" NOT NULL DEFAULT 'na_voljo',
    "zunanji_id" INTEGER,

    CONSTRAINT "nogometas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mostvo" (
    "id" TEXT NOT NULL,
    "uporabnik_id" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "proracun" DECIMAL(4,1) NOT NULL DEFAULT 100.0,
    "skupne_tocke" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mostvo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mostvo_nogometas" (
    "mostvo_id" TEXT NOT NULL,
    "nogometas_id" TEXT NOT NULL,

    CONSTRAINT "mostvo_nogometas_pkey" PRIMARY KEY ("mostvo_id","nogometas_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "klub_naziv_key" ON "klub"("naziv");

-- CreateIndex
CREATE UNIQUE INDEX "klub_kratica_key" ON "klub"("kratica");

-- CreateIndex
CREATE UNIQUE INDEX "nogometas_zunanji_id_key" ON "nogometas"("zunanji_id");

-- CreateIndex
CREATE INDEX "nogometas_klub_id_idx" ON "nogometas"("klub_id");

-- CreateIndex
CREATE UNIQUE INDEX "mostvo_uporabnik_id_key" ON "mostvo"("uporabnik_id");

-- CreateIndex
CREATE INDEX "mostvo_nogometas_nogometas_id_idx" ON "mostvo_nogometas"("nogometas_id");

-- AddForeignKey
ALTER TABLE "nogometas" ADD CONSTRAINT "nogometas_klub_id_fkey" FOREIGN KEY ("klub_id") REFERENCES "klub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mostvo" ADD CONSTRAINT "mostvo_uporabnik_id_fkey" FOREIGN KEY ("uporabnik_id") REFERENCES "uporabnik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mostvo_nogometas" ADD CONSTRAINT "mostvo_nogometas_mostvo_id_fkey" FOREIGN KEY ("mostvo_id") REFERENCES "mostvo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mostvo_nogometas" ADD CONSTRAINT "mostvo_nogometas_nogometas_id_fkey" FOREIGN KEY ("nogometas_id") REFERENCES "nogometas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
