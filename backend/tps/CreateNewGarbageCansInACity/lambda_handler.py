import logging
import json
import uuid
from boto3.dynamodb.types import Decimal

logger = logging.getLogger("CreateNewGarbageCansInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    _LAMBDA_GARBAGECANS_TABLE_RESOURCE,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting city name
    city = event.get('pathParameters', {}).get('city')

    # Getting body data
    body = json.loads(event.get('body'))

    if not city:
        return build_response(
            400,
            {
                'message': 'City name is required'
            }
        )
    
    try:
        longitude = body['X']
        latitude = body['Y']
    except Exception as e:
        logger.info(f'X (longitude) and Y (latitude) are required')

    # Create database instance
    global _LAMBDA_GARBAGECANS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_GARBAGECANS_TABLE_RESOURCE)

    container_id = str(uuid.uuid4())

    dynamodb.table.put_item(
        Item={
            'id': container_id,
            'city': city,
            'X': Decimal(str(longitude)),
            'Y': Decimal(str(latitude))
        }
    )
    
    return build_response(
        200,
        {
            'message': f'Creating new container with id: {container_id}'
        }
    )
