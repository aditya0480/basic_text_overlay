# 🐳 Docker Setup for Image Generator Webapp

Your webapp has been successfully containerized! Here's everything you need to know.

## 📋 Prerequisites

### Install Docker Desktop
Since you're on macOS, install Docker Desktop:

1. **Download Docker Desktop for Mac**: https://www.docker.com/products/docker-desktop/
2. **Install and start Docker Desktop**
3. **Verify installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and start the application
docker-compose up --build

# The app will be available at: http://localhost:5500
```

### Option 2: Using Docker directly
```bash
# Build the image
docker build -t image-generator .

# Run the container
docker run -p 5500:5500 -v $(pwd)/public/images:/app/public/images image-generator
```

### Option 3: Using the build script
```bash
# Make script executable (already done)
chmod +x docker-build.sh

# Run the build script
./docker-build.sh
```

## 📁 Files Created

- **`Dockerfile`** - Defines how to build the Docker image
- **`.dockerignore`** - Excludes unnecessary files from the Docker build
- **`docker-compose.yml`** - Orchestrates the container with proper configuration
- **`docker-build.sh`** - Convenient build script
- **`docker-commands.md`** - Complete command reference
- **`README-Docker.md`** - This file

## 🔧 Key Features

### Security
- ✅ Runs as non-root user
- ✅ Minimal Alpine Linux base image
- ✅ Health checks included

### Performance
- ✅ Multi-stage build optimization
- ✅ Production dependencies only
- ✅ Proper caching layers

### Persistence
- ✅ Generated images persist on host
- ✅ Volume mounting for `public/images`

### Monitoring
- ✅ Health checks
- ✅ Proper logging
- ✅ Graceful shutdown

## 🌐 Access Your App

Once running, your app will be available at:
- **Local**: http://localhost:5500
- **Network**: http://[your-ip]:5500

## 🛠️ Development Workflow

### Making Changes
1. Edit your code
2. Rebuild: `docker-compose up --build`
3. Test your changes

### Viewing Logs
```bash
docker-compose logs -f
```

### Stopping the App
```bash
docker-compose down
```

## 🚀 Production Deployment

### Build for Production
```bash
docker build -t your-registry/image-generator:latest .
docker push your-registry/image-generator:latest
```

### Environment Variables
Override in `docker-compose.yml` or use `-e` flag:
```bash
docker run -e DOMAIN=https://yourdomain.com image-generator
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Change port in docker-compose.yml or use different port
   docker run -p 5501:5500 image-generator
   ```

2. **Permission issues**:
   ```bash
   # Ensure public/images directory exists and is writable
   mkdir -p public/images
   chmod 755 public/images
   ```

3. **Font not loading**:
   - Check that `fonts/TiroDevanagariMarathi-Italic.ttf` exists
   - The app will fallback to default font if custom font fails

### Health Check
```bash
# Check if container is healthy
docker ps
docker inspect --format='{{.State.Health.Status}}' image-generator
```

## 📊 Benefits of Docker

- ✅ **Consistent Environment**: Runs the same everywhere
- ✅ **Easy Deployment**: One command to deploy
- ✅ **Isolation**: No conflicts with host system
- ✅ **Scalability**: Easy to scale horizontally
- ✅ **Version Control**: Tag and version your deployments
- ✅ **Rollback**: Easy to rollback to previous versions

Your webapp is now ready for containerized deployment! 🎉
