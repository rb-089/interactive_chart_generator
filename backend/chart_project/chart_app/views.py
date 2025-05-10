from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend for matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import os
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt  # Temporarily disable CSRF protection for testing (not recommended for production)
def manual_data_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body).get('data', [])

            # Check if the data is valid
            if not data:
                logger.error("No data provided.")
                return JsonResponse({'error': 'No data provided'}, status=400)

            # Convert data to a Pandas DataFrame
            df = pd.DataFrame(data)

            # Ensure 'Value' is numeric
            if 'Value' not in df.columns or df['Value'].dtype != 'int64' and df['Value'].dtype != 'float64':
                logger.error(f"Invalid data format: {data}")
                return JsonResponse({'error': 'Value column must contain numeric data'}, status=400)

            # Generate chart
            plt.figure()
            df.plot(kind='bar', x='Category', y='Value')  # Customize as per your data
            chart_path = os.path.join('media', 'charts', 'manual_chart.png')  # Save in media directory
            os.makedirs(os.path.dirname(chart_path), exist_ok=True)
            plt.savefig(chart_path)
            plt.close()

            return JsonResponse({'chart_url': f'/media/charts/manual_chart.png'})  # Return correct URL
        except Exception as e:
            logger.error(f"Error generating chart: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        return JsonResponse({'message': 'This endpoint expects POST requests with data to generate charts'})

    else:
        return HttpResponseNotAllowed(['POST', 'GET'])
