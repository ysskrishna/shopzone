# ShopZone Backend

This is the backend service for ShopZone, an e-commerce product search platform built with FastAPI and Elasticsearch.

## Tech Stack
- FastAPI
- Elasticsearch
- Kibana
- Docker
- Docker Compose
- Python

## Prerequisites

- Python 3.8+
- pip
- virtualenv
- Docker


## Initial Setup

1. Create a virtual environment:
   ```
   virtualenv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     .\venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the docker compose file to start the elasticsearch and kibana instances:
   ```
   docker compose -f docker-compose.yml up -d 
   ```

## Development

### Running the Development Server

Start the FastAPI server:
```
python main.py
```

The server will be available at `http://localhost:8081/`

### API Documentation

Access the Swagger UI documentation at `http://localhost:8081/docs`

### Updating Dependencies

After adding or removing packages, update the requirements file:
```
pip freeze > requirements.txt
```