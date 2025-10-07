#!/bin/bash

APP_NAME=$1
ENV=$2
APP_VERSION=$3

{
  echo "VITE_APP_VERSION=$APP_VERSION"
  echo "VITE_API_URL=$(aws ssm get-parameter --name /$APP_NAME/$ENV/api_url --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/google_client_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_GOOGLE_API_KEY=$(aws ssm get-parameter --name /$APP_NAME/$ENV/google_api_key --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_APPLE_CLIENT_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/apple_client_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_SECRET_CONFIG_PASSWORD=$(aws ssm get-parameter --name /$APP_NAME/$ENV/secret_config_password --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_API_KEY=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_api_key --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_AUTH_DOMAIN=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_auth_domain --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_PROJECTID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_projectid --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_STORAGE_BUCKET=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_storage_bucket --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_messaging_sender_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_APPID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_appid --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_FIREBASE_MEASUREMENTID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/firebase_measurementid --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_NODE_ENV=$ENV"
  echo "VITE_EXTERNAL_PROTECTION_PASSWORD=$(aws ssm get-parameter --name /$APP_NAME/$ENV/external_protection_password --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_GTM_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/gtm_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_GTM_MAIN_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/gtm_main_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_PIXEL_ID=$(aws ssm get-parameter --name /$APP_NAME/$ENV/pixel_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_CMS_API_URL=$(aws ssm get-parameter --name /$APP_NAME/$ENV/cms_api_url --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_WEB_CALLBACK_URL=$(aws ssm get-parameter --name /$APP_NAME/$ENV/web_callback_url --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_TUTORIAL_PRESENTATION_URL=$(aws ssm get-parameter --name /$APP_NAME/$ENV/tutorial_presentation_url --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_RECAPTCHA_KEY=$(aws ssm get-parameter --name /$APP_NAME/$ENV/recaptcha_key --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_RECAPTCHA_SECRET_KEY=$(aws ssm get-parameter --name /$APP_NAME/$ENV/recaptcha_secret_key --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_MSAL_CLIENT_ID=$(aws ssm get-parameter --name /$APP_NAME/msal_client_id --with-decryption --query 'Parameter.Value' --output text)"
  echo "VITE_MSAL_AUTHORITY=$(aws ssm get-parameter --name /$APP_NAME/msal_authority --with-decryption --query 'Parameter.Value' --output text)"
  
  
  # echo "VITE_EXAMPLE_VAR=$(aws ssm get-parameter --name /$APP_NAME/$ENV/example_var --with-decryption --query 'Parameter.Value' --output text)"
} > .env