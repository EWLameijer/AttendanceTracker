# Tentative instructions for using the AttendanceTracker Docker containers

(substitute mennomuller with the DockerHub username that should be used, including in "docker-compose.yml")

## Instructions to get the containers running locally:

- Make sure you have local copies of the images "mennomuller/attendancetracker-frontend", "mennomuller/attendancetracker-backend" and "postgres" (from DockerHub)
- Make sure the image names in the file "docker-compose.yml" correspond to the names of the actual images.
- Open the folder which has the file "docker-compose.yml" in a terminal
- use the command "docker-compose up"

## Instructions to update the containers using the latest code:

(On a computer which has the repository)

- Open the frontend folder in a terminal
- Use the command "docker build -t mennomuller/attendancetracker-frontend ." to build the image for the frontend
- Push the newly built image to DockerHub

- Open the backend folder in a terminal
- Use the command "docker build -t mennomuller/attendancetracker-backend ." to build the image for the backend
- Push the newly built image to DockerHub

(Connected to the server)

- Get the latest frontend and backend images from DockerHub
- Update the containers using docker-compose, in whatever way that works on the server.

## Instructions to shut down and remove the local containers:

- Use Ctrl+C to shut down the containers
- Use the command "docker-compose down" to remove them. (WARNING: This will also delete the database!)
