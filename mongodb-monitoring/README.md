# MongoDB - Monitoring with Prometheus Grafana

## Project Directory Structure
```
mongodb-monitoring/
│── docker-compose.yml
│── prometheus.yml
│── grafana/

```

// Windows
$env:MONGO_USERNAME = "mongouser"
echo $env:MONGO_USERNAME


// Linux


// Login MONGO
docker exec -it mongodb mongosh -u mongouser -p secretpassword --authenticationDatabase admin

Cek daftar database yang tersedia:
show dbs

Pilih database yang sesuai, misalnya mydb:
use mydb;

db.users.findOne({ email: "clara@example.co.id" })
db.users.find().limit(5).pretty()


// Get All User
use admin;
db.getUsers();

// Buat atau Update User dengan clusterMonitor
db.createUser({
  user: "exporter",
  pwd: "password",
  roles: [{ role: "clusterMonitor", db: "admin" }]
});

db.createUser({ user: "test", pwd: "testing", roles:[{ role: "clusterMonitor", db: "admin"}, { role: "read", db: "local"}]});

 3. Jika User Sudah Ada, Update Role-nya
Jika user exporter sudah ada, gunakan perintah berikut:

javascript
Copy
Edit
use admin;

db.updateUser("exporter", {
  roles: [{ role: "clusterMonitor", db: "admin" }]
});


db.updateUser("exporter", {
  roles: [{ role: "clusterMonitor", db: "admin" }]
});

// Restart MongoDB Exporter
docker-compose restart mongodb_exporter

// 
https://www.digitalocean.com/community/tutorials/how-to-monitor-mongodb-with-grafana-and-prometheus-on-ubuntu-20-04


2. Pilih Database yang Digunakan
Cek daftar database yang tersedia:

js
Copy
Edit
show dbs
Pilih database yang sesuai, misalnya mydb:

js
Copy
Edit
use mydb
3. Cek Apakah Data dengan Email Tertentu Ada
Misalkan data disimpan dalam koleksi users, jalankan:

js
Copy
Edit
db.users.findOne({ email: "clara@example.co.id" })
Jika data ada, hasilnya seperti ini:

js
Copy
Edit
{
    "_id": ObjectId("65123abcd456ef7890123456"),
    "email": "clara@example.co.id",
    "name": "Clara",
    "region": "Asia"
}
Jika hasilnya null, berarti data tidak ditemukan.

4. Cek Beberapa Data dalam Koleksi
Jika ingin melihat 5 data pertama:

js
Copy
Edit
db.users.find().limit(5).pretty()
Untuk melihat semua data (tanpa batasan):

js
Copy
Edit
db.users.find().pretty()
5. Cek Struktur Field dalam Koleksi
Untuk melihat hanya email dari semua data:

js
Copy
Edit
db.users.find({}, { email: 1, _id: 0 })
Jika hasilnya seperti ini:

js
Copy
Edit
{ "Email": "clara@example.co.id" }
maka field yang digunakan adalah "Email", bukan "email", sehingga query harus disesuaikan.

6. Cek Index pada Field email
js
Copy
Edit
db.users.getIndexes()
Jika tidak ada index email, buat index agar pencarian lebih cepat:

js
Copy
Edit
db.users.createIndex({ email: 1 })
7. Cek dengan Pencarian Case-Insensitive
Jika masih tidak menemukan data, coba $regex untuk pencarian fleksibel:

js
Copy
Edit
db.users.findOne({ email: { $regex: "^clara@example.co.id$", $options: "i" } })
Tambahkan $options: "i" agar pencarian tidak case-sensitive.

8. Cek Data dengan Kondisi Khusus
Cek apakah ada data yang email-nya mirip dengan "clara"
js
Copy
Edit
db.users.find({ email: /clara/ }).pretty()
Cek apakah ada email yang memiliki spasi atau karakter aneh
js
Copy
Edit
db.users.find({ email: { $regex: "\\s" } })
Jika ada hasil, berarti ada email yang tidak valid (misalnya "clara@example.co.id " dengan spasi di akhir).
