import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la Carga de Estrés
export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp-up: Sube a 50 usuarios virtuales en 30s
        { duration: '1m', target: 100 },  // Plateau: Mantiene 100 usuarios activos por 1 minuto
        { duration: '30s', target: 0 },   // Ramp-down: Baja a 0 usuarios
    ],
    thresholds: {
        // El 95% de las peticiones deben responder en menos de 500ms
        http_req_duration: ['p(95)<500'],
        // Menos de un 1% de tasa de fallo
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    // Simular un request gráfico a la landing o endpoint de API
    const res = http.get('http://127.0.0.1:8000/');

    check(res, {
        'estatus HTTP es 200': (r) => r.status === 200,
        'tiempo de respuesta aceptable': (r) => r.timings.duration < 1000,
    });

    // Pausa pseudo-random típica de un humano leyendo
    sleep(Math.random() * 2);
}
