#!/bin/sh

# แทนที่ค่า Environment Variable ในไฟล์ template แล้วสร้างเป็นไฟล์ env.js
# Replace environment variable.
# envsubst '${PRODUCTION},${API_ENDPOINT},${WHITELISTED_DOMAINS}' < /usr/share/nginx/html/assets/env.js > /usr/share/nginx/html/assets/env.js

# Start Nginx.
# exec "$@"

# 1. ตรวจสอบว่ามี Environment Variable ที่ต้องการหรือไม่

# Validate $PRODUCTION environment variable.
if [ -z "$PRODUCTION" ]; then
  echo "!!! Error: PRODUCTION environment variable is not set."
  exit 1
fi
echo "✅ PRODUCTION is set to: $PRODUCTION"

# Validate $API_ENDPOINT environment variable.
if [ -z "$API_ENDPOINT" ]; then
  echo "!!! Error: API_ENDPOINT environment variable is not set."
  exit 1
fi
echo "✅ API_ENDPOINT is set to: $API_ENDPOINT"

# Validate $WEB_SOCKET_ENDPOINT environment variable.
if [ -z "$WEB_SOCKET_ENDPOINT" ]; then
  echo "!!! Error: WEB_SOCKET_ENDPOINT environment variable is not set."
  exit 1
fi
echo "✅ WEB_SOCKET_ENDPOINT is set to: $WEB_SOCKET_ENDPOINT"

# Validate $WHITELISTED_DOMAINS environment variable.
if [ -z "$WHITELISTED_DOMAINS" ]; then
  echo "!!! Error: WHITELISTED_DOMAINS environment variable is not set."
  exit 1
fi
echo "✅ WHITELISTED_DOMAINS is set to: $WHITELISTED_DOMAINS"

# 2. Define Path to environment.prod.ts
PROD_ENV_FILE="/usr/share/nginx/html/assets/env.js"

# 3. ใช้คำสั่ง `sed` เพื่อค้นหาและแทนที่ Placeholder
#    -i คือการแก้ไขไฟล์โดยตรง
#    's/__API_ENDPOINT__/'"$API_ENDPOINT"'/g' คือ pattern การค้นหาและแทนที่
#    เราใช้ single quote และ double quote เพื่อให้ bash expand ตัวแปร $API_ENDPOINT ได้ถูกต้อง
echo "🔄 Replacing placeholder in $PROD_ENV_FILE..."
sed -i 's|__PRODUCTION__|'"$PRODUCTION"'|g' $PROD_ENV_FILE
sed -i 's|__API_ENDPOINT__|'"$API_ENDPOINT"'|g' $PROD_ENV_FILE
sed -i 's|__WEB_SOCKET_ENDPOINT__|'"$WEB_SOCKET_ENDPOINT"'|g' $PROD_ENV_FILE
sed -i 's|__WHITELISTED_DOMAINS__|'"$WHITELISTED_DOMAINS"'|g' $PROD_ENV_FILE

# Start Nginx.
exec "$@"