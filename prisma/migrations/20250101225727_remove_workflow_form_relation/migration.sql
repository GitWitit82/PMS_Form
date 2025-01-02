/*
  Warnings:

  - You are about to drop the column `form_id` on the `WorkflowTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowTask" DROP CONSTRAINT "WorkflowTask_form_id_fkey";

-- AlterTable
ALTER TABLE "WorkflowTask" DROP COLUMN "form_id";
