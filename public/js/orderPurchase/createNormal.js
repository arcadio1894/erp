let $materials=[];
let $locations=[];
let $materialsComplete=[];
let $locationsComplete=[];
let $items=[];
$(document).ready(function () {
    $("#element_loader").LoadingOverlay("show", {
        background  : "rgba(236, 91, 23, 0.5)"
    });
    $.ajax({
        url: "/dashboard/get/materials/entry",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $materials.push(json[i].material);
                $materialsComplete.push(json[i]);
            }
            $("#element_loader").LoadingOverlay("hide", true);
        }
    });

    $('#material_search').typeahead({
            hint: true,
            highlight: true, /* Enable substring highlighting */
            minLength: 1 /* Specify minimum characters required for showing suggestions */
        },
        {
            limit: 12,
            source: substringMatcher($materials)
        });

    $('#btn-add').on('click', addItem);

    $('#btn-submit').on('click', storeOrderPurchase);

    $(document).on('click', '[data-delete]', deleteItem);

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
        var total = parseFloat($(this).val());
        var price = parseFloat($(this).parent().parent().prev().prev().children().children().val());
        var quantity = parseFloat($(this).parent().parent().prev().prev().prev().children().children().val());
        var description = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();
        var id = $(this).parent().parent().prev().prev().prev().prev().prev().prev().children().children().children().val();

        $items = $items.filter(material => material.id_material != id);
        $items.push({'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': total });
        updateSummaryInvoice();
    });

    $(document).on('input', '[data-price2]', function() {
        var price = parseFloat($(this).parent().parent().prev().children().children().val());
        var quantity = parseFloat($(this).parent().parent().prev().prev().children().children().val());
        var description = $(this).parent().parent().prev().prev().prev().children().children().children().val();
        var id = $(this).parent().parent().prev().prev().prev().prev().prev().children().children().children().val();

        $items = $items.filter(material => material.id_material != id);
        $items.push({'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
        updateSummaryInvoice();

    });

    $(document).on('input', '[data-price]', function() {
        var price = parseFloat($(this).val());
        var quantity = parseFloat($(this).parent().parent().prev().children().children().val());
        var description = $(this).parent().parent().prev().prev().children().children().children().val();
        var id = $(this).parent().parent().prev().prev().prev().prev().children().children().children().val();

        $items = $items.filter(material => material.id_material != id);
        $items.push({'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
        updateSummaryInvoice();

    });

    $(document).on('input', '[data-quantity]', function() {
        var quantity = parseFloat($(this).val());
        var price = parseFloat($(this).parent().parent().next().children().children().val());
        var description = $(this).parent().parent().prev().children().children().children().val();
        var id = $(this).parent().parent().prev().prev().prev().children().children().children().val();

        $items = $items.filter(material => material.id_material != id);
        $items.push({'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
        updateSummaryInvoice();
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

function addItem() {

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

    let material_name = $('#material_search').val();
    let material_quantity = $('#quantity').val();

    let material = $materialsComplete.find( material => material.material.trim() === material_name.trim() );
    console.log(material);
    let id = material.id;
    let code = material.code;
    let description = material_name;
    let quantity = material_quantity;
    let price = parseFloat(material.price);

    let flag = false;

    $('[data-id]').each(function(e){
        if( $(this).val() == id ) {
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
        $items.push({'price': price, 'quantity':quantity ,'material': description, 'id_material': id, 'total': quantity*price });
        $('#material_search').val('');
        $('#quantity').val(0);
        renderTemplateMaterial(id, code, description, quantity, price);
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

    /*$('#subtotal').html(subtotal.toFixed(2));
    $('#taxes').html(taxes.toFixed(2));
    $('#total').html(total.toFixed(2));*/
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

function deleteItem() {
    var materialId = $(this).data('delete');
    console.log(materialId);
    $items = $items.filter(material => material.id_material != materialId);
    $(this).parent().parent().remove();

    updateSummaryInvoice();
}

function renderTemplateMaterial(id, code, description, quantity, price) {
    var clone = activateTemplate('#materials-selected');
    clone.querySelector("[data-id]").setAttribute('value', id);
    clone.querySelector("[data-code]").setAttribute('value', code);
    clone.querySelector("[data-description]").setAttribute('value', description);
    clone.querySelector("[data-quantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2) );
    clone.querySelector("[data-quantity]").setAttribute('max', quantity);
    clone.querySelector("[data-price]").setAttribute('value', (parseFloat(price)).toFixed(2) );
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

    /*var subtotal_send = $('#subtotal').html();
    var taxes_send = $('#taxes').html();
    var total_send = $('#total').html();*/
    var subtotal_send = $('#subtotal').val();
    var taxes_send = $('#taxes').val();
    var total_send = $('#total').val();

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
