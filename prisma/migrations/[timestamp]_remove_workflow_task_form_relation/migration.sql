-- First drop the WorkflowTaskForm table and its relations
DROP TABLE IF EXISTS "WorkflowTaskForm";

-- Remove the has_form column from WorkflowTask
ALTER TABLE "WorkflowTask" DROP COLUMN IF EXISTS "has_form";

-- Remove the workflow_task_id from FormSubmission
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "workflow_task_id"; 