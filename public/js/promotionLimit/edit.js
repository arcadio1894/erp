let $materials=[];
var $permissions;
var $igv;

$(document).ready(function () {
    $permissions = JSON.parse($('#permissions').val());
    $igv = $('#igv').val();
    $.ajax({
        url: "/dashboard/get/promotion/limits/materials/totals",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $materials.push(json[i]);
            }
        }
    });

    $formCreate = $('#formCreate');

    $('.material_search').select2({
        placeholder: 'Selecciona un producto',
        ajax: {
            url: '/dashboard/get/promotion/limit/materials',
            dataType: 'json',
            type: 'GET',
            processResults(data) {
                //console.log(data);
                return {
                    results: $.map(data, function (item) {
                        //console.log(item.full_description);
                        return {
                            text: item.full_description,
                            id: item.id,
                        }
                    })
                }
            }
        }
    });

    $('.material_search').on('change', function() {
        const selectedId = $(this).val(); // id del material seleccionado
        const selectedMaterial = $materials.find(m => m.id == selectedId);

        if (selectedMaterial) {
            // Mostrar el precio en el input correspondiente
            $('#precioOriginal').val(selectedMaterial.list_price);
        } else {
            $('#precioOriginal').val('');
        }
    });

    // Detectar cambio en el radio (fijado / porcentaje)
    $('input[name="price_type"]').on('change', function () {
        updatePromoPrice();
    });

    // Detectar cuando el usuario cambie el valor de tipoPrecio
    $('#tipoPrecio').on('input', function () {
        updatePromoPrice();
    });

    // Detectar cuando se actualice el precio original
    $('#precioOriginal').on('input', function () {
        updatePromoPrice();
    });

    $('#btn-submit').click(function(e) {
        e.preventDefault();

        // Bloqueamos el botón
        const $btn = $(this);
        $btn.prop('disabled', true).text('Guardando...');

        // Recogemos datos del formulario
        const form = $('#formCreate');
        const url = form.data('url');

        const startDate = $('#start_date').val();
        const endDate = $('#end_date').val();

        if (!startDate || !endDate) {
            alert('Debe seleccionar ambas fechas: inicio y fin.');
            $btn.prop('disabled', false).text('Guardar promoción');
            return;
        }

        if (endDate < startDate) {
            alert('La fecha de fin no puede ser anterior a la de inicio.');
            $btn.prop('disabled', false).text('Guardar promoción');
            return;
        }

        const data = {
            _token: form.find('[name=_token]').val(),
            material_id: $('#material_id').val(),
            promotion_id: $('#promotion_id').val(),
            limit_quantity: $('#cantidadLimite').val(),
            applies_to: $('input[name=applies_to]:checked').val(),
            price_type: $('input[name=price_type]:checked').val(),
            percentage: $('#tipoPrecio').val(),
            promo_price: $('#precioPromocion').val(),
            original_price: $('#precioOriginal').val(),
            start_date: startDate,
            end_date: endDate,
        };

        // Enviamos vía AJAX
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            success: function(response) {
                toastr.success(response.message, 'Éxito',
                    {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": true,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "2000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
                // Puedes resetear el formulario o redirigir
                setTimeout( function () {
                    location.reload();
                }, 2000 )
            },
            error: function(data) {
                if( data.responseJSON.message && !data.responseJSON.errors )
                {
                    toastr.error(data.responseJSON.message, 'Error',
                        {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": false,
                            "onclick": null,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }
                for ( var property in data.responseJSON.errors ) {
                    toastr.error(data.responseJSON.errors[property], 'Error',
                        {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": false,
                            "onclick": null,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }
            },
            complete: function() {
                // Desbloqueamos el botón
                $btn.prop('disabled', false).text('Guardar promoción');
            }
        });
    });
});

var $formCreate;

function updatePromoPrice() {
    const priceType = $('input[name="price_type"]:checked').val();
    const originalPrice = parseFloat($('#precioOriginal').val()) || 0;
    const tipoPrecio = parseFloat($('#tipoPrecio').val()) || 0;

    let promoPrice = 0;

    if (priceType === 'fixed') {
        promoPrice = tipoPrecio;
    } else if (priceType === 'percentage') {
        promoPrice = originalPrice - (originalPrice * (tipoPrecio / 100));
    }

    // Colocar en el campo "Precio Promoción"
    $('#precioPromocion').val(promoPrice.toFixed(2));
}

function mayus(e) {
    e.value = e.value.toUpperCase();
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}