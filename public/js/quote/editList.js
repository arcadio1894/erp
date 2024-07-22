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

$(document).ready(function () {
    console.log($total);
    $permissions = JSON.parse($('#permissions').val());
    $materials = JSON.parse($('#materials').val());
    $("#element_loader").LoadingOverlay("show", {
        background  : "rgba(61, 215, 239, 0.4)"
    });
    $selectContact = $('#contact_id');
    getContacts();

    /*$.ajax({
        url: "/dashboard/get/quote/materials/",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $materials.push(json[i]);
            }

        },
        complete: function (data) {

            fillEquipments();

        }
    });*/
    fillEquipments();
    $.ajax({
        url: "/dashboard/get/materials/quote",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $materialsTypeahead.push(json[i].material);
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

    $.ajax({
        url: "/dashboard/get/quote/consumables/",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $consumables.push(json[i]);
                $electrics.push(json[i]);
            }
        }
    });

    $modalAddMaterial = $('#modalAddMaterial');
    $modalChangePercentages = $('#modalChangePercentages');

    $(document).on('click', '[data-add]', addMaterial);
    
    $(document).on('click', '[data-confirm]', confirmEquipment);

    $(document).on('click', '[data-addMano]', addMano);

    $(document).on('click', '[data-addTorno]', addTorno);

    $(document).on('click', '[data-addDia]', addDia);

    $(document).on('click', '[data-addConsumable]', addConsumable);

    $(document).on('click', '[data-addElectric]', addElectric);

    $('#btn-addEquipment').on('click', addEquipment);

    $('#btn-addMaterial').on('click', addTableMaterials);
    
    $('#btnCalculate').on('click', calculatePercentage);

    $formCreate = $('#formEdit');
    $("#btn-submit").on("click", storeQuote);
    //$formCreate.on('submit', storeQuote);

    $('input[type=radio][name=presentation]').on('change', function() {
        switch ($(this).val()) {
            case 'fraction':
                if($material.typescrap_id == 3 || $material.typescrap_id == 4 || $material.typescrap_id == 5)
                {
                    $('#width_entered_material').hide();
                    $('#length_entered_material').show();
                    $('#quantity_entered_material').hide();
                    $('#material_length_entered').val('');
                    $('#material_width_entered').val('');
                    $('#material_quantity_entered').val('');
                } else {
                    $('#width_entered_material').show();
                    $('#length_entered_material').show();
                    $('#quantity_entered_material').hide();
                    $('#material_length_entered').val('');
                    $('#material_width_entered').val('');
                    $('#material_quantity_entered').val('');
                }

                break;
            case 'complete':
                $('#width_entered_material').hide();
                $('#length_entered_material').hide();
                $('#quantity_entered_material').show();
                $('#material_length_entered').val('');
                $('#material_width_entered').val('');
                $('#material_quantity_entered').val('');
                break;
        }
    });

    /*$('.material_search').select2({
        placeholder: 'Selecciona un material',
        ajax: {
            url: '/dashboard/select/materials',
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
*/
    $('.consumable_search').select2({
        placeholder: 'Selecciona un consumible',
        ajax: {
            url: '/dashboard/select/consumables',
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

    $('.electric_search').select2({
        placeholder: 'Selecciona un material',
        ajax: {
            url: '/dashboard/select/consumables',
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

    $(document).on('click', '[data-delete]', deleteItem);

    $(document).on('click', '[data-deleteConsumable]', deleteConsumable);

    $(document).on('click', '[data-deleteElectric]', deleteElectric);

    $(document).on('click', '[data-deleteMano]', deleteMano);

    $(document).on('click', '[data-deleteTorno]', deleteTorno);

    $(document).on('click', '[data-deleteDia]', deleteDia);

    $(document).on('click', '[data-deleteEquipment]', deleteEquipment);

    $(document).on('click', '[data-saveEquipment]', saveEquipment);

    // TODO: Nuevo boton para modificar los porcentages
    $(document).on('click', '[data-acEdit]', changePercentages);
    $('#btn-changePercentage').on('click', savePercentages);

    $(document).on('typeahead:select', '.materialTypeahead', function(ev, suggestion) {
        var select_material = $(this);
        console.log($(this).val());
        // TODO: Tomar el texto no el val()
        var material_search = select_material.val();

        //$material = $materials.find( mat=>mat.full_name.trim().toLowerCase() === material_search.trim().toLowerCase() );

        $material = $materials.find(mat =>
            mat.full_name.trim().toLowerCase() === material_search.trim().toLowerCase() &&
            mat.enable_status === 1
        );

        if( $material === undefined )
        {
            toastr.error('Debe seleccionar un material', 'Error',
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

        /*for (var i=0; i<$items.length; i++)
        {
            var mat = $items.find( mat=>mat.material.id === $material.id );
            if (mat !== undefined)
            {
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
                return;
            }
        }*/

        if ( $material.type_scrap === null )
        {
            $('#presentation').hide();
            $('#length_material').hide();
            $('#width_material').hide();
            $('#width_entered_material').hide();
            $('#length_entered_material').hide();
            $('#material_quantity').val($material.stock_current);
            $('#quantity_entered_material').show();
            $('#material_price').val($material.unit_price);

            // TODO: Render esta fallando
            $renderMaterial = $(this).parent().parent().parent().parent().next().next().next();
            $modalAddMaterial.modal('show');
        } else {
            switch($material.type_scrap.id) {
                case 1:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#width_entered_material').show();
                    $('#width_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#length_material').show();
                    $('#material_width').val($material.type_scrap.width);
                    $('#material_quantity').val($material.stock_current);
                    $('#quantity_entered_material').hide();
                    $('#material_price').val($material.unit_price);
                    break;
                case 2:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#width_entered_material').show();
                    $('#length_material').show();
                    $('#width_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#material_width').val($material.type_scrap.width);
                    $('#quantity_entered_material').hide();
                    $('#material_quantity').val($material.stock_current);
                    $('#material_price').val($material.unit_price);
                    break;
                case 3:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#width_material').hide();
                    $('#length_material').show();
                    $('#width_entered_material').hide();
                    $('#quantity_entered_material').hide();
                    $('#material_quantity').val($material.stock_current);
                    $('#material_price').val($material.unit_price);
                    break;
                case 4:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#width_material').hide();
                    $('#length_material').show();
                    $('#width_entered_material').hide();
                    $('#quantity_entered_material').hide();
                    $('#material_quantity').val($material.stock_current);
                    $('#material_price').val($material.unit_price);
                    break;
                case 5:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#width_material').hide();
                    $('#length_material').show();
                    $('#width_entered_material').hide();
                    $('#quantity_entered_material').hide();
                    $('#material_quantity').val($material.stock_current);
                    $('#material_price').val($material.unit_price);
                    break;
                case 6:
                    $('#presentation').show();
                    $("#fraction").prop("checked", true);
                    $('#length_entered_material').show();
                    $('#width_entered_material').show();
                    $('#width_material').show();
                    $('#material_length').val($material.type_scrap.length);
                    $('#length_material').show();
                    $('#material_width').val($material.type_scrap.width);
                    $('#material_quantity').val($material.stock_current);
                    $('#quantity_entered_material').hide();
                    $('#material_price').val($material.unit_price);
                    break;
                default:
                    $('#length_material').hide();
                    $('#width_material').hide();
                    $('#width_entered_material').hide();
                    $('#length_entered_material').hide();
                    $('#material_quantity').val($material.stock_current);
                    $('#material_percentage_entered').hide();
                    $('#material_price').val($material.unit_price);

            }
            //var idMaterial = $(this).select2('data').id;
            $renderMaterial = $(this).parent().parent().parent().parent().next().next().next();
            $modalAddMaterial.modal('show');
        }
    });

    $(document).on('input', '[data-materialLargo]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-materialAncho]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-materialQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });

    $(document).on('input', '[data-manoQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-manoPrice]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-description]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-cantidad]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-horas]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-precio]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-consumableQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-electricQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-tornoQuantity]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-tornoPrice]', function() {
        var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-quantityequipment]', function() {
        var card = $(this).parent().parent().parent().parent();
        card.removeClass('card-success');
        card.addClass('card-gray-dark');
    });
    $(document).on('input', '[data-descriptionequipment]', function() {
        var card = $(this).parent().parent().parent().parent();
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
    /*$total = parseFloat($('#quote_total').val());
    $subtotal = parseFloat($('#quote_subtotal_utility').val());
    $subtotal2 = parseFloat($('#quote_subtotal_letter').val());
    $subtotal3 = parseFloat($('#quote_subtotal_rent').val());*/

    var customerQuote = $('#customer_quote_id');
    var contactQuote = $('#contact_quote_id');

    $selectCustomer = $('#customer_id');


    $selectCustomer.change(function () {
        $selectContact.empty();
        var customer =  $selectCustomer.val();
        $.get( "/dashboard/get/contact/"+customer, function( data ) {
            $selectContact.append($("<option>", {
                value: '',
                text: 'Seleccione contacto'
            }));
            var contact_quote_id = $('#contact_quote_id').val();
            for ( var i=0; i<data.length; i++ )
            {
                if (data[i].id === parseInt(contact_quote_id)) {
                    var newOption = new Option(data[i].contact, data[i].id, false, true);
                    // Append it to the select
                    $selectContact.append(newOption).trigger('change');

                } else {
                    var newOption2 = new Option(data[i].contact, data[i].id, false, false);
                    // Append it to the select
                    $selectContact.append(newOption2);
                }
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
var $modalChangePercentages;

function savePercentages() {
    var utility = $('#percentage_utility').val();
    var rent = $('#percentage_rent').val();
    var letter = $('#percentage_letter').val();

    var quote = $('#quote_percentage').val();
    var equipment = $('#equipment_percentage').val();

    $.ajax({
        url: '/dashboard/update/percentages/equipment/'+equipment+'/quote/'+quote,
        method: 'POST',
        data: JSON.stringify({ utility: utility, rent:rent, letter: letter}),
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        processData:false,
        contentType:'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
            $modalChangePercentages.modal('hide');
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


        },
    });


}

function changePercentages() {
    var utility = $(this).data('utility');
    var rent = $(this).data('rent');
    var letter = $(this).data('letter');

    var quote = $(this).data('acedit');
    var equipment = $(this).data('acequipment');

    $('#quote_percentage').val(quote);
    $('#equipment_percentage').val(equipment);

    $('#percentage_utility').val(utility);
    $('#percentage_rent').val(rent);
    $('#percentage_letter').val(letter);

    $modalChangePercentages.modal('show');
}

function getContacts() {
    var customer =  $('#customer_quote_id').val();
    $.get( "/dashboard/get/contact/"+customer, function( data ) {
        $selectContact.append($("<option>", {
            value: '',
            text: ''
        }));
        for ( var i=0; i<data.length; i++ )
        {
            if (data[i].id === parseInt($('#contact_quote_id').val())) {
                var newOption = new Option(data[i].contact, data[i].id, false, true);
                // Append it to the select
                $selectContact.append(newOption).trigger('change');

            } else {
                var newOption2 = new Option(data[i].contact, data[i].id, false, false);
                // Append it to the select
                $selectContact.append(newOption2);
            }

        }
    });
}

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

function fillEquipments() {
    //$('#body-summary').html('');

    $('[data-confirm]').each(function(){
        if($(this).data('confirm')!=='')
        {
            var button = $(this);
            var idEquipment = $(this).data('confirm');
            var quantity = button.parent().parent().next().children().children().children().next().val();
            var utility = button.parent().parent().next().children().children().children().next().next().val();
            var rent = button.parent().parent().next().children().children().children().next().next().next().val();
            var letter = button.parent().parent().next().children().children().children().next().next().next().next().val();

            var description = button.parent().parent().next().children().children().next().next().children().next().val();
            var detail = button.parent().parent().next().children().children().next().next().next().children().next().val();
            var materials = button.parent().parent().next().children().next().children().next().children().next().next().next();
            var electrics = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
            var consumables = button.parent().parent().next().children().next().next().children().next().children().next().next();
            var workforces = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
            var tornos = button.parent().parent().next().children().next().next().next().children().next().children().next().next().next().children().next().children().next().next();
            var dias = button.parent().parent().next().children().next().next().next().next().children().next().children().next().next().next();

            var materialsDescription = [];
            var materialsUnit = [];
            var materialsLargo = [];
            var materialsAncho = [];
            var materialsQuantity = [];
            var materialsPrice = [];
            var materialsTotal = [];

            materials.each(function(e){
                $(this).find('[data-materialDescription]').each(function(){
                    materialsDescription.push($(this).val());
                });
                $(this).find('[data-materialUnit]').each(function(){
                    materialsUnit.push($(this).val());
                });
                $(this).find('[data-materialLargo]').each(function(){
                    materialsLargo.push($(this).val());
                });
                $(this).find('[data-materialAncho]').each(function(){
                    materialsAncho.push($(this).val());
                });
                $(this).find('[data-materialQuantity]').each(function(){
                    materialsQuantity.push($(this).val());
                });
                $(this).find('[data-materialPrice]').each(function(){
                    materialsPrice.push($(this).val());
                });
                $(this).find('[data-materialTotal]').each(function(){
                    materialsTotal.push($(this).val());
                });
            });

            var materialsArray = [];
            for (let i = 0; i < materialsDescription.length; i++) {
                var materialSelected = $materials.find( mat=>
                    //mat=>mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase()
                    mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase() &&
                    mat.enable_status === 1
                );
                materialsArray.push({'id':materialSelected.id, 'description':materialsDescription[i], 'unit':materialsUnit[i], 'length':materialsLargo[i], 'width':materialsAncho[i], 'quantity':materialsQuantity[i], 'price': materialsPrice[i], 'total': materialsTotal[i]});
            }

            var diasDescription = [];
            var diasCantidad = [];
            var diasHoras = [];
            var diasPrecio = [];
            var diasTotal = [];

            dias.each(function(e){
                $(this).find('[data-description]').each(function(){
                    diasDescription.push($(this).val());
                });
                $(this).find('[data-cantidad]').each(function(){
                    diasCantidad.push($(this).val());
                });
                $(this).find('[data-horas]').each(function(){
                    diasHoras.push($(this).val());
                });
                $(this).find('[data-precio]').each(function(){
                    diasPrecio.push($(this).val());
                });
                $(this).find('[data-total]').each(function(){
                    diasTotal.push($(this).val());
                });
            });

            var diasArray = [];

            for (let i = 0; i < diasCantidad.length; i++) {
                diasArray.push({'description':diasDescription[i], 'quantity':diasCantidad[i], 'hours':diasHoras[i], 'price':diasPrecio[i], 'total': diasTotal[i]});
            }

            var consumablesDescription = [];
            var consumablesIds = [];
            var consumablesUnit = [];
            var consumablesQuantity = [];
            var consumablesPrice = [];
            var consumablesTotal = [];

            consumables.each(function(e){
                $(this).find('[data-consumableDescription]').each(function(){
                    consumablesDescription.push($(this).val());
                });
                $(this).find('[data-consumableId]').each(function(){
                    consumablesIds.push($(this).attr('data-consumableid'));
                });
                $(this).find('[data-consumableUnit]').each(function(){
                    consumablesUnit.push($(this).val());
                });
                $(this).find('[data-consumableQuantity]').each(function(){
                    consumablesQuantity.push($(this).val());
                });
                $(this).find('[data-consumablePrice]').each(function(){
                    consumablesPrice.push($(this).val());
                });
                $(this).find('[data-consumableTotal]').each(function(){
                    consumablesTotal.push($(this).val());
                });
            });

            var consumablesArray = [];

            for (let i = 0; i < consumablesDescription.length; i++) {
                consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'price': consumablesPrice[i], 'total': consumablesTotal[i]});
            }

            var electricsDescription = [];
            var electricsIds = [];
            var electricsUnit = [];
            var electricsQuantity = [];
            var electricsPrice = [];
            var electricsTotal = [];

            electrics.each(function(e){
                $(this).find('[data-electricDescription]').each(function(){
                    electricsDescription.push($(this).val());
                });
                $(this).find('[data-electricId]').each(function(){
                    electricsIds.push($(this).attr('data-electricid'));
                });
                $(this).find('[data-electricUnit]').each(function(){
                    electricsUnit.push($(this).val());
                });
                $(this).find('[data-electricQuantity]').each(function(){
                    electricsQuantity.push($(this).val());
                });
                $(this).find('[data-electricPrice]').each(function(){
                    electricsPrice.push($(this).val());
                });
                $(this).find('[data-electricTotal]').each(function(){
                    electricsTotal.push($(this).val());
                });
            });

            var electricsArray = [];

            for (let i = 0; i < electricsDescription.length; i++) {
                electricsArray.push({'id':electricsIds[i], 'description':electricsDescription[i], 'unit':electricsUnit[i], 'quantity':electricsQuantity[i], 'price': electricsPrice[i], 'total': electricsTotal[i]});
            }

            var manosDescription = [];
            var manosIds = [];
            var manosUnit = [];
            var manosQuantity = [];
            var manosPrice = [];
            var manosTotal = [];

            workforces.each(function(e){
                $(this).find('[data-manoDescription]').each(function(){
                    manosDescription.push($(this).val());
                });
                $(this).find('[data-manoId]').each(function(){
                    manosIds.push($(this).val());
                });
                $(this).find('[data-manoUnit]').each(function(){
                    manosUnit.push($(this).val());
                });
                $(this).find('[data-manoQuantity]').each(function(){
                    manosQuantity.push($(this).val());
                });
                $(this).find('[data-manoPrice]').each(function(){
                    manosPrice.push($(this).val());
                });
                $(this).find('[data-manoTotal]').each(function(){
                    manosTotal.push($(this).val());
                });
            });

            var manosArray = [];

            for (let i = 0; i < manosDescription.length; i++) {
                manosArray.push({'id':manosIds[i], 'description':manosDescription[i], 'unit':manosUnit[i], 'quantity':manosQuantity[i], 'price':manosPrice[i], 'total': manosTotal[i]});
            }

            var tornosDescription = [];
            var tornosQuantity = [];
            var tornosPrice = [];
            var tornosTotal = [];

            tornos.each(function(e){
                $(this).find('[data-tornoDescription]').each(function(){
                    tornosDescription.push($(this).val());
                });
                $(this).find('[data-tornoQuantity]').each(function(){
                    tornosQuantity.push($(this).val());
                });
                $(this).find('[data-tornoPrice]').each(function(){
                    tornosPrice.push($(this).val());
                });
                $(this).find('[data-tornoTotal]').each(function(){
                    tornosTotal.push($(this).val());
                });
            });

            var tornosArray = [];

            for (let i = 0; i < tornosDescription.length; i++) {
                tornosArray.push({'description':tornosDescription[i], 'quantity':tornosQuantity[i], 'price':tornosPrice[i], 'total': tornosTotal[i]});
            }

            var totalEquipment = 0;
            var totalEquipmentU = 0;
            var totalEquipmentL = 0;
            var totalEquipmentR = 0;
            var totalEquipmentUtility = 0;
            var totalDias = 0;
            for (let i = 0; i < materialsTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(materialsTotal[i]);
            }

            for (let i = 0; i < tornosTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(tornosTotal[i]);
            }

            for (let i = 0; i < manosTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(manosTotal[i]);
            }

            for (let i = 0; i < consumablesTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(consumablesTotal[i]);
            }

            for (let i = 0; i < electricsTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(electricsTotal[i]);
            }

            for (let i = 0; i < diasTotal.length; i++) {
                totalEquipment = parseFloat(totalEquipment) + parseFloat(diasTotal[i]);
            }

            totalEquipment = parseFloat((totalEquipment * quantity)/*+totalDias*/).toFixed(2);

            totalEquipmentU = totalEquipment*((utility/100)+1);
            totalEquipmentL = totalEquipmentU*((letter/100)+1);
            totalEquipmentR = totalEquipmentL*((rent/100)+1);
            totalEquipmentUtility = totalEquipmentR.toFixed(2);

            $total = parseFloat($total) + parseFloat(totalEquipment);
            $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility);

            var quote_id = $('#quote_id').val();

            button.next().attr('data-saveEquipment', $equipments.length);
            button.next().next().attr('data-deleteEquipment', $equipments.length);
            $equipments.push({'id':$equipments.length, 'quote': quote_id, 'equipment': idEquipment, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':description, 'detail':detail, 'materials': materialsArray, 'electrics':electricsArray, 'consumables':consumablesArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias': diasArray});
            //renderTemplateSummary(description, quantity, totalEquipment);
            $items = [];
        }

    });
    //renderTemplateSummary($equipments);
    $("#element_loader").LoadingOverlay("hide", true);
}

function deleteEquipment() {
    //if($(this).attr('data-idequipment')==='') {
    var attr = $(this).attr('data-idequipment');
    console.log(attr);
    if (typeof attr === typeof undefined || attr === false) {
        var button = $(this);
        $.confirm({
            icon: 'fas fa-frown',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'red',
            title: 'Eliminar Equipo',
            content: '¿Está seguro de eliminar este equipo?',
            buttons: {
                confirm: {
                    text: 'CONFIRMAR',
                    action: function (e) {
                        var equipmentId = parseInt(button.data('deleteequipment'));
                        console.log(equipmentId);

                        var equipmentDeleted = $equipments.find(equipment => equipment.id === equipmentId);
                        console.log(equipmentDeleted);

                        $equipments = $equipments.filter(equipment => equipment.id !== equipmentId);
                        button.parent().parent().parent().parent().remove();
                        if ($equipments.length === 0) {
                            renderTemplateEquipment();
                            $equipmentStatus = false;
                        }

                        var totalEquipmentU = 0;
                        var totalEquipmentL = 0;
                        var totalEquipmentR = 0;
                        var totalEquipmentUtility = 0;

                        totalEquipmentU = equipmentDeleted.total*((equipmentDeleted.utility/100)+1);
                        totalEquipmentL = totalEquipmentU*((equipmentDeleted.letter/100)+1);
                        totalEquipmentR = totalEquipmentL*((equipmentDeleted.rent/100)+1);
                        totalEquipmentUtility = totalEquipmentR.toFixed(2);

                        $total = parseFloat($total) - parseFloat(totalEquipmentUtility);
                        $totalUtility = parseFloat($totalUtility) - parseFloat(totalEquipmentUtility);

                        $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                        $('#total').html('USD '+$total.toFixed(2));
                        $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                        $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                        /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                            renderTemplateSummary($equipments);
                        }*/
                        $.alert("Equipo eliminado!");

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
        // TODO: Vamos a eliminar en la base de datos
        var button2 = $(this);
        $.confirm({
            icon: 'fas fa-frown',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'red',
            title: 'Eliminar Equipo',
            content: 'Este equipo va a ser eliminado en la base de datos',
            buttons: {
                confirm: {
                    text: 'CONFIRMAR',
                    action: function (e) {
                        var equipmentId = parseInt(button2.data('deleteequipment'));
                        var idEquipment = button2.data('idequipment');
                        var idQuote = button2.data('quote');
                        console.log(equipmentId);

                        var equipmentDeleted = $equipments.find(equipment => equipment.id === equipmentId);
                        console.log(equipmentDeleted);

                        $.ajax({
                            url: '/dashboard/destroy/list/equipment/'+idEquipment+'/quote/'+idQuote,
                            method: 'POST',
                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                            processData:false,
                            contentType:false,
                            success: function (data) {
                                console.log(data);
                                /*toastr.success(data.message, 'Éxito',
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
                                    });*/

                                $equipments = $equipments.filter(equipment => equipment.id !== equipmentId);
                                button2.parent().parent().parent().parent().remove();

                                var totalEquipmentU = 0;
                                var totalEquipmentL = 0;
                                var totalEquipmentR = 0;
                                var totalEquipmentUtility = 0;

                                totalEquipmentU = equipmentDeleted.total*((equipmentDeleted.utility/100)+1);
                                totalEquipmentL = totalEquipmentU*((equipmentDeleted.letter/100)+1);
                                totalEquipmentR = totalEquipmentL*((equipmentDeleted.rent/100)+1);
                                totalEquipmentUtility = totalEquipmentR.toFixed(2);

                                $total = parseFloat($total) - parseFloat(equipmentDeleted.total);
                                $totalUtility = parseFloat($totalUtility) - parseFloat(totalEquipmentUtility);

                                $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                                $('#total').html('USD '+$total.toFixed(2));
                                $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                                $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                                if ($equipments.length === 0) {
                                    /*renderTemplateEquipment();*/
                                    $equipmentStatus = false;
                                }
                                /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                                    renderTemplateSummary($equipments);
                                }*/
                                $.alert(data.message);

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
    }
}

function saveEquipment() {
    console.log($total);
    if($(this).data('idequipment')==='')
    {
        var button = $(this);
        $.confirm({
            icon: 'fas fa-smile',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'orange',
            title: 'Guardar cambios',
            content: '¿Está seguro de guardar los cambios en este equipo?',
            buttons: {
                confirm: {
                    text: 'CONFIRMAR',
                    action: function (e) {
                        var modifiedEquipment = [];
                        var equipmentId = parseInt(button.data('saveequipment'));
                        var idEquipment = button.attr('data-idequipment');
                        var idQuote = button.attr('data-quote');
                        console.log(equipmentId);
                        var equipmentDeleted = $equipments.find(equipment => equipment.id === equipmentId);
                        console.log(equipmentDeleted);

                        $equipments = $equipments.filter(equipment => equipment.id !== equipmentId);

                        var totalEquipmentU = 0;
                        var totalEquipmentL = 0;
                        var totalEquipmentR = 0;
                        var totalEquipmentUtility = 0;


                        // TODO: Capturar los materiales y recorrerlos y agregar al anterior
                        // TODO: En data-delete (material) debe estar el equipo tambien
                        //$total = parseFloat($total) - parseFloat(equipmentDeleted.total);
                        totalEquipmentU = equipmentDeleted.total*((equipmentDeleted.utility/100)+1);
                        totalEquipmentL = totalEquipmentU*((equipmentDeleted.letter/100)+1);
                        totalEquipmentR = totalEquipmentL*((equipmentDeleted.rent/100)+1);
                        totalEquipmentUtility = totalEquipmentR.toFixed(2);

                        $total = parseFloat($total) - parseFloat(equipmentDeleted.total);
                        $totalUtility = parseFloat($totalUtility) - parseFloat(totalEquipmentUtility);

                        $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                        $('#total').html('USD '+$total.toFixed(2));
                        $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                        $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                        //TODO: Otra vez guardamos el equipo

                        var quantity = button.parent().parent().next().children().children().children().next().val();
                        var utility = button.parent().parent().next().children().children().children().next().next().val();
                        var rent = button.parent().parent().next().children().children().children().next().next().next().val();
                        var letter = button.parent().parent().next().children().children().children().next().next().next().next().val();

                        var description = button.parent().parent().next().children().children().next().next().children().next().val();
                        var detail = button.parent().parent().next().children().children().next().next().next().children().next().val();
                        var materials = button.parent().parent().next().children().next().children().next().children().next().next().next();
                        var consumables = button.parent().parent().next().children().next().next().children().next().children().next().next();
                        var electrics = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
                        var workforces = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
                        var tornos = button.parent().parent().next().children().next().next().next().children().next().children().next().next().next().next().children().next().children().next().next();
                        var dias = button.parent().parent().next().children().next().next().next().next().children().next().children().next().next().next();

                        var materialsDescription = [];
                        var materialsUnit = [];
                        var materialsLargo = [];
                        var materialsAncho = [];
                        var materialsQuantity = [];
                        var materialsPrice = [];
                        var materialsTotal = [];

                        materials.each(function(e){
                            $(this).find('[data-materialDescription]').each(function(){
                                materialsDescription.push($(this).val());
                            });
                            $(this).find('[data-materialUnit]').each(function(){
                                materialsUnit.push($(this).val());
                            });
                            $(this).find('[data-materialLargo]').each(function(){
                                materialsLargo.push($(this).val());
                            });
                            $(this).find('[data-materialAncho]').each(function(){
                                materialsAncho.push($(this).val());
                            });
                            $(this).find('[data-materialQuantity]').each(function(){
                                materialsQuantity.push($(this).val());
                            });
                            $(this).find('[data-materialPrice]').each(function(){
                                materialsPrice.push($(this).val());
                            });
                            $(this).find('[data-materialTotal]').each(function(){
                                materialsTotal.push($(this).val());
                            });
                        });

                        var materialsArray = [];

                        for (let i = 0; i < materialsDescription.length; i++) {
                            var materialSelected = $materials.find( mat=>
                                //mat=>mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase()
                                mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase() &&
                                mat.enable_status === 1
                            );
                            materialsArray.push({'id':materialSelected.id,'material':materialSelected, 'description':materialsDescription[i], 'unit':materialsUnit[i], 'length':materialsLargo[i], 'width':materialsAncho[i], 'quantity':materialsQuantity[i], 'price': materialsPrice[i], 'total': materialsTotal[i]});
                        }

                        var diasDescription = [];
                        var diasCantidad = [];
                        var diasHoras = [];
                        var diasPrecio = [];
                        var diasTotal = [];

                        dias.each(function(e){
                            $(this).find('[data-description]').each(function(){
                                diasDescription.push($(this).val());
                            });
                            $(this).find('[data-cantidad]').each(function(){
                                diasCantidad.push($(this).val());
                            });
                            $(this).find('[data-horas]').each(function(){
                                diasHoras.push($(this).val());
                            });
                            $(this).find('[data-precio]').each(function(){
                                diasPrecio.push($(this).val());
                            });
                            $(this).find('[data-total]').each(function(){
                                diasTotal.push($(this).val());
                            });
                        });

                        var diasArray = [];

                        for (let i = 0; i < diasCantidad.length; i++) {
                            diasArray.push({'description':diasDescription[i], 'quantity':diasCantidad[i], 'hours':diasHoras[i], 'price':diasPrecio[i], 'total': diasTotal[i]});
                        }

                        var consumablesDescription = [];
                        var consumablesIds = [];
                        var consumablesUnit = [];
                        var consumablesQuantity = [];
                        var consumablesPrice = [];
                        var consumablesTotal = [];

                        consumables.each(function(e){
                            $(this).find('[data-consumableDescription]').each(function(){
                                consumablesDescription.push($(this).val());
                            });
                            $(this).find('[data-consumableId]').each(function(){
                                console.log($(this).attr('data-consumableid'));
                                consumablesIds.push($(this).attr('data-consumableid'));
                            });
                            $(this).find('[data-consumableUnit]').each(function(){
                                consumablesUnit.push($(this).val());
                            });
                            $(this).find('[data-consumableQuantity]').each(function(){
                                consumablesQuantity.push($(this).val());
                            });
                            $(this).find('[data-consumablePrice]').each(function(){
                                consumablesPrice.push($(this).val());
                            });
                            $(this).find('[data-consumableTotal]').each(function(){
                                consumablesTotal.push($(this).val());
                            });
                        });

                        var consumablesArray = [];

                        for (let i = 0; i < consumablesDescription.length; i++) {
                            consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'price': consumablesPrice[i], 'total': consumablesTotal[i]});
                        }

                        var electricsDescription = [];
                        var electricsIds = [];
                        var electricsUnit = [];
                        var electricsQuantity = [];
                        var electricsPrice = [];
                        var electricsTotal = [];

                        electrics.each(function(e){
                            $(this).find('[data-electricDescription]').each(function(){
                                electricsDescription.push($(this).val());
                            });
                            $(this).find('[data-electricId]').each(function(){
                                console.log($(this).attr('data-electricid'));
                                electricsIds.push($(this).attr('data-electricid'));
                            });
                            $(this).find('[data-electricUnit]').each(function(){
                                electricsUnit.push($(this).val());
                            });
                            $(this).find('[data-electricQuantity]').each(function(){
                                electricsQuantity.push($(this).val());
                            });
                            $(this).find('[data-electricPrice]').each(function(){
                                electricsPrice.push($(this).val());
                            });
                            $(this).find('[data-electricTotal]').each(function(){
                                electricsTotal.push($(this).val());
                            });
                        });

                        var electricsArray = [];

                        for (let i = 0; i < electricsDescription.length; i++) {
                            electricsArray.push({'id':electricsIds[i], 'description':electricsDescription[i], 'unit':electricsUnit[i], 'quantity':electricsQuantity[i], 'price': electricsPrice[i], 'total': electricsTotal[i]});
                        }

                        var manosDescription = [];
                        var manosIds = [];
                        var manosUnit = [];
                        var manosQuantity = [];
                        var manosPrice = [];
                        var manosTotal = [];

                        workforces.each(function(e){
                            $(this).find('[data-manoDescription]').each(function(){
                                manosDescription.push($(this).val());
                            });
                            $(this).find('[data-manoId]').each(function(){
                                manosIds.push($(this).val());
                            });
                            $(this).find('[data-manoUnit]').each(function(){
                                manosUnit.push($(this).val());
                            });
                            $(this).find('[data-manoQuantity]').each(function(){
                                manosQuantity.push($(this).val());
                            });
                            $(this).find('[data-manoPrice]').each(function(){
                                manosPrice.push($(this).val());
                            });
                            $(this).find('[data-manoTotal]').each(function(){
                                manosTotal.push($(this).val());
                            });
                        });

                        var manosArray = [];

                        for (let i = 0; i < manosDescription.length; i++) {
                            manosArray.push({'id':manosIds[i], 'description':manosDescription[i], 'unit':manosUnit[i], 'quantity':manosQuantity[i], 'price':manosPrice[i], 'total': manosTotal[i]});
                        }

                        var tornosDescription = [];
                        var tornosQuantity = [];
                        var tornosPrice = [];
                        var tornosTotal = [];

                        tornos.each(function(e){
                            $(this).find('[data-tornoDescription]').each(function(){
                                tornosDescription.push($(this).val());
                            });
                            $(this).find('[data-tornoQuantity]').each(function(){
                                tornosQuantity.push($(this).val());
                            });
                            $(this).find('[data-tornoPrice]').each(function(){
                                tornosPrice.push($(this).val());
                            });
                            $(this).find('[data-tornoTotal]').each(function(){
                                tornosTotal.push($(this).val());
                            });
                        });

                        var tornosArray = [];

                        for (let i = 0; i < tornosDescription.length; i++) {
                            tornosArray.push({'description':tornosDescription[i], 'quantity':tornosQuantity[i], 'price':tornosPrice[i], 'total': tornosTotal[i]});
                        }

                        var totalEquipment = 0;
                        var totalEquipmentU = 0;
                        var totalEquipmentL = 0;
                        var totalEquipmentR = 0;
                        var totalEquipmentUtility = 0;
                        var totalDias = 0;
                        for (let i = 0; i < materialsTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(materialsTotal[i]);
                        }
                        for (let i = 0; i < tornosTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(tornosTotal[i]);
                        }
                        for (let i = 0; i < manosTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(manosTotal[i]);
                        }
                        for (let i = 0; i < consumablesTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(consumablesTotal[i]);
                        }
                        for (let i = 0; i < electricsTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(electricsTotal[i]);
                        }
                        for (let i = 0; i < diasTotal.length; i++) {
                            totalEquipment = parseFloat(totalEquipment) + parseFloat(diasTotal[i]);
                        }

                        //totalEquipment = parseFloat((totalEquipment * quantity)).toFixed(2);

                        //$total = parseFloat($total) + parseFloat(totalEquipment);

                        //$('#subtotal').html('USD '+$total);

                        //calculateMargen2($('#utility').val());
                        //calculateLetter2($('#letter').val());
                        //calculateRent2($('#taxes').val());

                        totalEquipment = parseFloat((totalEquipment * quantity)/*+totalDias*/).toFixed(2);
                        totalEquipmentU = totalEquipment*((utility/100)+1);
                        totalEquipmentL = totalEquipmentU*((letter/100)+1);
                        totalEquipmentR = totalEquipmentL*((rent/100)+1);
                        totalEquipmentUtility = totalEquipmentR.toFixed(2);

                        $total = parseFloat($total) + parseFloat(totalEquipment);
                        $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility);

                        $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                        $('#total').html('USD '+$total.toFixed(2));
                        $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                        $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                        /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                            renderTemplateSummary($equipments);
                        }*/
                        button.attr('data-saveEquipment', $equipments.length);
                        button.next().attr('data-deleteEquipment', $equipments.length);
                        $equipments.push({'id':equipmentId, 'quote':'', 'equipment':'', 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'electrics':electricsArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
                        //console.log(modifiedEquipment);
                        /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                            renderTemplateSummary($equipments);
                        }
                        updateTableTotalsEquipment(button, {'id':$equipments.length, 'quote':'', 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
*/
                        var card = button.parent().parent().parent();
                        card.removeClass('card-gray-dark');
                        card.addClass('card-success');
                        $items = [];
                        $.alert("Equipo guardado!");

                    },
                },
                cancel: {
                    text: 'CANCELAR',
                    action: function (e) {
                        $.alert("Modificaión cancelada.");
                    },
                },
            },
        });
    } else {
        var button2 = $(this);
        $.confirm({
            icon: 'fas fa-smile',
            theme: 'modern',
            closeIcon: true,
            animation: 'zoom',
            type: 'orange',
            title: 'Guardar cambios',
            content: '¿Está seguro de guardar los cambios en este equipo?',
            buttons: {
                confirm: {
                    text: 'CONFIRMAR',
                    action: function (e) {
                        $("#element_loader").LoadingOverlay("show", {
                            background  : "rgba(61, 215, 239, 0.4)"
                        });
                        var modifiedEquipment = [];
                        var equipmentId = parseInt(button2.attr('data-saveequipment')); // pos in array js
                        var idEquipment = button2.attr('data-idequipment'); // id del equipo en BD
                        var idQuote = button2.attr('data-quote');
                        var equipmentDeleted = $equipments.find(equipment => equipment.id === equipmentId);
                        console.log(equipmentDeleted);
                        $equipments = $equipments.filter(equipment => equipment.id !== equipmentId);
                        console.log($equipments);
                        // TODO: Capturar los materiales y recorrerlos y agregar al anterior
                        // TODO: En data-delete (material) debe estar el equipo tambien
                        console.log($total);

                        var totalEquipmentU = 0;
                        var totalEquipmentL = 0;
                        var totalEquipmentR = 0;
                        var totalEquipmentUtility = 0;

                        totalEquipmentU = equipmentDeleted.total*((equipmentDeleted.utility/100)+1);
                        totalEquipmentL = totalEquipmentU*((equipmentDeleted.letter/100)+1);
                        totalEquipmentR = totalEquipmentL*((equipmentDeleted.rent/100)+1);
                        totalEquipmentUtility = totalEquipmentR.toFixed(2);

                        $total = parseFloat($total) - parseFloat(equipmentDeleted.total);
                        $totalUtility = parseFloat($totalUtility) - parseFloat(totalEquipmentUtility);


                        //$total = parseFloat($total) - parseFloat(equipmentDeleted.total);
                        console.log($total);
                        //TODO: Otra vez guardamos el equipo

                        var quantity = button2.parent().parent().next().children().children().children().next().val();
                        var utility = button2.parent().parent().next().children().children().children().next().next().val();
                        var rent = button2.parent().parent().next().children().children().children().next().next().next().val();
                        var letter = button2.parent().parent().next().children().children().children().next().next().next().next().val();

                        var description = button2.parent().parent().next().children().children().next().next().children().next().val();
                        var detail = button2.parent().parent().next().children().children().next().next().next().children().next().val();
                        var materials = button2.parent().parent().next().children().next().children().next().children().next().next().next();
                        var consumables = button2.parent().parent().next().children().next().next().children().next().children().next().next();
                        var electrics = button2.parent().parent().next().children().next().next().next().children().next().children().next().next();
                        var workforces = button2.parent().parent().next().children().next().next().next().children().next().children().next().next();
                        var tornos = button2.parent().parent().next().children().next().next().next().children().next().children().next().next().next().next().children().next().children().next().next();
                        var dias = button2.parent().parent().next().children().next().next().next().next().children().next().children().next().next().next();

                        var materialsDescription = [];
                        var materialsUnit = [];
                        var materialsLargo = [];
                        var materialsAncho = [];
                        var materialsQuantity = [];
                        var materialsPrice = [];
                        var materialsTotal = [];

                        materials.each(function(e){
                            $(this).find('[data-materialDescription]').each(function(){
                                materialsDescription.push($(this).val());
                            });
                            $(this).find('[data-materialUnit]').each(function(){
                                materialsUnit.push($(this).val());
                            });
                            $(this).find('[data-materialLargo]').each(function(){
                                materialsLargo.push($(this).val());
                            });
                            $(this).find('[data-materialAncho]').each(function(){
                                materialsAncho.push($(this).val());
                            });
                            $(this).find('[data-materialQuantity]').each(function(){
                                materialsQuantity.push($(this).val());
                            });
                            $(this).find('[data-materialPrice]').each(function(){
                                materialsPrice.push($(this).val());
                            });
                            $(this).find('[data-materialTotal]').each(function(){
                                materialsTotal.push($(this).val());
                            });
                        });

                        var materialsArray = [];

                        for (let i = 0; i < materialsDescription.length; i++) {
                            var materialSelected = $materials.find( mat=>
                                //mat=>mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase()
                                mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase() &&
                                mat.enable_status === 1
                            );
                            materialsArray.push({'id':materialSelected.id,'material':materialSelected, 'description':materialsDescription[i], 'unit':materialsUnit[i], 'length':materialsLargo[i], 'width':materialsAncho[i], 'quantity':materialsQuantity[i], 'price': materialsPrice[i], 'total': materialsTotal[i]});
                        }

                        var diasDescription = [];
                        var diasCantidad = [];
                        var diasHoras = [];
                        var diasPrecio = [];
                        var diasTotal = [];

                        dias.each(function(e){
                            $(this).find('[data-description]').each(function(){
                                diasDescription.push($(this).val());
                            });
                            $(this).find('[data-cantidad]').each(function(){
                                diasCantidad.push($(this).val());
                            });
                            $(this).find('[data-horas]').each(function(){
                                diasHoras.push($(this).val());
                            });
                            $(this).find('[data-precio]').each(function(){
                                diasPrecio.push($(this).val());
                            });
                            $(this).find('[data-total]').each(function(){
                                diasTotal.push($(this).val());
                            });
                        });

                        var diasArray = [];

                        for (let i = 0; i < diasCantidad.length; i++) {
                            diasArray.push({'description':diasDescription[i], 'quantity':diasCantidad[i], 'hours':diasHoras[i], 'price':diasPrecio[i], 'total': diasTotal[i]});
                        }

                        var consumablesDescription = [];
                        var consumablesIds = [];
                        var consumablesUnit = [];
                        var consumablesQuantity = [];
                        var consumablesPrice = [];
                        var consumablesTotal = [];

                        consumables.each(function(e){
                            $(this).find('[data-consumableDescription]').each(function(){
                                consumablesDescription.push($(this).val());
                            });
                            $(this).find('[data-consumableId]').each(function(){
                                consumablesIds.push($(this).attr('data-consumableid'));
                            });
                            $(this).find('[data-consumableUnit]').each(function(){
                                consumablesUnit.push($(this).val());
                            });
                            $(this).find('[data-consumableQuantity]').each(function(){
                                consumablesQuantity.push($(this).val());
                            });
                            $(this).find('[data-consumablePrice]').each(function(){
                                consumablesPrice.push($(this).val());
                            });
                            $(this).find('[data-consumableTotal]').each(function(){
                                consumablesTotal.push($(this).val());
                            });
                        });

                        var consumablesArray = [];

                        for (let i = 0; i < consumablesDescription.length; i++) {
                            consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'price': consumablesPrice[i], 'total': consumablesTotal[i]});
                        }

                        var electricsDescription = [];
                        var electricsIds = [];
                        var electricsUnit = [];
                        var electricsQuantity = [];
                        var electricsPrice = [];
                        var electricsTotal = [];

                        electrics.each(function(e){
                            $(this).find('[data-electricDescription]').each(function(){
                                electricsDescription.push($(this).val());
                            });
                            $(this).find('[data-electricId]').each(function(){
                                electricsIds.push($(this).attr('data-electricid'));
                            });
                            $(this).find('[data-electricUnit]').each(function(){
                                electricsUnit.push($(this).val());
                            });
                            $(this).find('[data-electricQuantity]').each(function(){
                                electricsQuantity.push($(this).val());
                            });
                            $(this).find('[data-electricPrice]').each(function(){
                                electricsPrice.push($(this).val());
                            });
                            $(this).find('[data-electricTotal]').each(function(){
                                electricsTotal.push($(this).val());
                            });
                        });

                        var electricsArray = [];

                        for (let i = 0; i < electricsDescription.length; i++) {
                            electricsArray.push({'id':electricsIds[i], 'description':electricsDescription[i], 'unit':electricsUnit[i], 'quantity':electricsQuantity[i], 'price': electricsPrice[i], 'total': electricsTotal[i]});
                        }

                        var manosDescription = [];
                        var manosIds = [];
                        var manosUnit = [];
                        var manosQuantity = [];
                        var manosPrice = [];
                        var manosTotal = [];

                        workforces.each(function(e){
                            $(this).find('[data-manoDescription]').each(function(){
                                manosDescription.push($(this).val());
                            });
                            $(this).find('[data-manoId]').each(function(){
                                manosIds.push($(this).val());
                            });
                            $(this).find('[data-manoUnit]').each(function(){
                                manosUnit.push($(this).val());
                            });
                            $(this).find('[data-manoQuantity]').each(function(){
                                manosQuantity.push($(this).val());
                            });
                            $(this).find('[data-manoPrice]').each(function(){
                                manosPrice.push($(this).val());
                            });
                            $(this).find('[data-manoTotal]').each(function(){
                                manosTotal.push($(this).val());
                            });
                        });

                        var manosArray = [];

                        for (let i = 0; i < manosDescription.length; i++) {
                            manosArray.push({'id':manosIds[i], 'description':manosDescription[i], 'unit':manosUnit[i], 'quantity':manosQuantity[i], 'price':manosPrice[i], 'total': manosTotal[i]});
                        }

                        var tornosDescription = [];
                        var tornosQuantity = [];
                        var tornosPrice = [];
                        var tornosTotal = [];

                        tornos.each(function(e){
                            $(this).find('[data-tornoDescription]').each(function(){
                                tornosDescription.push($(this).val());
                            });
                            $(this).find('[data-tornoQuantity]').each(function(){
                                tornosQuantity.push($(this).val());
                            });
                            $(this).find('[data-tornoPrice]').each(function(){
                                tornosPrice.push($(this).val());
                            });
                            $(this).find('[data-tornoTotal]').each(function(){
                                tornosTotal.push($(this).val());
                            });
                        });

                        var tornosArray = [];

                        for (let i = 0; i < tornosDescription.length; i++) {
                            tornosArray.push({'description':tornosDescription[i], 'quantity':tornosQuantity[i], 'price':tornosPrice[i], 'total': tornosTotal[i]});
                        }

                        var totalEquipment2 = 0;
                        var totalEquipmentU2 = 0;
                        var totalEquipmentL2 = 0;
                        var totalEquipmentR2 = 0;
                        var totalEquipmentUtility2 = 0;
                        var totalDias2 = 0;

                        for (let i = 0; i < materialsTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(materialsTotal[i]);
                        }
                        for (let i = 0; i < tornosTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(tornosTotal[i]);
                        }
                        for (let i = 0; i < manosTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(manosTotal[i]);
                        }
                        for (let i = 0; i < consumablesTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(consumablesTotal[i]);
                        }
                        for (let i = 0; i < electricsTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(electricsTotal[i]);
                        }
                        for (let i = 0; i < diasTotal.length; i++) {
                            totalEquipment2 = parseFloat(totalEquipment2) + parseFloat(diasTotal[i]);
                        }

                        totalEquipment2 = parseFloat((totalEquipment2 * quantity)/*+totalDias2*/).toFixed(2);
                        totalEquipmentU2 = totalEquipment2*((utility/100)+1);
                        totalEquipmentL2 = totalEquipmentU2*((letter/100)+1);
                        totalEquipmentR2 = totalEquipmentL2*((rent/100)+1);
                        totalEquipmentUtility2 = totalEquipmentR2.toFixed(2);

                        $total = parseFloat($total) + parseFloat(totalEquipment2);
                        $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility2);

                        $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                        $('#total').html('USD '+$total.toFixed(2));
                        $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                        $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                        //totalEquipment = parseFloat((totalEquipment * quantity)).toFixed(2);
                        console.log(totalEquipment2);
                        console.log($total);
                        //$total = parseFloat($total) + parseFloat(totalEquipment);
                        console.log($total);
                        //$('#subtotal').html('USD '+ parseFloat($total).toFixed(2));
                        console.log($total);
                        //calculateMargen2($('#utility').val());
                        //calculateLetter2($('#letter').val());
                        //calculateRent2($('#taxes').val());
                        console.log($total);
                        button2.attr('data-saveEquipment', equipmentDeleted.id);
                        button2.next().attr('data-deleteEquipment', equipmentDeleted.id);
                        modifiedEquipment.push({'id':equipmentDeleted.id, 'quote':idQuote, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment2, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'electrics':electricsArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
                        //console.log(modifiedEquipment);
                        $items = [];
                        console.log(modifiedEquipment);
                        var equipos = JSON.stringify(modifiedEquipment);
                        $.ajax({
                            url: '/dashboard/update/list/equipment/'+idEquipment+'/quote/'+idQuote,
                            method: 'POST',
                            data: JSON.stringify({ equipment: modifiedEquipment }),
                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                            processData:false,
                            contentType:'application/json; charset=utf-8',
                            success: function (data) {
                                console.log(data);
                                var equipment = data.equipment;
                                var quote = data.quote;
                                button2.parent().prev().html('EQUIPO: '+description);
                                button2.attr('data-quote', quote.id);
                                button2.attr('data-idequipment', equipment.id);
                                button2.next().attr('data-quote', quote.id);
                                button2.next().attr('data-idequipment', equipment.id);
                                $equipments.push({'id':equipmentDeleted.id, 'quote':quote.id, 'equipment':equipment.id, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment2, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'electrics':electricsArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
                                /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                                    renderTemplateSummary($equipments);
                                }
                                updateTableTotalsEquipment(button2, {'id':equipmentDeleted.id, 'quote':quote.id, 'equipment':equipment.id, 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment2, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
*/
                                $.alert(data.message);

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
                        //$.alert("Equipo guardado!");
                        var card = button2.parent().parent().parent();
                        card.removeClass('card-gray-dark');
                        card.addClass('card-success');
                        $("#element_loader").LoadingOverlay("hide", true);
                        console.log($total);
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


}

function deleteConsumable() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function deleteElectric() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function deleteMano() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function deleteDia() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function deleteTorno() {
    //console.log($(this).parent().parent().parent());
    var card = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    $(this).parent().parent().remove();
}

function addConsumable() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var consumableID = $(this).parent().parent().find('[data-consumable]').val();
        //console.log(material);
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
        renderTemplateConsumable(render, consumable, cantidad);
    } else {
        var consumableID2 = $(this).parent().parent().find('[data-consumable]').val();
        console.log(consumableID2);
        var inputQuantity2 = $(this).parent().parent().find('[data-cantidad]');
        console.log(inputQuantity2);
        var cantidad2 = inputQuantity2.val();
        console.log(cantidad2);
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
        console.log(render2);
        var consumable2 = $consumables.find( mat=>mat.id === parseInt(consumableID2) );
        var consumables2 = $(this).parent().parent().next().next().children();
        console.log(consumable2);
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
        renderTemplateConsumable(render2, consumable2, cantidad2);
    }

}

function addElectric() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var electricID = $(this).parent().parent().find('[data-electric]').val();
        //console.log(material);
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

        if ( electricID === '' || electricID === null )
        {
            toastr.error('Debe seleccionar un material eléctrico', 'Error',
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

        var electric = $electrics.find( mat=>mat.id === parseInt(electricID) );

        var electrics = $(this).parent().parent().next().next().children();

        electrics.each(function(e){
            var id = $(this).children().children().children().next().val();
            if (parseInt(electric.id) === parseInt(id)) {
                inputQuantity.val(0);
                $(".electric_search").empty().trigger('change');
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
        $(".electric_search").empty().trigger('change');
        renderTemplateElectric(render, electric, cantidad);
    } else {
        var electricID2 = $(this).parent().parent().find('[data-electric]').val();
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

        if ( electricID2 === '' || electricID2 === null )
        {
            toastr.error('Debe seleccionar un material electrico', 'Error',
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

        var electric2 = $electrics.find( mat=>mat.id === parseInt(electricID2) );
        var electrics2 = $(this).parent().parent().next().next().children();

        electrics2.each(function(e){
            var id = $(this).children().children().children().next().val();
            if (parseInt(electric2.id) === parseInt(id)) {
                inputQuantity2.val(0);
                $(".electric_search").empty().trigger('change');
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
        $(".electric_search").empty().trigger('change');
        renderTemplateElectric(render2, electric2, cantidad2);
    }

}

function addMano() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var precio = $(this).parent().prev().children().children().next().val();
        var cantidad = $(this).parent().prev().prev().children().children().next().val();
        var unidad = $(this).parent().prev().prev().prev().children().children().next().next().text();
        var unidadID = $(this).parent().prev().prev().prev().children().children().next().val();
        var descripcion = $(this).parent().prev().prev().prev().prev().children().children().next().val();

        if ( descripcion === '' )
        {
            toastr.error('Escriba una descripción adecuada.', 'Error',
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
        if ( unidadID === '' || parseFloat(unidadID) === 0 )
        {
            toastr.error('Seleccione una unidad válida.', 'Error',
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
        if ( cantidad === '' || parseFloat(cantidad) === 0 )
        {
            toastr.error('Agregue una cantidad válida.', 'Error',
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
        if ( precio === '' || parseFloat(precio) === 0 )
        {
            toastr.error('Agregue un precio válido.', 'Error',
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

        $(this).parent().prev().prev().prev().prev().children().children().next().val('');
        $(".unitMeasure").val('').trigger('change');
        $(this).parent().prev().prev().children().children().next().val(0);
        $(this).parent().prev().children().children().next().val(0);
        //console.log(descripcion);
        var render = $(this).parent().parent().next().next().next();
        renderTemplateMano(render, descripcion, unidad, cantidad, precio);
    } else {
        var precio2 = 0;
        var cantidad2 = $(this).parent().prev().children().children().next().val();
        var unidad2 = $(this).parent().prev().prev().children().children().next().next().text();
        var unidadID2 = $(this).parent().prev().prev().children().children().next().val();
        var descripcion2 = $(this).parent().prev().prev().prev().children().children().next().val();

        if ( descripcion2 === '' )
        {
            toastr.error('Escriba una descripción adecuada.', 'Error',
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
        if ( unidadID2 === '' || parseFloat(unidadID2) === 0 )
        {
            toastr.error('Seleccione una unidad válida.', 'Error',
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
        if ( cantidad2 === '' || parseFloat(cantidad2) === 0 )
        {
            toastr.error('Agregue una cantidad válida.', 'Error',
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


        $(this).parent().prev().prev().prev().children().children().next().val('');
        $(".unitMeasure").val('').trigger('change');
        $(this).parent().prev().children().children().next().val(0);
        $(this).parent().children().children().next().val(0);
        //console.log(descripcion);
        var render2 = $(this).parent().parent().next().next().next();
        console.log(render2);
        renderTemplateMano(render2, descripcion2, unidad2, cantidad2, precio2);
    }

}

function addDia() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var pricePerHour = $(this).parent().prev().children().children().next().val();
        var hoursPerPerson = $(this).parent().prev().prev().children().children().next().val();
        var quantityPerson = $(this).parent().prev().prev().prev().children().children().next().val();
        var description = $(this).parent().prev().prev().prev().prev().children().children().next().val();

        if ( quantityPerson === '' || parseFloat(quantityPerson) === 0 )
        {
            toastr.error('Ingrese un valor correcto.', 'Error',
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
        if ( hoursPerPerson === '' || parseFloat(hoursPerPerson) === 0 )
        {
            toastr.error('Ingrese un valor válido.', 'Error',
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
        if ( pricePerHour === '' || parseFloat(pricePerHour) === 0 )
        {
            toastr.error('Ingrese un precio válido.', 'Error',
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
        if ( description === '' )
        {
            toastr.error('Ingrese una descripción correcta.', 'Error',
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

        $(this).parent().prev().children().children().next().val(0);
        $(this).parent().prev().prev().children().children().next().val(0);
        $(this).parent().prev().prev().prev().children().children().next().next().val(0);
        $(this).parent().prev().prev().prev().prev().children().children().next().next().val('');

        //console.log(descripcion);
        var render = $(this).parent().parent().next().next().next();
        var total = parseFloat(pricePerHour)*parseFloat(hoursPerPerson)*parseFloat(quantityPerson);
        renderTemplateDia(render, description, pricePerHour, hoursPerPerson, quantityPerson, total.toFixed(2));
    } else {
        var pricePerHour2 = 0;
        var hoursPerPerson2 = $(this).parent().prev().children().children().next().val();
        var quantityPerson2 = $(this).parent().prev().prev().children().children().next().val();
        var description2 = $(this).parent().prev().prev().prev().children().children().next().val();

        if ( quantityPerson2 === '' || parseFloat(quantityPerson2) === 0 )
        {
            toastr.error('Ingrese un valor correcto.', 'Error',
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
        if ( hoursPerPerson2 === '' || parseFloat(hoursPerPerson2) === 0 )
        {
            toastr.error('Ingrese un valor válido.', 'Error',
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
        if ( description2 === '' )
        {
            toastr.error('Ingrese una descripción correcta.', 'Error',
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

        //$(this).parent().prev().children().children().next().val(0);
        $(this).parent().prev().prev().prev().children().children().next().val('');
        $(this).parent().prev().prev().children().children().next().val(0);
        $(this).parent().prev().children().children().next().val(0);
        //console.log(descripcion);
        var render2 = $(this).parent().parent().next().next().next();
        console.log(render2);
        var total2 = 0;
        renderTemplateDia(render2, description2, pricePerHour2, hoursPerPerson2, quantityPerson2, total2);
    }

}

function addTorno() {

    var precio = $(this).parent().prev().children().children().next().val();
    var cantidad = $(this).parent().prev().prev().children().children().next().val();
    var descripcion = $(this).parent().prev().prev().prev().children().children().next().val();

    if ( descripcion === '' )
    {
        toastr.error('Escriba una descripción adecuada.', 'Error',
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
    if ( cantidad === '' || parseFloat(cantidad) === 0 )
    {
        toastr.error('Agregue una cantidad válida.', 'Error',
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
    if ( precio === '' || parseFloat(precio) === 0 )
    {
        toastr.error('Agregue un precio válido.', 'Error',
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

    $(this).parent().prev().prev().prev().children().children().next().val('');
    $(this).parent().prev().prev().children().children().next().val(0);
    $(this).parent().prev().children().children().next().val(0);
    //console.log(descripcion);
    var render = $(this).parent().parent().next().next();
    renderTemplateTorno(render, descripcion, cantidad, precio);
}

function confirmEquipment() {
    var button = $(this);
    $.confirm({
        icon: 'fas fa-smile',
        theme: 'modern',
        closeIcon: true,
        animation: 'zoom',
        type: 'green',
        title: 'Confirmar Equipo',
        content: 'Debe confirmar para almacenar el equipo en memoria',
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

                    var quantity = button.parent().parent().next().children().children().children().next().val();
                    var utility = button.parent().parent().next().children().children().children().next().next().val();
                    var rent = button.parent().parent().next().children().children().children().next().next().next().val();
                    var letter = button.parent().parent().next().children().children().children().next().next().next().next().val();

                    var description = button.parent().parent().next().children().children().next().next().children().next().val();
                    var detail = button.parent().parent().next().children().children().next().next().next().children().next().val();
                    var materials = button.parent().parent().next().children().next().children().next().children().next().next().next();
                    var consumables = button.parent().parent().next().children().next().next().children().next().children().next().next();
                    var electrics = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
                    var workforces = button.parent().parent().next().children().next().next().next().children().next().children().next().next();
                    var tornos = button.parent().parent().next().children().next().next().next().children().next().children().next().next().next().next().children().next().children().next().next();
                    var dias = button.parent().parent().next().children().next().next().next().next().children().next().children().next().next().next();
                    console.log(description);
                    var materialsDescription = [];
                    var materialsUnit = [];
                    var materialsLargo = [];
                    var materialsAncho = [];
                    var materialsQuantity = [];
                    var materialsPrice = [];
                    var materialsTotal = [];

                    materials.each(function(e){
                        $(this).find('[data-materialDescription]').each(function(){
                            materialsDescription.push($(this).val());
                        });
                        $(this).find('[data-materialUnit]').each(function(){
                            materialsUnit.push($(this).val());
                        });
                        $(this).find('[data-materialLargo]').each(function(){
                            materialsLargo.push($(this).val());
                        });
                        $(this).find('[data-materialAncho]').each(function(){
                            materialsAncho.push($(this).val());
                        });
                        $(this).find('[data-materialQuantity]').each(function(){
                            materialsQuantity.push($(this).val());
                        });
                        $(this).find('[data-materialPrice]').each(function(){
                            materialsPrice.push($(this).val());
                        });
                        $(this).find('[data-materialTotal]').each(function(){
                            materialsTotal.push($(this).val());
                        });
                    });

                    var materialsArray = [];

                    for (let i = 0; i < materialsDescription.length; i++) {
                        var materialSelected = $materials.find( mat=>
                            //mat=>mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase()
                            mat.full_name.trim().toLowerCase() === materialsDescription[i].trim().toLowerCase() &&
                            mat.enable_status === 1
                        );
                        materialsArray.push({'id':materialSelected.id,'material':materialSelected, 'description':materialsDescription[i], 'unit':materialsUnit[i], 'length':materialsLargo[i], 'width':materialsAncho[i], 'quantity':materialsQuantity[i], 'price': materialsPrice[i], 'total': materialsTotal[i]});
                    }

                    var diasDescription = [];
                    var diasCantidad = [];
                    var diasHoras = [];
                    var diasPrecio = [];
                    var diasTotal = [];

                    dias.each(function(e){
                        $(this).find('[data-description]').each(function(){
                            diasDescription.push($(this).val());
                        });
                        $(this).find('[data-cantidad]').each(function(){
                            diasCantidad.push($(this).val());
                        });
                        $(this).find('[data-horas]').each(function(){
                            diasHoras.push($(this).val());
                        });
                        $(this).find('[data-precio]').each(function(){
                            diasPrecio.push($(this).val());
                        });
                        $(this).find('[data-total]').each(function(){
                            diasTotal.push($(this).val());
                        });
                    });

                    var diasArray = [];

                    for (let i = 0; i < diasCantidad.length; i++) {
                        diasArray.push({'description':diasDescription[i], 'quantity':diasCantidad[i], 'hours':diasHoras[i], 'price':diasPrecio[i], 'total': diasTotal[i]});
                    }

                    var consumablesDescription = [];
                    var consumablesIds = [];
                    var consumablesUnit = [];
                    var consumablesQuantity = [];
                    var consumablesPrice = [];
                    var consumablesTotal = [];

                    consumables.each(function(e){
                        $(this).find('[data-consumableDescription]').each(function(){
                            consumablesDescription.push($(this).val());
                        });
                        $(this).find('[data-consumableId]').each(function(){
                            consumablesIds.push($(this).attr('data-consumableid'));
                        });
                        $(this).find('[data-consumableUnit]').each(function(){
                            consumablesUnit.push($(this).val());
                        });
                        $(this).find('[data-consumableQuantity]').each(function(){
                            consumablesQuantity.push($(this).val());
                        });
                        $(this).find('[data-consumablePrice]').each(function(){
                            consumablesPrice.push($(this).val());
                        });
                        $(this).find('[data-consumableTotal]').each(function(){
                            consumablesTotal.push($(this).val());
                        });
                    });

                    var consumablesArray = [];

                    for (let i = 0; i < consumablesDescription.length; i++) {
                        consumablesArray.push({'id':consumablesIds[i], 'description':consumablesDescription[i], 'unit':consumablesUnit[i], 'quantity':consumablesQuantity[i], 'price': consumablesPrice[i], 'total': consumablesTotal[i]});
                    }

                    // SECCION DE ELECTRICOS
                    var electricsDescription = [];
                    var electricsIds = [];
                    var electricsUnit = [];
                    var electricsQuantity = [];
                    var electricsPrice = [];
                    var electricsTotal = [];

                    electrics.each(function(e){
                        $(this).find('[data-electricDescription]').each(function(){
                            electricsDescription.push($(this).val());
                        });
                        $(this).find('[data-electricId]').each(function(){
                            electricsIds.push($(this).attr('data-electricid'));
                        });
                        $(this).find('[data-electricUnit]').each(function(){
                            electricsUnit.push($(this).val());
                        });
                        $(this).find('[data-electricQuantity]').each(function(){
                            electricsQuantity.push($(this).val());
                        });
                        $(this).find('[data-electricPrice]').each(function(){
                            electricsPrice.push($(this).val());
                        });
                        $(this).find('[data-electricTotal]').each(function(){
                            electricsTotal.push($(this).val());
                        });
                    });

                    var electricsArray = [];

                    for (let i = 0; i < electricsDescription.length; i++) {
                        electricsArray.push({'id':electricsIds[i], 'description':electricsDescription[i], 'unit':electricsUnit[i], 'quantity':electricsQuantity[i], 'price': electricsPrice[i], 'total': electricsTotal[i]});
                    }

                    var manosDescription = [];
                    var manosIds = [];
                    var manosUnit = [];
                    var manosQuantity = [];
                    var manosPrice = [];
                    var manosTotal = [];

                    workforces.each(function(e){
                        $(this).find('[data-manoDescription]').each(function(){
                            manosDescription.push($(this).val());
                        });
                        $(this).find('[data-manoId]').each(function(){
                            manosIds.push($(this).val());
                        });
                        $(this).find('[data-manoUnit]').each(function(){
                            manosUnit.push($(this).val());
                        });
                        $(this).find('[data-manoQuantity]').each(function(){
                            manosQuantity.push($(this).val());
                        });
                        $(this).find('[data-manoPrice]').each(function(){
                            manosPrice.push($(this).val());
                        });
                        $(this).find('[data-manoTotal]').each(function(){
                            manosTotal.push($(this).val());
                        });
                    });

                    var manosArray = [];

                    for (let i = 0; i < manosDescription.length; i++) {
                        manosArray.push({'id':manosIds[i], 'description':manosDescription[i], 'unit':manosUnit[i], 'quantity':manosQuantity[i], 'price':manosPrice[i], 'total': manosTotal[i]});
                    }

                    var tornosDescription = [];
                    var tornosQuantity = [];
                    var tornosPrice = [];
                    var tornosTotal = [];

                    tornos.each(function(e){
                        $(this).find('[data-tornoDescription]').each(function(){
                            tornosDescription.push($(this).val());
                        });
                        $(this).find('[data-tornoQuantity]').each(function(){
                            tornosQuantity.push($(this).val());
                        });
                        $(this).find('[data-tornoPrice]').each(function(){
                            tornosPrice.push($(this).val());
                        });
                        $(this).find('[data-tornoTotal]').each(function(){
                            tornosTotal.push($(this).val());
                        });
                    });

                    var tornosArray = [];

                    for (let i = 0; i < tornosDescription.length; i++) {
                        tornosArray.push({'description':tornosDescription[i], 'quantity':tornosQuantity[i], 'price':tornosPrice[i], 'total': tornosTotal[i]});
                    }

                    var totalEquipment = 0;
                    var totalEquipmentU = 0;
                    var totalEquipmentL = 0;
                    var totalEquipmentR = 0;
                    var totalEquipmentUtility = 0;
                    var totalDias = 0;
                    for (let i = 0; i < materialsTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(materialsTotal[i]);
                    }
                    for (let i = 0; i < tornosTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(tornosTotal[i]);
                    }
                    for (let i = 0; i < manosTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(manosTotal[i]);
                    }
                    for (let i = 0; i < consumablesTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(consumablesTotal[i]);
                    }
                    for (let i = 0; i < electricsTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(electricsTotal[i]);
                    }
                    for (let i = 0; i < diasTotal.length; i++) {
                        totalEquipment = parseFloat(totalEquipment) + parseFloat(diasTotal[i]);
                    }

                    totalEquipment = parseFloat((totalEquipment * quantity)/*+totalDias*/).toFixed(2);

                    totalEquipmentU = totalEquipment*((utility/100)+1);
                    totalEquipmentL = totalEquipmentU*((letter/100)+1);
                    totalEquipmentR = totalEquipmentL*((rent/100)+1);
                    totalEquipmentUtility = totalEquipmentR.toFixed(2);

                    $total = parseFloat($total) + parseFloat(totalEquipment);
                    $totalUtility = parseFloat($totalUtility) + parseFloat(totalEquipmentUtility);

                    $('#subtotal').html('USD '+ ($total/1.18).toFixed(2));
                    $('#total').html('USD '+$total.toFixed(2));
                    $('#subtotal_utility').html('USD '+ ($totalUtility/1.18).toFixed(2));
                    $('#total_utility').html('USD '+$totalUtility.toFixed(2));

                    button.next().attr('data-saveEquipment', $equipments.length);
                    button.next().next().attr('data-deleteEquipment', $equipments.length);
                    $equipments.push({'id':$equipments.length, 'quote':'', 'quantity':quantity, 'equipment':'', 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'electrics':electricsArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
                    /*if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
                        renderTemplateSummary($equipments);
                    }
                    updateTableTotalsEquipment(button, {'id':$equipments.length, 'quote':'', 'quantity':quantity, 'utility':utility, 'rent':rent, 'letter':letter, 'total':totalEquipment, 'description':description, 'detail':detail, 'materials': materialsArray, 'consumables':consumablesArray, 'workforces':manosArray, 'tornos':tornosArray, 'dias':diasArray});
*/
                    var card = button.parent().parent().parent();
                    card.removeClass('card-gray-dark');
                    card.addClass('card-success');
                    $items = [];
                    $.alert("Equipo confirmado!");

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

function updateTableTotalsEquipment(button, data) {
    var quantity = data.quantity;
    var materiales = data.materials;
    var consumibles = data.consumables;
    var electrics = data.electrics;
    var serviciosVarios = data.workforces;
    var serviciosAdicionales = data.tornos;
    var diasTrabajo = data.dias;

    var totalMaterials = 0;

    for (let i = 0; i < materiales.length; i++) {
        totalMaterials += parseFloat(materiales[i].total);
    }

    var totalConsumables = 0;

    for (let j = 0; j < consumibles.length; j++) {
        totalConsumables += parseFloat(consumibles[j].total);
    }

    var totalElectrics = 0;

    for (let j = 0; j < electrics.length; j++) {
        totalElectrics += parseFloat(electrics[j].total);
    }

    var totalWorkforces = 0;

    for (let k = 0; k < serviciosVarios.length; k++) {
        totalWorkforces += parseFloat(serviciosVarios[k].total);
    }

    var totalTornos = 0;

    for (let l = 0; l < serviciosAdicionales.length; l++) {
        totalTornos += parseFloat(serviciosAdicionales[l].total);
    }

    var totalDias = 0;

    for (let m = 0; m < diasTrabajo.length; m++) {
        totalDias += parseFloat(diasTrabajo[m].total);
    }

    var table = button.parent().parent().next().children().next().next().next().next().next().children().next().children();

    var totalMaterialsElement = table.find('[data-total_materials]');
    //totalMaterialsElement.html((totalMaterials*quantity).toFixed(2));
    totalMaterialsElement.html((totalMaterials).toFixed(2));
    totalMaterialsElement.css('text-align', 'right');

    var totalConsumablesElement = table.find('[data-total_consumables]');
    //totalConsumablesElement.html((totalConsumables*quantity).toFixed(2));
    totalConsumablesElement.html((totalConsumables).toFixed(2));
    totalConsumablesElement.css('text-align', 'right');

    var totalElectricsElement = table.find('[data-total_electrics]');
    //totalConsumablesElement.html((totalConsumables*quantity).toFixed(2));
    totalElectricsElement.html((totalElectrics).toFixed(2));
    totalElectricsElement.css('text-align', 'right');

    var totalWorkforcesElement = table.find('[data-total_workforces]');
    //totalWorkforcesElement.html((totalWorkforces*quantity).toFixed(2));
    totalWorkforcesElement.html((totalWorkforces).toFixed(2));
    totalWorkforcesElement.css('text-align', 'right');

    var totalTornosElement = table.find('[data-total_tornos]');
    //totalTornosElement.html((totalTornos*quantity).toFixed(2));
    totalTornosElement.html((totalTornos).toFixed(2));
    totalTornosElement.css('text-align', 'right');

    var totalDiasElement = table.find('[data-total_dias]');
    //totalDiasElement.html((totalDias*quantity).toFixed(2));
    totalDiasElement.html((totalDias).toFixed(2));
    totalDiasElement.css('text-align', 'right');
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

function addEquipment() {
    //var result = document.querySelectorAll('[data-equip]');
    //console.log(result);
    /*for (var index in result){
        if (result.hasOwnProperty(index)){
            if(result[index].getAttribute('style')!==null){
                //console.log(result[index].getAttribute('style'));
                $equipmentStatus=true;
            }
        }
    }*/
    //var equipmentStat = confirmEquipment.css('display') === 'none';
    //console.log(confirmEquipment);
    /*if ( !$equipmentStatus )
    {
        toastr.error('Confirme el equipo antes de agregar otro.', 'Error',
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
    }*/

    renderTemplateEquipment();
    $('.materialTypeahead').typeahead('destroy');
    $('.materialTypeahead').typeahead({
            hint: true,
            highlight: true, /* Enable substring highlighting */
            minLength: 1 /* Specify minimum characters required for showing suggestions */
        },
        {
            limit: 12,
            source: substringMatcher($materialsTypeahead)
        });
    /*for (var i=0; i<$materials.length; i++)
    {
        var newOption = new Option($materials[i].full_description, $materials[i].id, false, false);
        $('.material_search').append(newOption).trigger('change');
    }*/

    $('.consumable_search').select2({
        placeholder: 'Selecciona un consumible',
        ajax: {
            url: '/dashboard/select/consumables',
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
    //$equipmentStatus = false;
    $('.electric_search').select2({
        placeholder: 'Selecciona un material',
        ajax: {
            url: '/dashboard/select/consumables',
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

    $('.textarea_edit').summernote({
        lang: 'es-ES',
        placeholder: 'Ingrese los detalles',
        tabsize: 2,
        height: 120,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['para', ['ul', 'ol']],
            ['insert', ['link']],
            ['view', ['codeview', 'help']]
        ]
    });
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

function calculatePercentage() {
    if( $('#material_length_entered').val().trim() === '' && $("#quantity_entered_material").css('display') === 'none' )
    {
        toastr.error('Debe ingresar la longitud del material', 'Error',
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
    if( $('#material_width_entered').val().trim() === '' && $("#quantity_entered_material").css('display') === 'none' && $("#width_entered_material").css('display') !== 'none' )
    {
        toastr.error('Debe ingresar el ancho del material', 'Error',
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
    if( $('#material_quantity_entered').val().trim() === '' && $("#quantity_entered_material").attr('style') === '' )
    {
        toastr.error('Debe ingresar la cantidad del material', 'Error',
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

    if ($('#material_length_entered').val().trim() !== '' && $('#material_width_entered').val().trim() !== '')
    {
        var price_material = parseFloat($('#material_price').val());
        var length_material = parseFloat($('#material_length').val());
        var width_material = parseFloat($('#material_width').val());
        var length = parseFloat($('#material_length_entered').val());
        var width = parseFloat($('#material_width_entered').val());
        var areaTotal = length_material*width_material;
        var areaNueva = length*width;
        var percentage = parseFloat(areaNueva/areaTotal).toFixed(2);
        var new_price = parseFloat(percentage*price_material).toFixed(2);
        $('#material_percentage_entered').val(percentage);
        $('#material_price_entered').val(new_price);
    }

    if ($('#material_length_entered').val().trim() !== '' && $("#width_entered_material").css('display') === 'none' )
    {
        var price_material2 = parseFloat($('#material_price').val());
        var length_material2 = parseFloat($('#material_length').val());

        var length2 = parseFloat($('#material_length_entered').val());

        var percentage2 = parseFloat(length2/length_material2).toFixed(2);
        var new_price2 = parseFloat(percentage2*price_material2).toFixed(2);
        $('#material_percentage_entered').val(percentage2);
        $('#material_price_entered').val(new_price2);
    }

    if ( $('#material_quantity_entered').val().trim() !== '' )
    {
        var price_material3 = parseFloat($('#material_price').val());
        var quantity_entered = parseFloat($('#material_quantity_entered').val());
        var new_price3 = parseFloat(quantity_entered*price_material3).toFixed(2);
        $('#material_percentage_entered').val(quantity_entered);
        $('#material_price_entered').val(new_price3);

    }
}

function addTableMaterials() {
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        if( $('#material_length_entered').val().trim() === '' && $("#length_entered_material").attr('style') === '' )
        {
            toastr.error('Debe ingresar la longitud del material', 'Error',
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
        if( $('#material_width_entered').val().trim() === '' && $("#width_entered_material").attr('style') === '' )
        {
            toastr.error('Debe ingresar el ancho del material', 'Error',
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
        if( $("#material_quantity_entered").css('display') === '' && $('#material_quantity_entered').val().trim() === '' )
        {
            toastr.error('Debe ingresar la cantidad del material', 'Error',
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
        if( $('#material_percentage_entered').val().trim() === '' )
        {
            toastr.error('Debe hacer click en calcular', 'Error',
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
        if( $('#material_price_entered').val().trim() === '' )
        {
            toastr.error('Debe hacer click en calcular', 'Error',
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

        var material_quantity = ($("#material_quantity_entered").css('display') === '') ? $("#material_quantity_entered").val(): $("#material_percentage_entered").val();
        var total = $("#material_price_entered").val();
        var length = $('#material_length_entered').val();
        var witdh = $('#material_width_entered').val();

        //$items.push({ 'id': $items.length+1, 'material': $material, 'material_quantity': material_quantity, 'material_price':total, 'material_length':length, 'material_width':witdh});
        //console.log($renderMaterial);
        renderTemplateMaterial($material.code, $material.full_name, material_quantity, $material.unit_measure.name, $material.unit_price, total, $renderMaterial, length, witdh, $material);

        $('#material_length_entered').val('');
        $('#material_width_entered').val('');
        $('#material_percentage_entered').val('');
        $('#material_price_entered').val('');
        $('#material_quantity_entered').val('');
        $(".material_search").empty().trigger('change');
        $modalAddMaterial.modal('hide');
    } else {
        if( $('#material_length_entered').val().trim() === '' && $("#length_entered_material").attr('style') === '' )
        {
            toastr.error('Debe ingresar la longitud del material', 'Error',
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
        if( $('#material_width_entered').val().trim() === '' && $("#width_entered_material").attr('style') === '' )
        {
            toastr.error('Debe ingresar el ancho del material', 'Error',
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
        if( $("#material_quantity_entered").css('display') === '' && $('#material_quantity_entered').val().trim() === '' )
        {
            toastr.error('Debe ingresar la cantidad del material', 'Error',
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
        if( $('#material_percentage_entered').val().trim() === '' )
        {
            toastr.error('Debe hacer click en calcular', 'Error',
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

        var material_quantity2 = ($("#material_quantity_entered").css('display') === '') ? $("#material_quantity_entered").val(): $("#material_percentage_entered").val();
        var length2 = $('#material_length_entered').val();
        var witdh2 = $('#material_width_entered').val();
        console.log($renderMaterial);
        //$items.push({ 'id': $items.length+1, 'material': $material, 'material_quantity': material_quantity2, 'material_price':0, 'material_length':length2, 'material_width':witdh2});
        renderTemplateMaterial($material.code, $material.full_name, material_quantity2, $material.unit_measure.name, $material.unit_price, 0, $renderMaterial, length2, witdh2, $material);

        $('#material_length_entered').val('');
        $('#material_width_entered').val('');
        $('#material_percentage_entered').val('');
        $('#material_quantity_entered').val('');
        $(".material_search").empty().trigger('change');
        $modalAddMaterial.modal('hide');
    }

}

function addMaterial() {
    var select_material = $(this).parent().parent().children().children().children().next();
    // TODO: Tomar el texto no el val()
    var material_search = select_material.val();

    $material = $materials.find( mat=>mat.id === parseInt(material_search) );

    if( $material === undefined )
    {
        toastr.error('Debe seleccionar un material', 'Error',
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

    for (var i=0; i<$items.length; i++)
    {
        var mat = $items.find( mat=>mat.material.id == $material.id );
        if (mat !== undefined)
        {
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
            return;
        }
    }

    if ( $material.type_scrap === null )
    {
        $('#presentation').hide();
        $('#length_material').hide();
        $('#width_material').hide();
        $('#width_entered_material').hide();
        $('#length_entered_material').hide();
        $('#material_quantity').val($material.stock_current);
        $('#quantity_entered_material').show();
        $('#material_price').val($material.unit_price);

        $renderMaterial = $(this).parent().parent().next().next().next();

        $modalAddMaterial.modal('show');
    } else {
        switch($material.type_scrap.id) {
            case 1:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#width_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#material_width').val($material.type_scrap.width);
                $('#material_quantity').val($material.stock_current);
                $('#quantity_entered_material').hide();
                $('#material_price').val($material.unit_price);
                break;
            case 2:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#width_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#material_width').val($material.type_scrap.width);
                $('#quantity_entered_material').hide();
                $('#material_quantity').val($material.stock_current);
                $('#material_price').val($material.unit_price);
                break;
            case 3:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#width_material').hide();
                $('#width_entered_material').hide();
                $('#quantity_entered_material').hide();
                $('#material_quantity').val($material.stock_current);
                $('#material_price').val($material.unit_price);
                break;
            case 4:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#width_material').hide();
                $('#width_entered_material').hide();
                $('#quantity_entered_material').hide();
                $('#material_quantity').val($material.stock_current);
                $('#material_price').val($material.unit_price);
                break;
            case 5:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#width_material').hide();
                $('#width_entered_material').hide();
                $('#quantity_entered_material').hide();
                $('#material_quantity').val($material.stock_current);
                $('#material_price').val($material.unit_price);
                break;
            case 6:
                $('#presentation').show();
                $("#fraction").prop("checked", true);
                $('#length_entered_material').show();
                $('#width_entered_material').show();
                $('#material_length').val($material.type_scrap.length);
                $('#material_width').val($material.type_scrap.width);
                $('#material_quantity').val($material.stock_current);
                $('#quantity_entered_material').hide();
                $('#material_price').val($material.unit_price);
                break;
            default:
                $('#length_material').hide();
                $('#width_material').hide();
                $('#width_entered_material').hide();
                $('#length_entered_material').hide();
                $('#material_quantity').val($material.stock_current);
                $('#material_percentage_entered').hide();
                $('#material_price').val($material.unit_price);

        }
        //var idMaterial = $(this).select2('data').id;

        $renderMaterial = $(this).parent().parent().next().next().next();

        $modalAddMaterial.modal('show');
    }


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
        toastr.error('No se puede guardar porque hay equipos no confirmados.', 'Error',
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
    /*if( $equipments.length === 0 )
    {
        toastr.error('No se puede agregar más equipos si no existen.', 'Error',
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
    }*/
    // Obtener la URL
    var createUrl = $formCreate.data('url');
    var equipos = JSON.stringify($equipments);
    var formulario = $('#formEdit')[0];
    var form = new FormData(formulario);
    form.append('equipments', equipos);
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

function calculateTotalMaterialQuantity(e) {
    var cantidad = e.value;
    var material_id = e.getAttribute('material_id');
    console.log(material_id);
    var igvRate = 0.18;

    var width = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    var length = e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value;

    var material = $materials.find( mat=>mat.id === parseInt(material_id) );

    if ( material.type_scrap == null )
    {
        var newPriceConIgv = parseFloat(cantidad*material.unit_price).toFixed(2);

        var newPriceSinIgv = parseFloat(newPriceConIgv / (1 + igvRate)).toFixed(2);

        var newPriceConIgvTotal = parseFloat(material.unit_price).toFixed(2);

        var newPriceSinIgvTotal = parseFloat(newPriceConIgvTotal / (1 + igvRate)).toFixed(2);

        //var priceSinIgv =
        e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotal;
        //var priceConIgv =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotal;
        //var priceSinIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgv ;
        //var priceConIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgv ;

    } else {

        // TODO: Si es tubo
        if (material && material.type_scrap && (material.type_scrap.id === 3 || material.type_scrap.id === 4 || material.type_scrap.id === 5))
        {
            if ( length == null || length == '' )
            {
                // TODO: Solo colocaron cantidad
                var newPriceConIgvT = parseFloat(cantidad*material.unit_price).toFixed(2);

                var newPriceSinIgvT = parseFloat(newPriceConIgvT / (1 + igvRate)).toFixed(2);

                var newPriceConIgvTotalT = parseFloat(material.unit_price).toFixed(2);

                var newPriceSinIgvTotalT = parseFloat(newPriceConIgvTotalT / (1 + igvRate)).toFixed(2);

                //var priceSinIgv =
                e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalT;
                //var priceConIgv =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalT;
                //var priceSinIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvT ;
                //var priceConIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvT ;

            } else {
                // TODO: Solo colocaron largo
                var lengthOriginalMaterial = material.type_scrap.length;
                var newLength = parseFloat(cantidad*lengthOriginalMaterial).toFixed(2);

                // Actualizamos la cantidad automaticamente
                e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value = newLength;

                var newPriceConIgvT2 = parseFloat(cantidad*material.unit_price).toFixed(2);

                var newPriceSinIgvT2 = parseFloat(newPriceConIgvT2 / (1 + igvRate)).toFixed(2);

                var newPriceConIgvTotalT2 = parseFloat(material.unit_price).toFixed(2);

                var newPriceSinIgvTotalT2 = parseFloat(newPriceConIgvTotalT2 / (1 + igvRate)).toFixed(2);

                //var priceSinIgv =
                e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalT2;
                //var priceConIgv =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalT2;
                //var priceSinIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvT2 ;
                //var priceConIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvT2 ;

            }

        } else {

            // TODO: Si es plancha
            if ( length == "" || width == "" )
            {
                // TODO: Solo colocaron cantidad
                var newPriceConIgvP = parseFloat(cantidad*material.unit_price).toFixed(2);

                var newPriceSinIgvP = parseFloat(newPriceConIgvP / (1 + igvRate)).toFixed(2);

                var newPriceConIgvTotalP = parseFloat(material.unit_price).toFixed(2);

                var newPriceSinIgvTotalP = parseFloat(newPriceConIgvTotalP / (1 + igvRate)).toFixed(2);

                //var priceSinIgv =
                e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalP;
                //var priceConIgv =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalP;
                //var priceSinIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvP ;
                //var priceConIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvP ;

            } else {
                // TODO: Colocaron largo y ancho, no se puede asi que seteamos el largo y ancho a 0
                var newLengthP = 0;

                var newWidthP = 0;

                // Actualizamos la cantidad automaticamente

                e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value = newLengthP;
                e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value = newWidthP;

                var newPriceConIgvP2 = parseFloat(cantidad*material.unit_price).toFixed(2);

                var newPriceSinIgvP2 = parseFloat(newPriceConIgvP2 / (1 + igvRate)).toFixed(2);

                var newPriceConIgvTotalP2 = parseFloat(material.unit_price).toFixed(2);

                var newPriceSinIgvTotalP2 = parseFloat(newPriceConIgvTotalP2 / (1 + igvRate)).toFixed(2);

                //var priceSinIgv =
                e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalP2;
                //var priceConIgv =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalP2;
                //var priceSinIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvP2 ;
                //var priceConIgvTotal =
                e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvP2 ;

            }
        }
    }


}

function calculateTotalMaterialLargo(e) {
    var largo = e.value;
    var material_id = e.getAttribute('material_id');
    console.log(material_id);
    var igvRate = 0.18;

    var width = e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value;
    //var length = e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value;

    var material = $materials.find( mat=>mat.id === parseInt(material_id) );

    // TODO: Si es tubo
    if (material && material.type_scrap && (material.type_scrap.id === 3 || material.type_scrap.id === 4 || material.type_scrap.id === 5))
    {

        // TODO: Solo colocaron cantidad
        var lengthOriginalMaterial = material.type_scrap.length;
        var cantidad = parseFloat(largo/lengthOriginalMaterial).toFixed(2);

        var newPriceConIgvT = parseFloat(cantidad*material.unit_price).toFixed(2);

        var newPriceSinIgvT = parseFloat(newPriceConIgvT / (1 + igvRate)).toFixed(2);

        var newPriceConIgvTotalT = parseFloat(material.unit_price).toFixed(2);

        var newPriceSinIgvTotalT = parseFloat(newPriceConIgvTotalT / (1 + igvRate)).toFixed(2);

        //var cantidad =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = cantidad;
        //var priceSinIgv =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalT;
        //var priceConIgv =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalT;
        //var priceSinIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvT ;
        //var priceConIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvT ;

    } else {

        // TODO: Si es plancha falta
        var lengthOriginalMaterialP = material.type_scrap.length;
        var widthOriginalMaterialP = material.type_scrap.width;

        var areaOriginal = lengthOriginalMaterialP*widthOriginalMaterialP;

        var areaNew = largo*width;

        var cantidadP = parseFloat(areaNew/areaOriginal).toFixed(2);

        var newPriceConIgvP = parseFloat(cantidadP*material.unit_price).toFixed(2);

        var newPriceSinIgvP = parseFloat(newPriceConIgvP / (1 + igvRate)).toFixed(2);

        var newPriceConIgvTotalP = parseFloat(material.unit_price).toFixed(2);

        var newPriceSinIgvTotalP = parseFloat(newPriceConIgvTotalP / (1 + igvRate)).toFixed(2);

        //var cantidad =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = cantidadP;
        //var priceSinIgv =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalP;
        //var priceConIgv =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalP;
        //var priceSinIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvP ;
        //var priceConIgvTotal =
        e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvP ;

    }
}

function calculateTotalMaterialAncho(e) {
    var ancho = e.value;
    var material_id = e.getAttribute('material_id');
    console.log(material_id);
    var igvRate = 0.18;

    var length = e.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.value;
    //var length = e.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.value;

    var material = $materials.find( mat=>mat.id === parseInt(material_id) );

    // TODO: Si es plancha falta
    var lengthOriginalMaterialP = material.type_scrap.length;
    var widthOriginalMaterialP = material.type_scrap.width;

    var areaOriginal = lengthOriginalMaterialP*widthOriginalMaterialP;

    var areaNew = length*ancho;

    var cantidadP = parseFloat(areaNew/areaOriginal).toFixed(2);

    var newPriceConIgvP = parseFloat(cantidadP*material.unit_price).toFixed(2);

    var newPriceSinIgvP = parseFloat(newPriceConIgvP / (1 + igvRate)).toFixed(2);

    var newPriceConIgvTotalP = parseFloat(material.unit_price).toFixed(2);

    var newPriceSinIgvTotalP = parseFloat(newPriceConIgvTotalP / (1 + igvRate)).toFixed(2);

    //var cantidad =
    e.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.value = cantidadP;
    //var priceSinIgv =
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvTotalP;
    //var priceConIgv =
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvTotalP;
    //var priceSinIgvTotal =
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceSinIgvP ;
    //var priceConIgvTotal =
    e.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.value = newPriceConIgvP ;

}

function renderTemplateMaterial(code, description, quantity, unit, price, total, render, length, width, material) {
    console.log(render);
    var card = render.parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var clone = activateTemplate('#materials-selected');

        if ( material.enable_status == 0 )
        {
            clone.querySelector("[data-materialDescription]").setAttribute('value', description);
            clone.querySelector("[data-materialDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( material.stock_current == 0 )
            {
                clone.querySelector("[data-materialDescription]").setAttribute('value', description);
                clone.querySelector("[data-materialDescription]").setAttribute("style", "color:red;");
            } else {
                if ( material.update_price == 1 )
                {
                    clone.querySelector("[data-materialDescription]").setAttribute('value', description);
                    clone.querySelector("[data-materialDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone.querySelector("[data-materialDescription]").setAttribute('value', description);
                }
                //clone.querySelector("[data-materialDescription]").setAttribute('value', description);
            }
        }


        //clone.querySelector("[data-materialDescription]").setAttribute('value', description);
        clone.querySelector("[data-materialUnit]").setAttribute('value', unit);
        /*clone.querySelector("[data-materialLargo]").setAttribute('value', length);
        clone.querySelector("[data-materialAncho]").setAttribute('value', width);*/
        if (material.type_scrap == null)
        {
            clone.querySelector("[data-materialLargo]").setAttribute('value', length);
            clone.querySelector("[data-materialAncho]").setAttribute('value', width);
            clone.querySelector("[data-materialLargo]").setAttribute('readonly', 'readonly');
            clone.querySelector("[data-materialAncho]").setAttribute('readonly', 'readonly');

            clone.querySelector("[data-materialLargo]").setAttribute('material_id', material.id);
            clone.querySelector("[data-materialAncho]").setAttribute('material_id', material.id);

        } else {
            if (material && material.type_scrap && (material.type_scrap.id === 3 || material.type_scrap.id === 4 || material.type_scrap.id === 5))
            {
                if ( length == null || length == '' )
                {
                    clone.querySelector("[data-materialLargo]").setAttribute('value', length);
                    clone.querySelector("[data-materialLargo]").setAttribute('readonly', 'readonly');
                } else {
                    clone.querySelector("[data-materialLargo]").setAttribute('value', length);
                }

                clone.querySelector("[data-materialAncho]").setAttribute('readonly', 'readonly');

                clone.querySelector("[data-materialLargo]").setAttribute('material_id', material.id);
                clone.querySelector("[data-materialAncho]").setAttribute('material_id', material.id);
            } else {
                if ( length == null || width == null )
                {
                    clone.querySelector("[data-materialLargo]").setAttribute('readonly', 'readonly');
                    clone.querySelector("[data-materialAncho]").setAttribute('readonly', 'readonly');
                } else {
                    clone.querySelector("[data-materialLargo]").setAttribute('value', length);
                    clone.querySelector("[data-materialAncho]").setAttribute('value', width);
                }
                clone.querySelector("[data-materialLargo]").setAttribute('material_id', material.id);
                clone.querySelector("[data-materialAncho]").setAttribute('material_id', material.id);
            }
        }

        clone.querySelector("[data-materialQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-materialQuantity]").setAttribute('material_id', material.id);
        clone.querySelector("[data-materialPrice]").setAttribute('value', (parseFloat(price)).toFixed(2));
        clone.querySelector("[data-materialTotal]").setAttribute( 'value', (parseFloat(total)).toFixed(2));
        clone.querySelector("[data-materialPrice2]").setAttribute('value', (parseFloat(price)/1.18).toFixed(2));
        clone.querySelector("[data-materialTotal2]").setAttribute( 'value', (parseFloat(total)/1.18).toFixed(2));
        clone.querySelector("[data-delete]").setAttribute('data-delete', code);
        render.append(clone);
    } else {
        var clone2 = activateTemplate('#materials-selected');

        if ( material.enable_status == 0 )
        {
            clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
            clone2.querySelector("[data-materialDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( material.stock_current == 0 )
            {
                clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
                clone2.querySelector("[data-materialDescription]").setAttribute("style", "color:red;");
            } else {
                if ( material.update_price == 1 )
                {
                    clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
                    clone2.querySelector("[data-materialDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
                }
                //clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
            }
        }


        //clone2.querySelector("[data-materialDescription]").setAttribute('value', description);
        clone2.querySelector("[data-materialUnit]").setAttribute('value', unit);
        /*clone2.querySelector("[data-materialLargo]").setAttribute('value', length);
        clone2.querySelector("[data-materialAncho]").setAttribute('value', width);*/
        if (material.type_scrap == null)
        {
            clone2.querySelector("[data-materialLargo]").setAttribute('value', length);
            clone2.querySelector("[data-materialAncho]").setAttribute('value', width);
            clone2.querySelector("[data-materialLargo]").setAttribute('readonly', 'readonly');
            clone2.querySelector("[data-materialAncho]").setAttribute('readonly', 'readonly');

            clone2.querySelector("[data-materialLargo]").setAttribute('material_id', material.id);
            clone2.querySelector("[data-materialAncho]").setAttribute('material_id', material.id);

        } else {
            clone2.querySelector("[data-materialLargo]").setAttribute('value', length);
            clone2.querySelector("[data-materialAncho]").setAttribute('value', width);

            clone2.querySelector("[data-materialLargo]").setAttribute('material_id', material.id);
            clone2.querySelector("[data-materialAncho]").setAttribute('material_id', material.id);
        }
        clone2.querySelector("[data-materialQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone2.querySelector("[data-materialQuantity]").setAttribute('material_id', material.id);
        clone2.querySelector("[data-materialPrice]").setAttribute('value', (parseFloat(price)).toFixed(2));
        clone2.querySelector("[data-materialTotal]").setAttribute( 'value', (parseFloat(total)).toFixed(2));
        clone2.querySelector("[data-materialPrice]").setAttribute("style","display:none;");
        clone2.querySelector("[data-materialTotal]").setAttribute("style","display:none;");
        clone2.querySelector("[data-materialPrice2]").setAttribute('value', (parseFloat(price)/1.18).toFixed(2));
        clone2.querySelector("[data-materialTotal2]").setAttribute( 'value', ((parseFloat(quantity)*parseFloat(price))/1.18).toFixed(2));
        clone2.querySelector("[data-materialPrice2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-materialTotal2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-delete]").setAttribute('data-delete', code);
        render.append(clone2);
    }
}

function renderTemplateConsumable(render, consumable, quantity) {
    var card = render.parent().parent().parent().parent();
    card.removeClass('card-sucess');
    card.addClass('card-gray-dark');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var clone = activateTemplate('#template-consumable');
        //clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);

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
                //clone.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
            }
        }


        clone.querySelector("[data-consumableId]").setAttribute('data-consumableId', consumable.id);
        clone.querySelector("[data-consumableUnit]").setAttribute('value', consumable.unit_measure.description);
        clone.querySelector("[data-consumableQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-consumablePrice]").setAttribute('value', (parseFloat(consumable.unit_price)).toFixed(2));
        clone.querySelector("[data-consumableTotal]").setAttribute( 'value', (parseFloat(consumable.unit_price)*parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-consumablePrice2]").setAttribute('value', ( (parseFloat(consumable.unit_price))/1.18 ).toFixed(2));
        clone.querySelector("[data-consumableTotal2]").setAttribute( 'value', ( (parseFloat(consumable.unit_price)*parseFloat(quantity))/1.18 ).toFixed(2));
        clone.querySelector("[data-deleteConsumable]").setAttribute('data-deleteConsumable', consumable.id);
        render.append(clone);
    } else {
        var clone2 = activateTemplate('#template-consumable');

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


        //clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
        clone2.querySelector("[data-consumableId]").setAttribute('data-consumableId', consumable.id);
        clone2.querySelector("[data-consumableUnit]").setAttribute('value', consumable.unit_measure.description);
        clone2.querySelector("[data-consumableQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone2.querySelector("[data-consumablePrice]").setAttribute('value', (parseFloat(consumable.unit_price)).toFixed(2));
        clone2.querySelector("[data-consumableTotal]").setAttribute( 'value', (parseFloat(consumable.unit_price)*parseFloat(quantity)).toFixed(2));
        clone2.querySelector("[data-consumablePrice]").setAttribute("style","display:none;");
        clone2.querySelector("[data-consumableTotal]").setAttribute("style","display:none;");
        clone2.querySelector("[data-consumablePrice2]").setAttribute('value', ( (parseFloat(consumable.unit_price))/1.18 ).toFixed(2));
        clone2.querySelector("[data-consumableTotal2]").setAttribute( 'value', ( (parseFloat(consumable.unit_price)*parseFloat(quantity))/1.18 ).toFixed(2));
        clone2.querySelector("[data-consumablePrice2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-consumableTotal2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-deleteConsumable]").setAttribute('data-deleteConsumable', consumable.id);
        render.append(clone2);
    }
}

function renderTemplateElectric(render, electric, quantity) {
    var card = render.parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        var clone = activateTemplate('#template-electric');
        //console.log(consumable.stock_current );

        if ( electric.enable_status == 0 )
        {
            clone.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
            clone.querySelector("[data-electricDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( electric.stock_current == 0 )
            {
                clone.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                clone.querySelector("[data-electricDescription]").setAttribute("style", "color:red;");
            } else {
                if ( electric.state_update_price == 1 )
                {
                    clone.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                    clone.querySelector("[data-electricDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                }

            }
        }

        clone.querySelector("[data-electricId]").setAttribute('data-electricId', electric.id);
        clone.querySelector("[data-electricUnit]").setAttribute('value', electric.unit_measure.description);
        clone.querySelector("[data-electricQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-electricPrice]").setAttribute('value', (parseFloat(electric.unit_price)).toFixed(2));
        clone.querySelector("[data-electricPrice2]").setAttribute('value', ( (parseFloat(electric.unit_price))/1.18 ).toFixed(2));
        clone.querySelector("[data-electricTotal2]").setAttribute( 'value', ( (parseFloat(electric.unit_price)*parseFloat(quantity))/1.18 ).toFixed(2));
        clone.querySelector("[data-electricTotal]").setAttribute( 'value', (parseFloat(electric.unit_price)*parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-deleteElectric]").setAttribute('data-deleteElectric', electric.id);
        render.append(clone);
    } else {
        var clone2 = activateTemplate('#template-electric');
        //console.log(consumable.stock_current );

        if ( electric.enable_status == 0 )
        {
            clone2.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
            clone2.querySelector("[data-electricDescription]").setAttribute("style", "color:purple;");

        } else {
            if ( electric.stock_current == 0 )
            {
                clone2.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                clone2.querySelector("[data-electricDescription]").setAttribute("style", "color:red;");
            } else {
                if ( electric.state_update_price == 1 )
                {
                    clone2.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                    clone2.querySelector("[data-electricDescription]").setAttribute("style", "color:blue;");
                } else {
                    clone2.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
                }

                //clone2.querySelector("[data-consumableDescription]").setAttribute('value', consumable.full_description);
            }
        }

        clone2.querySelector("[data-electricDescription]").setAttribute('value', electric.full_description);
        clone2.querySelector("[data-electricId]").setAttribute('data-electricId', electric.id);
        clone2.querySelector("[data-electricUnit]").setAttribute('value', electric.unit_measure.description);
        clone2.querySelector("[data-electricQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone2.querySelector("[data-electricPrice]").setAttribute('value', (parseFloat(electric.unit_price)).toFixed(2));
        clone2.querySelector("[data-electricTotal]").setAttribute( 'value', (parseFloat(electric.unit_price)*parseFloat(quantity)).toFixed(2));
        clone2.querySelector("[data-electricPrice]").setAttribute("style","display:none;");
        clone2.querySelector("[data-electricTotal]").setAttribute("style","display:none;");
        clone2.querySelector("[data-electricPrice2]").setAttribute('value', ( (parseFloat(electric.unit_price))/1.18 ).toFixed(2));
        clone2.querySelector("[data-electricTotal2]").setAttribute( 'value', ( (parseFloat(electric.unit_price)*parseFloat(quantity))/1.18 ).toFixed(2));
        clone2.querySelector("[data-electricPrice2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-electricTotal2]").setAttribute("style","display:none;");
        clone2.querySelector("[data-deleteElectric]").setAttribute('data-deleteElectric', electric.id);
        render.append(clone2);
    }


}

function renderTemplateMano(render, description, unit, quantity, unitPrice) {
    var card = render.parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    var clone = activateTemplate('#template-mano');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        clone.querySelector("[data-manoDescription]").setAttribute('value', description);
        clone.querySelector("[data-manoUnit]").setAttribute('value', unit);
        clone.querySelector("[data-manoQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-manoPrice]").setAttribute('value', (parseFloat(unitPrice)).toFixed(2));
        clone.querySelector("[data-manoTotal]").setAttribute( 'value', (parseFloat(quantity)*parseFloat(unitPrice)).toFixed(2));
    } else {
        clone.querySelector("[data-manoDescription]").setAttribute('value', description);
        clone.querySelector("[data-manoUnit]").setAttribute('value', unit);
        clone.querySelector("[data-manoQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
        clone.querySelector("[data-manoPrice]").setAttribute('value', (parseFloat(unitPrice)).toFixed(2));
        clone.querySelector("[data-manoTotal]").setAttribute( 'value', (parseFloat(quantity)*parseFloat(unitPrice)).toFixed(2));
        clone.querySelector("[data-manoPrice]").setAttribute("style","display:none;");
        clone.querySelector("[data-manoTotal]").setAttribute("style","display:none;");

    }

    render.append(clone);
}

function renderTemplateDia(render, description, pricePerHour2, hoursPerPerson2, quantityPerson2, total2) {
    var card = render.parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    var clone = activateTemplate('#template-dia');
    if ( $.inArray('showPrices_quote', $permissions) !== -1 ) {
        clone.querySelector("[data-description]").setAttribute('value', description);
        clone.querySelector("[data-cantidad]").setAttribute('value', (parseFloat(quantityPerson2)).toFixed(2));
        clone.querySelector("[data-horas]").setAttribute('value', (parseFloat(hoursPerPerson2)).toFixed(2));
        clone.querySelector("[data-precio]").setAttribute('value', (parseFloat(pricePerHour2)).toFixed(2));
        clone.querySelector("[data-total]").setAttribute( 'value', (parseFloat(total2)).toFixed(2));

    } else {
        clone.querySelector("[data-description]").setAttribute('value', description);
        clone.querySelector("[data-cantidad]").setAttribute('value', (parseFloat(quantityPerson2)).toFixed(2));
        clone.querySelector("[data-horas]").setAttribute('value', (parseFloat(hoursPerPerson2)).toFixed(2));
        clone.querySelector("[data-precio]").setAttribute('value', (parseFloat(pricePerHour2)).toFixed(2));
        clone.querySelector("[data-total]").setAttribute( 'value', (parseFloat(total2)).toFixed(2));
        clone.querySelector("[data-precio]").setAttribute("style","display:none;");
        clone.querySelector("[data-total]").setAttribute("style","display:none;");

    }

    render.append(clone);
}

function renderTemplateTorno(render, description, quantity, unitPrice) {
    var card = render.parent().parent().parent().parent().parent().parent();
    card.removeClass('card-success');
    card.addClass('card-gray-dark');
    var clone = activateTemplate('#template-torno');

    clone.querySelector("[data-tornoDescription]").setAttribute('value', description);
    clone.querySelector("[data-tornoQuantity]").setAttribute('value', (parseFloat(quantity)).toFixed(2));
    clone.querySelector("[data-tornoPrice]").setAttribute('value', (parseFloat(unitPrice)).toFixed(2));
    clone.querySelector("[data-tornoTotal]").setAttribute( 'value', (parseFloat(quantity)*parseFloat(unitPrice)).toFixed(2));

    render.append(clone);
}

function renderTemplateEquipment() {
    var clone = activateTemplate('#template-equipment');

    $('#body-equipment').append(clone);

    $('.unitMeasure').select2({
        placeholder: "Seleccione unidad",
    });
}

function renderTemplateSummary(equipments) {
    console.log('Se renderiza');
    console.log(equipments);
    $('#body-summary').html('');
    var equipos = equipments.sort(function (a, b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    console.log(equipos);
    console.log(equipos.length);
    for (let i = 0; i < equipos.length; i++) {
        //console.log(equipments[i]);
        var clone = activateTemplate('#template-summary');
        var price = ((parseFloat(equipos[i].total)/parseFloat(equipos[i].quantity))/1.18).toFixed(2);
        var totalE = (parseFloat(equipos[i].total)/1.18).toFixed(2);

        var subtotalUtility = totalE*((parseFloat(equipos[i].utility)/100)+1);
        var subtotalRent = subtotalUtility*((parseFloat(equipos[i].rent)/100)+1);
        var subtotalLetter = subtotalRent*((parseFloat(equipos[i].letter)/100)+1);

        clone.querySelector("[data-nEquipment]").innerHTML = equipos[i].description;
        clone.querySelector("[data-qEquipment]").innerHTML = equipos[i].quantity;
        clone.querySelector("[data-pEquipment]").innerHTML = parseFloat(price).toFixed(2);
        clone.querySelector("[data-uEquipment]").innerHTML = equipos[i].utility;
        //clone.querySelector("[data-uPEquipment]").innerHTML = parseFloat(subtotalUtility).toFixed(2);
        clone.querySelector("[data-rlEquipment]").innerHTML = (parseFloat(equipos[i].rent) + parseFloat(equipos[i].letter)).toFixed(2);
        clone.querySelector("[data-uPEquipment]").innerHTML = (parseFloat(subtotalLetter)/parseFloat(equipos[i].quantity)).toFixed(2);
        clone.querySelector("[data-tEquipment]").innerHTML = parseFloat(subtotalLetter).toFixed(2);

        if ( equipos[i].quote == '' && equipos[i].equipment == '' )
        {
            clone.querySelector("[data-acEdit]").setAttribute('style', 'display:none');
        } else {
            clone.querySelector("[data-acEdit]").setAttribute( 'acEdit', equipos[i].quote);
            clone.querySelector("[data-acEdit]").setAttribute( 'acEquipment', equipos[i].equipment);
            clone.querySelector("[data-acEdit]").setAttribute( 'utility', equipos[i].utility);
            clone.querySelector("[data-acEdit]").setAttribute( 'rent', equipos[i].rent);
            clone.querySelector("[data-acEdit]").setAttribute( 'letter', equipos[i].letter);
        }

        $('#body-summary').append(clone);
    }

}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}