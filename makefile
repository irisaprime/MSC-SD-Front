# Frontend Makefile for Similarity Detection UI
# Place this file at: ~/similarity-checker/Makefile

.PHONY: help run

# Configuration - nested project directory
APP_DIR := similarity-checker

# Default target
help:
	@echo "Available commands:"
	@echo "  make run        - Run development server"


# Run development server
run:
	@echo "Installing dependencies..."
	cd $(APP_DIR) && npm install
	@echo "Starting development server..."
	cd $(APP_DIR) && npm run dev