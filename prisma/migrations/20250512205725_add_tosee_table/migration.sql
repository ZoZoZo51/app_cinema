-- CreateTable
CREATE TABLE "ToSeeMovie" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "ToSeeMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToSeeMovie_userId_movieId_key" ON "ToSeeMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "ToSeeMovie" ADD CONSTRAINT "ToSeeMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToSeeMovie" ADD CONSTRAINT "ToSeeMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
