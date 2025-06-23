$(document).ready(function() {
    // Agregar fecha
    $('#addDateBtn').on('click', function() {
        const newInput = `
            <div class="input-group mb-2">
                <input type="date" name="quantityStore[]" class="form-control" data-fechaVencimiento>
                <div class="input-group-append">
                    <button class="btn btn-danger btn-sm removeDateBtn" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>`;
        $('#datesContainer').append(newInput);
    });

    // Eliminar fecha
    $('#datesContainer').on('click', '.removeDateBtn', function() {
        $(this).closest('.input-group').remove();
    });

    $('.circle-btn').on('click', function() {
        const positionId = $(this).data('position-id');
        const positionName = $(this).data('position-name');
        const status = $(this).data('position-status');

        if (status === 'inactive') {
            $.confirm({
                title: 'Posición bloqueada',
                content: `La posición "<strong>${positionName}</strong>" está bloqueada y no se pueden colocar productos.`,
                type: 'red',
                buttons: {
                    ok: {
                        text: 'Entendido',
                        btnClass: 'btn-red'
                    }
                }
            });
        } else {
            // Asignar datos al input
            const $input = $('#locationSend');
            $input.val(positionName);
            $input.attr('data-position_id', positionId);

            // Quitar clase a todos los botones primero
            $('.circle-btn').removeClass('selected-position');

            // Agregar clase al botón actual
            $(this).addClass('selected-position');
        }
    });

    $('#sendDataBtn').on('click', function() {

        $("#sendDataBtn").attr("disabled", true);

        const materialId = $('#material_id').val();
        const positionId = $('#locationSend').attr('data-position_id');
        const quantity = $('[data-quantitySend]').val();
        const unitPrice = $('[data-priceUnitSend]').val();

        let perecible = $('#material_perecible').val();

        // Validaciones básicas
        if (!positionId) {
            $.alert({
                title: 'Error',
                content: 'Debes seleccionar una ubicación válida.',
                type: 'red'
            });
            $("#sendDataBtn").attr("disabled", false);
            return;
        }

        if (!quantity || quantity <= 0) {
            $.alert({
                title: 'Error',
                content: 'La cantidad a trasladar debe ser mayor a 0.',
                type: 'red'
            });
            $("#sendDataBtn").attr("disabled", false);
            return;
        }

        if (!unitPrice || unitPrice <= 0) {
            $.alert({
                title: 'Error',
                content: 'El precio unitario debe ser mayor a 0.',
                type: 'red'
            });
            $("#sendDataBtn").attr("disabled", false);
            return;
        }

        // Obtener todas las fechas
        let fechas = [];
        $('[data-fechaVencimiento]').each(function() {
            const fecha = $(this).val();
            if (fecha) {
                fechas.push(fecha);
            }
        });

        console.log(fechas.length);

        if ( perecible === 's' && fechas.length === 0) {
            $.alert({
                title: 'Error',
                content: 'Debes agregar al menos una fecha de vencimiento porque el material es perecible.',
                type: 'red'
            });
            $("#sendDataBtn").attr("disabled", false);
            return;
        }

        // Enviar por AJAX
        $.ajax({
            url: '/dashboard/traslado/guardar',
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                material_id: materialId,
                position_id: positionId,
                quantity: quantity,
                unit_price: unitPrice,
                fechas: fechas
            },
            success: function(response) {
                $.alert({
                    title: 'Éxito',
                    content: 'Traslado guardado correctamente.',
                    type: 'green'
                });

                // Resetear formulario
                $('#locationSend').val('').removeAttr('data-position_id');
                $('[data-quantitySend]').val('');
                $('[data-priceUnitSend]').val('');
                $('#datesContainer').empty();

                setTimeout( function () {
                    $("#sendDataBtn").attr("disabled", false);
                    location.reload();
                }, 2000 )
            },
            error: function(xhr) {
                $.alert({
                    title: 'Error',
                    content: 'Hubo un problema al guardar el traslado.',
                    type: 'red'
                });
                console.log(xhr.responseText);
                $("#sendDataBtn").attr("disabled", false);
            }
        });
    });
});