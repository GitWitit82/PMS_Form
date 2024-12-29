/*
  Warnings:

  - You are about to drop the `WorkflowTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_definitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_step_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_transition_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_transitions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "WorkflowStepType" AS ENUM ('TASK', 'APPROVAL', 'NOTIFICATION', 'CONDITION', 'INTEGRATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "WorkflowTransitionType" AS ENUM ('AUTOMATIC', 'MANUAL', 'CONDITIONAL', 'SCHEDULED');

-- DropForeignKey
ALTER TABLE "WorkflowTask" DROP CONSTRAINT "WorkflowTask_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_definitions" DROP CONSTRAINT "workflow_definitions_created_by_fkey";

-- DropForeignKey
ALTER TABLE "workflow_definitions" DROP CONSTRAINT "workflow_definitions_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "workflow_instances" DROP CONSTRAINT "workflow_instances_created_by_fkey";

-- DropForeignKey
ALTER TABLE "workflow_instances" DROP CONSTRAINT "workflow_instances_current_step_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_instances" DROP CONSTRAINT "workflow_instances_workflow_definition_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_step_instances" DROP CONSTRAINT "workflow_step_instances_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "workflow_step_instances" DROP CONSTRAINT "workflow_step_instances_step_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_step_instances" DROP CONSTRAINT "workflow_step_instances_workflow_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_steps" DROP CONSTRAINT "workflow_steps_workflow_definition_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transition_instances" DROP CONSTRAINT "workflow_transition_instances_transition_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transition_instances" DROP CONSTRAINT "workflow_transition_instances_triggered_by_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transition_instances" DROP CONSTRAINT "workflow_transition_instances_workflow_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transitions" DROP CONSTRAINT "workflow_transitions_from_step_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transitions" DROP CONSTRAINT "workflow_transitions_to_step_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_transitions" DROP CONSTRAINT "workflow_transitions_workflow_definition_id_fkey";

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" INTEGER NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "WorkflowTask";

-- DropTable
DROP TABLE "workflow_definitions";

-- DropTable
DROP TABLE "workflow_instances";

-- DropTable
DROP TABLE "workflow_step_instances";

-- DropTable
DROP TABLE "workflow_steps";

-- DropTable
DROP TABLE "workflow_transition_instances";

-- DropTable
DROP TABLE "workflow_transitions";

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "step_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "step_type" "WorkflowStepType" NOT NULL,
    "order" INTEGER NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("step_id")
);

-- CreateTable
CREATE TABLE "TransitionRule" (
    "rule_id" SERIAL NOT NULL,
    "from_step_id" INTEGER NOT NULL,
    "to_step_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "WorkflowTransitionType" NOT NULL,
    "conditions" JSONB NOT NULL DEFAULT '{}',
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitionRule_pkey" PRIMARY KEY ("rule_id")
);

-- CreateTable
CREATE TABLE "WorkflowInstance" (
    "instance_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "WorkflowInstance_pkey" PRIMARY KEY ("instance_id")
);

-- CreateTable
CREATE TABLE "WorkflowStepInstance" (
    "instance_id" SERIAL NOT NULL,
    "workflow_instance_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "result" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "WorkflowStepInstance_pkey" PRIMARY KEY ("instance_id")
);

-- CreateIndex
CREATE INDEX "WorkflowStep_workflow_id_order_idx" ON "WorkflowStep"("workflow_id", "order");

-- CreateIndex
CREATE INDEX "WorkflowStep_step_type_idx" ON "WorkflowStep"("step_type");

-- CreateIndex
CREATE INDEX "TransitionRule_from_step_id_idx" ON "TransitionRule"("from_step_id");

-- CreateIndex
CREATE INDEX "TransitionRule_to_step_id_idx" ON "TransitionRule"("to_step_id");

-- CreateIndex
CREATE INDEX "TransitionRule_type_idx" ON "TransitionRule"("type");

-- CreateIndex
CREATE INDEX "WorkflowInstance_workflow_id_idx" ON "WorkflowInstance"("workflow_id");

-- CreateIndex
CREATE INDEX "WorkflowInstance_status_idx" ON "WorkflowInstance"("status");

-- CreateIndex
CREATE INDEX "WorkflowInstance_created_by_idx" ON "WorkflowInstance"("created_by");

-- CreateIndex
CREATE INDEX "WorkflowStepInstance_workflow_instance_id_idx" ON "WorkflowStepInstance"("workflow_instance_id");

-- CreateIndex
CREATE INDEX "WorkflowStepInstance_step_id_idx" ON "WorkflowStepInstance"("step_id");

-- CreateIndex
CREATE INDEX "WorkflowStepInstance_status_idx" ON "WorkflowStepInstance"("status");

-- CreateIndex
CREATE INDEX "Workflow_status_idx" ON "Workflow"("status");

-- CreateIndex
CREATE INDEX "Workflow_is_template_idx" ON "Workflow"("is_template");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitionRule" ADD CONSTRAINT "TransitionRule_from_step_id_fkey" FOREIGN KEY ("from_step_id") REFERENCES "WorkflowStep"("step_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitionRule" ADD CONSTRAINT "TransitionRule_to_step_id_fkey" FOREIGN KEY ("to_step_id") REFERENCES "WorkflowStep"("step_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowInstance" ADD CONSTRAINT "WorkflowInstance_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow"("workflow_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowInstance" ADD CONSTRAINT "WorkflowInstance_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStepInstance" ADD CONSTRAINT "WorkflowStepInstance_workflow_instance_id_fkey" FOREIGN KEY ("workflow_instance_id") REFERENCES "WorkflowInstance"("instance_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStepInstance" ADD CONSTRAINT "WorkflowStepInstance_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "WorkflowStep"("step_id") ON DELETE RESTRICT ON UPDATE CASCADE;
