$(document).ready(function () {
    var id_area = $('#id_area').val();
    $permissions = JSON.parse($('#permissions').val());
    console.log($permissions);
    $('#dynamic-table').DataTable( {
        ajax: {
            url: "/dashboard/all/warehouses/"+id_area,
            dataSrc: 'data'
        },
        bAutoWidth: false,
        "aoColumns": [
            { data: 'id' },
            { data: 'name' },
            { data: 'comment' },
            { data: null,
                title: 'Acciones',
                wrap: true,
                "render": function (item)
                {
                    var text = '' + '<a href="'+document.location.origin+ '/dashboard/ver/anaqueles/almacen/'+item.id+'/area/'+item.area.id+'" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i> Ver anaqueles</a>';
                    if ( $.inArray('update_warehouse', $permissions) !== -1 ) {
                        text = text + ' <button data-area="'+item.area.id+'" data-comment="'+item.comment+'" data-name="'+item.name+'" data-edit="'+item.id+'" class="btn btn-outline-warning btn-sm"><i class="fa fa-pen"></i> Editar</button>';
                    }
                    if ( $.inArray('destroy_warehouse', $permissions) !== -1 ) {
                        text = text + ' <button data-delete="'+item.id+'" data-comment="'+item.comment+'" data-name="'+item.name+'" class="btn btn-outline-danger btn-sm"><i class="fa fa-trash"></i> Eliminar</button>';
                    }
                    if ( $.inArray('update_warehouse', $permissions) !== -1 ) {
                        text = text + ' <button data-create_visual="'+item.id+'" data-comment="'+item.comment+'" data-name="'+item.name+'" class="btn btn-outline-success btn-sm"><i class="fas fa-th"></i> Creación Visual</button>';
                    }
                    if ( $.inArray('update_warehouse', $permissions) !== -1 ) {
                        text = text + ' <a target="_blank" href="'+document.location.origin+ '/dashboard/ver/estructura/almacen/'+item.id+'" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i> Ver estructura</a>';
                    }
                    return text;

                }
            },

        ],
        "aaSorting": [],

        select: {
            style: 'single'
        },
        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "infoThousands": ",",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "buttons": {
                "copy": "Copiar",
                "colvis": "Visibilidad",
                "collection": "Colección",
                "colvisRestore": "Restaurar visibilidad",
                "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
                "copySuccess": {
                    "1": "Copiada 1 fila al portapapeles",
                    "_": "Copiadas %d fila al portapapeles"
                },
                "copyTitle": "Copiar al portapapeles",
                "csv": "CSV",
                "excel": "Excel",
                "pageLength": {
                    "-1": "Mostrar todas las filas",
                    "1": "Mostrar 1 fila",
                    "_": "Mostrar %d filas"
                },
                "pdf": "PDF",
                "print": "Imprimir"
            },
            "autoFill": {
                "cancel": "Cancelar",
                "fill": "Rellene todas las celdas con <i>%d<\/i>",
                "fillHorizontal": "Rellenar celdas horizontalmente",
                "fillVertical": "Rellenar celdas verticalmentemente"
            },
            "decimal": ",",
            "searchBuilder": {
                "add": "Añadir condición",
                "button": {
                    "0": "Constructor de búsqueda",
                    "_": "Constructor de búsqueda (%d)"
                },
                "clearAll": "Borrar todo",
                "condition": "Condición",
                "conditions": {
                    "date": {
                        "after": "Despues",
                        "before": "Antes",
                        "between": "Entre",
                        "empty": "Vacío",
                        "equals": "Igual a",
                        "not": "No",
                        "notBetween": "No entre",
                        "notEmpty": "No Vacio"
                    },
                    "number": {
                        "between": "Entre",
                        "empty": "Vacio",
                        "equals": "Igual a",
                        "gt": "Mayor a",
                        "gte": "Mayor o igual a",
                        "lt": "Menor que",
                        "lte": "Menor o igual que",
                        "not": "No",
                        "notBetween": "No entre",
                        "notEmpty": "No vacío"
                    },
                    "string": {
                        "contains": "Contiene",
                        "empty": "Vacío",
                        "endsWith": "Termina en",
                        "equals": "Igual a",
                        "not": "No",
                        "notEmpty": "No Vacio",
                        "startsWith": "Empieza con"
                    }
                },
                "data": "Data",
                "deleteTitle": "Eliminar regla de filtrado",
                "leftTitle": "Criterios anulados",
                "logicAnd": "Y",
                "logicOr": "O",
                "rightTitle": "Criterios de sangría",
                "title": {
                    "0": "Constructor de búsqueda",
                    "_": "Constructor de búsqueda (%d)"
                },
                "value": "Valor"
            },
            "searchPanes": {
                "clearMessage": "Borrar todo",
                "collapse": {
                    "0": "Paneles de búsqueda",
                    "_": "Paneles de búsqueda (%d)"
                },
                "count": "{total}",
                "countFiltered": "{shown} ({total})",
                "emptyPanes": "Sin paneles de búsqueda",
                "loadMessage": "Cargando paneles de búsqueda",
                "title": "Filtros Activos - %d"
            },
            "select": {
                "1": "%d fila seleccionada",
                "_": "%d filas seleccionadas",
                "cells": {
                    "1": "1 celda seleccionada",
                    "_": "$d celdas seleccionadas"
                },
                "columns": {
                    "1": "1 columna seleccionada",
                    "_": "%d columnas seleccionadas"
                }
            },
            "thousands": ".",
            "datetime": {
                "previous": "Anterior",
                "next": "Proximo",
                "hours": "Horas"
            }
        }

    } );
    $formCreate = $('#formCreate');
    $formCreate.on('submit', storeWarehouse);
    $modalCreate = $('#modalCreate');
    $('#newArea').on('click', openModalCreate);

    $formEdit = $('#formEdit');
    $formEdit.on('submit', updateWarehouse);
    $modalEdit = $('#modalEdit');
    $(document).on('click', '[data-edit]', openModalEdit);

    $formDelete = $('#formDelete');
    $formDelete.on('submit', destroyWarehouse);
    $modalDelete = $('#modalDelete');
    $(document).on('click', '[data-delete]', openModalDelete);

    $formCreateVisual = $('#formCreateVisual');
    $("#btn-generatePosition").on('click', createVisual);
    $modalCreateVisual = $('#modalCreateVisual');
    $(document).on('click', '[data-create_visual]', openModalCreateVisual);

});

var $formCreateVisual;
var $modalCreateVisual;

var $formCreate;
var $modalCreate;

var $formEdit;
var $modalEdit;

var $formDelete;
var $modalDelete;

var $permissions;

function mayus(e) {
    e.value = e.value.toUpperCase();
}

function createVisual() {
    let form = $("#formCreateVisual");
    let url = form.data('url');
    let data = form.serialize();

    $("#btn-generatePosition").attr("disabled", true);
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        success: function(response) {
            $.confirm({
                title: 'Éxito',
                content: response.message || 'Estructura generada correctamente',
                type: 'green',
                buttons: {
                    ok: {
                        text: 'Aceptar',
                        btnClass: 'btn-green'
                    }
                }
            });
            $("#btn-generatePosition").attr("disabled", false);
            // Aquí podrías recargar tabla, cerrar modal, etc.
            $modalCreateVisual.modal('hide');
        },
        error: function(xhr) {
            let message = 'Ocurrió un error al generar la estructura.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                message = xhr.responseJSON.message;
            }
            $("#btn-generatePosition").attr("disabled", false);
            $.confirm({
                title: 'Error',
                content: message,
                type: 'red',
                buttons: {
                    ok: {
                        text: 'Cerrar',
                        btnClass: 'btn-red'
                    }
                }
            });
        }
    });
}

function openModalCreateVisual() {
    var warehouse_id = $(this).data('create_visual');
    var name = $(this).data('name');
    var comment = $(this).data('comment');

    console.log(warehouse_id);
    console.log(name);
    console.log(comment);

    $modalCreateVisual.find('[id=warehouse_id]').val(warehouse_id);
    $modalCreateVisual.find('[id=nameCreateVisual]').val(name);
    $modalCreateVisual.find('[id=commentCreateVisual]').val(comment);

    $modalCreateVisual.modal('show');
}

function openModalCreate() {
    $modalCreate.modal('show');
}

function storeWarehouse() {
    event.preventDefault();
    // Obtener la URL
    var createUrl = $formCreate.data('url');
    $.ajax({
        url: createUrl,
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
            $modalCreate.modal('hide');
            setTimeout( function () {
                location.reload();
            }, 4000 )
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
                        "timeOut": "3000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }


        },
    });
}

function openModalEdit() {
    var area_id = $(this).data('area');
    var warehouse_id = $(this).data('edit');
    var name = $(this).data('name');
    var comment = $(this).data('comment');
    console.log(area_id);
    console.log(name);
    console.log(comment);

    $modalEdit.find('[id=area_id]').val(area_id);
    $modalEdit.find('[id=warehouse_id]').val(warehouse_id);
    $modalEdit.find('[id=nameE]').val(name);
    $modalEdit.find('[id=commentE]').val(comment);

    $modalEdit.modal('show');
}

function updateWarehouse() {
    event.preventDefault();
    // Obtener la URL
    var editUrl = $formEdit.data('url');
    $.ajax({
        url: editUrl,
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
            $modalEdit.modal('hide');
            setTimeout( function () {
                location.reload();
            }, 4000 )
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
                        "timeOut": "3000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }


        },
    });
}

function openModalDelete() {
    var area_id = $(this).data('area');
    var warehouse_id = $(this).data('delete');
    var name = $(this).data('name');
    var comment = $(this).data('comment');

    $modalDelete.find('[id=area_id]').val(area_id);
    $modalDelete.find('[id=warehouse_id]').val(warehouse_id);
    $modalDelete.find('[id=nameDelete]').html(name);
    $modalDelete.find('[id=commentDelete]').html(comment);

    $modalDelete.modal('show');
}

function destroyWarehouse() {
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
            }, 4000 )
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
                        "timeOut": "3000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    });
            }


        },
    });
}