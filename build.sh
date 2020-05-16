echo "===== Building container"
docker build -t devinkott/security:latest --no-cache .

echo "===== Logging into docker"
cat ./docker_password.txt | docker login --username devinkott --password-stdin

echo "===== Pushing container"
docker push devinkott/security:latest

echo "===== Removing old service file"
sudo systemctl stop motion.service
sudo systemctl disable motion.service
sudo rm -rf /etc/systemd/system/motion.service

echo "===== Copying new service file"
sudo cp motion.service /etc/systemd/system/

echo "===== Reloading daemons"
sudo systemctl daemon-reload

echo "===== Starting service"
sudo systemctl enable motion.service
sudo systemctl start motion.service
