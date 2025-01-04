import os
import zipfile
import pandas as pd
import shutil

from src.core.elasticsearch_utils import ElasticSearchHelper


def read_csv_data(csv_file_path):
    if not os.path.exists(csv_file_path):
        raise FileNotFoundError(f"CSV file '{csv_file_path}' not found.")
    
    print(f"Reading CSV file: {csv_file_path}")
    # Read CSV file using pandas
    df = pd.read_csv(csv_file_path)
    
    # Convert to a list of dictionaries (one dict per row)
    data = df.to_dict(orient="records")
    print(f"CSV data read successfully. Total rows: {len(data)}")
    return data

def extract_seed_data(zip_file_path, extract_zip_path):
    # Extract the ZIP file in the current directory
    try:
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_zip_path)  # Extract all contents to the current directory
        print(f"Extracted '{zip_file_path}' successfully.")

        csv_file_path = os.path.join(extract_zip_path, "products.csv")
        data = read_csv_data(csv_file_path)
        return data
    except FileNotFoundError:
        raise FileNotFoundError(f"Error: The file '{zip_file_path}' does not exist.")
    except zipfile.BadZipFile:
        raise zipfile.BadZipFile(f"Error: '{zip_file_path}' is not a valid ZIP file.")

def clean_folder(folder_path):
    if os.path.exists(folder_path):
        # Delete the seed_data folder and all its contents
        shutil.rmtree(folder_path)
        print(f"cleaned up {folder_path}")

def clean_es_index():
    es_helper = ElasticSearchHelper()
    es_helper.reset_products_index()


def add_seed_data_if_empty():
    es_helper = ElasticSearchHelper()

    if es_helper.get_products_count() > 0:
        print("Products index is not empty. Skipping seed data addition.")
        return

    es_helper.reset_products_index()
    seed_data_path = os.path.join(os.path.dirname(__file__), "seed_data.zip")
    extract_zip_path = os.path.join(os.path.dirname(__file__), "seed_data")

    # clean the seed_data folder if it exists, before extracting the zip file
    clean_folder(extract_zip_path)

    data = extract_seed_data(seed_data_path, extract_zip_path)
    es_helper.add_products_bulk(data)

    # clean the seed_data folder after adding the data to the index
    clean_folder(extract_zip_path)
