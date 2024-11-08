import logging

logger = logging.getLogger("DeleteNewsForCity")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_NEWS_TABLE_RESOURCE,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    delete_news_pictures
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting city name
    news_id = event.get('pathParameters', {}).get('news_id')

    if not news_id:
        return build_response(
            400,
            {
                'message': 'News id is required'
            }
        )

    # Setting up table for users
    global _LAMBDA_NEWS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_NEWS_TABLE_RESOURCE)

    dynamodb.table.delete_item(
        Key={
            'id': news_id
        }
    )

    delete_news_pictures(news_id)
    
    return build_response(
        200,
        {
            'message': 'Delete news for city'
        }
    )
