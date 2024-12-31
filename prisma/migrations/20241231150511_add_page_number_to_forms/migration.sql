/*
  Warnings:

  - You are about to drop the `WorkflowTaskForm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowTaskForm" DROP CONSTRAINT "WorkflowTaskForm_form_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowTaskForm" DROP CONSTRAINT "WorkflowTaskForm_workflow_task_id_fkey";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "page" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "WorkflowTask" ADD COLUMN     "actual_end" TIMESTAMP(3),
ADD COLUMN     "actual_start" TIMESTAMP(3),
ADD COLUMN     "estimated_duration" INTEGER,
ADD COLUMN     "form_id" INTEGER,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "WorkflowTaskForm";

-- CreateTable
CREATE TABLE "WorkflowVersion" (
    "version_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "version_number" INTEGER NOT NULL,
    "changes" JSONB NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkflowVersion_pkey" PRIMARY KEY ("version_id")
);

-- CreateTable
CREATE TABLE "WorkflowProgress" (
    "progress_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "total_tasks" INTEGER NOT NULL DEFAULT 0,
    "completed_tasks" INTEGER NOT NULL DEFAULT 0,
    "in_progress_tasks" INTEGER NOT NULL DEFAULT 0,
    "blocked_tasks" INTEGER NOT NULL DEFAULT 0,
    "overall_progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimated_completion" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowProgress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "dependency_id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "dependent_task_id" INTEGER NOT NULL,
    "dependency_type" TEXT NOT NULL,
    "lag_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("dependency_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVersion_workflow_id_version_number_key" ON "WorkflowVersion"("workflow_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowProgress_workflow_id_key" ON "WorkflowProgress"("workflow_id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_task_id_dependent_task_id_key" ON "TaskDependency"("task_id", "dependent_task_id");

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowProgress" ADD CONSTRAINT "WorkflowProgress_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "WorkflowTask"("workflow_task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependent_task_id_fkey" FOREIGN KEY ("dependent_task_id") REFERENCES "WorkflowTask"("workflow_task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTask" ADD CONSTRAINT "WorkflowTask_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("form_id") ON DELETE SET NULL ON UPDATE CASCADE;
