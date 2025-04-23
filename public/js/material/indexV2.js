$(document).ready(function () {
    $permissions = JSON.parse($('#permissions').val());
    //console.log($permissions);

    $('.custom-control-input').change(function() {
        updateData();
    });


    // Variable para almacenar los nombres clave de los checkboxes activos
    var activeColumns = getActiveColumns();

    // Función para obtener y mostrar los datos iniciales
    function initData() {
        activeColumns = getActiveColumns();
        console.log(activeColumns);
        getDataMaterials(1, activeColumns);
    }

    // Función para obtener y mostrar los datos con los checkboxes actuales
    function updateData() {
        activeColumns = getActiveColumns();
        getDataMaterials(1, activeColumns);
    }

    // Función para obtener y mostrar los datos con los checkboxes activos y criterios de búsqueda
    function showDataSearch() {
        activeColumns = getActiveColumns();
        getDataMaterials(1, activeColumns);
    }

    // Evento al cargar la página
    initData();

    $("#btnBusquedaAvanzada").click(function(e){
        e.preventDefault();
        $(".busqueda-avanzada").slideToggle();
    });

    $(document).on('click', '[data-item]', showData);

    $("#btn-search").on('click', showDataSearch);

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    $('#btn-export').on('click', exportExcel);

    $modalImage = $('#modalImage');

    $formDelete = $('#formDelete');
    $formDelete.on('submit', disableMaterial);
    $modalDelete = $('#modalDelete');
    $(document).on('click', '[data-delete]', openModalDisable);

    $(document).on('click', '[data-image]', showImage);

    $selectCategory = $('#category');

    $selectSubCategory = $('#subcategory');

    $selectType = $('#material_type');

    $selectSubtype = $('#sub_type');

    $selectCategory.change(function () {
        $selectSubCategory.empty();
        $selectType.val('0');
        $selectType.trigger('change');
        $selectSubtype.val('0');
        $selectSubtype.trigger('change');
        var category =  $selectCategory.val();
        $.get( "/dashboard/get/subcategories/"+category, function( data ) {
            $selectSubCategory.append($("<option>", {
                value: '',
                text: 'Ninguna'
            }));
            for ( var i=0; i<data.length; i++ )
            {
                $selectSubCategory.append($("<option>", {
                    value: data[i].id,
                    text: data[i].subcategory
                }));
            }
        });

    });

    $selectSubCategory.change(function () {
        let subcategory = $selectSubCategory.select2('data');
        let option = $selectSubCategory.find(':selected');

        console.log(option);
        if(subcategory[0].text == 'INOX' || subcategory[0].text == 'FENE') {
            $selectType.empty();
            var subcategoria =  subcategory[0].id;
            $.get( "/dashboard/get/types/"+subcategoria, function( data ) {
                $selectType.append($("<option>", {
                    value: '',
                    text: 'Ninguno'
                }));
                for ( var i=0; i<data.length; i++ )
                {
                    $selectType.append($("<option>", {
                        value: data[i].id,
                        text: data[i].type
                    }));
                }
            });
        } else {
            console.log(subcategory[0].text);
            $selectType.val('0');
            $selectType.trigger('change');
            $selectSubtype.val('0');
            $selectSubtype.trigger('change');
            $selectSubCategory.select2('close');
        }
    });

    $selectType.change(function () {
        $selectSubtype.empty();
        var type = $selectType.select2('data');
        console.log(type);
        if( type.length !== 0)
        {
            $.get( "/dashboard/get/subtypes/"+type[0].id, function( data ) {
                $selectSubtype.append($("<option>", {
                    value: '',
                    text: 'Ninguno'
                }));
                for ( var i=0; i<data.length; i++ )
                {
                    $selectSubtype.append($("<option>", {
                        value: data[i].id,
                        text: data[i].subtype
                    }));
                }
            });
        }


    });

    $(document).on('click', '[data-precioDirecto]', openModalPrecioDirecto);
    $(document).on('click', '[data-precioPorcentaje]', openModalPrecioPorcentaje);

    $modalPrecioDirecto = $('#modalPrecioDirecto');
    $modalPrecioPercentage = $('#modalPrecioPercentage');

    $formPrecioDirecto = $('#formPrecioDirecto');
    $formPrecioPorcentaje = $('#formPrecioPorcentaje');

    $('#btn-submit_priceList').on('click', setPriceList);
    $('#btn-submit_pricePercentage').on('click', setPricePercentage);


    $(document).on('click', '[data-separate]', openModalSeparate);

    $formSeparate = $('#formSeparate');
    $modalSeparate = $('#modalSeparate');

    $('#btn-submitSeparate').on('click', submitSeparate);


    $(document).on('click', '[data-assign_child]', openModalAssignChild);
    $formAssignChild = $('#formAssignChild');
    $modalAssignChild = $('#modalAssignChild');

    $('#btn-submitAssignChild').on('click', submitAssignChild);

    // Evento delegado para eliminar un hijo
    $(document).on('click', '.btn-remove-child', function() {
        var button = $(this);
        var material_id = button.data('material_id');
        var unpack_id = button.data('material_unpack_id');

        if (!confirm('¿Estás seguro de eliminar este hijo?')) return;

        $.ajax({
            url: '/dashboard/material-unpack/' + unpack_id,
            type: 'DELETE',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content') // CSRF token
            },
            success: function(response) {
                // Recargar hijos después de eliminar
                $.get('/dashboard/material-unpack/' + material_id + '/childs', function(res) {
                    $('#body-childs').empty();
                    if (res.length > 0) {
                        $.each(res, function(index, item) {
                            var row = `
                            <tr>
                                <th scope="row">${index + 1}</th>
                                <td>${item.name}</td>
                                <td>
                                    <button 
                                        type="button" 
                                        class="btn btn-outline-danger btn-block btn-remove-child" 
                                        data-material_id="${material_id}" 
                                        data-material_unpack_id="${item.id}">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                            $('#body-childs').append(row);
                        });
                    }
                });
            },
            error: function() {
                alert('Hubo un error al intentar eliminar.');
            }
        });
    });
});

var $formAssignChild;
var $modalAssignChild;

var $formSeparate;

var $formDelete;
var $modalDelete;
var $permissions;
var $selectCategory;
var $selectSubCategory;
var $selectType;
var $selectSubtype;

var $modalPrecioDirecto;
var $modalPrecioPercentage;
var $formPrecioDirecto;
var $formPrecioPorcentaje;


function submitAssignChild() {
    var child_id = $('#material').val();
    var parent_id = $('#material_id').val();

    if (!child_id) {
        $.alert({
            title: 'Error',
            content: 'Debes seleccionar un material hijo.',
            type: 'red',
            typeAnimated: true
        });
        return;
    }

    $.post('/dashboard/material-unpack/store', {
        _token: $('meta[name="csrf-token"]').attr('content'),
        parent_material_id: parent_id,
        child_material_id: child_id
    }, function(response) {
        $.alert({
            title: 'Éxito',
            content: 'Material hijo asignado correctamente.',
            type: 'green',
            typeAnimated: true
        });

        // Vaciar el select (opcional)
        $('#material').val(null).trigger('change');

        // Volver a cargar hijos
        $.get('/dashboard/material-unpack/' + parent_id + '/childs', function(res) {
            $('#body-childs').empty();
            if (res.length > 0) {
                $.each(res, function(index, item) {
                    var row = `
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td>${item.name}</td>
                            <td>
                                <button 
                                    type="button" 
                                    class="btn btn-outline-danger btn-block btn-remove-child" 
                                    data-material_id="${parent_id}" 
                                    data-material_unpack_id="${item.id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    $('#body-childs').append(row);
                });
            }
        });
    }).fail(function() {
        $.alert({
            title: 'Error',
            content: 'No se pudo asignar el material. Intenta nuevamente.',
            type: 'red',
            typeAnimated: true
        });
    });
}

function openModalAssignChild() {
    var material_id = $(this).data('material');
    var description = $(this).data('description');

    // Traer los hijos si hay
// Limpiar tabla
    $('#body-childs').empty();

    // Obtener hijos vía AJAX
    $.get('/dashboard/material-unpack/' + material_id + '/childs', function(response) {
        if (response.length > 0) {
            $.each(response, function(index, item) {
                var row = `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${item.name}</td>
                        <td>
                            <button 
                                type="button" 
                                class="btn btn-outline-danger btn-block btn-remove-child" 
                                data-material_id="${material_id}" 
                                data-material_unpack_id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
                $('#body-childs').append(row);
            });
        }
    });

    $modalAssignChild.find('[id=material_id]').val(material_id);
    $modalAssignChild.find('[id=name_material]').html(description);
    $modalAssignChild.modal('show');
}

function submitSeparate() {
    event.preventDefault();
    $("#btn-submitSeparate").attr("disabled", true);
    // Obtener la URL
    var createUrl = $formSeparate.data('url');
    var form = new FormData($('#formSeparate')[0]);
    $.ajax({
        url: createUrl,
        method: 'POST',
        data: form,
        processData:false,
        contentType:false,
        success: function (data) {
            console.log(data);
            toastr.success(data.message, 'Éxito',
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
            setTimeout( function () {
                $("#btn-submitSeparate").attr("disabled", false);
                $modalSeparate.modal('hide');
                var activeColumns = getActiveColumns();
                getDataMaterials(1, activeColumns);
            }, 1000 )
        },
        error: function (data) {
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
                        "timeOut": "4000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }
            $("#btn-submitSeparate").attr("disabled", false);

        },
    });


}

function openModalSeparate() {
    var material_id = $(this).data('material');
    var description = $(this).data('description');
    var quantity = $(this).data('quantity');

    $modalSeparate.find('[id=material_id]').val(material_id);
    $modalSeparate.find('[id=name_material]').html(description);
    $modalSeparate.find('[id=packs_total]').val(quantity);
    $modalSeparate.find('[id=packs_separate]').val(0);

    // Limpiar y deshabilitar temporalmente el select
    let $select = $modalSeparate.find('#materialChild');
    $select.empty().append('<option value="">Cargando...</option>').prop('disabled', true);

    // Obtener los materiales hijos
    $.get('/dashboard/material-unpack/' + material_id + '/child-materials', function(res) {
        $select.empty().append('<option value="">Seleccione un material</option>');

        if (res.length > 0) {
            $.each(res, function(index, item) {
                $select.append('<option value="' + item.id + '">' + item.name + '</option>');
            });
        }

        $select.prop('disabled', false);
    });

    $modalSeparate.modal('show');
}



function setPricePercentage() {
    event.preventDefault();
    $("#btn-submit_pricePercentage").attr("disabled", true);
    // Obtener la URL
    var createUrl = $formPrecioPorcentaje.data('url');
    var form = new FormData($('#formPrecioPorcentaje')[0]);
    $.ajax({
        url: createUrl,
        method: 'POST',
        data: form,
        processData:false,
        contentType:false,
        success: function (data) {
            console.log(data);
            toastr.success(data.message, 'Éxito',
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
            setTimeout( function () {
                $("#btn-submit_pricePercentage").attr("disabled", false);
                $modalPrecioPercentage.modal('hide');
                var activeColumns = getActiveColumns();
                console.log(activeColumns);
                getDataMaterials(1, activeColumns);
            }, 2000 )
        },
        error: function (data) {
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
                        "timeOut": "4000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }
            $("#btn-submit_pricePercentage").attr("disabled", false);

        },
    });
}

function setPriceList() {
    event.preventDefault();
    $("#btn-submit_priceList").attr("disabled", true);
    // Obtener la URL
    var createUrl = $formPrecioDirecto.data('url');
    var form = new FormData($('#formPrecioDirecto')[0]);
    $.ajax({
        url: createUrl,
        method: 'POST',
        data: form,
        processData:false,
        contentType:false,
        success: function (data) {
            console.log(data);
            toastr.success(data.message, 'Éxito',
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
            setTimeout( function () {
                $("#btn-submit_priceList").attr("disabled", false);
                $modalPrecioDirecto.modal('hide');
                var activeColumns = getActiveColumns();
                console.log(activeColumns);
                getDataMaterials(1, activeColumns);
            }, 2000 )
        },
        error: function (data) {
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
                        "timeOut": "4000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }
            $("#btn-submit_priceList").attr("disabled", false);

        },
    });
}

function openModalPrecioDirecto() {
    var material_id = $(this).data('material');

    var priceList = 0;

    $.get('/dashboard/get/price/list/material/'+material_id, function(data) {
        priceList = data.priceList;
        $modalPrecioDirecto.find('[id=material_priceList]').val(priceList);

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

    $modalPrecioDirecto.find('[id=material_id]').val(material_id);

    $modalPrecioDirecto.modal('show');
}

function openModalPrecioPorcentaje() {
    var material_id = $(this).data('material');

    var pricePercentage = 0;

    $.get('/dashboard/get/price/percentage/material/'+material_id, function(data) {
        pricePercentage = data.pricePercentage;
        $modalPrecioPercentage.find('[id=material_pricePercentage]').val(pricePercentage);

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

    $modalPrecioPercentage.find('[id=material_id]').val(material_id);

    $modalPrecioPercentage.modal('show');
}

// Función para obtener los nombres clave de los checkboxes activos
function getActiveColumns() {
    var activeColumns = [];
    $('input[type="checkbox"]:checked').each(function() {
        activeColumns.push($(this).data('column'));
    });
    return activeColumns;
}

function openModalDisable() {
    var material_id = $(this).data('delete');
    var description = $(this).data('description');

    $modalDelete.find('[id=material_id]').val(material_id);
    $modalDelete.find('[id=descriptionDelete]').html(description);

    $modalDelete.modal('show');
}

function disableMaterial() {
    event.preventDefault();
    // Obtener la URL
    var deleteUrl = $formDelete.data('url');
    $.ajax({
        url: deleteUrl,
        method: 'POST',
        data: new FormData(this),
        processData:false,
        contentType:false,
        success: function (data) {
            console.log(data);
            toastr.success(data.message, 'Éxito',
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
            $modalDelete.modal('hide');
            setTimeout( function () {
                location.reload();
            }, 2000 )
        },
        error: function (data) {
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
            /*for ( var property in data.responseJSON.errors ) {
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
                        "timeOut": "4000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }*/


        },
    });
}

function showImage() {
    var path = $(this).data('src');
    $('#image-document').attr('src', path);
    $modalImage.modal('show');
}

function exportExcel() {
    var start  = $('#start').val();
    var end  = $('#end').val();
    var startDate   = moment(start, "DD/MM/YYYY");
    var endDate     = moment(end, "DD/MM/YYYY");

    console.log(start);
    console.log(end);
    console.log(startDate);
    console.log(endDate);

    if ( start == '' || end == '' )
    {
        console.log('Sin fechas');
        $.confirm({
            icon: 'fas fa-file-excel',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'green',
            title: 'No especificó fechas',
            content: 'Si no hay fechas se descargará todos los ingresos',
            buttons: {
                confirm: {
                    text: 'DESCARGAR',
                    action: function (e) {
                        //$.alert('Descargado igual');
                        console.log(start);
                        console.log(end);

                        var query = {
                            start: start,
                            end: end
                        };

                        $.alert('Descargando archivo ...');

                        var url = "/dashboard/exportar/reporte/egresos/proveedores/?" + $.param(query);

                        window.location = url;

                    },
                },
                cancel: {
                    text: 'CANCELAR',
                    action: function (e) {
                        $.alert("Exportación cancelada.");
                    },
                },
            },
        });
    } else {
        console.log('Con fechas');
        console.log(JSON.stringify(start));
        console.log(JSON.stringify(end));

        var query = {
            start: start,
            end: end
        };

        toastr.success('Descargando archivo ...', 'Éxito',
            {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "2000",
                "timeOut": "2000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            });

        var url = "/dashboard/exportar/reporte/egresos/proveedores/?" + $.param(query);

        window.location = url;

    }

}

/*function showDataSearch() {
    getDataMaterials(1)
}*/

function showData() {
    //event.preventDefault();
    var numberPage = $(this).attr('data-item');
    console.log(numberPage);
    var activeColumns = getActiveColumns();
    getDataMaterials(numberPage, activeColumns)
}

function getDataMaterials($numberPage, $activeColumns) {
    $('[data-toggle="tooltip"]').tooltip('dispose').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    var description = $('#description').val();
    var code = $('#code').val();
    var category = $('#category').val();
    var subcategory = $('#subcategory').val();
    var material_type = $('#material_type').val();
    var sub_type = $('#sub_type').val();
    var cedula = $('#cedula').val();
    var calidad = $('#calidad').val();
    var marca = $('#marca').val();
    var retaceria = $('#retaceria').val();
    var rotation = $('#rotation').val();
    var isPack = $('#isPack').val();

    $.get('/dashboard/get/data/material/v2/'+$numberPage, {
        description:description,
        code:code,
        category: category,
        subcategory: subcategory,
        material_type: material_type,
        sub_type: sub_type,
        cedula: cedula,
        calidad: calidad,
        marca: marca,
        retaceria: retaceria,
        rotation: rotation,
        isPack: isPack
    }, function(data) {
        if ( data.data.length == 0 )
        {
            renderDataMaterialsEmpty(data);
        } else {
            renderDataMaterials(data, $activeColumns);
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

function renderDataMaterialsEmpty(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;
    console.log(dataAccounting);
    console.log(pagination);

    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' materiales');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    renderDataTableEmpty();
}

function renderDataMaterials(data, activeColumns) {
    var dataQuotes = data.data;
    var pagination = data.pagination;
    console.log(dataQuotes);
    console.log(pagination);
    console.log(activeColumns);

    $("#header-table").html('');
    $("#body-table").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' materiales.');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    renderDataTableHeader(activeColumns);

    for (let j = 0; j < dataQuotes.length ; j++) {
        renderDataTable(dataQuotes[j], activeColumns);
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

function renderDataTableHeader(activeColumns) {
    var cloneHeader = document.querySelector('#item-header').content.cloneNode(true);
    var headerRow = cloneHeader.querySelector('tr');

    headerRow.querySelectorAll('[data-column]').forEach(function(column) {
        var columnName = column.dataset.column;
        if (activeColumns.includes(columnName)) {
            column.style.display = 'table-cell';
        } else {
            column.style.display = 'none';
        }
    });

    $("#header-table").append(cloneHeader);

}

function renderDataTable(data, activeColumns) {
    var clone = document.querySelector('#item-table').content.cloneNode(true);

    // Iterar sobre cada columna en el cuerpo de la tabla y mostrar u ocultar según los checkboxes activos
    clone.querySelectorAll('[data-column]').forEach(function(column) {
        var columnName = column.dataset.column;
        if (activeColumns.includes(columnName)) {
            column.style.display = 'table-cell';
        } else {
            column.style.display = 'none';
        }
    });

    // Llenar los datos en cada celda según el objeto de datos
    clone.querySelector("[data-codigo]").innerHTML = data.codigo;
    if ( data.update_price == 1 )
    {
        clone.querySelector("[data-descripcion]").innerHTML = '<p class="text-blue">'+data.descripcion+'</p>';
    } else {
        clone.querySelector("[data-descripcion]").innerHTML = data.descripcion;
    }

    clone.querySelector("[data-medida]").innerHTML = data.medida;
    clone.querySelector("[data-unidad_medida]").innerHTML = data.unidad_medida;
    clone.querySelector("[data-stock_max]").innerHTML = data.stock_max;
    clone.querySelector("[data-stock_min]").innerHTML = data.stock_min;
    clone.querySelector("[data-stock_actual]").innerHTML = data.stock_actual;
    clone.querySelector("[data-prioridad]").innerHTML = data.prioridad;
    clone.querySelector("[data-precio_unitario]").innerHTML = data.precio_unitario;
    clone.querySelector("[data-categoria]").innerHTML = data.categoria;
    clone.querySelector("[data-sub_categoria]").innerHTML = data.sub_categoria;
    clone.querySelector("[data-tipo]").innerHTML = data.tipo;
    clone.querySelector("[data-sub_tipo]").innerHTML = data.sub_tipo;
    clone.querySelector("[data-cedula]").innerHTML = data.cedula;
    clone.querySelector("[data-calidad]").innerHTML = data.calidad;
    clone.querySelector("[data-marca]").innerHTML = data.marca;
    clone.querySelector("[data-modelo]").innerHTML = data.modelo;
    clone.querySelector("[data-retaceria]").innerHTML = data.retaceria;

    let url_image = document.location.origin + '/images/material/' + data.image;
    clone.querySelector("[data-ver_imagen]").setAttribute("data-src", url_image);
    clone.querySelector("[data-ver_imagen]").setAttribute("data-image", data.id);

    clone.querySelector("[data-rotation]").innerHTML = data.rotation;

    // Configurar enlaces y botones según los permisos y datos
    if ($.inArray('update_material', $permissions) !== -1) {
        let url = document.location.origin + '/dashboard/editar/material/' + data.id;
        clone.querySelector("[data-editar_material]").setAttribute("href", url);
    } else {
        let element = clone.querySelector("[data-editar_material]");
        if (element) {
            element.style.display = 'none';
        }
    }

    if ($.inArray('enable_material', $permissions) !== -1) {
        clone.querySelector("[data-deshabilitar]").setAttribute("data-delete", data.id);
        clone.querySelector("[data-deshabilitar]").setAttribute("data-description", data.descripcion);
        clone.querySelector("[data-deshabilitar]").setAttribute("data-measure", data.medida);
    } else {
        let element = clone.querySelector("[data-deshabilitar]");
        if (element) {
            element.style.display = 'none';
        }
    }


    clone.querySelector("[data-precioPorcentaje]").setAttribute("data-material", data.id);
    clone.querySelector("[data-precioPorcentaje]").setAttribute("data-description", data.descripcion);
    clone.querySelector("[data-precioDirecto]").setAttribute("data-material", data.id);
    clone.querySelector("[data-precioDirecto]").setAttribute("data-description", data.descripcion);


    let url2 = document.location.origin + '/dashboard/view/material/items/' + data.id;
    clone.querySelector("[data-ver_items]").setAttribute("href", url2);


    if (data.isPack == 1) {
        clone.querySelector("[data-assign_child]").setAttribute("data-material", data.id);
        clone.querySelector("[data-assign_child]").setAttribute("data-description", data.descripcion);

        clone.querySelector("[data-separate]").setAttribute("data-material", data.id);
        clone.querySelector("[data-separate]").setAttribute("data-description", data.descripcion);
        clone.querySelector("[data-separate]").setAttribute("data-measure", data.medida);
        clone.querySelector("[data-separate]").setAttribute("data-quantity", data.stock_actual);
    } else {
        let element = clone.querySelector("[data-separate]");
        let element2 = clone.querySelector("[data-assign_child]");
        if (element) {
            element.style.display = 'none';
        }
        if (element2) {
            element2.style.display = 'none';
        }
    }

    // Agregar la fila clonada al cuerpo de la tabla
    $("#body-table").append(clone);

    // Inicializar tooltips si es necesario
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
