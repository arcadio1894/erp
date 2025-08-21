$(document).ready(function () {
    $permissions = JSON.parse($('#permissions').val());
    //console.log($permissions);
    $('#sandbox-container .input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true
    });

    getDataPromotions(1);

    $("#btnBusquedaAvanzada").click(function(e){
        e.preventDefault();
        $(".busqueda-avanzada").slideToggle();
    });

    $(document).on('click', '[data-item]', showData);
    $("#btn-search").on('click', showDataSearch);

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    $(document).on('click', '[data-anular]', deletePromotion);

});

var $formDelete;
var $modalDelete;
var $modalDecimals;
var $formDecimals;

var $permissions;
var $modalDetraction;

function deletePromotion() {
    var promotion_id = $(this).data('delete');

    $.confirm({
        icon: 'fas fa-frown',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'red',
        title: '¿Está seguro de eliminar esta promoción?',
        content: "",
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                action: function (e) {
                    $.ajax({
                        url: '/dashboard/destroy/promotion/limits/'+promotion_id,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        processData:false,
                        contentType:false,
                        success: function (data) {
                            console.log(data);
                            $.alert("Promocíon anulada.");
                            setTimeout( function () {
                                /*location.reload();*/
                                getDataPromotions(1);
                            }, 2000 )
                        },
                        error: function (data) {
                            $.alert("Sucedió un error en el servidor. Intente nuevamente.");
                        },
                    });
                },
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $.alert("Anulación cancelada.");
                },
            },
        },
    });

}

function showDataSearch() {
    getDataPromotions(1)
}

function showData() {
    //event.preventDefault();
    var numberPage = $(this).attr('data-item');
    console.log(numberPage);
    getDataPromotions(numberPage)
}

function getDataPromotions($numberPage) {
    $('[data-toggle="tooltip"]').tooltip('dispose').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    $.get('/dashboard/get/data/promotion/orders/'+$numberPage, function(data) {
        if ( data.data.length == 0 )
        {
            renderDataPromotionsEmpty(data);
        } else {
            renderDataPromotions(data);
        }


    }).fail(function(jqXHR, textStatus, errorThrown) {
        // Función de error, se ejecuta cuando la solicitud GET falla
        console.error(textStatus, errorThrown);
        if (jqXHR.responseJSON.message && !jqXHR.responseJSON.errors) {
            toastr.error(jqXHR.responseJSON.message, 'Error', {
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
        for (var property in jqXHR.responseJSON.errors) {
            toastr.error(jqXHR.responseJSON.errors[property], 'Error', {
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
    }, 'json')
        .done(function() {
            // Configuración de encabezados
            var headers = {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            };

            $.ajaxSetup({
                headers: headers
            });
        });
}

function renderDataPromotionsEmpty(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;
    console.log(dataAccounting);
    console.log(pagination);

    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' cotizaciones');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    renderDataTableEmpty();
}

function renderDataPromotions(data) {
    var dataQuotes = data.data;
    var pagination = data.pagination;
    console.log(dataQuotes);
    console.log(pagination);

    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' promociones.');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    for (let j = 0; j < dataQuotes.length ; j++) {
        renderDataTable(dataQuotes[j]);
    }

    if (pagination.currentPage > 1)
    {
        renderPreviousPage(pagination.currentPage-1);
    }

    if (pagination.totalPages > 1)
    {
        if (pagination.currentPage > 3)
        {
            renderItemPage(1);

            if (pagination.currentPage > 4) {
                renderDisabledPage();
            }
        }

        for (var i = Math.max(1, pagination.currentPage - 2); i <= Math.min(pagination.totalPages, pagination.currentPage + 2); i++)
        {
            renderItemPage(i, pagination.currentPage);
        }

        if (pagination.currentPage < pagination.totalPages - 2)
        {
            if (pagination.currentPage < pagination.totalPages - 3)
            {
                renderDisabledPage();
            }
            renderItemPage(i, pagination.currentPage);
        }

    }

    if (pagination.currentPage < pagination.totalPages)
    {
        renderNextPage(pagination.currentPage+1);
    }
}

function renderDataTableEmpty() {
    var clone = activateTemplate('#item-table-empty');
    $("#body-table").append(clone);
}

function renderDataTable(data) {
    var clone = activateTemplate('#item-table');
    clone.querySelector("[data-id]").innerHTML = data.id;
    clone.querySelector("[data-table]").innerHTML = data.table;
    clone.querySelector("[data-order]").innerHTML = data.order;

    // Agregamos evento a las flechas
    $(clone).find(".btn-up").click(function () {
        updateOrder(data.id, 'up');
    });

    $(clone).find(".btn-down").click(function () {
        updateOrder(data.id, 'down');
    });

    $("#body-table").append(clone);

    $('[data-toggle="tooltip"]').tooltip();
}

function updateOrder(id, direction) {
    $.ajax({
        url: '/dashboard/promotion-orders/update-order', // Ajusta esta URL si usas una ruta diferente
        method: 'POST',
        data: {
            id: id,
            direction: direction,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            if (response.success) {
                getDataPromotions(1); // O refresca solo la fila si prefieres
            } else {
                alert(response.message);
            }
        },
        error: function () {
            alert("Error en el servidor.");
        }
    });
}

function renderPreviousPage($numberPage) {
    var clone = activateTemplate('#previous-page');
    clone.querySelector("[data-item]").setAttribute('data-item', $numberPage);
    $("#pagination").append(clone);
}

function renderDisabledPage() {
    var clone = activateTemplate('#disabled-page');
    $("#pagination").append(clone);
}

function renderItemPage($numberPage, $currentPage) {
    var clone = activateTemplate('#item-page');
    if ( $numberPage == $currentPage )
    {
        clone.querySelector("[data-item]").setAttribute('data-item', $numberPage);
        clone.querySelector("[data-active]").setAttribute('class', 'page-item active');
        clone.querySelector("[data-item]").innerHTML = $numberPage;
    } else {
        clone.querySelector("[data-item]").setAttribute('data-item', $numberPage);
        clone.querySelector("[data-item]").innerHTML = $numberPage;
    }

    $("#pagination").append(clone);
}

function renderNextPage($numberPage) {
    var clone = activateTemplate('#next-page');
    clone.querySelector("[data-item]").setAttribute('data-item', $numberPage);
    $("#pagination").append(clone);
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}