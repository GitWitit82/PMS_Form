/*
  Warnings:

  - You are about to drop the column `created_by` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `is_template` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the `TransitionRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowStepInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransitionRule" DROP CONSTRAINT "TransitionRule_from_step_id_fkey";

-- DropForeignKey
ALTER TABLE "TransitionRule" DROP CONSTRAINT "TransitionRule_to_step_id_fkey";

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowInstance" DROP CONSTRAINT "WorkflowInstance_created_by_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowInstance" DROP CONSTRAINT "WorkflowInstance_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStepInstance" DROP CONSTRAINT "WorkflowStepInstance_step_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStepInstance" DROP CONSTRAINT "WorkflowStepInstance_workflow_instance_id_fkey";

-- DropIndex
DROP INDEX "Workflow_is_template_idx";

-- DropIndex
DROP INDEX "Workflow_status_idx";

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "created_by",
DROP COLUMN "is_template",
DROP COLUMN "status",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
DROP COLUMN "version";

-- DropTable
DROP TABLE "TransitionRule";

-- DropTable
DROP TABLE "WorkflowInstance";

-- DropTable
DROP TABLE "WorkflowStep";

-- DropTable
DROP TABLE "WorkflowStepInstance";

-- DropEnum
DROP TYPE "WorkflowStatus";

-- DropEnum
DROP TYPE "WorkflowStepType";

-- DropEnum
DROP TYPE "WorkflowTransitionType";

-- CreateTable
CREATE TABLE "WorkflowTask" (
    "workflow_task_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scheduled_start_time" TIMESTAMP(3),
    "scheduled_start_date" TIMESTAMP(3),
    "scheduled_end_time" TIMESTAMP(3),
    "scheduled_end_date" TIMESTAMP(3),
    "priority" TEXT,

    CONSTRAINT "WorkflowTask_pkey" PRIMARY KEY ("workflow_task_id")
);

-- AddForeignKey
ALTER TABLE "WorkflowTask" ADD CONSTRAINT "WorkflowTask_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;
