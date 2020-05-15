echo "===== Removing old service file"
sudo systemctl disable motion.service
sudo rm -rf /etc/systemd/system/motion.service

echo "===== Copying new service file"
sudo cp motion.service /etc/systemd/system/

echo "===== Reloading daemons"
sudo systemctl daemon-reload

echo "===== Starting service"
sudo systemctl start motion.service
sudo systemctl enable motion.service
