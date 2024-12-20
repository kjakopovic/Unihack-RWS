import logging

logger = logging.getLogger("DeleteGarbageCansInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    _LAMBDA_GARBAGECANS_TABLE_RESOURCE,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting charger_id
    container_id = event.get('pathParameters', {}).get('container_id')

    if not container_id:
        return build_response(
            400,
            {
                'message': 'Container id is required'
            }
        )
    
    # Create database instance
    global _LAMBDA_GARBAGECANS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_GARBAGECANS_TABLE_RESOURCE)

    dynamodb.table.delete_item(
        Key={
            'id': container_id
        }
    )
    
    return build_response(
        200,
        {
            'message': 'Deleted garbage can'
        }
    )
