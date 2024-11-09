import json
import bcrypt
import logging

logger = logging.getLogger("LoginUser")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_USERS_TABLE_RESOURCE,
    generate_jwt_token,
    generate_refresh_token,
    build_response,
    LambdaDynamoDBClass
)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'Checking if every required attribute is found in body: {event}')

    try:
        email = event['email']
        password = event['password']
    except Exception as e:
        return build_response(
            400,
            {
                'message': f'{e} is missing, please check and try again'
            }
        )
    
    # Setting up table for users
    global _LAMBDA_USERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_USERS_TABLE_RESOURCE)

    return login_user(dynamodb, email, password)

def login_user(dynamodb, email, password):
    user = get_user_by_email(dynamodb, email)
    
    # Check if input is correct
    if not user or not verify_password(password, user.get("password", "")):
        return build_response(
            400,
            {
                'message': 'Wrong email or password. Please try again.'
            }
        )
    
    # Generate jwt and refresh tokens
    access_token = generate_jwt_token(email)
    refresh_token = generate_refresh_token(email)

    if not access_token or not refresh_token:
        return build_response(
            500,
            {
                'message': f"Unable to generate tokens. Please contact support."
            }
        )
    
    update_refresh_token(dynamodb, email, refresh_token)

    isAdmin = user.get('city') is not None

    return build_response(
        200,
        {
            'message': 'Logged in successfully, welcome!',
            'token': access_token,
            'refresh_token': refresh_token,
            'isAdmin': isAdmin
        }
    )

def update_refresh_token(dynamodb, email, refresh_token):
    logger.info('Updating refresh token in the database')

    dynamodb.table.update_item(
        Key={
            'email': email
        },
        UpdateExpression='SET refresh_token = :refreshToken',
        ExpressionAttributeValues={
            ':refreshToken': refresh_token
        }
    )

def get_user_by_email(dynamodb, email):
    logger.info('Getting user by email')

    user = dynamodb.table.get_item(
        Key={
            'email': email
        }
    )

    return user.get('Item')

def verify_password(user_password, stored_password):
    logger.info('Verifying password')

    return bcrypt.checkpw(user_password.encode('utf-8'), stored_password.encode('utf-8'))
