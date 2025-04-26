import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 20, // Jumlah virtual users
  duration: '60s', // Durasi pengujian
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% permintaan harus di bawah 500ms
  },
};

export default function () {
  let res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, {
    'status was 200': (r) => r.status === 200,
  });
  sleep(1);
}
