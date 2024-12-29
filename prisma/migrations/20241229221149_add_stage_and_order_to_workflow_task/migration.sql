/*
  Warnings:

  - Added the required column `order` to the `WorkflowTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkflowTask" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "stage" TEXT;
