echo "===== Building container"
docker build -t devinkott/security:latest --no-cache .

echo "===== Logging into docker"
cat ./docker_password.txt | docker login --username devinkott --password-stdin

echo "===== Pushing container"
docker push devinkott/security:latest

echo "===== Copying service file"
sudo cp motion.service /etc/systemd/system/

echo "===== Reloading daemons"
sudo systemctl daemon-reload

echo "===== Starting service"
sudo systemctl start motion.service
sudo systemctl enable motion.service