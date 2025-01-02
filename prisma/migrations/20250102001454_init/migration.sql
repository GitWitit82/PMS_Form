/*
  Warnings:

  - A unique constraint covering the columns `[workflow_id]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "workflow_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "projects_workflow_id_key" ON "projects"("workflow_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE SET NULL ON UPDATE CASCADE;
