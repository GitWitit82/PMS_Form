-- Add form types
ALTER TYPE "FormType" ADD VALUE 'PROJECT_CHECKLIST';
ALTER TYPE "FormType" ADD VALUE 'QUALITY_CONTROL';
ALTER TYPE "FormType" ADD VALUE 'CUSTOMER_APPROVAL';

-- Insert default project forms
INSERT INTO "Form" (
  "title", 
  "type", 
  "department_id", 
  "description", 
  "created_at", 
  "updated_at"
) VALUES 
  (
    'Project Checklist',
    'PROJECT_CHECKLIST',
    1,
    'Standard project checklist',
    NOW(),
    NOW()
  ),
  (
    'Quality Control Form',
    'QUALITY_CONTROL',
    1,
    'Quality control checklist',
    NOW(),
    NOW()
  ),
  (
    'Customer Approval Form',
    'CUSTOMER_APPROVAL',
    1,
    'Customer sign-off form',
    NOW(),
    NOW()
  );

-- Insert form templates for each form
WITH form_ids AS (
  SELECT form_id, title FROM "Form"
  WHERE type IN ('PROJECT_CHECKLIST', 'QUALITY_CONTROL', 'CUSTOMER_APPROVAL')
)
INSERT INTO "FormTemplate" (
  "form_id",
  "name",
  "description",
  "fields",
  "layout",
  "version",
  "is_active",
  "created_at",
  "updated_at"
)
SELECT 
  f.form_id,
  f.title,
  CASE 
    WHEN f.title = 'Project Checklist' THEN '{"items":[{"type":"checkbox","label":"Initial Contact Complete","required":true},{"type":"checkbox","label":"Requirements Gathered","required":true}]}'::jsonb
    WHEN f.title = 'Quality Control Form' THEN '{"items":[{"type":"checkbox","label":"Design Review Complete","required":true},{"type":"checkbox","label":"Technical Review Complete","required":true}]}'::jsonb
    WHEN f.title = 'Customer Approval Form' THEN '{"items":[{"type":"signature","label":"Customer Signature","required":true},{"type":"date","label":"Approval Date","required":true}]}'::jsonb
  END AS fields,
  '{}'::jsonb AS layout,
  1 AS version,
  true AS is_active,
  NOW() AS created_at,
  NOW() AS updated_at
FROM form_ids f; 