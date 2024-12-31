/*
  Warnings:

  - You are about to drop the column `form_id` on the `WorkflowTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowTask" DROP CONSTRAINT "WorkflowTask_form_id_fkey";

-- AlterTable
ALTER TABLE "WorkflowTask" DROP COLUMN "form_id";

-- CreateTable
CREATE TABLE "WorkflowTaskForm" (
    "workflow_task_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowTaskForm_pkey" PRIMARY KEY ("workflow_task_id","form_id")
);

-- CreateIndex
CREATE INDEX "WorkflowTaskForm_workflow_task_id_idx" ON "WorkflowTaskForm"("workflow_task_id");

-- CreateIndex
CREATE INDEX "WorkflowTaskForm_form_id_idx" ON "WorkflowTaskForm"("form_id");

-- AddForeignKey
ALTER TABLE "WorkflowTaskForm" ADD CONSTRAINT "WorkflowTaskForm_workflow_task_id_fkey" FOREIGN KEY ("workflow_task_id") REFERENCES "WorkflowTask"("workflow_task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTaskForm" ADD CONSTRAINT "WorkflowTaskForm_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("form_id") ON DELETE CASCADE ON UPDATE CASCADE;
