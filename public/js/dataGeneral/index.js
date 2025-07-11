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

    $('#sandbox-container1 .input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true
    });

    getDataGenerals(1);

    $("#btnBusquedaAvanzada").click(function(e){
        e.preventDefault();
        $(".busqueda-avanzada").slideToggle();
    });

    $(document).on('click', '[data-item]', showData);
    $("#btn-search").on('click', showDataSearch);

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    // 👉 Abrir modal de creación
    $(document).on('click', '[data-btn_create]', function () {
        $('#formDataGeneral')[0].reset();
        $('#dg_id').val('');
        $('#dg_valueText').val('').prop('disabled', false);
        $('#dg_valueNumber').val('').prop('disabled', true);
        $('#radio_text').prop('checked', true);
        $('#dataGeneralTitle').text('Nuevo Dato de Configuración');
        $('#modalDataGeneral').modal('show');
    });

    // 👉 Abrir modal de edición
    $(document).on('click', '[data-editar]', function () {
        // Obtener datos del botón
        const id = $(this).data('id');
        const name = $(this).data('name');
        const valueText = $(this).data('valuetext'); // ojo: data-valueText → valuetext (en lowercase)
        const valueNumber = $(this).data('valuenumber');
        const description = $(this).data('description');

        // Asignar al formulario
        $('#dg_id').val(id);
        $('#dg_name').val(name);
        $('#dg_valueText').val(valueText);
        $('#dg_valueNumber').val(valueNumber);
        $('#dg_description').val(description);
        $('#dataGeneralTitle').text('Editar Dato de Configuración');

        // Seleccionar tipo de valor
        if (valueNumber !== null && valueNumber !== '' && valueNumber !== 0 && !isNaN(valueNumber)) {
            $('#radio_number').prop('checked', true).trigger('change');
        } else {
            $('#radio_text').prop('checked', true).trigger('change');
        }

        // Mostrar modal
        $('#modalDataGeneral').modal('show');
    });

    // 👉 Guardar (crear o editar)
    $('#btnSaveDataGeneral').on('click', function () {
        let $btn = $(this);
        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Guardando...');

        // Limpia campos deshabilitados para que no se envíen
        let $form = $('#formDataGeneral');
        $form.find(':input:disabled').removeAttr('disabled');

        const id = $('#dg_id').val();
        const formData = $form.serialize();

        const url = id === ''
            ? $form.data('url_create')
            : $form.data('url_edit') + '/' + id;

        $.ajax({
            url: url,
            method: 'POST',
            data: formData,
            success: function (res) {
                $.confirm({
                    title: 'Éxito',
                    content: 'Los datos fueron guardados correctamente.',
                    type: 'green',
                    buttons: {
                        ok: function () {
                            $('#modalDataGeneral').modal('hide');
                            getDataGenerals(1); // O actualiza tabla vía AJAX si es dinámico
                        }
                    }
                });
            },
            error: function (xhr) {
                let content = 'Ocurrió un error inesperado.';

                if (xhr.status === 422 && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    content = '<ul>';
                    $.each(errors, function (key, val) {
                        content += `<li>${val[0]}</li>`;
                    });
                    content += '</ul>';
                }

                $.confirm({
                    title: 'Error',
                    content: content,
                    type: 'red',
                    buttons: {
                        ok: function () {}
                    }
                });
            },
            complete: function () {
                // Rehabilitar botón
                $btn.prop('disabled', false).html('Guardar');
            }
        });
    });

    // Activar/desactivar campos según el tipo de valor
    $('input[name="value_type"]').on('change', function () {
        if ($(this).val() === 'text') {
            $('#dg_valueText').prop('disabled', false);
            $('#dg_valueNumber').prop('disabled', true);
        } else {
            $('#dg_valueNumber').prop('disabled', false);
            $('#dg_valueText').prop('disabled', true);
        }
    });
});

var $permissions;

function showDataSearch() {
    getDataGenerals(1)
}

function showData() {
    //event.preventDefault();
    var numberPage = $(this).attr('data-item');
    console.log(numberPage);
    getDataGenerals(numberPage)
}

function getDataGenerals($numberPage) {
    $('[data-toggle="tooltip"]').tooltip('dispose').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    var name = $('#name').val();

    $.get('/dashboard/get/data/dataGeneral/'+$numberPage, {
        name: name
    },function(data) {
        if ( data.data.length == 0 )
        {
            renderDataGeneralsEmpty(data);
        } else {
            renderDataGenerals(data);
        }
        console.log(data.newlyCreated);
        if ( data.newlyCreated.length != 0 ) {
            showPopUp(data.newlyCreated);
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

function showPopUp(newlyCreated) {
    // Asumimos que `data.newlyCreated` está accesible
    let contentHtml = '<ul class="list-group">';
    newlyCreated.forEach(variable => {
        contentHtml += `<li class="list-group-item">${variable}</li>`;
    });
    contentHtml += '</ul>';

    $.confirm({
        title: 'Nuevas variables creadas',
        content: `
            <p>Se han creado nuevas variables que necesitan ser modificadas:</p>
            ${contentHtml}
        `,
        type: 'orange',
        typeAnimated: true,
        buttons: {

            cerrar: {
                text: 'Cerrar',
                action: function () {
                    // Solo cierra el popup
                }
            }
        }
    });
}

function renderDataGeneralsEmpty(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;
    console.log(dataAccounting);
    console.log(pagination);

    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' datos de configuración');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    renderDataTableEmpty();
}

function renderDataGenerals(data) {
    var dataFinanceWorks = data.data;
    var pagination = data.pagination;
    console.log(dataFinanceWorks);
    console.log(pagination);

    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' datos de configuración.');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    for (let j = 0; j < dataFinanceWorks.length ; j++) {
        renderDataTable(dataFinanceWorks[j]);
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
    clone.querySelector("[data-name]").innerHTML = data.name;
    clone.querySelector("[data-valuetext]").innerHTML = data.valueText;
    clone.querySelector("[data-valuenumber]").innerHTML = data.valueNumber;
    clone.querySelector("[data-description]").innerHTML = data.description;

    var botones = clone.querySelector("[data-buttons]");

    var cloneBtnExpress = activateTemplate('#template-express');

    if ( $.inArray('update_dataGeneral', $permissions) !== -1 ) {
        cloneBtnExpress.querySelector("[data-editar]").setAttribute("data-id", data.id);
        cloneBtnExpress.querySelector("[data-editar]").setAttribute("data-name", data.name);
        cloneBtnExpress.querySelector("[data-editar]").setAttribute("data-valuetext", data.valueText);
        cloneBtnExpress.querySelector("[data-editar]").setAttribute("data-valuenumber", data.valueNumber);
        cloneBtnExpress.querySelector("[data-editar]").setAttribute("data-description", data.description);
    } else {
        let element = cloneBtnExpress.querySelector("[data-editar]");
        if (element) {
            element.style.display = 'none';
        }
    }

    botones.append(cloneBtnExpress);

    $("#body-table").append(clone);

    $('[data-toggle="tooltip"]').tooltip();
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
