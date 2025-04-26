## Grafana k6

docker-compose up -d


Buka browser dan akses: http://localhost:3000
Login dengan:
Username: admin
Password: admin
Tambahkan InfluxDB sebagai Data Source:
URL: http://influxdb:8086
Database: k6
Import dashboard K6 dari Grafana dengan ID: 2587


docker exec -it k6 k6 run /scripts/test-script.js


Sekarang, Anda bisa menambahkan atau mengubah file skrip di folder scripts/ tanpa perlu restart kontainer. Untuk menjalankan skrip, gunakan perintah:

sh
docker exec -it k6 k6 run /scripts/test-script.js

Jika Anda menambahkan skrip baru, misalnya new-test.js, cukup jalankan:

sh
docker exec -it k6 k6 run /scripts/new-test.js
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6 /scripts/test-script.js
