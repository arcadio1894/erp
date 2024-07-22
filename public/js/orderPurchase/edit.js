let $materials=[];
let $locations=[];
let $materialsComplete=[];
let $locationsComplete=[];
let $items=[];
$(document).ready(function () {

    fillItems();

    $(document).on('click', '[data-add]', addItem);

    $(document).on('click', '[data-check]', checkItem);

    $modalCheck = $("#modalCheck");

    $('#btn-submit').on('click', storeOrderPurchase);

    $(document).on('click', '[data-delete]', deleteItem);

    $(document).on('click', '[data-edit]', editItem);

    $formCreate = $("#formCreate");

    $('#btn-currency').on('switchChange.bootstrapSwitch', function (event, state) {

        if (this.checked) // if changed state is "CHECKED"
        {
            console.log($(this));
            $('.moneda').html('PEN');

        } else {
            console.log($(this));
            $('.moneda').html('USD');
        }
    });

    $(document).on('input', '[data-total]', function() {
        if ( $(this).attr('data-total') !== ''  )
        {
            var total2 = parseFloat($(this).val());
            var price2 = parseFloat($(this).parent().parent().prev().prev().children().children().val());
            var quantity2 = parseFloat($(this).parent().parent().prev().prev().prev().children().children().val());
            var description2 = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();
            var id2 = $(this).parent().parent().prev().prev().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id2);
            $items.push({'detail_id':$(this).attr('data-total'),'price': price2, 'quantity':quantity2 ,'material': description2, 'id_material': id2, 'total': total2});

            $(this).parent().parent().next().children().children().removeClass( "btn-outline-success" );
            $(this).parent().parent().next().children().children().addClass( "btn-outline-warning" );

            updateSummaryInvoice();
        } else {
            var total = parseFloat($(this).val());
            var price = parseFloat($(this).parent().parent().prev().prev().children().children().val());
            var quantity = parseFloat($(this).parent().parent().prev().prev().prev().children().children().val());
            var description = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();
            var id = $(this).parent().parent().prev().prev().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id);
            $items.push({'detail_id':'','price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': total });
            updateSummaryInvoice();
        }
    });

    $(document).on('input', '[data-price2]', function() {
        if ( $(this).attr('data-price2') !== ''  )
        {
            var price2 = parseFloat($(this).parent().parent().prev().children().children().val());
            var quantity2 = parseFloat($(this).parent().parent().prev().prev().children().children().val());
            var description2 = $(this).parent().parent().prev().prev().prev().children().children().children().val();
            var id2 = $(this).parent().parent().prev().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id2);
            $items.push({'detail_id':$(this).attr('data-price2'),'price': price2, 'quantity':quantity2 ,'material': description2, 'id_material': id2, 'total': quantity2*price2 });

            $(this).parent().parent().next().next().children().children().removeClass( "btn-outline-success" );
            $(this).parent().parent().next().next().children().children().addClass( "btn-outline-warning" );

            updateSummaryInvoice();
        } else {
            var price = parseFloat($(this).parent().parent().prev().children().children().val());
            var quantity = parseFloat($(this).parent().parent().prev().prev().children().children().val());
            var description = $(this).parent().parent().prev().prev().prev().children().children().children().val();
            var id = $(this).parent().parent().prev().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id);
            $items.push({'detail_id':'','price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
            updateSummaryInvoice();
        }


    });

    $(document).on('input', '[data-price]', function() {
        if ( $(this).attr('data-price') !== ''  )
        {
            var price2 = parseFloat($(this).val());
            var quantity2 = parseFloat($(this).parent().parent().prev().children().children().val());
            var description2 = $(this).parent().parent().prev().prev().children().children().children().val();
            var id2 = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id2);
            $items.push({'detail_id':$(this).attr('data-price'), 'price': price2, 'quantity':quantity2 ,'material': description2, 'id_material': id2, 'total': quantity2*price2 });

            $(this).parent().parent().next().next().next().children().children().removeClass( "btn-outline-success" );
            $(this).parent().parent().next().next().next().children().children().addClass( "btn-outline-warning" );

            updateSummaryInvoice();
        } else {
            var price = parseFloat($(this).val());
            var quantity = parseFloat($(this).parent().parent().prev().children().children().val());
            var description = $(this).parent().parent().prev().prev().children().children().children().val();
            var id = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id);
            $items.push({'detail_id':'', 'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
            updateSummaryInvoice();
        }

    });

    $(document).on('input', '[data-quantity]', function() {
        if ( $(this).attr('data-quantity') !== ''  )
        {
            var quantity2 = parseFloat($(this).val());
            var price2 = parseFloat($(this).parent().parent().next().children().children().val());
            var description2 = $(this).parent().parent().prev().children().children().children().val();
            var id2 = $(this).parent().parent().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id2);
            $items.push({'detail_id':$(this).attr('data-quantity'), 'price': price2, 'quantity':quantity2 ,'material': description2, 'id_material': id2, 'total': quantity2*price2 });

            $(this).parent().parent().next().next().next().next().children().children().removeClass( "btn-outline-success" );
            $(this).parent().parent().next().next().next().next().children().children().addClass( "btn-outline-warning" );

            updateSummaryInvoice();
        } else {
            var quantity = parseFloat($(this).val());
            var price = parseFloat($(this).parent().parent().next().children().children().val());
            var description = $(this).parent().parent().prev().children().children().children().val();
            var id = $(this).parent().parent().prev().prev().prev().children().children().children().val();

            $items = $items.filter(material => material.id_material != id);
            $items.push({'detail_id':'', 'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
            updateSummaryInvoice();
        }

    });


});

// Initializing the typeahead
var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

let $formCreate;
let $modalCheck;

function fillItems() {
    $("#element_loader").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });

    var arrayIds = [];
    $('[data-id]').each(function(e){
        arrayIds.push($(this).val());
    });
    var arrayDescriptions = [];
    $('[data-description]').each(function(e){
        arrayDescriptions.push($(this).val());
    });
    var arrayQuantitys = [];
    $('[data-quantity]').each(function(e){
        arrayQuantitys.push($(this).val());
    });
    var arrayPrices = [];
    $('[data-price]').each(function(e){
        arrayPrices.push($(this).val());
    });

    var arrayOrders = [];
    $('[data-price]').each(function(e){
        arrayOrders.push($(this).attr('data-price'));
    });

    var arrayTotals = [];
    $('[data-total]').each(function(e){
        arrayTotals.push($(this).val());
    });

    for (let i = 0; i < arrayIds.length; i++) {
        $items.push({'detail_id': arrayOrders[i], 'price': arrayPrices[i], 'quantity':arrayQuantitys[i] ,'material': arrayDescriptions[i], 'id_material': arrayIds[i], 'total': arrayTotals[i] });
    }

    //updateSummaryInvoice();

    $("#element_loader").LoadingOverlay("hide", true);
}

function checkItem() {
    var material_id = $(this).attr('data-check');

    $.ajax({
        url: "/dashboard/get/information/quantity/material/"+material_id,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            console.log(json);
            $("#stockActual").html(parseFloat(json.stockActual).toFixed(2));
            $("#cantidadOrdenes").html(parseFloat(json.cantidadOrdenes).toFixed(2));
            $("#cantidadDisponibleReal").html(parseFloat(json.cantidadDisponibleReal).toFixed(2));
            $("#cantidadCotizaciones").html(parseFloat(json.cantidadCotizaciones).toFixed(2));
            $("#cantidadSolicitada").html(parseFloat(json.cantidadSolicitada).toFixed(2));
            $("#cantidadNecesitadaReal").html(parseFloat(json.cantidadNecesitadaReal).toFixed(2));
            $("#cantidadParaComprar").html(parseFloat(json.cantidadParaComprar).toFixed(2));
            $modalCheck.modal('show');
        }
    });
}

function addItem() {

    let id = $(this).parent().prev().prev().prev().prev().prev().prev().html();
    let code = $(this).parent().prev().prev().prev().prev().prev().html();
    let description = $(this).parent().prev().prev().prev().prev().html();
    let quantity = $(this).parent().prev().prev().html();
    let price = $(this).parent().prev().html();

    let flag = false;

    $('[data-id]').each(function(e){
        if( $(this).val() === id ) {
            toastr.error('Ya esta agregado este material.', 'Error',
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
            flag = true;
            return false;
        }
    });

    if ( !flag )
    {
        $items.push({'detail_id':'', 'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
        renderTemplateMaterial(id, code, description, quantity, price);
        $('#btn-submit').removeClass( "btn-outline-success" );
        $('#btn-submit').addClass( "btn-outline-danger" );
        updateSummaryInvoice();
    }

}

function updateSummaryInvoice() {
    var subtotal = 0;
    var total = 0;
    var taxes = 0;

    for ( var i=0; i<$items.length; i++ )
    {
        subtotal += (parseFloat($items[i].total))/1.18 ;
        total += parseFloat($items[i].total);
        taxes = subtotal*0.18;
    }

    $('#subtotal').val(subtotal.toFixed(2));
    $('#taxes').val(taxes.toFixed(2));
    $('#total').val(total.toFixed(2));

}

function calculateTotal(e) {
    var cantidad = e.value;
    var precio = e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value;
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);
    updateSummaryInvoice();
}

function calculateTotal2(e) {
    var precio = e.value;
    var cantidad = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(precio)/1.18).toFixed(2);
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);
    updateSummaryInvoice();
}

function calculateTotal3(e) {
    var precioSI = e.value;
    var precioCI = (parseFloat(precioSI)*1.18).toFixed(2);
    console.log(precioSI);
    console.log(precioCI);
    var cantidad = e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value;
    console.log(cantidad);
    e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precioCI)).toFixed(2);
    e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value = precioCI;
    updateSummaryInvoice();
}

function editItem() {
    var detail_id = $(this).attr('data-edit');
    var total = parseFloat($(this).parent().parent().prev().children().children().val());
    var price = parseFloat($(this).parent().parent().prev().prev().prev().children().children().val());
    var quantity = parseFloat($(this).parent().parent().prev().prev().prev().prev().children().children().val());
    var description = $(this).parent().parent().prev().prev().prev().prev().prev().children().children().children().val();
    var id = $(this).parent().parent().prev().prev().prev().prev().prev().prev().prev().children().children().children().val();
    var modifiedItem = [];
    modifiedItem.push({'detail_id':detail_id, 'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': total });
    console.log(modifiedItem);
    var valParam = JSON.stringify(modifiedItem);
    $.confirm({
        icon: 'fas fa-smile',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'green',
        title: 'Guardar cambios',
        content: 'Se guardará en la base de datos',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                action: function (e) {
                    $.ajax({
                        url: '/dashboard/update/detail/order/purchase/express/'+detail_id,
                        method: 'POST',
                        data: { items: valParam },
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        success: function (data) {
                            console.log(data);
                            $(this).removeClass('btn-outline-warning');
                            $(this).addClass( "btn-outline-success" );
                            updateSummaryInvoice();
                            $('#btn-submit').removeClass( "btn-outline-success" );
                            $('#btn-submit').addClass( "btn-outline-danger" );
                            $.alert(data.message);
                            setTimeout( function () {
                                //location.reload();
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


                        },
                    });

                },
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $.alert("Modificación cancelada. Si hay una modificación, por favor guarde los cambios.");
                },
            },
        },
    });
}

function deleteItem() {
    var button = $(this);
    var materialId = $(this).data('material');
    var idDetail = $(this).data('delete');
    console.log(materialId);
    if (materialId) {
        $.confirm({
            icon: 'fas fa-frown',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'red',
            title: 'Eliminar detalle',
            content: 'Se eliminará en la base de datos',
            buttons: {
                confirm: {
                    text: 'CONFIRMAR',
                    action: function (e) {
                        $.ajax({
                            url: '/dashboard/destroy/detail/order/purchase/express/'+idDetail+'/material/'+materialId,
                            method: 'POST',
                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                            processData:false,
                            contentType:false,
                            success: function (data) {
                                console.log(data);

                                $items = $items.filter(material => material.id_material != materialId);
                                button.parent().parent().parent().remove();

                                updateSummaryInvoice();
                                $('#btn-submit').removeClass( "btn-outline-success" );
                                $('#btn-submit').addClass( "btn-outline-danger" );

                                $.alert(data.message);

                                /*setTimeout( function () {
                                    location.reload();
                                }, 2000 )*/

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
                },
                cancel: {
                    text: 'CANCELAR',
                    action: function (e) {
                        $.alert("Eliminación cancelada.");
                    },
                },
            },
        });
    } else {
        var materialId2 = $(this).data('delete');
        console.log(materialId);
        $items = $items.filter(material => material.id_material != materialId2);
        $(this).parent().parent().parent().remove();

        updateSummaryInvoice();
    }


}

function renderTemplateMaterial(id, code, description, quantity, price) {
    var clone = activateTemplate('#materials-selected');
    clone.querySelector("[data-id]").setAttribute('value', id);
    clone.querySelector("[data-code]").setAttribute('value', code);
    clone.querySelector("[data-description]").setAttribute('value', description);
    clone.querySelector("[data-quantity]").setAttribute('value', quantity);
    clone.querySelector("[data-quantity]").setAttribute('max', quantity);
    clone.querySelector("[data-price]").setAttribute('value', price);
    clone.querySelector("[data-price2]").setAttribute('value', (parseFloat(price)/1.18).toFixed(2) );
    clone.querySelector("[data-total]").setAttribute('value', (parseFloat(price)*parseFloat(quantity)).toFixed(2) );
    clone.querySelector("[data-delete]").setAttribute('data-delete', id);
    $('#body-materials').append(clone);
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}

function storeOrderPurchase() {
    event.preventDefault();
    // Obtener la URL
    $("#btn-submit").attr("disabled", true);

    var subtotal_send = $('#subtotal').val();
    var taxes_send = $('#taxes').val();
    var total_send = $('#total').val();

    var state = $('#btn-currency').bootstrapSwitch('state');

    /*var arrayId = [];
    var arrayCode = [];
    var arrayDescription = [];
    var arrayQuantity = [];
    var arrayPrice = [];

    $('[data-id]').each(function(e){
        arrayId.push($(this).val());
    });
    $('[data-code]').each(function(e){
        arrayCode.push($(this).val());
    });
    $('[data-description]').each(function(e){
        arrayDescription.push($(this).val());
    });
    $('[data-quantity]').each(function(e){
        arrayQuantity.push($(this).val());
    });
    $('[data-price]').each(function(e){
        arrayPrice.push($(this).val());
    });

    var itemsArray = [];
    for (let i = 0; i < arrayId.length; i++) {
        itemsArray.push({'id':arrayId[i], 'code':arrayCode[i], 'description':arrayDescription[i], 'quantity': arrayQuantity[i], 'price': arrayPrice[i]});
    }*/

    var createUrl = $formCreate.data('url');
    var items = JSON.stringify($items);
    var form = new FormData($('#formCreate')[0]);
    form.append('items', items);
    form.append('subtotal_send', subtotal_send);
    form.append('taxes_send', taxes_send);
    form.append('total_send', total_send);
    form.append('state', state);
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
                $("#btn-submit").attr("disabled", false);
                $('#btn-submit').removeClass( "btn-outline-danger" );
                $('#btn-submit').addClass( "btn-outline-success" );
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
            $('#btn-submit').removeClass( "btn-outline-danger" );
            $('#btn-submit').addClass( "btn-outline-success" );
            $("#btn-submit").attr("disabled", false);
        },
    });
}
