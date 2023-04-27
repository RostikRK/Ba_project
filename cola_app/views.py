import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

# Read the dataframe (assuming it is stored in a CSV file)
my_df = pd.read_csv("cola_app/templates/cola_app/my_dataframe.csv_")
my_df_s = pd.read_csv("cola_app/templates/cola_app/my_df.csv")


print(my_df.columns)
def index(request):
    return render(request, "cola_app/index.html")

def partners(request):
    return render(request, "cola_app/partners.html")

def get_cities(request):
    country = request.GET.get('country', '').strip()
    filtered_cities = my_df[my_df['Country'].str.contains(country, case=False, na=False)]['City'].unique().tolist()
    data = {'cities': filtered_cities}
    return JsonResponse(data)

def get_streets(request):
    city = request.GET.get('city', '').strip()
    country = request.GET.get('country', '').strip()
    filtered_streets = my_df[(my_df['City'].str.contains(city, case=False, na=False)) & (my_df['Country'].str.contains(country, case=False, na=False))]['Street'].unique().tolist()
    data = {'streets': filtered_streets}
    return JsonResponse(data)


def show_map(request):
    country = request.POST.get('country', '').strip()
    city = request.POST.get('city', '').strip()
    street = request.POST.get('street', '').strip()

    filtered_data = my_df[(my_df['Country'].str.contains(country, case=False, na=False)) &
                          (my_df['City'].str.contains(city, case=False, na=False)) &
                          (my_df['Street'].str.contains(street, case=False, na=False))]

    outlets = filtered_data[['Outlet_Name', 'Rating', 'Lat', 'Lon', 'predicted_has_combo']].to_dict(orient='records')

    return render(request, 'cola_app/map.html', {'outlets': outlets})