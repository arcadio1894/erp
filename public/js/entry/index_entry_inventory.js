let $entriesComplete=[];
let $entriesJson=[];
let $materialsComplete=[];
let $locationsComplete=[];
let $items=[];

/*
function format ( d ) {
    var mensaje = "";
    var detalles = d.details;
    console.log(detalles);
    for ( var i=0; i<detalles.length; i++ )
    {
        var state = ( d.details[i].isComplete === 1 ) ? 'Completa' : 'Faltante';
        mensaje = mensaje +
            'Material: '+d.details[i].material.full_description+'<br>'+
            'Cantidad ordenada: '+d.details[i].ordered_quantity+'<br>'+
            'Cantidad ingresada: '+d.details[i].entered_quantity+'<br>'+
            'Estado: '+state+'<br>'+
            '<a class="btn btn-outline-primary btn-sm" data-detail="'+d.details[i].id+'"> Items </a>'+'<br>';
    }
    return 'DETALLES DE ENTRADA'+'<br>'+
        mensaje;
}
*/

$(document).ready(function () {
    $('#sandbox-container .input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true
    });
    $permissions = JSON.parse($('#permissions').val());
    console.log($permissions);
    var table = $('#dynamic-table').DataTable( {
        ajax: {
            url: "/dashboard/get/json/entries/inventory",
            dataSrc: 'data'
        },
        bAutoWidth: false,
        "aoColumns": [
            { data: null,
                title: 'Código',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ 'Entrada-'+item.id+'</p>'
                }
            },
            { data: null,
                title: 'Fecha',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ moment(item.date_entry).format('DD/MM/YYYY') +'</p>'
                }
            },
            { data: null,
                title: 'Observaciones',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ 'Entrada-'+item.observation+'</p>'
                }
            },
            { data: null,
                title: 'Acciones',
                wrap: true,
                "render": function (item)
                {
                    var text = '';
                    text = text + ' <button data-detail="'+item.id+'" '+
                        ' class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Ver detalles"><i class="fa fa-eye"></i></button>';

                    if ( $.inArray('update_entryInventory', $permissions) !== -1 ) {
                        text = text + '<a href="'+document.location.origin+ '/dashboard/entrada/inventario/editar/'+item.id+'" class="btn btn-outline-warning btn-sm" data-toggle="tooltip" data-placement="top" title="Editar"><i class="fa fa-pen"></i> </a>  ';
                    }
                    if ( $.inArray('destroy_entryInventory', $permissions) !== -1 ) {
                        text = text + ' <button data-delete="'+item.id+'" '+
                            ' class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Anular"><i class="fa fa-trash"></i></button>';
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
        },

    } );
    // Array to track the ids of the details displayed rows
    var detailRows = [];

    /*$('#dynamic-table tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();

            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();

            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    } );
*/
    // On each draw, loop over the `detailRows` array and show any child rows
    /*table.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    } );*/

    /*$(document).on('click', '[data-column]', function (e) {
        //e.preventDefault();

        // Get the column API object
        var column = table.column( $(this).attr('data-column') );

        // Toggle the visibility
        column.visible( ! column.visible() );
    } );*/

    $modalAddItems = $('#modalAddItems');

    //$(document).on('click', '[data-delete]', deleteItem);

    $modalItems = $('#modalItems');

    $(document).on('click', '[data-detail]', showItems);

    $(document).on('click', '[data-delete]', cancelEntry);

    // Extend dataTables search
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var min  = $('#start').val();
            var max  = $('#end').val();
            var createdAt = data[1]; // Our date column in the table
            var startDate   = moment(min, "DD/MM/YYYY");
            var endDate     = moment(max, "DD/MM/YYYY");
            var diffDate = moment(createdAt, "DD/MM/YYYY");

            if ( (min === "" || max === "") ||  (diffDate.isBetween(startDate, endDate, null, '[]')) )
            {
                console.log("Es true" + (diffDate.isBetween(startDate, endDate, null, '[]')) );
                console.log(min + " " + max + " " + createdAt + " " + startDate + " " + endDate + " " + diffDate + " " );
                return true;
            }
            console.log("Es false" + (diffDate.isBetween(startDate, endDate, null, '[]')) );
            console.log(min + " " + max + " " + createdAt + " " + startDate + " " + endDate + " " + diffDate);

            return false;

        }
    );

    // Re-draw the table when the a date range filter changes
    $('.date-range-filter').change( function() {
        table.draw();
    } );

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });
});

let $modalItems;

let $modalImage;

let $formCreate;

let $modalAddItems;

let $caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let $longitud = 20;

var $permissions;


function cancelEntry() {
    var entry_id = $(this).data('delete');

    $.confirm({
        icon: 'fas fa-frown',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'red',
        title: '¿Está seguro de eliminar esta entrada?',
        content: 'También se eliminarán los items ingresados',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                action: function (e) {
                    $.ajax({
                        url: '/dashboard/entry_inventory/destroy/'+entry_id,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        processData:false,
                        contentType:false,
                        success: function (data) {
                            console.log(data);
                            $.alert("Entrada eliminada.");
                            setTimeout( function () {
                                location.reload();
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


function showItems() {
    $('#table-items').html('');
    $('#table-details').html('');
    var entry_id = $(this).data('detail');
    $.ajax({
        url: "/dashboard/get/json/items/"+entry_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.details.length; i++)
            {
                renderTemplateItemDetail(json.details[i].code, json.details[i].material, json.details[i].ordered_quantity, json.details[i].unit_price);
                //$materials.push(json[i].material);
            }
            /*
            for (var j=0; j<json.items.length; j++)
            {
                renderTemplateItemItems(json.items[j].id, json.items[j].material, json.items[j].code, json.items[j].length, json.items[j].width, json.items[j].weight, json.items[j].price, json.items[j].location, json.items[j].state);
                //$materials.push(json[i].material);
            }*/

        }
    });
    $modalItems.modal('show');
}

/*
function renderTemplateItemItems(id, material, code, length, width, weight, price, location, state) {
    var status = (state === 'good') ? '<span class="badge bg-success">En buen estado</span>' :
        (state === 'bad') ? '<span class="badge bg-secondary">En mal estado</span>' :
            'Indefinido';
    var clone = activateTemplate('#template-item');
    clone.querySelector("[data-i]").innerHTML = id;
    clone.querySelector("[data-material]").innerHTML = material;
    clone.querySelector("[data-code]").innerHTML = code;
    clone.querySelector("[data-length]").innerHTML = length;
    clone.querySelector("[data-width]").innerHTML = width;
    clone.querySelector("[data-weight]").innerHTML = weight;
    clone.querySelector("[data-price]").innerHTML = price;
    clone.querySelector("[data-location]").innerHTML = location;
    clone.querySelector("[data-state]").innerHTML = status;
    $('#table-items').append(clone);
}*/

function renderTemplateItemDetail(code, material, quantity, price) {
    var clone = activateTemplate('#template-detail');
    clone.querySelector("[data-code]").innerHTML = code;
    clone.querySelector("[data-material]").innerHTML = material;
    clone.querySelector("[data-quantity]").innerHTML = quantity;
    clone.querySelector("[data-price]").innerHTML = price;
    $('#table-details').append(clone);
}

function addItems() {
    if( $('#material_search').val().trim() === '' )
    {
        toastr.error('Debe elegir un material', 'Error',
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
        return;
    }

    if( $('#quantity').val().trim() === '' || $('#quantity').val()<0 )
    {
        toastr.error('Debe ingresar una cantidad', 'Error',
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
        return;
    }

    if( $('#price').val().trim() === '' || $('#price').val()<0 )
    {
        toastr.error('Debe ingresar un precio adecuado', 'Error',
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
        return;
    }

    let material_name = $('#material_search').val();
    $modalAddItems.find('[id=material_selected]').val(material_name);
    $modalAddItems.find('[id=material_selected]').prop('disabled', true);
    let material_quantity = $('#quantity').val();
    $modalAddItems.find('[id=quantity_selected]').val(material_quantity);
    $modalAddItems.find('[id=quantity_selected]').prop('disabled', true);
    let material_price = $('#price').val();
    $modalAddItems.find('[id=price_selected]').val(material_price);
    $modalAddItems.find('[id=price_selected]').prop('disabled', true);

    $('#body-items').html('');

    for (var i = 0; i<material_quantity; i++)
    {
        renderTemplateItem();
        $('.select2').select2();
    }

    $('.locations').typeahead({
            hint: true,
            highlight: true, /* Enable substring highlighting */
            minLength: 1 /* Specify minimum characters required for showing suggestions */
        },
        {
            limit: 12,
            source: substringMatcher($locations)
        });

    $modalAddItems.modal('show');

    /*$items.push({
        "productId" : sku,
        "qty" : qty,
        "price" : price
    });*/
}

function rand_code($caracteres, $longitud){
    var code = "";
    for (var x=0; x < $longitud; x++)
    {
        var rand = Math.floor(Math.random()*$caracteres.length);
        code += $caracteres.substr(rand, 1);
    }
    return code;
}

function deleteItem() {
    //console.log($(this).parent().parent().parent());
    $(this).parent().parent().parent().remove();
}

function renderTemplateMaterial(id, price, material, item, location, state) {
    var clone = activateTemplate('#materials-selected');
    clone.querySelector("[data-id]").innerHTML = id;
    clone.querySelector("[data-description]").innerHTML = material;
    clone.querySelector("[data-item]").innerHTML = item;
    clone.querySelector("[data-location]").innerHTML = location;
    clone.querySelector("[data-state]").innerHTML = state;
    clone.querySelector("[data-price]").innerHTML = price;
    $('#body-materials').append(clone);
}

function renderTemplateItem() {
    var clone = activateTemplate('#template-item');
    clone.querySelector("[data-series]").setAttribute('value', rand_code($caracteres, $longitud));
    $('#body-items').append(clone);
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}
