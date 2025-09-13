# Docker Commands for Image Generator Webapp

## Quick Start

### Using Docker Compose (Recommended)
```bash
# Build and start the application
docker-compose up --build

# Run in background (detached mode)
docker-compose up -d --build

# Stop the application
docker-compose down

# View logs
docker-compose logs -f
```

### Using Docker directly
```bash
# Build the Docker image
docker build -t image-generator .

# Run the container
docker run -p 5500:5500 -v $(pwd)/public/images:/app/public/images image-generator

# Run in background
docker run -d -p 5500:5500 -v $(pwd)/public/images:/app/public/images --name image-generator image-generator

# Stop the container
docker stop image-generator

# Remove the container
docker rm image-generator
```

## Development Commands

### Rebuild after code changes
```bash
# Stop, rebuild, and start
docker-compose down
docker-compose up --build

# Or force rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### View container logs
```bash
# Using docker-compose
docker-compose logs -f webapp

# Using docker directly
docker logs -f image-generator
```

### Access container shell
```bash
# Using docker-compose
docker-compose exec webapp sh

# Using docker directly
docker exec -it image-generator sh
```

## Production Deployment

### Build for production
```bash
# Build the image
docker build -t your-registry/image-generator:latest .

# Push to registry (replace with your registry)
docker push your-registry/image-generator:latest
```

### Environment Variables
You can override environment variables:
```bash
# Using docker-compose
docker-compose up -e DOMAIN=https://yourdomain.com

# Using docker run
docker run -p 5500:5500 -e DOMAIN=https://yourdomain.com image-generator
```

## Troubleshooting

### Check if container is running
```bash
docker ps
```

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' image-generator
```

### Clean up
```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune
```
