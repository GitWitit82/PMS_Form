-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'CHECKLIST';

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "workflow_task_id" INTEGER;

-- AlterTable
ALTER TABLE "WorkflowTask" ADD COLUMN     "form_id" INTEGER,
ADD COLUMN     "has_form" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "WorkflowTask" ADD CONSTRAINT "WorkflowTask_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("form_id") ON DELETE SET NULL ON UPDATE CASCADE;
