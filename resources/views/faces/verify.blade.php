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
        window.addEventListener('DOMContentLoaded', async function () {
            const labeledDescriptors = [];
            const faces = @json($faces);  // Rostros registrados

            // Cargar los modelos de cara
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
                await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
                console.log("Modelos cargados correctamente.");
            } catch (err) {
                console.error("Error al cargar los modelos:", err);
                return;  // Si hay un error en la carga de los modelos, se detiene la ejecución
            }

            // Ahora que los modelos están cargados, iniciamos la detección de rostros
            start();

            async function start() {
                const video = document.getElementById('videoElement');
                const canvas = document.getElementById('overlay');
                const resultBox = document.getElementById('result');

                // Iniciar cámara
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    video.srcObject = stream;
                } catch (err) {
                    console.error('Error al acceder a la cámara', err);
                    return;
                }

                // Esperar a que el video esté listo para la detección
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

                    // Detectar rostros en intervalos
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

                            // Comprobar prueba de vida (parpadeo o movimiento)
                            const landmarks = resizedDetections[i].landmarks;
                            const leftEye = landmarks.getLeftEye();
                            const rightEye = landmarks.getRightEye();

                            const blinkDetected = isBlinking(leftEye, rightEye);
                            if (blinkDetected) {
                                resultBox.innerHTML = `<strong>Resultado:</strong> ${bestMatch.toString()} - Parpadeo Detectado!`;
                                resultBox.className = bestMatch.label !== 'unknown' ? 'alert alert-success' : 'alert alert-danger';
                            } else {
                                resultBox.innerHTML = `<strong>Resultado:</strong> ${bestMatch.toString()} - Sin Parpadeo`;
                                resultBox.className = 'alert alert-warning';
                            }

                            // Si no hay parpadeo, marcarlo como un posible intento de fraude
                            if (!blinkDetected) {
                                resultBox.innerHTML += "<br><strong>Advertencia:</strong> No se detectó parpadeo, verifique si es una imagen.";
                            }
                        });

                        if (results.length === 0) {
                            resultBox.innerHTML = `Esperando rostro...`;
                            resultBox.className = 'alert alert-info';
                        }
                    }, 1000);
                });
            }

            // Función para detectar parpadeos
            function isBlinking(leftEye, rightEye) {
                const leftEyeHeight = Math.abs(leftEye[1].y - leftEye[5].y);
                const rightEyeHeight = Math.abs(rightEye[1].y - rightEye[5].y);
                return (leftEyeHeight < 5 && rightEyeHeight < 5);  // Si la altura de los ojos es pequeña, podría ser parpadeo
            }
        });
    </script>


    {{--<script defer>
        window.addEventListener('DOMContentLoaded', async function () {
            const labeledDescriptors = [];
            const faces = @json($faces);  // Rostros registrados

            // Cargar los modelos de cara
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
                await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
                console.log("Modelos cargados correctamente.");
            } catch (err) {
                console.error("Error al cargar los modelos:", err);
                return;  // Si hay un error en la carga de los modelos, se detiene la ejecución
            }

            // Ahora que los modelos están cargados, iniciamos la detección de rostros
            start();

            async function start() {
                const video = document.getElementById('videoElement');
                const canvas = document.getElementById('overlay');
                const resultBox = document.getElementById('result');

                // Iniciar cámara
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        video.srcObject = stream;
                    });

                // Esperar a que el video esté listo
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

                    // Detectar rostros en intervalos
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
    </script>--}}
@endsection
