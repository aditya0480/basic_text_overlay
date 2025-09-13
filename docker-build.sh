#!/bin/bash

# Docker build script for Image Generator Webapp

echo "🐳 Building Image Generator Docker container..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t image-generator:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "🚀 To run the container:"
    echo "   docker run -p 5500:5500 -v \$(pwd)/public/images:/app/public/images image-generator"
    echo ""
    echo "🔧 Or use docker-compose:"
    echo "   docker-compose up"
    echo ""
    echo "🌐 The app will be available at: http://localhost:5500"
else
    echo "❌ Docker build failed!"
    exit 1
fi
