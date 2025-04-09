@extends('layouts.appAdmin2')

@section('title')
    Verificación Facial
@endsection

@section('activeInvoice')
    active
@endsection

@section('page-title')
    Verificar Rostro
@endsection

@section('page-breadcrumb')
    <li class="breadcrumb-item active">Verificar</li>
@endsection

@section('styles-plugins')
    <style>
        #videoElement {
            width: 100%;
            max-width: 400px;
            border: 1px solid #ddd;
        }
        canvas {
            position: absolute;
        }
    </style>
@endsection

@section('content')
    <div class="container mt-3">
        <div class="card shadow">
            <div class="card-body">
                <h4 class="mb-3">Verificación Facial en Vivo</h4>

                <div class="mb-3">
                    <video id="videoElement" autoplay muted></video>
                    <canvas id="overlay"></canvas>
                </div>

                <div id="result" class="alert alert-info">
                    Esperando rostro...
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <!-- Carga de face-api.js (con defer) -->
    <script defer src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>

    <!-- Tu script que usa faceapi -->
    <script defer>
        // Esperar a que todo cargue
        window.addEventListener('DOMContentLoaded', function () {
            // Aquí va todo tu código JS que usa faceapi
            const labeledDescriptors = [];

            // Cargar rostros registrados
            const faces = @json($faces);

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            ]).then(start)

            async function start() {
                const video = document.getElementById('videoElement');
                const canvas = document.getElementById('overlay');
                const resultBox = document.getElementById('result');

                // Iniciar cámara
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        video.srcObject = stream;
                    });

                // Esperar video
                video.addEventListener('playing', async () => {
                    const displaySize = { width: video.videoWidth, height: video.videoHeight };
                    faceapi.matchDimensions(canvas, displaySize);

                    // Cargar rostros registrados
                    for (const face of faces) {
                        const img = await faceapi.fetchImage('/storage/' + face.image_path);
                        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                        if (!detection) continue;
                        labeledDescriptors.push(
                            new faceapi.LabeledFaceDescriptors(face.name, [detection.descriptor])
                        );
                    }

                    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

                    setInterval(async () => {
                        const detections = await faceapi
                            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks()
                            .withFaceDescriptors();

                        const resizedDetections = faceapi.resizeResults(detections, displaySize);
                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

                        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                        results.forEach((bestMatch, i) => {
                            const box = resizedDetections[i].detection.box;
                            const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
                            drawBox.draw(canvas);

                            resultBox.innerHTML = `<strong>Resultado:</strong> ${bestMatch.toString()}`;
                            resultBox.className = bestMatch.label !== 'unknown' ? 'alert alert-success' : 'alert alert-danger';
                        });

                        if (results.length === 0) {
                            resultBox.innerHTML = `Esperando rostro...`;
                            resultBox.className = 'alert alert-info';
                        }
                    }, 1000);
                });
            }
        });
    </script>
@endsection
