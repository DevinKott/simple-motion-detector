sudo docker build -t devinkott/security:latest --no-cache .
cat ./docker_password.txt | sudo docker login --username devinkott --password-stdin
sudo docker push devinkott/security:latest