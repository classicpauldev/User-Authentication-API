#!/bin/bash

# Set up start date and end date for February
START_DATE="2022-02-01"
END_DATE="2022-02-28"
PROJECT_NAME="user-auth-api"

# Array of technical terms for commit messages
COMMIT_MESSAGES=(
    "Initial project setup"s
    "Implemented basic routing"
    "Set up authentication middleware"
    "Created user model schema"
    "Added validation for user input"
    "Integrated JWT authentication"
    "Set up environment variables"
    "Created user registration API"
    "Implemented login functionality"
    "Fixed minor bugs in auth API"
    "Optimized API response time"
    "Updated user schema for additional fields"
    "Integrated logging system"
    "Refactored user routes"
    "Improved error handling"
    "Added API documentation"
    "Set up test environment"
    "Wrote unit tests for user registration"
    "Implemented password reset functionality"
    "Fixed issues with JWT token expiration"
    "Updated README with project setup instructions"
    "Improved user authentication flow"
    "Implemented role-based access control"
    "Fixed issue with login API"
    "Updated dependencies to latest versions"
    "Fixed user data validation errors"
    "Finalized user API endpoints"
)

# Initialize the Git repository
git init
echo "# $PROJECT_NAME" > README.md
git add README.md
git commit -m "${COMMIT_MESSAGES[0]}"

# Convert start date to timestamp
CURRENT_DATE=$(date -d "$START_DATE" +"%s")
END_TIMESTAMP=$(date -d "$END_DATE" +"%s")

# Loop through each day and make a commit with different technical terms
COMMIT_INDEX=1  # Start from the second message in the array
while [ "$CURRENT_DATE" -le "$END_TIMESTAMP" ]; do
    # Use a commit message from the array
    COMMIT_MESSAGE="${COMMIT_MESSAGES[$COMMIT_INDEX]}"
    echo "Implementation details for $CURRENT_DATE" > update.txt
    git add update.txt
    git commit -m "$COMMIT_MESSAGE"

    # Move to next day (86400 seconds = 1 day)
    CURRENT_DATE=$((CURRENT_DATE + 86400))

    # Increment commit index, reset if we exceed the message array
    COMMIT_INDEX=$((COMMIT_INDEX + 1))
    if [ "$COMMIT_INDEX" -ge "${#COMMIT_MESSAGES[@]}" ]; then
        COMMIT_INDEX=0  # Loop back to the first message
    fi
done
