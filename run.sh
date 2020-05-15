echo "===== Copying service file"
sudo cp motion.service /etc/systemd/system/

echo "===== Reloading daemons"
sudo systemctl daemon-reload

echo "===== Starting service"
sudo systemctl enable motion.service
sudo systemctl start motion.service
