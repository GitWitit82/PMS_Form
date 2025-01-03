/*
  Warnings:

  - You are about to drop the column `workflow_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskDependency" DROP CONSTRAINT "TaskDependency_dependent_task_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskDependency" DROP CONSTRAINT "TaskDependency_task_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowProgress" DROP CONSTRAINT "WorkflowProgress_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowTask" DROP CONSTRAINT "WorkflowTask_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowVersion" DROP CONSTRAINT "WorkflowVersion_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_workflow_id_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "workflow_id";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "Workflow";

-- DropTable
DROP TABLE "WorkflowTask";

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "order" INTEGER NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "department_id" INTEGER,
    "resource_id" INTEGER,
    "scheduled_start_time" TIMESTAMP(3),
    "scheduled_start_date" TIMESTAMP(3),
    "scheduled_end_time" TIMESTAMP(3),
    "scheduled_end_date" TIMESTAMP(3),
    "actual_start" TIMESTAMP(3),
    "actual_end" TIMESTAMP(3),
    "priority" TEXT,
    "stage" TEXT,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimated_duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "workflow_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("workflow_id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("workflow_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resource"("resource_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowProgress" ADD CONSTRAINT "WorkflowProgress_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependent_task_id_fkey" FOREIGN KEY ("dependent_task_id") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;
