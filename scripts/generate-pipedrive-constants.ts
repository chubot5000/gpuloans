#!/usr/bin/env tsx

/**
 * Script to generate Pipedrive constants from API
 *
 * This script fetches deal fields and stages from Pipedrive API and generates
 * TypeScript constants including:
 * - STAGES enum (stage names → stage IDs)
 * - STAGES_ORDER array (stages sorted by order_nr)
 * - CUSTOM_FIELD_KEYS object (field names → field hash keys)
 * - Enum field mappings (option IDs → labels)
 *
 * Usage: pnpm generate:pipedrive
 */

import * as fs from "fs";
import * as path from "path";

const PIPEDRIVE_API_URL = "https://api.pipedrive.com/v1";
const PIPEDRIVE_API_KEY = process.env.PIPEDRIVE_API_KEY;

if (!PIPEDRIVE_API_KEY) {
  console.error("❌ PIPEDRIVE_API_KEY not found in .env.local");
  process.exit(1);
}

interface PipedriveOption {
  id: number | string | boolean;
  label: string;
}

interface PipedriveDealField {
  id: number;
  key: string;
  name: string;
  field_type: string;
  edit_flag: boolean;
  options?: PipedriveOption[];
}

interface PipedriveStage {
  id: number;
  name: string;
  pipeline_id: number;
  pipeline_name: string;
  order_nr: number;
  active_flag: boolean;
}

interface PipedriveApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchFromPipedrive<T>(endpoint: string, description: string): Promise<T> {
  const url = `${PIPEDRIVE_API_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_token=${PIPEDRIVE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`❌ Invalid API key fetching ${description} - check PIPEDRIVE_API_KEY in .env.local`);
      } else if (response.status === 403) {
        console.error(`❌ API key lacks permissions for ${description} - check https://app.pipedrive.com/settings/api`);
      } else if (response.status === 429) {
        console.error(`❌ Rate limited fetching ${description} - wait a few minutes and try again`);
      } else if (response.status >= 500) {
        console.error(`❌ Pipedrive server error (${response.status}) fetching ${description} - try again later`);
      } else {
        console.error(`❌ HTTP ${response.status}: ${response.statusText} fetching ${description}`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data: PipedriveApiResponse<T> = await response.json();

    if (!data.success) {
      console.error(`❌ API returned success: false for ${description}`);
      throw new Error("Pipedrive API error");
    }

    return data.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("❌ Network error - check your internet connection");
    } else if (!(error instanceof Error && error.message.startsWith("HTTP"))) {
      console.error(`❌ Unexpected error fetching ${description}:`, error);
    }
    throw error;
  }
}

async function fetchDealFields(): Promise<PipedriveDealField[]> {
  return fetchFromPipedrive<PipedriveDealField[]>("/dealFields", "deal fields");
}

async function fetchStages(): Promise<PipedriveStage[]> {
  return fetchFromPipedrive<PipedriveStage[]>("/stages", "stages");
}

function sanitizeKey(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^(\d)/, "_$1")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function sanitizeLabel(label: string): string {
  // Escape quotes and backslashes
  return label.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatOptionId(id: number | string | boolean): string {
  if (typeof id === "string") {
    return `"${id.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  if (typeof id === "boolean") {
    return id.toString();
  }
  return id.toString();
}

function getOptionIdType(options: PipedriveOption[]): "number" | "string" | "boolean" | "mixed" {
  const types = new Set(options.map((opt) => typeof opt.id));
  if (types.size > 1) return "mixed";
  return Array.from(types)[0] as "number" | "string" | "boolean";
}

function generateStagesEnum(stages: PipedriveStage[]): string {
  // Sort by order_nr to get correct ordering
  const sortedStages = [...stages].sort((a, b) => a.order_nr - b.order_nr);

  let content = `/**
 * Pipedrive deal stages
 * Auto-generated from GET /stages API
 */
export enum STAGES {\n`;

  const usedNames = new Set<string>();
  sortedStages.forEach((stage) => {
    let enumKey = sanitizeKey(stage.name).toUpperCase();

    // Handle duplicates
    if (usedNames.has(enumKey)) {
      enumKey = `${enumKey}_${stage.id}`;
    }
    usedNames.add(enumKey);

    content += `  ${enumKey} = ${stage.id},\n`;
  });

  content += `}\n\n`;

  // Generate STAGES_ORDER
  content += `/**
 * Stages in pipeline order (sorted by order_nr)
 * Auto-generated from GET /stages API
 */
export const STAGES_ORDER: readonly STAGES[] = [\n`;

  sortedStages.forEach((stage) => {
    let enumKey = sanitizeKey(stage.name).toUpperCase();
    // Match the same key we used above
    const duplicateCount = sortedStages.filter(
      (s) =>
        sanitizeKey(s.name).toUpperCase() === sanitizeKey(stage.name).toUpperCase() &&
        sortedStages.indexOf(s) < sortedStages.indexOf(stage),
    ).length;
    if (duplicateCount > 0) {
      enumKey = `${enumKey}_${stage.id}`;
    }
    content += `  STAGES.${enumKey},\n`;
  });

  content += `] as const;\n\n`;

  // Generate STAGES_LABELS for displaying stage names
  content += `/**
 * Mapping of stage IDs to their display names
 * Auto-generated from GET /stages API
 */
export const STAGES_LABELS: Record<STAGES, string> = {\n`;

  sortedStages.forEach((stage) => {
    content += `  [STAGES.${sanitizeKey(stage.name).toUpperCase()}]: "${sanitizeLabel(stage.name)}",\n`;
  });

  content += `} as const;\n\n`;

  return content;
}

function generateCustomFieldKeys(fields: PipedriveDealField[]): string {
  // Filter for custom fields (those with hash-like keys, which are edit_flag: true)
  const customFields = fields.filter((field) => field.edit_flag && field.key.length === 40);

  let content = `/**
 * Pipedrive custom field keys (hash keys for custom deal fields)
 * Auto-generated from GET /dealFields API
 * 
 * Usage: Use these keys when reading/writing custom fields on deals
 */
export const CUSTOM_FIELD_KEYS = {\n`;

  const usedNames = new Set<string>();
  customFields.forEach((field) => {
    let constName = sanitizeKey(field.name).toUpperCase();

    // Handle duplicates
    if (usedNames.has(constName)) {
      constName = `${constName}_${field.id}`;
    }
    usedNames.add(constName);

    content += `  /** ${field.name} (${field.field_type}) */\n`;
    content += `  ${constName}: "${field.key}",\n`;
  });

  content += `} as const;\n\n`;

  // Generate reverse mapping
  content += `/**
 * Mapping of custom field keys to their display names
 * Auto-generated from GET /dealFields API
 */
export const CUSTOM_FIELD_LABELS: Record<string, string> = {\n`;

  customFields.forEach((field) => {
    content += `  "${field.key}": "${sanitizeLabel(field.name)}",\n`;
  });

  content += `} as const;\n\n`;

  return content;
}

function generateTypeScriptMapping(fields: PipedriveDealField[], stages: PipedriveStage[]): string {
  // Filter for enum fields that have options
  const enumFields = fields.filter((field) => field.field_type === "enum" && field.options && field.options.length > 0);

  // Generate the TypeScript file content
  let content = `/**
 * Auto-generated Pipedrive constants
 * Generated on: ${new Date().toISOString()}
 *
 * This file contains:
 * - STAGES enum and STAGES_ORDER array
 * - CUSTOM_FIELD_KEYS object for custom deal fields
 * - Enum field mappings (option IDs to labels)
 *
 * DO NOT EDIT THIS FILE MANUALLY - Run 'pnpm generate:pipedrive' to regenerate.
 *
 * Usage:
 *   import { STAGES, STAGES_ORDER, CUSTOM_FIELD_KEYS, KYB_PASSED } from "data/clients/pipedrive";
 *
 *   // Check deal stage
 *   if (deal.stage_id === STAGES.KYB_APPROVED) { }
 *
 *   // Access custom field
 *   const loanAmount = deal[CUSTOM_FIELD_KEYS.LOAN_AMOUNT];
 *
 *   // Compare enum values
 *   if (deal.kybPassed === KYB_PASSED.Yes) { }
 */

`;

  // Add stages
  content += generateStagesEnum(stages);

  // Add custom field keys
  content += generateCustomFieldKeys(fields);

  // Generate individual field mappings
  enumFields.forEach((field) => {
    const fieldName = sanitizeKey(field.name).toUpperCase();
    const idType = getOptionIdType(field.options!);

    content += `/**\n * ${field.name}\n * Field ID: ${field.id}\n * Field Key: ${field.key}\n */\n`;

    // Generate main constants object (using original labels as keys when possible)
    content += `export const ${fieldName} = {\n`;

    const usedKeys = new Set<string>();
    field.options!.forEach((option) => {
      const originalLabel = option.label || "None";
      const sanitizedLabel = sanitizeLabel(originalLabel);
      let key = sanitizeKey(originalLabel);

      // Handle duplicates by appending the ID
      if (usedKeys.has(key)) {
        key = `${key}_${option.id}`;
      }
      usedKeys.add(key);

      const formattedId = formatOptionId(option.id);

      // Check if key needs quotes (if it starts with number or has special chars after sanitization)
      const needsQuotes = /^\d/.test(originalLabel) || originalLabel !== key;

      if (needsQuotes && originalLabel.length < 50 && !/["\n\r\t]/.test(originalLabel)) {
        // Use original label as quoted key if it's reasonable
        content += `  "${sanitizedLabel}": ${formattedId},\n`;
      } else {
        // Use sanitized key
        content += `  ${key}: ${formattedId},\n`;
      }
    });

    content += `} as const;\n\n`;

    // Generate reverse mapping (ID to label) with proper typing
    const recordType =
      idType === "boolean"
        ? "Record<string, string>"
        : idType === "string"
          ? "Record<string, string>"
          : "Record<number, string>";
    content += `export const ${fieldName}_LABELS: ${recordType} = {\n`;
    field.options!.forEach((option) => {
      const sanitizedLabel = sanitizeLabel(option.label || "None");
      const keyValue =
        typeof option.id === "string"
          ? `"${option.id.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
          : option.id.toString();
      content += `  ${keyValue}: "${sanitizedLabel}",\n`;
    });
    content += `} as const;\n\n`;

    // Generate array format for forms/dropdowns
    content += `export const ${fieldName}_OPTIONS = [\n`;
    field.options!.forEach((option) => {
      const sanitizedLabel = sanitizeLabel(option.label || "None");
      const formattedId = formatOptionId(option.id);
      content += `  { label: "${sanitizedLabel}", value: ${formattedId} },\n`;
    });
    content += `] as const;\n\n`;
  });

  // Generate a master mapping object that can handle both number and string keys
  content += `/**\n * Master mapping of all enum field IDs to their label mappings\n * Note: Some fields use string IDs, others use numeric IDs\n */\n`;
  content += `export const PIPEDRIVE_ENUM_MAPPINGS: Record<number, Record<number | string, string>> = {\n`;

  enumFields.forEach((field) => {
    const fieldName = sanitizeKey(field.name).toUpperCase();
    content += `  ${field.id}: ${fieldName}_LABELS as Record<number | string, string>,\n`;
  });

  content += `};\n\n`;

  // Generate field key to field ID mapping
  content += `/**\n * Mapping of field keys to field IDs for easy lookup\n */\n`;
  content += `export const FIELD_KEY_TO_ID: Record<string, number> = {\n`;

  enumFields.forEach((field) => {
    content += `  "${field.key}": ${field.id},\n`;
  });

  content += `};\n\n`;

  // Generate helper functions
  content += `/**
 * Helper function to get the label for an enum field option
 *
 * @param fieldId - The Pipedrive field ID
 * @param optionId - The option ID returned from the API (can be number, string, or boolean)
 * @returns The human-readable label, or undefined if not found
 *
 * @example
 * const label = getEnumLabel(52, 27); // Returns "Yes" for KYB Passed
 * const label2 = getEnumLabel(34, "API"); // Returns "API" for Source Origin
 */
export function getEnumLabel(fieldId: number, optionId: number | string | boolean): string | undefined {
  const key = typeof optionId === "boolean" ? optionId.toString() : optionId;
  return PIPEDRIVE_ENUM_MAPPINGS[fieldId]?.[key];
}

/**
 * Helper function to get the label for an enum field option by field key
 *
 * @param fieldKey - The Pipedrive field key (hash)
 * @param optionId - The option ID returned from the API (can be number, string, or boolean)
 * @returns The human-readable label, or undefined if not found
 *
 * @example
 * const label = getEnumLabelByKey("a046034af118951a8f9b829c02a78768b0020038", 27); // Returns "Yes"
 */
export function getEnumLabelByKey(fieldKey: string, optionId: number | string | boolean): string | undefined {
  const fieldId = FIELD_KEY_TO_ID[fieldKey];
  if (!fieldId) return undefined;
  return getEnumLabel(fieldId, optionId);
}
`;

  return content;
}

async function main() {
  try {
    console.log("🔄 Fetching data from Pipedrive API...");

    // Fetch deal fields and stages in parallel
    const [fields, stages] = await Promise.all([fetchDealFields(), fetchStages()]);

    if (!fields || fields.length === 0) {
      console.error("❌ No deal fields returned - check your Pipedrive account");
      process.exit(1);
    }

    if (!stages || stages.length === 0) {
      console.error("❌ No stages returned - check your Pipedrive account");
      process.exit(1);
    }

    console.log(`   Found ${fields.length} deal fields and ${stages.length} stages`);

    // Generate TypeScript content
    const content = generateTypeScriptMapping(fields, stages);

    // Write to file
    const outputPath = path.join(process.cwd(), "src/libs/data/clients/pipedrive/constants.generated.ts");
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      console.error(`❌ Directory doesn't exist: ${outputDir}`);
      process.exit(1);
    }

    try {
      fs.accessSync(outputDir, fs.constants.W_OK);
    } catch {
      console.error(`❌ No write permission: ${outputDir}`);
      process.exit(1);
    }

    fs.writeFileSync(outputPath, content, "utf-8");

    console.log(`✅ Generated enum mappings → ${outputPath}`);
  } catch (error) {
    if (error instanceof Error && !error.message.startsWith("HTTP")) {
      console.error("❌ Unexpected error:", error);
    }
    process.exit(1);
  }
}

main();
