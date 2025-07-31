let $materials=[];
let $materialsTypeahead=[];
let $consumables=[];
let $electrics=[];
let $items=[];
let $equipments=[];
let $equipmentStatus=false;
let $total=0;
let $totalUtility=0;
let $subtotal=0;
let $subtotal2=0;
let $subtotal3=0;
var $permissions;
var $igv;

$(document).ready(function () {
    $permissions = JSON.parse($('#permissions').val());
    $igv = $('#igv').val();
    $.ajax({
        url: "/dashboard/get/quote/sale/materials/totals",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $consumables.push(json[i]);
            }
        }
    });

    $('.materialTypeahead').typeahead({
            hint: true,
            highlight: true, /* Enable substring highlighting */
            minLength: 1 /* Specify minimum characters required for showing suggestions */
        },
        {
            limit: 12,
            source: substringMatcher($materialsTypeahead)
        });

    $(document).on('click', '[data-confirm]', confirmEquipment);

    $(document).on('click', '[data-addConsumable]', addConsumable);

    $formCreate = $('#formCreate');
    $("#btn-submit").on("click", storeQuote);

    $('.consumable_search').select2({
        placeholder: 'Selecciona un consumible',
        ajax: {
            url: '/dashboard/get/quote/sale/materials',
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

    $(document).on('click', '[data-deleteConsumable]', deleteConsumable);

    $(document).on('click', '[data-saveEquipment]', saveEquipment);

    $(document).on('input', '[data-consumableQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });

    $(document).on('input', '[data-detailequipment]', function() {
        var card = $(this).parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });

    $(document).on("summernote.change", ".textarea_edit",function (e) {   // callback as jquery custom event
        var card = $(this).parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });

    $selectCustomer = $('#customer_id');
    $selectContact = $('#contact_id');

    $selectCustomer.change(function () {
        $selectContact.empty();
        var customer =  $selectCustomer.val();
        $.get( "/dashboard/get/contact/"+customer, function( data ) {
            $selectContact.append($("<option>", {
                value: '',
                text: 'Seleccione contacto'
            }));
            for ( var i=0; i<data.length; i++ )
            {
                $selectContact.append($("<option>", {
                    value: data[i].id,
                    text: data[i].contact
                }));
            }
        });

    });

});

var $formCreate;
var $modalAddMaterial;
var $material;
var $renderMaterial;
var $selectCustomer;
var $selectContact;
var $descuento = 0;

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

function saveEquipment() {
    var button = $(this);
    console.log(button);
    $.confirm({
        icon: 'fas fa-smile',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'orange',
        title: 'Guardar cambios',
        content: '¿Está seguro de guardar los cambios en los productos?',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                action: function (e) {

                    var equipmentId = parseInt(button.data('saveequipment'));
                    console.log(equipmentId);

                    var quantity = 1;

                    var utility = button.parent().parent().next().children().children().val();
                    var rent    = button.parent().parent().next().children().children().next().val();
                    var letter  = button.parent().parent().next().children().children().next().next().val();

                    var detail      = button.parent().parent().next().children().children().next().next().next().children().next().val();

                    var consumables = button.parent().parent().next().children().next().children().next().children().next().next();

                    var consumablesDescription = [];
                    var consumablesIds = [];
                    var consumablesUnit = [];
                    var consumablesQuantity = [];
                    var consumablesValor = [];
                    var consumablesPrice = [];
                    var consumablesImporte = [];
                    var consumablesDiscount = [];

                    var descuento_nuevo = 0;

                    consumables.each(function(e){
                        $(this).find('[data-consumableDescription]').each(function(){
                            console.log($(this).val());
                            consumablesDescription.push($(this).val());
                        });
                        $(this).find('[data-consumableId]').each(function(){
                            consumablesIds.push($(this).attr('data-consumableid'));
                        });
                        $(this).find('[data-descuento]').each(function(){
                            consumablesDiscount.push($(this).attr('data-descuento'));
                            descuento_nuevo = descuento_nuevo + parseFloat($(this).attr('data-descuento'));
                        });
                        $(this).find('[data-consumableUnit]').each(function(){
                            consumablesUnit.push($(this).val());
                        });
                        $(this).find('[data-consumableQuantity]').each(function(){
                            consumablesQuantity.push($(this).val());
                        });
                        $(this).find('[data-consumableValor]').each(function(){
                            consumablesValor.push($(this).val());
                        });
                        $(this).find('[data-consumablePrice]').each(function(){
                            consumablesPrice.push($(this).val());
                        });
                        $(this).find('[data-consumableImporte]').each(function(){
                            consumablesImporte.push($(this).val());
                        });
                    });

                    $descuento = descuento_nuevo;
                    var consumablesArray = [];

                    for (let i = 0; i < consumablesDescription.length; i++) {
                        consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'valor': consumablesValor[i], 'price': consumablesPrice[i], 'importe': consumablesImporte[i], 'discount': consumablesDiscount[i]});
                    }

                    console.log(consumablesArray);

                    var totalEquipment = 0;
                    var gravadaEquipment = 0;
                    var totalEquipmentU = 0;
                    var totalEquipmentL = 0;
                    var totalEquipmentR = 0;
                    var totalEquipmentUtility = 0;
                    var totalDias = 0;

                    for (let i = 0; i < consumablesImporte.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(consumablesImporte[i]);
                        gravadaEquipment = parseFloat(gravadaEquipment) + (parseFloat(consumablesQuantity[i])*parseFloat(consumablesValor[i]));
                    }

                    totalEquipment = parseFloat((totalEquipment * quantity)).toFixed(2);

                    console.log(totalEquipment);

                    totalEquipmentU = totalEquipment*((utility/100)+1);
                    totalEquipmentL = totalEquipmentU*((letter/100)+1);
                    totalEquipmentR = totalEquipmentL*((rent/100)+1);
                    totalEquipmentUtility = totalEquipmentR.toFixed(2);

                    $total = parseFloat($total) + parseFloat(totalEquipment);
                    $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility);

                    var igv = parseFloat(gravadaEquipment)*parseFloat($igv/100);

                    $('#descuento').html(parseFloat($descuento).toFixed(2));
                    $('#gravada').html(parseFloat(gravadaEquipment-$descuento).toFixed(2));
                    $('#igv_total').html(parseFloat(igv).toFixed(2));
                    $('#total_importe').html(parseFloat(gravadaEquipment-$descuento+igv).toFixed(2));


                    button.attr('data-saveEquipment', $equipments.length);
                    button.next().attr('data-deleteEquipment', $equipments.length);
                    $equipments.push({'id':equipmentId, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':"", 'detail':detail, 'materials': [], 'consumables':consumablesArray, 'electrics':[], 'workforces':[], 'tornos':[], 'dias':[]});

                    var card = button.parent().parent().parent();
                    card.removeClass('card-gray-dark');
                    card.addClass('card-success');

                    $items = [];

                    $.alert("Productos guardados!");

                },
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $.alert("Modificación cancelada.");
                },
            },
        },
    });

}

function deleteConsumable() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function addConsumable() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var consumableID = $(this).parent().parent().find('[data-consumable]').val();

        var inputQuantity = $(this).parent().parent().find('[data-cantidad]');

        var cantidad = inputQuantity.val();

        if ( cantidad === '' || parseFloat(cantidad) === 0 )
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

        if ( consumableID === '' || consumableID === null )
        {
            toastr.error('Debe seleccionar un consumible', 'Error',
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

        var render = $(this).parent().parent().next().next();

        var consumable = $consumables.find( mat=>mat.id === parseInt(consumableID) );

        var consumables = $(this).parent().parent().next().next().children();

        consumables.each(function(e){
            var id = $(this).children().children().children().next().val();
            if (parseInt(consumable.id) === parseInt(id)) {
                inputQuantity.val(0);
                $(".consumable_search").empty().trigger('change');
                toastr.error('Este material ya esta seleccionado', 'Error',
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
                e.stopPropagation();
                return false ;
            }
        });
        inputQuantity.val(0);
        $(".consumable_search").empty().trigger('change');
        //getDiscountMaterial(consumable.id, cantidad);

        getDiscountMaterial(consumable.id, parseFloat(cantidad).toFixed(2)).then(function(discount) {
            console.log(discount.valueDiscount);
            if ( discount != -1 )
            {
                $descuento += discount.valueDiscount;
                renderTemplateConsumable(render, consumable, cantidad, discount.valueDiscount);
            } else  {
                $descuento += 0;
                renderTemplateConsumable(render, consumable, cantidad, 0);
            }

        });
        //renderTemplateConsumable(render, consumable, cantidad);

    } else {
        var consumableID2 = $(this).parent().parent().find('[data-consumable]').val();
        //console.log(material);
        var inputQuantity2 = $(this).parent().parent().find('[data-cantidad]');
        var cantidad2 = inputQuantity2.val();
        if ( cantidad2 === '' || parseFloat(cantidad2) === 0 )
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

        if ( consumableID2 === '' || consumableID2 === null )
        {
            toastr.error('Debe seleccionar un consumible', 'Error',
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

        var render2 = $(this).parent().parent().next().next();

        var consumable2 = $consumables.find( mat=>mat.id === parseInt(consumableID2) );
        var consumables2 = $(this).parent().parent().next().next().children();

        consumables2.each(function(e){
            var id = $(this).children().children().children().next().val();
            if (parseInt(consumable2.id) === parseInt(id)) {
                inputQuantity2.val(0);
                $(".consumable_search").empty().trigger('change');
                toastr.error('Este material ya esta seleccionado', 'Error',
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
                e.stopPropagation();
                return false ;
            }
        });
        inputQuantity2.val(0);
        $(".consumable_search").empty().trigger('change');
        //getDiscountMaterial(consumable2.id, cantidad2);
        getDiscountMaterial(consumable2.id, parseFloat(cantidad2).toFixed(2)).then(function(discount) {
            console.log(discount.valueDiscount);
            if ( discount != -1 )
            {
                $descuento += discount.valueDiscount;
                renderTemplateConsumable(render2, consumable2, cantidad2, discount.valueDiscount);
            } else  {
                $descuento += 0;
                renderTemplateConsumable(render2, consumable2, cantidad2, 0);
            }

        });

        //renderTemplateConsumable(render2, consumable2, cantidad2);
    }

}

function getDiscountMaterial(product_id, quantity) {
    return $.get('/dashboard/get/discount/product/' + product_id, {
        quantity: quantity
    }).then(function(data) {
        console.log(data.data[0].haveDiscount);
        if (data.data[0].haveDiscount == true) {
            console.log(data);
            return data.data[0];
        } else {
            return -1;
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
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
    });
}

function confirmEquipment() {
    var button = $(this);
    $.confirm({
        icon: 'fas fa-smile',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'green',
        title: 'Confirmar Productos',
        content: 'Debe confirmar para almacenar los productos en memoria',
        buttons: {
            confirm: {
                text: 'CONFIRMAR',
                action: function (e) {
                    //var cantidad = button.parent().parent().next().children().children().children().next();
                    //console.log($(this));
                    /*$equipmentStatus = true;*/
                    // Quitamos el boton
                    button.hide();
                    //$items.push({ 'id': $items.length+1, 'material': $material, 'material_quantity': material_quantity, 'material_price':total});
                    //console.log(button);
                    button.next().show();
                    button.next().next().show();

                    var quantity = 1;

                    // TODO: Obtencion de los porcentages
                    var utility = button.parent().parent().next().children().children().val();
                    var rent    = button.parent().parent().next().children().children().next().val();
                    var letter  = button.parent().parent().next().children().children().next().next().val();

                    var detail      = button.parent().parent().next().children().children().next().next().next().children().next().val();

                    var consumables = button.parent().parent().next().children().next().children().next().children().next().next();

                    var consumablesDescription = [];
                    var consumablesIds = [];
                    var consumablesUnit = [];
                    var consumablesQuantity = [];
                    var consumablesValor = [];
                    var consumablesPrice = [];
                    var consumablesImporte = [];
                    var consumablesDiscount = [];

                    var descuento_nuevo = 0;

                    consumables.each(function(e){
                        $(this).find('[data-consumableDescription]').each(function(){
                            consumablesDescription.push($(this).val());
                        });
                        $(this).find('[data-consumableId]').each(function(){
                            consumablesIds.push($(this).attr('data-consumableid'));
                        });
                        $(this).find('[data-descuento]').each(function(){
                            consumablesDiscount.push($(this).attr('data-descuento'));
                            descuento_nuevo = descuento_nuevo + parseFloat($(this).attr('data-descuento'));
                        });
                        $(this).find('[data-consumableUnit]').each(function(){
                            consumablesUnit.push($(this).val());
                        });
                        $(this).find('[data-consumableQuantity]').each(function(){
                            consumablesQuantity.push($(this).val());
                        });
                        $(this).find('[data-consumableValor]').each(function(){
                            consumablesValor.push($(this).val());
                        });
                        $(this).find('[data-consumablePrice]').each(function(){
                            consumablesPrice.push($(this).val());
                        });
                        $(this).find('[data-consumableImporte]').each(function(){
                            consumablesImporte.push($(this).val());
                        });
                    });

                    $descuento = descuento_nuevo;

                    var consumablesArray = [];

                    for (let i = 0; i < consumablesDescription.length; i++) {
                        consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'valor': consumablesValor[i], 'price': consumablesPrice[i], 'importe': consumablesImporte[i], 'discount': consumablesDiscount[i]});
                    }

                    console.log(consumablesArray);

                    var totalEquipment = 0;
                    var gravadaEquipment = 0;
                    var totalEquipmentU = 0;
                    var totalEquipmentL = 0;
                    var totalEquipmentR = 0;
                    var totalEquipmentUtility = 0;
                    var totalDias = 0;

                    for (let i = 0; i < consumablesImporte.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(consumablesImporte[i]);
                        gravadaEquipment = parseFloat(gravadaEquipment) + (parseFloat(consumablesQuantity[i])*parseFloat(consumablesValor[i]));
                    }

                    totalEquipment = parseFloat((totalEquipment * quantity)).toFixed(2);

                    console.log(totalEquipment);

                    totalEquipmentU = totalEquipment*((utility/100)+1);
                    totalEquipmentL = totalEquipmentU*((letter/100)+1);
                    totalEquipmentR = totalEquipmentL*((rent/100)+1);
                    totalEquipmentUtility = totalEquipmentR.toFixed(2);

                    $total = parseFloat($total) + parseFloat(totalEquipment);
                    $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility);

                    var igv = parseFloat(gravadaEquipment-$descuento)*parseFloat($igv/100);

                    $('#descuento').html(parseFloat($descuento).toFixed(2));
                    $('#gravada').html(parseFloat(gravadaEquipment-$descuento).toFixed(2));
                    $('#igv_total').html(parseFloat(igv).toFixed(2));
                    $('#total_importe').html(parseFloat(gravadaEquipment-$descuento+igv).toFixed(2));

                    button.next().attr('data-saveEquipment', $equipments.length);
                    button.next().next().attr('data-deleteEquipment', $equipments.length);
                    $equipments.push({'id':$equipments.length, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':"", 'detail':detail, 'materials': [], 'consumables':consumablesArray, 'electrics':[], 'workforces':[], 'tornos':[], 'dias':[]});
                    var card = button.parent().parent().parent();
                    card.removeClass('card-gray-dark');
                    card.addClass('card-success');

                    $items = [];
                    $.alert("Productos confirmado!");

                },
            },
            cancel: {
                text: 'CANCELAR',
                action: function (e) {
                    $equipmentStatus = false;
                    $.alert("Confirmación cancelada.");
                },
            },
        },
    });

}

function mayus(e) {
    e.value = e.value.toUpperCase();
}

function calculateMargen(e) {
    var margen = e.value;

    var letter = $('#letter').val() ;
    var rent = $('#taxes').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);

    $('#subtotal2').html('USD '+$subtotal);
    $('#subtotal3').html('USD '+$subtotal2);
    $('#total').html('USD '+$subtotal3);

}

function calculateLetter(e) {
    var letter = e.value;

    var margen = $('#utility').val() ;
    var rent = $('#taxes').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);
    $('#subtotal3').html('USD '+$subtotal2);
    $('#total').html('USD '+$subtotal3);

}

function calculateRent(e) {
    var rent = e.value;

    var margen = $('#utility').val();
    var letter = $('#letter').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);

    $('#total').html('USD '+$subtotal3);

}

function calculateMargen2(margen) {
    var letter = $('#letter').val() ;
    var rent = $('#taxes').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);

    $('#subtotal2').html('USD '+$subtotal);
    $('#subtotal3').html('USD '+$subtotal2);
    $('#total').html('USD '+$subtotal3);

}

function calculateLetter2(letter) {
    var margen = $('#utility').val() ;
    var rent = $('#taxes').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);
    $('#subtotal3').html('USD '+$subtotal2);
    $('#total').html('USD '+$subtotal3);

}

function calculateRent2(rent) {
    var margen = $('#utility').val();
    var letter = $('#letter').val() ;

    $subtotal = ($total * ((parseFloat(margen)/100)+1)).toFixed(2);
    $subtotal2 = ($subtotal * ((parseFloat(letter)/100)+1)).toFixed(2);
    $subtotal3 = ($subtotal2 * ((parseFloat(rent)/100)+1)).toFixed(0);

    $('#total').html('USD '+$subtotal3);
}

function calculateTotalC(e) {
    var cantidad = e.value;
    var precio = e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value;
    // CON IGV
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);
    // SIN IGV
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = ((parseFloat(cantidad)*parseFloat(precio))/1.18).toFixed(2);
}

function calculateTotalE(e) {
    var cantidad = e.value;
    var precio = e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value;
    // CON IGV
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);
    // SIN IGV
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = ((parseFloat(cantidad)*parseFloat(precio))/1.18).toFixed(2);

}

function calculateTotal(e) {
    var cantidad = e.value;
    var precio = e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value;
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);

}

function calculateTotal2(e) {
    var precio = e.value;
    var cantidad = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(precio)).toFixed(2);

}

function calculateTotalQuatity(e) {
    var cantidad = e.value;
    var hour = e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value;
    var price = e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value;

    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(hour)*parseFloat(price)).toFixed(2);

}

function calculateTotalHour(e) {
    var cantidad = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    var hour = e.value;
    var price = e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value;
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(hour)*parseFloat(price)).toFixed(2);

}

function calculateTotalPrice(e) {
    var cantidad = e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value;
    var hour = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    var price = e.value;
    console.log(cantidad);
    console.log(hour);
    console.log(price);
    e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = (parseFloat(cantidad)*parseFloat(hour)*parseFloat(price)).toFixed(2);
    console.log(e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value);
}

function deleteItem() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');

    $(this).parent().parent().remove();
    var itemId = $(this).data('delete');
    //$items = $items.filter(item => item.id !== itemId);
}

function editedActive() {
    var flag = false;
    $(document).find('[data-equip]').each(function(){
        console.log($(this));
        if ($(this).hasClass('card-gray-dark'))
        {
            flag = true;
        }
    });

    return flag;
}

function storeQuote() {
    event.preventDefault();
    $("#btn-submit").attr("disabled", true);

    if ( editedActive() )
    {
        toastr.error('No se puede guardar porque hay productos no confirmados.', 'Error',
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
        $("#btn-submit").attr("disabled", false);
        return;
    }
    if( $equipments.length === 0 )
    {
        toastr.error('No se puede crear una cotización sin productos.', 'Error',
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
        $("#btn-submit").attr("disabled", false);
        return;
    }
    // Obtener la URL
    var createUrl = $formCreate.data('url');
    var equipos = JSON.stringify($equipments);
    var formulario = $('#formCreate')[0];
    var form = new FormData(formulario);
    form.append('equipments', equipos);

    // Datos totales
    let descuento = $("#descuento").html();
    let gravada = $("#gravada").html();
    let igv_total = $("#igv_total").html();
    let total_importe = $("#total_importe").html();

    form.append('descuento', descuento);
    form.append('gravada', gravada);
    form.append('igv_total', igv_total);
    form.append('total_importe', total_importe);

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

function renderTemplateConsumable(render, consumable, quantity, discount) {

    console.log("renderTemplateConsumable");
    console.log("consumable");
    console.log(consumable);
    console.log("quantity");
    console.log(quantity);

    var card = render.parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var clone = activateTemplate('#template-consumable');
        //console.log(consumable.stock_current );

        if ( consumable.enable_status == 0 )
        {
            clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
            clone.querySelector("[data-consumableDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( consumable.stock_current == 0 )
            {
                clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                clone.querySelector("[data-consumableDescription]").setAttribute("style", "color:red;");
            } else {
                if ( consumable.state_update_price == 1 )
                {
                    clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                    clone.querySelector("[data-consumableDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                }

            }
        }

        let precioBase = parseFloat(consumable.list_price);
        console.log("igv");
        console.log($igv);
        let valorUnitario = precioBase/((100+parseFloat($igv))/100);
        //let precioUnitario = precioBase;
        let importeTotal = precioBase * parseFloat(quantity);

        clone.querySelector("[data-consumableId]").setAttribute('data-consumableId', consumable.id);
        clone.querySelector("[data-descuento]").setAttribute('data-descuento', (parseFloat(discount)).toFixed(2));
        clone.querySelector("[data-consumableUnit]").setAttribute('value', consumable.unit_measure.description);
        clone.querySelector("[data-consumableQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));

        clone.querySelector("[data-consumableValor]").setAttribute('value', (parseFloat(valorUnitario).toFixed(2)));
        clone.querySelector("[data-consumablePrice]").setAttribute('value', (parseFloat(precioBase).toFixed(2)));
        clone.querySelector("[data-consumableImporte]").setAttribute('value', (parseFloat(importeTotal).toFixed(2)));

        render.append(clone);
    } else {
        var clone2 = activateTemplate('#template-consumable');
        //console.log(consumable.stock_current );

        if ( consumable.enable_status == 0 )
        {
            clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
            clone2.querySelector("[data-consumableDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( consumable.stock_current == 0 )
            {
                clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                clone2.querySelector("[data-consumableDescription]").setAttribute("style", "color:red;");
            } else {
                if ( consumable.state_update_price == 1 )
                {
                    clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                    clone2.querySelector("[data-consumableDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
                }

                //clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
            }
        }

        let precioBase = parseFloat(consumable.list_price);
        let valorUnitario = precioBase/((100+parseFloat($igv))/100);
        //let precioUnitario = precioBase;
        let importeTotal = precioBase * parseFloat(quantity);

        clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
        clone2.querySelector("[data-consumableId]").setAttribute('data-consumableId', consumable.id);
        clone2.querySelector("[data-descuento]").setAttribute('data-descuento', (parseFloat(discount)).toFixed(2));
        clone2.querySelector("[data-consumableUnit]").setAttribute('value', consumable.unit_measure.description);
        clone2.querySelector("[data-consumableQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));

        clone2.querySelector("[data-consumableValor]").setAttribute('value', (parseFloat(valorUnitario).toFixed(2)));
        clone2.querySelector("[data-consumablePrice]").setAttribute('value', (parseFloat(precioBase).toFixed(2)));
        clone2.querySelector("[data-consumableImporte]").setAttribute('value', (parseFloat(importeTotal).toFixed(2)));
        clone2.querySelector("[data-consumableValor]").setAttribute("style","display:none;");
        clone2.querySelector("[data-consumablePrice]").setAttribute("style","display:none;");
        clone2.querySelector("[data-consumableImporte]").setAttribute("style","display:none;");

        clone2.querySelector("[data-deleteConsumable]").setAttribute('data-deleteConsumable', consumable.id);
        render.append(clone2);
    }


}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}