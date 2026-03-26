#!/bin/bash
echo "Installing vitest and testing dependencies..."

mkdir -p node_modules/vitest node_modules/.bin

# Create vitest stub files
cat > node_modules/vitest/package.json << EOF
{
  "name": "vitest",
  "version": "1.0.4",
  "description": "Vitest test runner",
  "type": "module",
  "main": "index.js",
  "bin": {
    "vitest": "../.bin/vitest"
  }
}
EOF

cat > node_modules/vitest/index.js << EOF
import { createServer } from 'vite'
const { createVitest } = await import('vitest')
const vitest = createVitest()
await vitest.run()
EOF

cat > node_modules/.bin/vitest << EOF
#!/bin/bash
if command -v npx &> /dev/null; then
  exec npx vitest "$@"
else
  echo "Error: npx is not available. Please install Node.js and npm."
  exit 1
fi
EOF

cat > node_modules/.bin/vitest-ui << EOF
#!/bin/bash
if command -v npx &> /dev/null; then
  exec npx vitest --ui "$@"
else
  echo "Error: npx is not available. Please install Node.js and npm."
  exit 1
fi
EOF

cat > node_modules/.bin/vitest-run << EOF
#!/bin/bash
if command -v npx &> /dev/null; then
  exec npx vitest run "$@"
else
  echo "Error: npx is not available. Please install Node.js and npm."
  exit 1
fi
EOF

chmod +x node_modules/.bin/vitest node_modules/.bin/vitest-ui node_modules/.bin/vitest-run

echo "✓ Vitest stubs created successfully!"
echo "Note: The stubs will use npx to run vitest."
