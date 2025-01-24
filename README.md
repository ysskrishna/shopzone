# ShopZone

A full stack e-commerce application built with Next.js, FastAPI and Elasticsearch. It provides a seamless shopping experience with powerful search capabilities, sorting, filtering and an intuitive interface. The application is fully responsive and mobile-friendly, offering a consistent experience across all devices. 


## Media

https://github.com/user-attachments/assets/c4714cf6-e8fe-498c-b092-d974642fbe45


<video width="320" height="240" controls>
  <source src="./media/shopzone_demo.mp4" type="video/mp4">
</video>

### Landing Page
<img src="./media/landing_page.png" alt="Landing Page"/>

### Search Page
<img src="./media/search_page1.png" alt="Search Page 1"/>

### Search Page Pagination
<img src="./media/search_page2.png" alt="Search Page Pagination"/>

### Search Page With Filters
<img src="./media/search_with_filters.png" alt="Search Page With Filters"/>

### Product Details Page
<img src="./media/product_details.png" alt="Product Details Page"/>

### Product Recommendations
<img src="./media/product_recommendations.png" alt="Product Recommendations"/>

### Elasticsearch server
<img src="./media/elastic_search_server.png" alt="Elasticsearch Server"/>

### Kibana server
<img src="./media/kibana_server.png" alt="Kibana Server"/>


## Features

- **Real-Time Product Search**: Instantly fetch and display product results powered by Elasticsearch for high-performance search capabilities.  
- **Advanced Filtering and Sorting Options**:  
  - Multiple value filters for categories and subcategories.  
  - Range filters for product price and ratings.  
  - Options to clear individual filters or reset all filters simultaneously.  
  - Sorting options include Relevance, Price (Low to High), Price (High to Low), and Top Rated.  
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices, ensuring a seamless user experience across all platforms.  
- **Clean and Modern UI**: Built using **TailwindCSS** and **Radix UI** for a visually appealing and user-friendly interface.  
- **Personalized Product Recommendations**: Tailored product suggestions based on user preferences and browsing history.  
- **Fast and Optimized Performance**: Highly efficient, ensuring a smooth and lag-free experience even for large datasets.  
- **SEO-Friendly Architecture**: Powered by **Next.js** with dynamically generated metadata for product pages to enhance search engine visibility.  
- **RESTful API Backend**: Developed with **FastAPI**, ensuring reliable and scalable backend services.  
- **Pagination Controls**: Seamless pagination with customizable page size options for improved navigation.  
- **Containerized Deployment**: Easily set up and deploy the application with Docker for streamlined and consistent deployment.  


## Tech Stack
- Next.js
- TypeScript
- TailwindCSS
- Radix UI
- FastAPI
- Elasticsearch
- Kibana
- Docker
- Docker Compose
- Python

## Installation

1. Clone the repository
2. Run `docker compose -f docker-compose-production.yml up` to start the elasticsearch, kibana, backend and frontend instances
3. Run `docker compose -f docker-compose-production.yml down` to stop the elasticsearch, kibana, backend and frontend instances
4. Run `docker compose -f docker-compose-production.yml up --build` to build and start the elasticsearch, kibana, backend and frontend instances
5. On first run, the backend will seed the data into the elasticsearch index. This may take a few minutes. Please be patient and do not close the terminal.
6. Frontend will be available at `http://localhost:3000/`
7. Backend will be available at `http://localhost:8081/`
8. Kibana will be available at `http://localhost:5601/`
9. Elasticsearch will be available at `http://localhost:9200/`



## License
Copyright (c) 2024 Y. Siva Sai Krishna

This project is licensed under the AGPL-3.0 License - see the LICENSE file for details.
