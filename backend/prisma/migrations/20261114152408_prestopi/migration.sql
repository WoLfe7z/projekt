-- CreateTable
CREATE TABLE "prestop" (
    "id" TEXT NOT NULL,
    "mostvo_id" TEXT NOT NULL,
    "krog_id" TEXT NOT NULL,
    "ven_id" TEXT NOT NULL,
    "noter_id" TEXT NOT NULL,
    "brezplacen" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prestop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prestop_mostvo_id_krog_id_idx" ON "prestop"("mostvo_id", "krog_id");

-- AddForeignKey
ALTER TABLE "prestop" ADD CONSTRAINT "prestop_mostvo_id_fkey" FOREIGN KEY ("mostvo_id") REFERENCES "mostvo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestop" ADD CONSTRAINT "prestop_krog_id_fkey" FOREIGN KEY ("krog_id") REFERENCES "krog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestop" ADD CONSTRAINT "prestop_ven_id_fkey" FOREIGN KEY ("ven_id") REFERENCES "nogometas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestop" ADD CONSTRAINT "prestop_noter_id_fkey" FOREIGN KEY ("noter_id") REFERENCES "nogometas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
