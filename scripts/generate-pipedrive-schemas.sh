#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$(dirname "$SCRIPT_DIR")/src/libs/data/clients/pipedrive"

generate_schema() {
  local version=$1
  local tmp_file="/tmp/pipedrive-${version}-openapi.json"
  
  echo "📥 Fetching Pipedrive ${version} OpenAPI spec..."
  curl -sfS -o "$tmp_file" "https://developers.pipedrive.com/docs/api/${version}/openapi.json"
  
  echo "⚙️  Generating ${version} TypeScript schema..."
  npx openapi-typescript "$tmp_file" -o "$OUTPUT_DIR/${version}/schema.d.ts"
  
  rm -f "$tmp_file"
  echo "✅ ${version} schema generated"
}

echo "🔄 Generating Pipedrive API schemas..."

generate_schema "v1"
generate_schema "v2"

echo "🎉 All Pipedrive schemas generated successfully!"
