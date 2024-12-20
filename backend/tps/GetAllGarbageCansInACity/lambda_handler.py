import logging
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger("GetAllGarbageCansInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    _LAMBDA_GARBAGECANS_TABLE_RESOURCE
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting city name
    city = event.get('pathParameters', {}).get('city')

    if not city:
        return build_response(
            400,
            {
                'message': 'City name is required'
            }
        )
    
    # Create database instance
    global _LAMBDA_GARBAGECANS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_GARBAGECANS_TABLE_RESOURCE)

    # Get all superchargers in a city
    garbage_cans = dynamodb.table.scan(
        FilterExpression=Attr('city').eq(city)
    ).get('Items', [])

    for g in garbage_cans:
        g['X'] = float(str(g['X']))
        g['Y'] = float(str(g['Y']))
    
    logger.info("Returning garbage cans")

    return build_response(
        200,
        {
            'message': f'Getting all garbage cans for city: {city}',
            'garbage_cans': garbage_cans
        }
    )
