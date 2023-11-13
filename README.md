# Introduction 
This project presents a frontend for running Azure Pipelines instead of giving unecessary access to the backend code and Azure Devops itself.
The idea is users would be added/removed on AD groups and based on their permissions, certain pipelines are opened up to them on this tool.

# Getting Started
The app is basic flask with flask-socketio used for displaying live updates from Azure Devops. Just run python main.py to run the development environment. When going live use docker-compose
