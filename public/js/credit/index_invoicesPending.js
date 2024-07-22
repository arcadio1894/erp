let $entriesComplete=[];
let $entriesJson=[];
let $materialsComplete=[];
let $locationsComplete=[];
let $items=[];

$(document).ready(function () {
    /*$('#sandbox-container .input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true
    });*/
    $('#sandbox-container2 .input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true
    });
    $permissions = JSON.parse($('#permissions').val());
    //console.log($permissions);
    /*var table = $('#dynamic-table').DataTable( {
        ajax: {
            url: "/dashboard/get/only/invoices/purchase",
            dataSrc: 'data'
        },
        bAutoWidth: false,
        "aoColumns": [
            { data: null,
                title: 'Fecha de Factura',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ moment(item.date_entry).format('DD/MM/YYYY') +'</p>'
                }
            },
            { data: null,
                title: 'Orden de compra',
                wrap: true,
                "render": function (item)
                {
                    if ( item.code == null ){
                        if ( item.purchase_order == null ) {
                            return '<p>Sin Orden</p>';
                        } else {
                            return '<p> '+ item.purchase_order +'</p>';
                        }

                    }
                    else {
                        return '<p> '+ item.code +'</p>';
                    }

                }
            },
            { data: 'invoice' },
            { data: null,
                title: 'Proveedor',
                wrap: true,
                "render": function (item)
                {
                    if ( item.supplier !== null )
                        return '<p> '+ item.supplier.business_name +'</p>';
                    else
                        return '<p> Sin proveedor </p>'
                }
            },
            { data: null,
                title: 'Subtotal',
                wrap: true,
                "render": function (item)
                {
                    if ( item.code == null )
                    {
                        return item.sub_total;
                    } else {
                        return parseFloat(item.total) - parseFloat(item.igv);
                    }

                }
            },
            { data: null,
                title: 'Impuestos',
                wrap: true,
                "render": function (item)
                {
                    if ( item.code == null )
                    {
                        return item.taxes;
                    } else {
                        return item.igv;
                    }

                }
            },
            { data: null,
                title: 'Total',
                wrap: true,
                "render": function (item)
                {
                    //console.log(item.code);
                    if ( item.code == null )
                    {
                        return item.total;
                    } else {
                        return item.total;
                    }

                }
            },
            { data: null,
                title: 'Imagen',
                wrap: true,
                "render": function (item)
                {
                    if (item.code == null){
                        return ' <button data-src="'+document.location.origin+ '/images/entries/'+item.image+'" data-image="'+item.id+'" '+
                            ' class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Ver Imagen"><i class="fa fa-image"></i></button>';

                    } else {
                        return ' <button data-src="'+document.location.origin+ '/images/orderServices/'+item.image_invoice+'" data-image="'+item.id+'" '+
                            ' class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Ver Imagen"><i class="fa fa-image"></i></button>';

                    }

                    //return '<img data-image src="'+document.location.origin+ '/images/entries/'+item.image+'" width="50px" height="50px">'
                }
            },
            { data: null,
                title: 'Acciones',
                wrap: true,
                "render": function (item)
                {
                    var text = '';

                    text = '<button type="button" data-add="' + item.id + '" class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="top" title="Agregar a créditos"><i class="fa fa-plus"></i> </button>';

                    return text; /!*'<a href="'+document.location.origin+ '/dashboard/entrada/compra/editar/'+item.id+'" class="btn btn-outline-warning btn-sm"><i class="fa fa-pen"></i> </a>  <button data-delete="'+item.id+'" data-description="'+item.description+'" data-measure="'+item.measure+'" class="btn btn-outline-danger btn-sm"><i class="fa fa-trash"></i> </button>' *!/
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

    } );*/

    var table2 = $('#dynamic-table2')
        .on( 'draw.dt', function() {
            //show nothing
            //console.log('no access to: ' + $('.dataTables_scroll') );
            setTimeout(function(){
                //show element
                //console.log('access to: ' + $('.dataTables_scroll') );
                $(document).find('.state_paid').select2({
                    placeholder: "Seleccione",
                });
            }, 0);
        }).DataTable( {
        ajax: {
            url: "/dashboard/get/invoices/pending",
            dataSrc: 'data'
        },
        bAutoWidth: false,
        "aoColumns": [
            { data: null,
                title: 'Orden',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.order +'</p>';
                }
            },
            { data: null,
                title: 'Correlativo',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.correlativo +'</p>';
                }
            },
            { data: null,
                title: 'Proveedor',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.proveedor +'</p>';
                }
            },
            { data: null,
                title: 'Moneda',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.moneda +'</p>';
                }
            },
            { data: null,
                title: 'Condición',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.condicion +'</p>';
                }
            },
            { data: null,
                title: 'Monto Dólares',
                wrap: true,
                "render": function (item)
                {
                    if (item.deudaActualDolares == "" && item.deudaActualSoles != "")
                    {
                        return '<p> </p>';
                    } else {
                        return '<p> USD '+ item.montoDolares +'</p>';
                    }
                }
            },
            { data: null,
                title: 'Monto Soles',
                wrap: true,
                "render": function (item)
                {
                    if (item.deudaActualSoles == "" && item.deudaActualDolares != "")
                    {
                        return '<p> </p>';
                    } else {
                        return '<p> PEN '+ item.montoSoles +'</p>';
                    }
                }
            },
            { data: null,
                title: 'Deuda Actual Dólares',
                wrap: true,
                "render": function (item)
                {
                    if (item.deudaActualDolares == "" && item.deudaActualSoles != "")
                    {
                        return '<p> </p>';
                    } else {
                        return '<p> USD '+ item.deudaActualDolares +'</p>';
                    }

                }
            },
            { data: null,
                title: 'Deuda Actual Soles',
                wrap: true,
                "render": function (item)
                {
                    if (item.deudaActualSoles == "" && item.deudaActualDolares != "")
                    {
                        return '<p> </p>';
                    } else {
                        return '<p> PEN '+ item.deudaActualSoles +'</p>';
                    }
                }
            },
            { data: null,
                title: 'Pago',
                wrap: true,
                "render": function (item)
                {
                    var moneda = (item.moneda == "Soles") ? 'PEN':'USD';
                    return '<p> '+ moneda+ ' ' +item.adelanto +'</p>';
                }
            },
            { data: null,
                title: 'Deuda Actual',
                wrap: true,
                "render": function (item)
                {
                    var moneda = (item.moneda == "Soles") ? 'PEN':'USD';
                    return '<p> '+ moneda+ ' ' +item.deudaActual +'</p>';
                }
            },
            { data: null,
                title: 'Factura',
                wrap: true,
                "render": function (item)
                {
                    if ( item.factura !== 'PENDIENTE' )
                    {
                        return '<a target="_blank" href="'+item.url+'" class="btn btn-sm btn-outline-primary"> '+ item.factura +'</a>';
                    } else {
                        return '<p> '+ item.factura +'</p>';
                    }

                }
            },
            { data: null,
                title: 'Fecha Emisión',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.fechaEmision +'</p>';
                }
            },
            { data: null,
                title: 'Fecha Vencimiento',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.fechaVencimiento +'</p>';
                }
            },
            { data: null,
                title: 'Vence en',
                wrap: true,
                "render": function (item)
                {
                    return '<p> '+ item.estado +'</p>';
                }
            },
            { data: null,
                title: 'Estado Pago',
                wrap: true,
                "render": function (item)
                {
                    var select = '';
                    if ( item.estadoPago === 'pending' )
                    {
                        select += '<select data-id="' + item.id + '" name="state_paid" class="form-control form-control-sm select2 state_paid" style="width: 115px;">' +
                            '       <option></option>' +
                            '       <option value="pending" selected>PENDIENTE</option>' +
                            '       <option value="pending50">CANC./PEND.50%</option>' +
                            '       <option value="canceled">CANCELADO</option>' +
                            '</select>';
                    }
                    if ( item.estadoPago === 'pending50' )
                    {
                        select += '<select data-id="' + item.id + '" name="state_paid" class="form-control form-control-sm select2 state_paid" style="width: 115px;">' +
                            '       <option></option>' +
                            '       <option value="pending">PENDIENTE</option>' +
                            '       <option value="pending50" selected>CANC./PEND.50%</option>' +
                            '       <option value="canceled">CANCELADO</option>' +
                            '</select>';
                    }
                    if ( item.estadoPago === 'canceled' )
                    {
                        select += '<select data-id="' + item.id + '" name="state_paid" class="form-control form-control-sm select2 state_paid" style="width: 115px;">' +
                            '       <option></option>' +
                            '       <option value="pending">PENDIENTE</option>' +
                            '       <option value="pending50">CANC./PEND.50%</option>' +
                            '       <option value="canceled" selected>CANCELADO</option>' +
                            '</select>';
                    }
                    return select;
                }
            },
            { data: null,
                title: 'Fecha Pago',
                wrap: true,
                "render": function (item)
                {
                    return '<p>'+item.fechaPago+'</p>';

                }
            },
            { data: null,
                title: 'Observación',
                wrap: true,
                "render": function (item)
                {
                    return '<p>'+item.observaciones+'</p>';
                }
            },
            { data: null,
                title: 'Acciones',
                sortable:false,
                wrap: true,
                "render": function (item)
                {
                    var text = '';

                    //if ( $.inArray('destroy_orderPurchaseNormal', $permissions) !== -1 ) {
                        text = text + ' <button data-pays="'+item.id+'" '+
                        ' class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Agregar pagos"><i class="fas fa-file-invoice-dollar"></i></button>';
                        text = text + ' <button data-add_days="'+item.id+'" data-fecha="'+item.fechaVencimiento+'"'+
                        ' class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="top" title="Agregar 7 días"><i class="fas fa-plus-circle"></i></button>';
                    //}

                    return text; /*'<a href="'+document.location.origin+ '/dashboard/entrada/compra/editar/'+item.id+'" class="btn btn-outline-warning btn-sm"><i class="fa fa-pen"></i> </a>  <button data-delete="'+item.id+'" data-description="'+item.description+'" data-measure="'+item.measure+'" class="btn btn-outline-danger btn-sm"><i class="fa fa-trash"></i> </button>' */
                }
            },

        ],
        "aaSorting": [],
        "columnDefs": [
            {
                "visible": false,
                "targets": [ 0, 5, 6, 7, 8, 16, 17 ]
            }],
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
        "createdRow": function(row, data, dataIndex) {
            var valor = data.stateCredit; // Supongamos que el valor de interés está en la tercera columna (índice 2)

            if (valor == "outstanding") {
                $(row).find('td:eq(9)').css('background-color', '#28a745'); // Cambiar el color de fondo de la tercera celda de la fila a rojo
            } else {
                if (valor == "by_expire") {
                    $(row).find('td:eq(9)').css('background-color', '#ffc107'); // Cambiar el color de fondo de la tercera celda de la fila a rojo
                } else {
                    if (valor == "expired") {
                        $(row).find('td:eq(9)').css('background-color', '#dc3545'); // Cambiar el color de fondo de la tercera celda de la fila a rojo
                    } else {
                        $(row).find('td:eq(9)').css('background-color', '#007bff'); // Cambiar el color de fondo de la tercera celda de la fila a rojo

                    }
                }
            }
        }
    } );

    $(document).on('click', '[data-column]', function (e) {
        //e.preventDefault();

        // Get the column API object
        var column = table2.column( $(this).attr('data-column') );

        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

    $modalAddItems = $('#modalAddItems');

    //$(document).on('click', '[data-delete]', deleteItem);

    $modalPays = $('#modalPays');

    $modalSummary = $('#modalSummary');

    $modalItems = $('#modalItems');

    $modalEdit = $('#modalEdit');

    $modalPay = $('#modalPay');

    $modalImage = $('#modalImage');

    $formEdit = $('#formEdit');

    $formPay = $('#formPay');

    $("#btn-submit").on('click', updateCredit);

    $("#btn-pay").on('click', paidCredit);

    $(document).on('change', '[id=date_issue]', modifyDateIsuue);

    $(document).on('click', '[data-details]', showDetails);

    $(document).on('click', '[data-image]', showImage);

    $(document).on('click', '[data-add]', addCredit);

    $(document).on('click', '[data-edit]', editCredit);

    $(document).on('click', '[data-pay]', payCredit);

    $(document).on('click', '[data-nopay]', cancelPayCredit);

    // Extend dataTables search
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            //console.log(settings.nTable.id);
            if ( settings.nTable.id === 'dynamic-table' )
            {
                var min  = $('#start').val();
                //console.log(min);
                var max  = $('#end').val();
                //console.log(max);
                var createdAt = data[12]; // Our date column in the table
                var startDate   = moment(min, "DD/MM/YYYY");
                var endDate     = moment(max, "DD/MM/YYYY");
                var diffDate = moment(createdAt, "DD/MM/YYYY");

                if ( (min === "" || max === "") ||  (diffDate.isBetween(startDate, endDate, null, '[]')) )
                {
                    //console.log("Es true" + (diffDate.isBetween(startDate, endDate, null, '[]')) );
                    //console.log(min + " " + max + " " + createdAt + " " + startDate + " " + endDate + " " + diffDate + " " );
                    return true;
                }
                //console.log("Es false" + (diffDate.isBetween(startDate, endDate, null, '[]')) );
                //console.log(min + " " + max + " " + createdAt + " " + startDate + " " + endDate + " " + diffDate);

                return false;

            } else {
                if ( settings.nTable.id === 'dynamic-table2' )
                {
                    var min2  = $('#start2').val();
                    //console.log(min2);
                    var max2  = $('#end2').val();
                    //console.log(max2);
                    var createdAt2 = data[12]; // Our date column in the table
                    var startDate2   = moment(min2, "DD/MM/YYYY");
                    var endDate2     = moment(max2, "DD/MM/YYYY");
                    var diffDate2 = moment(createdAt2, "DD/MM/YYYY");

                    if ( (min2 === "" || max2 === "") ||  (diffDate2.isBetween(startDate2, endDate2, null, '[]')) )
                    {
                        //console.log("Es true" + (diffDate2.isBetween(startDate2, endDate2, null, '[]')) );
                        //console.log(min2 + " " + max2 + " " + createdAt2 + " " + startDate2 + " " + endDate2 + " " + diffDate2 + " " );
                        return true;
                    }
                    //console.log("Es false" + (diffDate2.isBetween(startDate2, endDate2, null, '[]')) );
                    //console.log(min2 + " " + max2 + " " + createdAt2 + " " + startDate2 + " " + endDate2 + " " + diffDate2);

                    return false;
                }

            }

            /*return !!((min === "" || max === "")
                ||
                (moment(createdAt).isSameOrAfter(min) && moment(createdAt).isSameOrBefore(max)));

*/
            /*return !!((min === "" || max === "") ||
                (diffDate.isBetween(startDate, endDate)));*/

        }
    );

    // Re-draw the table when the a date range filter changes
    $('.date-range-filter').change( function() {
        table.draw();
    } );

    $('.date-range-filter2').change( function() {
        table2.draw();
    } );

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });
    
    $("#btn-summary").on('click', showModalSummary);

    $(document).on('click', '[data-pays]',showModalPays);

    $(document).on('click', '[data-add_days]',showModalAddDays);

    /*$modalPays.on('hidden.bs.modal', function () {
        $("#credito_id").val('');
        $("#montoPago").val('');
        $("#fechaPago").val('');
        $('#comprobantePago').val(null);
    });*/

    $("#btn-save-pay").on('click', savePayCredit);

    $modalImageComprobante = $('#modalImageComprobante');
    $(document).on('click', '[data-image_comprobante]', showImagePreview);

    $(document).on('click', '[data-delete]', deleteCredit);

    $(document).on('select2:select', '.state_paid', changeStatusPaid);

    $("#btn-expire").on('click', showModalExpire);

    $("#btn-amount").on('click', showModalAmount);

    $modalExpire = $('#modalExpire');

    $modalAmount = $('#modalAmount');

    $selectYear = $('#year');

    $selectMonth = $('#month');

    $selectYear.change(function () {
        $selectMonth.empty();
        $selectMonth.val('');
        $selectMonth.trigger('change');

        let year =  $selectYear.val();
        console.log(year);
        if ( year != null || year != undefined )
        {
            $.get( "/dashboard/get/months/of/year/"+year, function( data ) {
                $selectMonth.append($("<option>", {
                    value: '',
                    text: ''
                }));
                for ( var i=0; i<data.length; i++ )
                {
                    $selectMonth.append($("<option>", {
                        value: data[i].month,
                        text: data[i].month_name
                    }));
                }
            });
        }

    });

    $("#btn-get_amount").on("click", getAmountInvoices);

    $('#btn-export').on('click', exportCredits);
});

let $selectYear;

let $selectMonth;

let $modalExpire;

let $modalAmount;

let $modalImageComprobante;

let $modalPays;

let $modalSummary;

let $modalItems;

let $modalImage;

let $modalEdit;

let $modalPay;

let $formEdit;

let $formPay;

let $modalAddItems;

let $caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let $longitud = 20;

var $permissions;

function exportCredits() {
    var start  = $('#start2').val();
    var end  = $('#end2').val();
    var startDate   = moment(start, "DD/MM/YYYY");
    var endDate     = moment(end, "DD/MM/YYYY");

    if ( start == '' || end == '' )
    {
        toastr.error('Debe elegir fechas para hacer la búsqueda', 'Error',
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
        return;
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

        var url = "/dashboard/exportar/reporte/creditos/?" + $.param(query);

        window.location = url;

    }

}

function getAmountInvoices() {
    var url = $(this).data('url');
    $("#body-amount-load").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });

    let year = $selectYear.val();
    let month = $selectMonth.val();

    if ( year == '' || year == null )
    {
        toastr.error('Seleccione un año de la lista', 'Error',
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

    if ( month == '' || month == null )
    {
        toastr.error('Seleccione un mes de la lista', 'Error',
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

    var query = {
        year: year,
        month: month,
    };

    $.get(url+"?"+ $.param(query), function(data) {
        // Manipula los datos recibidos aquí
        var amountSoles = parseFloat(data.amountSoles);
        var formattedValueSoles = amountSoles.toLocaleString(undefined, { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
        $("#amountSoles").html("S/. "+formattedValueSoles);

        var amountDolares = parseFloat(data.amountDolares);
        var formattedValueDolares = amountDolares.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        $("#amountDolares").html("$. "+formattedValueDolares);

        $("#body-amount-load").LoadingOverlay("hide", true);
    }).done(function() {
        console.log("La solicitud se completó correctamente.");
    }).fail(function() {
        console.log("Ocurrió un error en la solicitud.");
    });

}

function showModalAmount() {
    var url = $(this).data('url');
    $("#body-amount-load").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });
    $.get(url, function(data) {
        // Manipula los datos recibidos aquí
        var amountSoles = parseFloat(data.amountSoles);
        var formattedValueSoles = amountSoles.toLocaleString(undefined, { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
        $("#amountSoles").html("S/. "+formattedValueSoles);

        var amountDolares = parseFloat(data.amountDolares);
        var formattedValueDolares = amountDolares.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        $("#amountDolares").html("$. "+formattedValueDolares);
        $("#body-amount-load").LoadingOverlay("hide", true);
        $modalAmount.modal('show');
    }).done(function() {
        console.log("La solicitud se completó correctamente.");
    }).fail(function() {
        console.log("Ocurrió un error en la solicitud.");
    });
}

function showModalExpire() {
    var url = $(this).data('url');
    $('#body-expires').html('');
    $("#body-expire-load").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });
    $.get(url, function(json) {
        // Manipula los datos recibidos aquí
        for (var i=0; i<json.credits.length; i++)
        {
            renderTemplateExpire(json.credits[i].orden, json.credits[i].proveedor, json.credits[i].factura, json.credits[i].fecha_vencimiento, json.credits[i].vence_en);
        }
        $("#body-expire-load").LoadingOverlay("hide", true);
        $modalExpire.modal('show');
    }).done(function() {
        console.log("La solicitud se completó correctamente.");
    }).fail(function() {
        console.log("Ocurrió un error en la solicitud.");
    });

}

function renderTemplateExpire(orden, proveedor, factura, fecha_vencimiento, vence_en) {

    var clone = activateTemplate('#template-expire');

    clone.querySelector("[data-orden]").innerHTML = orden;
    clone.querySelector("[data-proveedor]").innerHTML = proveedor;
    clone.querySelector("[data-factura]").innerHTML = factura;
    clone.querySelector("[data-fecha]").innerHTML = fecha_vencimiento;
    clone.querySelector("[data-vence]").innerHTML = vence_en;

    $('#body-expires').append(clone);


}

function changeStatusPaid() {
    event.preventDefault();
    var credit_pay_id = $(this).attr('data-id');
    var status = $(this).val();
    $.ajax({
        url: '/dashboard/change/status/credit/'+credit_pay_id+'/'+status,
        method: 'POST',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
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

        },
    });
}

function showModalAddDays() {
    var credit_id = $(this).data('add_days');
    var fecha = $(this).data('fecha');
    var formatoEntrada = "DD/MM/YYYY";
    var fechaMoment = moment(fecha, formatoEntrada);
    var fechaSumada = fechaMoment.add(7, 'days');
    var fechaFormateada = fechaSumada.format('DD/MM/YYYY');

    vdialog({
        type:'alert',// alert, success, error, confirm
        title: '¿Esta seguro de agregar 7 días más a la fecha de expiración?',
        content: 'La nueva fecha de expiración será: '+fechaFormateada,
        okValue:'Aceptar',
        modal:true,
        cancelValue:'Cancelar',
        ok: function(){
            $.ajax({
                url: '/dashboard/add/days/credit/'+credit_id,
                method: 'POST',
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                contentType: false,
                processData: false,
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
                    setTimeout(function() {
                        // Aquí va el código que deseas ejecutar después de 2 segundos
                        location.reload();
                    }, 2000);

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
                },
            });

        },
        cancel: function(){
            vdialog.alert('Asistencia no guardada');
        }
    });
}

function deleteCredit() {
    $modalPays.modal('hide');
    var credit_pay_id = $(this).data('delete');
    vdialog({
        type:'alert',// alert, success, error, confirm
        title: '¿Esta seguro de eliminar este pago?',
        content: 'Se eliminará todos los datos de este pago',
        okValue:'Aceptar',
        modal:true,
        cancelValue:'Cancelar',
        ok: function(){
            $.ajax({
                url: '/dashboard/delete/pay/credit/'+credit_pay_id,
                method: 'POST',
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                contentType: false,
                processData: false,
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
                    // Actualizar la assitanceDetail
                    getPaysUpdated(data.credit.id);

                    $("#montoPago").val('');
                    $("#fechaPago").val('');
                    $('#comprobantePago').val(null);

                    $modalPays.modal('show');
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
                },
            });

        },
        cancel: function(){
            vdialog.alert('Asistencia no guardada');
        }
    });
}

function showImagePreview() {
    var image = $(this).attr('data-image_comprobante');
    console.log(image);

    var url = document.location.origin+ '/images/credits/pays/'+image;

    $('#imagePreview').attr('src', url);
    $('#zoom').trigger('zoom.destroy');
    $('#zoom').zoom({
        url: url,
        on:'click',
        magnify: 0.35
    });

    $modalImageComprobante.modal('show');
}

function savePayCredit() {
    $modalPays.modal('hide');
    // Obtenemos los datos
    var credit_id = $("#credito_id").val();
    var montoPago = $("#montoPago").val();
    var fechaPago = $("#fechaPago").val();

    console.log(credit_id);
    console.log(montoPago);
    console.log(fechaPago);
    //var comprobantePago = $('#comprobantePago').val();

    var fileInput = $('#comprobantePago')[0].files[0];
    var formData = new FormData();

    formData.append('credit_id', credit_id);
    formData.append('montoPago', montoPago);
    formData.append('fechaPago', fechaPago);
    formData.append('comprobantePago', fileInput);

    vdialog({
        type:'alert',// alert, success, error, confirm
        title: '¿Esta seguro de guardar este pago?',
        content: 'Se guardará todos los datos de este pago',
        okValue:'Aceptar',
        modal:true,
        cancelValue:'Cancelar',
        ok: function(){
            $.ajax({
                url: '/dashboard/save/pay/credit/'+credit_id,
                method: 'POST',
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                data: formData,
                contentType: false,
                processData: false,
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
                    // Actualizar la assitanceDetail
                    getPaysUpdated(data.credit.id);

                    $("#montoPago").val('');
                    $("#fechaPago").val('');
                    $('#comprobantePago').val(null);

                    $modalPays.modal('show');
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
                },
            });

        },
        cancel: function(){
            vdialog.alert('Asistencia no guardada');
        }
    });
}

function getPaysUpdated(credit_id) {
    $('#body-pays').html('');
    $("#body-items-load").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });

    $.ajax({
        url: "/dashboard/get/pays/credit/"+credit_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            //console.log(json.consumables.length);
            for (var i=0; i<json.pays.length; i++)
            {
                renderTemplatePay(i+1, json.pays[i].id, json.pays[i].type,json.pays[i].monto, json.pays[i].fecha, json.pays[i].comprobante);
            }
            $("#body-items-load").LoadingOverlay("hide", true);
        }
    });
}

function showModalPays() {
    $('#body-pays').html('');
    $("#body-items-load").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });

    var credit_id = $(this).data('pays');

    $("#montoPago").val('');
    $("#fechaPago").val('');
    $('#comprobantePago').val(null);

    $("#credito_id").val(credit_id);

    $.ajax({
        url: "/dashboard/get/pays/credit/"+credit_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            //console.log(json.consumables.length);
            for (var i=0; i<json.pays.length; i++)
            {
                renderTemplatePay(i+1, json.pays[i].id, json.pays[i].type, json.pays[i].monto, json.pays[i].fecha, json.pays[i].comprobante);
            }
            $("#body-items-load").LoadingOverlay("hide", true);
        }
    });
    $modalPays.modal('show');

}

function renderTemplatePay(i, id, type,amount, datePay, image) {

    if ( type == "pdf" )
    {
        var clone2 = activateTemplate('#template-pay2');

        clone2.querySelector("[data-id]").innerHTML = i;
        clone2.querySelector("[data-monto]").innerHTML = amount;
        clone2.querySelector("[data-fecha]").innerHTML = datePay;
        clone2.querySelector("[data-comprobante]").setAttribute('href', document.location.origin+ '/images/credits/pays/'+image);
        clone2.querySelector("[data-delete]").setAttribute('data-delete', id);

        $('#body-pays').append(clone2);
    } else {
        var clone = activateTemplate('#template-pay');

        clone.querySelector("[data-id]").innerHTML = i;
        clone.querySelector("[data-monto]").innerHTML = amount;
        clone.querySelector("[data-fecha]").innerHTML = datePay;
        clone.querySelector("[data-comprobante]").setAttribute('data-image_comprobante', image);
        clone.querySelector("[data-delete]").setAttribute('data-delete', id);

        $('#body-pays').append(clone);
    }


}

function showModalSummary() {
    var url = $(this).data('url');
    $.get(url, function(data) {
        // Manipula los datos recibidos aquí
        console.log(data);
        var deudaSoles = parseFloat(data.deudaSoles);
        var formattedValueSoles = deudaSoles.toLocaleString(undefined, { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
        $("#deudaSoles").html("S/. "+formattedValueSoles);

        var deudaDolares = parseFloat(data.deudaDolares);
        var formattedValueDolares = deudaDolares.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        $("#deudaDolares").html("$. "+formattedValueDolares);

        $modalSummary.modal('show');
    }).done(function() {
        console.log("La solicitud se completó correctamente.");
    }).fail(function() {
        console.log("Ocurrió un error en la solicitud.");
    });

}

function cancelPayCredit() {
    var id_credit = $(this).attr('data-nopay');
    $.confirm({
        icon: 'fas fa-window-close',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'red',
        title: '¿Está seguro de cancelar el pago de este crédito?',
        content: 'Se actualizará la página.',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: '/dashboard/cancel/pay/credit/'+id_credit,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        processData:false,
                        contentType:false,
                        success: function (data) {
                            //console.log(data);
                            $.alert(data.message);
                            setTimeout( function () {
                                location.reload();
                            }, 2000 )
                        },
                        error: function (data) {
                            $.alert("Sucedió un error en el servidor. Intente nuevamente.");
                        },
                    });
                    //$.alert('Your name is ' + name);
                }
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $.alert("Proceso cancelado.");
                },
            },
        }
    });
}

function paidCredit() {
    event.preventDefault();
    $("#btn-pay").attr("disabled", true);
    // Obtener la URL
    var paidUrl = $formPay.data('url');
    var formulario = $('#formPay')[0];
    var form = new FormData(formulario);
    $.ajax({
        url: paidUrl,
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
                $("#btn-pay").attr("disabled", false);
                $modalPay.modal('hide');
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
            $("#btn-pay").attr("disabled", false);

        },
    });
}

function payCredit() {
    var credit_id = $(this).data('pay');
    $.ajax({
        url: "/dashboard/get/credit/by/id/"+credit_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            var credit = json.credit;
            console.log(credit);
            //console.log(json[0].supplier);
            var estado = (credit.state_credit === 'outstanding') ? 'Pendiente' :
                (credit.state_credit === 'by_expire') ? 'Por expirar' :
                    (credit.state_credit === 'expired') ? 'Expirado' :
                        'Pagado';
            $modalPay.find('[id=credit_id]').val(credit.id);
            $modalPay.find('[id=days_deadline]').val(credit.deadline.days);
            $modalPay.find('[id=supplier]').val(credit.supplier.business_name);
            $modalPay.find('[id=invoice]').val(credit.invoice);
            $modalPay.find('[id=code_order]').val(credit.code_order);
            $modalPay.find('[id=total_soles]').val(credit.total_soles);
            $modalPay.find('[id=total_dollars]').val(credit.total_dollars);
            $modalPay.find('[id=total_dollars]').val(credit.total_dollars);
            $modalPay.find('[id=date_issue]').val(moment(credit.date_issue).format('DD/MM/YYYY'));
            $modalPay.find('[id=payment_deadline]').val(credit.deadline.description);
            $modalPay.find('[id=date_expiration_2]').val(moment(credit.date_expiration).format('DD/MM/YYYY'));
            $modalPay.find('[id=state_credit]').val(estado);
            $modalPay.find('[id=days_to_expiration]').val(credit.days_to_expiration);
            $modalPay.find('[id=observation]').val(credit.observation);

            $modalPay.find('[id=date_paid]').datepicker('setDate', moment(credit.date_paid).format('DD/MM/YYYY'));
            $modalPay.find('[id=observation2]').val(credit.observation_extra);

            $('#date_picker_paid .date_picker_paid').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                language: "es",
                multidate: false,
                autoclose: true,
                todayHighlight: true,
                defaultViewDate: moment().format('L')
            });
        }
    });
    $modalPay.modal('show');
}

function modifyDateIsuue() {
    console.log($(this).val());
    // TODO: Obtener la fecha nueva de emision,
    var deadline_days = parseInt($('#days_deadline').val());
    console.log(deadline_days);
    var date_isuue = moment($(this).val().split(' ')[0].split("/").reverse().join("-"));
    console.log(date_isuue);
    // TODO: Obtener la fecha nueva de expiracion moment("12/25/1995", "MM-DD-YYYY");
    var date_expiration = moment(date_isuue).add(deadline_days, 'd');

    console.log(date_expiration.format('DD/MM/YYYY'));
    // TODO: Modificar los dias restantes teniendo
    // TODO: en cuenta la fecha actual y de expiracion
    var missing_days = date_expiration.diff(moment(), 'days');
    console.log(missing_days);
    $modalEdit.find('[id=days_to_expiration]').val(missing_days);

    $modalEdit.find('[id=date_issue]').val(date_isuue.format('DD/MM/YYYY'));
    $modalEdit.find('[id=date_expiration_2]').val(date_expiration.format('DD/MM/YYYY'));
    $('#date_picker_issue .date_picker_issue').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true,
        todayHighlight: true,
        defaultViewDate: moment().format('L')
    });
    $('#date_expiration .date_picker_expiration').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        language: "es",
        multidate: false,
        autoclose: true,
        todayHighlight: true,
        defaultViewDate: moment().format('L')
    });
    //console.log(date_isuue);

}

function updateCredit() {
    event.preventDefault();
    $("#btn-submit").attr("disabled", true);
    // Obtener la URL
    var editUrl = $formEdit.data('url');
    var formulario = $('#formEdit')[0];
    var form = new FormData(formulario);
    $.ajax({
        url: editUrl,
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
                $("#btn-submit").attr("disabled", false);
                $modalEdit.modal('hide');
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
            $("#btn-submit").attr("disabled", false);

        },
    });
}

function addCredit() {
    var id_entry = $(this).attr('data-add');
    $.confirm({
        icon: 'fas fa-check-double',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'green',
        title: '¿Está seguro de agregar al listado de créditos?',
        content: 'Se actualizará la página.',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: '/dashboard/add/invoice/credit/'+id_entry,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        processData:false,
                        contentType:false,
                        success: function (data) {
                            //console.log(data);
                            $.alert(data.message);
                            setTimeout( function () {
                                location.reload();
                            }, 2000 )
                        },
                        error: function (data) {
                            $.alert("Sucedió un error en el servidor. Intente nuevamente.");
                        },
                    });
                    //$.alert('Your name is ' + name);
                }
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $.alert("Proceso cancelado.");
                },
            },
        }
    });
}

function editCredit() {
    var credit_id = $(this).data('edit');
    $.ajax({
        url: "/dashboard/get/credit/by/id/"+credit_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            var credit = json.credit;
            console.log(credit);
            //console.log(json[0].supplier);
            var estado = (credit.state_credit === 'outstanding') ? 'Pendiente' :
                (credit.state_credit === 'by_expire') ? 'Por expirar' :
                    (credit.state_credit === 'expired') ? 'Expirado' :
                    'Pagado';
            $modalEdit.find('[id=credit_id]').val(credit.id);
            $modalEdit.find('[id=days_deadline]').val(credit.deadline.days);
            $modalEdit.find('[id=supplier]').val(credit.supplier.business_name);
            $modalEdit.find('[id=invoice]').val(credit.invoice);
            $modalEdit.find('[id=code_order]').val(credit.code_order);
            $modalEdit.find('[id=total_soles]').val(credit.total_soles);
            $modalEdit.find('[id=total_dollars]').val(credit.total_dollars);
            $modalEdit.find('[id=total_dollars]').val(credit.total_dollars);
            $modalEdit.find('[id=date_issue]').datepicker('setDate', moment(credit.date_issue).format('DD/MM/YYYY'));
            $modalEdit.find('[id=payment_deadline]').val(credit.deadline.description);
            $modalEdit.find('[id=date_expiration_2]').datepicker('setDate', moment(credit.date_expiration).format('DD/MM/YYYY'));
            $modalEdit.find('[id=state_credit]').val(estado);
            $modalEdit.find('[id=days_to_expiration]').val(credit.days_to_expiration);
            $modalEdit.find('[id=observation]').val(credit.observation);

            $('#date_picker_issue .date_picker_issue').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                language: "es",
                multidate: false,
                autoclose: true,
                todayHighlight: true,
                defaultViewDate: moment().format('L')
            });
            $('#date_expiration .date_picker_expiration').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                language: "es",
                multidate: false,
                autoclose: true,
                todayHighlight: true,
                defaultViewDate: moment().format('L')
            });
        }
    });
    $modalEdit.modal('show');
}

function showImage() {
    var path = $(this).data('src');
    $('#image-document').attr('src', path);
    $modalImage.modal('show');
}

function showDetails() {
    $('#body-materials').html('');
    $('#body-summary').html('');
    var entry_id = $(this).data('details');
    var code = $(this).data('code');
    if ( code == 0 )
    {
        $.ajax({
            url: "/dashboard/get/invoice/by/id/"+entry_id,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                //
                console.log(json[0].details);
                for (var i=0; i< json[0].details.length; i++)
                {
                    //console.log(json[0].details[i].material_description);
                    renderTemplateItemDetail(json[0].details[i].material_description, json[0].details[i].ordered_quantity, json[0].details[i].unit, json[0].details[i].unit_price, json[0].details[i].sub_total, json[0].details[i].taxes, json[0].details[i].total);
                    //$materials.push(json[i].material);
                }
                renderTemplateSummary(json[0].sub_total, json[0].taxes, json[0].total);

            }
        });
        $modalItems.modal('show');
    } else {
        $.ajax({
            url: "/dashboard/get/service/by/id/"+entry_id,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                //
                console.log(json[0].details);
                for (var i=0; i< json[0].details.length; i++)
                {
                    //console.log(json[0].details[i].material_description);
                    renderTemplateItemDetail(json[0].details[i].service, json[0].details[i].quantity, json[0].details[i].unit, json[0].details[i].price, (json[0].details[i].price*json[0].details[i].quantity)-json[0].details[i].igv, json[0].details[i].igv, json[0].details[i].price*json[0].details[i].quantity);
                    //$materials.push(json[i].material);
                }
                renderTemplateSummary(json[0].total-json[0].igv, json[0].igv, json[0].total);

            }
        });
        $modalItems.modal('show');
    }

}

function renderTemplateItemDetail(material, quantity, unit, price, subtotal, taxes, total) {
    var clone = activateTemplate('#template-item');
    clone.querySelector("[data-description]").innerHTML = material;
    clone.querySelector("[data-quantity]").innerHTML = quantity;
    clone.querySelector("[data-unit]").innerHTML = unit;
    clone.querySelector("[data-price]").innerHTML = price;
    clone.querySelector("[data-subtotal]").innerHTML = subtotal;
    clone.querySelector("[data-taxes]").innerHTML = taxes;
    clone.querySelector("[data-total]").innerHTML = total;
    $('#body-materials').append(clone);
}

function renderTemplateSummary(subtotal, taxes, total) {
    var clone = activateTemplate('#template-summary');
    clone.querySelector("[data-subtotal]").innerHTML = subtotal;
    clone.querySelector("[data-taxes]").innerHTML = taxes;
    clone.querySelector("[data-total]").innerHTML = total;
    $('#body-summary').append(clone);
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

