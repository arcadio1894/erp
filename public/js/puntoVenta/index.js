$(document).ready(function () {
    //$permissions = JSON.parse($('#permissions').val());

    $('#modalVuelto').on('hidden.bs.modal', function () {
        $('#btn-pay').prop('disabled', false);
    });

    // Detectar cambio en el select de tipo de vista
    $("#type_id").on("change", function() {
        if ($(this).val() === "f") {
            showDataSearchTable();
        } else {
            showDataSearch();
        }
    });

    $(document).on('click', '[data-item]', showData);

    $(document).on('click', '.pagination-btn', function() {
        var page = $(this).data('page');
        getDataTableNew(page);
    });

    getData(1);

    $("#btn_search").on('click', showDataSearch);

    $(document).on('click', '[data-add_cart]', addProductCart);

    $(document).on('click', '[data-add_cart_special]', addProductCartSpecial);

    $(document).on('input', '#importe_total', function() {
        //console.log("Input event detected!"); // Para depuración
        var $input = $(this);
        var currentValue = parseFloat($input.val());
        var importe = $("#monto_total").val();

        if ( currentValue >= importe)
        {
            $("#vuelto").val(parseFloat(currentValue-importe).toFixed(2));
        } else {
            $("#vuelto").val(parseFloat(0).toFixed(2));
        }

    });

    $(document).on('click', '[data-delete]', deleteItem);

    $("#btn-pay").on('click', payNow);

    $("#btn-save").on('click', guardarVenta);

    $("#btn-notSave").on('click', cerrarVuelto);

    $formCreate = $('#formCreate');

    $modalVuelto = $('#modalVuelto');

    $modalQuantity = $('#modalQuantity');

    $(document).on('input', 'input.quantity', function() {
        console.log("Input event detected!"); // Para depuración
        var $input = $(this);
        var currentValue = parseFloat($input.val());
        var stringDiscount = "";
        var productId = $input.siblings('button.minus').attr('data-product_id_minus');

        if (isNaN(currentValue) || currentValue < 0) {
            currentValue = 0;
            $input.val(currentValue.toFixed(2));
        }

        getDiscountMaterial(productId, currentValue.toFixed(2)).then(function(discount) {
            console.log(discount);
            if ( discount != -1 )
            {
                $input.closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
            } else  {
                $input.closest('.flex-grow-1').find('h6[data-discount]').html("");
            }

            updateItems(productId, priceTotal, currentValue);
            updateTotalOrder();
        });

        var string = changeStringPrice(productId, currentValue.toFixed(2));
        var priceTotal = changePriceTotal(productId, currentValue.toFixed(2));

        // Actualizar el string
        $input.closest('.flex-grow-1').find('h6[data-price]').html(string);
        // Actualizar el precio total
        $input.closest('.d-flex').find('p[data-priceTotal]').html(priceTotal);
    });

    $("#btn-pay").show();
    $("#btn-newSale").hide();
    $("#btn-printDocument").hide();

    $("#btn-newSale").on('click', newSale);

    $("#btn-notAddProduct").on('click', notAddProduct);
    $("#btn-add_product").on('click', addProduct);
});

let $items = [];
let $subtotal = 0;
let $taxes = 0;
let $total = 0;
let $formCreate;
let $modalVuelto;

let $fin_total_exonerada = 0;
let $fin_total_igv = 0;
let $fin_total_gravada = 0;
let $fin_total_descuentos = 0;
let $fin_total_importe = 0;
let $fin_vuelto = 0;
let $type_vuelto;

let $modeEdit = 1;
let $sale_id = null;
let $modalQuantity;

function notAddProduct() {
    $modalQuantity.modal('hide');
}

function addProductCartSpecial() {
    event.preventDefault(); // Evitar el comportamiento por defecto del enlace

    let productId = $(this).data('product_id');
    let productPrice = $(this).data('product_price');
    let productName = $(this).data('product_name');
    let productUnit = $(this).data('product_unit');
    let productTax = $(this).data('product_tax');
    let productType = $(this).data('product_type');

    // Verificar si el producto ya está en el carrito
    let existingProduct = $items.find(item => item.productId == productId);

    if ( $modeEdit == 0 )
    {
        toastr.error("Lo sentimos ya no puede agregar mas productos, anule o imprima el comprobante.", 'Error', {
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

    if (existingProduct) {
        // Si el producto ya está en el carrito, puedes actualizar la cantidad
        toastr.error("El producto "+productName+" ya esta agregado", 'Error',
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
    } else {
        showModalQuantity(productId, productPrice, productName, productUnit, productTax, productType);
    }

}

function showModalQuantity(productId, productPrice, productName, productUnit, productTax, productType) {

    $("#quantity_productId").val(productId);
    $("#quantity_productPrice").val(productPrice);
    $("#quantity_productName").val(productName);
    $("#quantity_productUnit").val(productUnit);
    $("#quantity_productTax").val(productTax);
    $("#quantity_productType").val(productType);

    $modalQuantity.modal('show');
}

function addProduct() {
    event.preventDefault(); // Evitar el comportamiento por defecto del enlace

    let productId =  $("#quantity_productId").val();
    let productPrice = $("#quantity_productPrice").val();
    let productName = $("#quantity_productName").val();
    let productUnit = $("#quantity_productUnit").val();
    let productTax = $("#quantity_productTax").val();

    let productType = $("#quantity_productType").val();

    let quantity = $("#quantity_total").val();

    if (productType == 2) {
        // Permitir decimales en quantity, no hacemos nada
        let precio = parseFloat(productPrice * quantity).toFixed(2);
        $items.push({
            "productId": productId,
            "productPrice": productPrice,
            "productName": productName,
            "productUnit": productUnit,
            "productTax": productTax,
            "productTotal": precio,
            "productTotalTaxes": parseFloat(precio*(1+(productTax/100))).toFixed(2),
            "productTaxes": parseFloat(precio*(productTax/100)).toFixed(2),
            "productQuantity": quantity,
            "productDiscount": 0
        });
        // Renderizar el producto en el carrito
        renderDataCartQuantity(productId, productPrice, productName, productUnit, quantity);

        //updateTotalOrder();

        /*getDiscountMaterial(productId, quantity).then(function(discount) {
            //console.log(discount);
            $input.closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
            updateItems(productId, precio, quantity);
            updateTotalOrder();
        });

        // Actualizar el string
        $input.closest('.flex-grow-1').find('h6[data-price]').html(string);
        // Actualizar el precio total
        $input.closest('.d-flex').find('p[data-priceTotal]').html(precio);*/

    } else {
        // No permitir decimales en quantity
        if (quantity % 1 !== 0) {
            toastr.error("Este tipo de producto no acepta decimales", 'Error', {
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
            $("#quantity_total").val(Math.floor(quantity)); // Elimina los decimales
            return;
        }

        let precio = parseFloat(productPrice * Math.floor(quantity)).toFixed(2);
        $items.push({
            "productId": productId,
            "productPrice": productPrice,
            "productName": productName,
            "productUnit": productUnit,
            "productTax": productTax,
            "productTotal": precio,
            "productTotalTaxes": parseFloat(precio*(1+(productTax/100))).toFixed(2),
            "productTaxes": parseFloat(precio*(productTax/100)).toFixed(2),
            "productQuantity": quantity,
            "productDiscount": 0
        });
        // Renderizar el producto en el carrito
        renderDataCartQuantity(productId, productPrice, productName, productUnit, quantity);
    }
    //renderDataCart(productId, productPrice, productName, productUnit);
    $modalQuantity.modal('hide');
}

function newSale() {
    location.reload();
}

function cerrarVuelto() {
    $modalVuelto.modal('hide');
    $("#btn-pay").attr("disabled", false);
}

function payNow() {
    event.preventDefault();
    $("#btn-pay").attr("disabled", true);

    if ( $items.length == 0 )
    {
        toastr.error("Seleccione productos a la venta.", 'Error', {
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
        $("#btn-pay").attr("disabled", false);
        return;
    }

    // Verificar si hay algún radio button seleccionado
    var selectedRadio = $('input[name="tipo_pago"]:checked');
    if (selectedRadio.length === 0) {
        toastr.error("Seleccione un tipo de pago.", 'Error', {
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
        $("#btn-pay").attr("disabled", false);
        return;
    }

    // Obtener el valor de data-vuelto
    var dataVuelto = selectedRadio.data('vuelto');

    // Verificar el valor de data-vuelto y realizar acciones
    if (dataVuelto === 1) {
        // Acción si se muestra el vuelto
        mostrarVuelto();
    } else {
        // Acción si data-vuelto no es 1
        guardarVenta();
    }
}

function mostrarVuelto() {
    $("#monto_total").val(parseFloat($fin_total_importe).toFixed(2));
    $modalVuelto.modal('show');
}

function guardarVenta() {
    event.preventDefault();
    $modalVuelto.modal('hide');

    $("#btn-pay").attr("disabled", true);

    $fin_vuelto = $("#vuelto").val();
    $type_vuelto = $("#type_caja").val();

    if ( $items.length == 0 )
    {
        toastr.error("Seleccione productos a la venta.", 'Error', {
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
        $("#btn-pay").attr("disabled", false);
        return;
    }

    var createUrl = $formCreate.data('url');
    var items = JSON.stringify($items);
    var formulario = $('#formCreate')[0];
    var form = new FormData(formulario);
    var tipo_pago = $('input[name="tipo_pago"]:checked').val();

    var tipo_pago_text = $('input[name="tipo_pago"]:checked').siblings('label').text().trim();

    /*form.append('items', items);
    form.append('total_exonerada', $fin_total_exonerada);
    form.append('total_igv', $fin_total_igv);
    form.append('total_gravada', $fin_total_gravada);
    form.append('total_descuentos', $fin_total_descuentos);
    form.append('total_importe', $fin_total_importe);
    form.append('total_vuelto', $fin_vuelto);
    form.append('type_vuelto', $type_vuelto);
    form.append('tipo_pago', tipo_pago);

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
                $("#btn-pay").attr("disabled", false);
                // No permitimos seguir agregando productos
                $modeEdit = 0;
                $sale_id = data.sale_id;

                $("#btn-pay").hide();
                $("#btn-newSale").show();
                $("#btn-printDocument").show();
                $("#btn-printDocument").attr("href", data.url_print);
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
            $("#btn-pay").attr("disabled", false);

        },
    });*/
    // Confirmación con jQuery Confirm
    $.confirm({
        title: 'Confirmar pago',
        content: '¿Está seguro de realizar el pago usando <strong>' + tipo_pago_text + '</strong>?',
        type: 'blue',
        buttons: {
            confirmar: {
                text: 'Sí, confirmar',
                btnClass: 'btn-primary',
                action: function () {
                    // Proceder con el envío del formulario
                    var createUrl = $formCreate.data('url');
                    var items = JSON.stringify($items);
                    var formulario = $('#formCreate')[0];
                    var form = new FormData(formulario);

                    form.append('items', items);
                    form.append('total_exonerada', $fin_total_exonerada);
                    form.append('total_igv', $fin_total_igv);
                    form.append('total_gravada', $fin_total_gravada);
                    form.append('total_descuentos', $fin_total_descuentos);
                    form.append('total_importe', $fin_total_importe);
                    form.append('total_vuelto', $fin_vuelto);
                    form.append('type_vuelto', $type_vuelto);
                    form.append('tipo_pago', tipo_pago);

                    $.ajax({
                        url: createUrl,
                        method: 'POST',
                        data: form,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            console.log(data);
                            toastr.success(data.message, 'Éxito', {
                                "closeButton": true,
                                "progressBar": true,
                                "positionClass": "toast-top-right",
                                "timeOut": "2000"
                            });
                            setTimeout(function () {
                                $("#btn-pay").attr("disabled", false);
                                $modeEdit = 0;
                                $sale_id = data.sale_id;

                                $("#btn-pay").hide();
                                $("#btn-newSale").show();
                                $("#btn-printDocument").show();
                                $("#btn-printDocument").attr("href", data.url_print);
                            }, 2000);
                        },
                        error: function (data) {
                            if (data.responseJSON.message && !data.responseJSON.errors) {
                                toastr.error(data.responseJSON.message, 'Error');
                            }
                            for (var property in data.responseJSON.errors) {
                                toastr.error(data.responseJSON.errors[property], 'Error');
                            }
                            $("#btn-pay").attr("disabled", false);
                        }
                    });
                }
            },
            cancelar: {
                text: 'Cancelar',
                btnClass: 'btn-secondary',
                action: function () {
                    $("#btn-pay").attr("disabled", false);
                }
            }
        }
    });
}

function deleteItem() {
    if ( $modeEdit == 0 )
    {
        toastr.error("Lo sentimos ya no puede quitar productos, anule o imprima el comprobante.", 'Error', {
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

    let product_id = $(this).attr('data-delete');

    $items = $items.filter(item => item.productId != product_id);

    updateTotalOrder();

    $(this).parent().parent().remove();
}

function updateItems(product_id, precioTotal, quantity) {
    let result = $items.find( item => item.productId == product_id );
    result.productTotal = parseFloat(precioTotal).toFixed(2);
    result.productQuantity = quantity;
}

function decrementQuantity(button) {
    var $input = $(button).siblings('input[type="number"]');
    var currentValue = parseFloat($input.val());
    var step = parseFloat($input.attr('step')) || 0.01;

    var string = "";
    var priceTotal = 0;
    var stringDiscount = "";

    if (currentValue > 0) {
        $input.val((currentValue - step).toFixed(2)).trigger('change');
        string = changeStringPrice( $(button).attr('data-product_id_minus'), (currentValue - step).toFixed(2) );
        priceTotal = changePriceTotal( $(button).attr('data-product_id_minus'), (currentValue - step).toFixed(2) );
        $(button).closest('.flex-grow-1').find('h6[data-price]').html(string);
        $(button).closest('.d-flex').find('p[data-priceTotal]').html(priceTotal);

        getDiscountMaterial($(button).attr('data-product_id_minus'), currentValue - step).then(function(discount) {
            console.log(discount);
            if ( discount != -1 )
            {
                $(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
            } else  {
                $(button).closest('.flex-grow-1').find('h6[data-discount]').html("");
            }

            //updateItems($(button).attr('data-product_id_plus', currentValue + step), priceTotal, currentValue + step);
        });

        updateItems($(button).attr('data-product_id_minus'), priceTotal, currentValue - step);

        updateTotalOrder();
    } else {
        $input.val(0);
        string = changeStringPrice( $(button).attr('data-product_id_minus'), 0 );
        priceTotal = changePriceTotal( $(button).attr('data-product_id_minus'), 0 );
        $(button).closest('.flex-grow-1').find('h6[data-price]').html(string);
        $(button).closest('.d-flex').find('p[data-priceTotal]').html(priceTotal);

        getDiscountMaterial($(button).attr('data-product_id_minus'), currentValue - step).then(function(discount) {
            console.log(discount);
            //$(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
            if ( discount != -1 )
            {
                $(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
            } else  {
                $(button).closest('.flex-grow-1').find('h6[data-discount]').html("");
            }
            //updateItems($(button).attr('data-product_id_plus', currentValue + step), priceTotal, currentValue + step);
        });

        updateItems($(button).attr('data-product_id_minus'), priceTotal, 0);

        updateTotalOrder();
    }
    //console.log(string);
}

function changePriceTotal(product_id, quantity) {
    let result = $items.find( item => item.productId == product_id );
    let priceTotal;
    priceTotal = (quantity * result.productPrice).toFixed(2);
    return priceTotal;
}

function changeStringPrice(product_id, quantity) {
    let result = $items.find( item => item.productId == product_id );
    //let priceTotal = quantity*result.productPrice;
    let stringTotal;
    stringTotal = "<strong>" + quantity + "</strong> " + result.productUnit + " a " + result.productPrice + " / Unit";
    return stringTotal;
}

function incrementQuantity(button) {
    event.preventDefault();
    var $input = $(button).siblings('input[type="number"]');
    var currentValue = parseFloat($input.val());
    var step = parseFloat($input.attr('step')) || 0.01;

    $input.val((currentValue + step).toFixed(2)).trigger('change');

    var string = "";
    var priceTotal = 0;
    var discount = 0;

    string = changeStringPrice( $(button).attr('data-product_id_plus'), (currentValue + step).toFixed(2) );
    priceTotal = changePriceTotal( $(button).attr('data-product_id_plus'), (currentValue + step).toFixed(2) );
    //console.log(string);

    $(button).closest('.flex-grow-1').find('h6[data-price]').html(string);
    $(button).closest('.d-flex').find('p[data-priceTotal]').text(priceTotal);

    // Maneja la promesa retornada por getDiscountMaterial
    getDiscountMaterial($(button).attr('data-product_id_plus'), currentValue + step).then(function(discount) {
        console.log(discount);
        //$(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
        if ( discount != -1 )
        {
            $(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);
        } else  {
            $(button).closest('.flex-grow-1').find('h6[data-discount]').html("");
        }
        //updateItems($(button).attr('data-product_id_plus', currentValue + step), priceTotal, currentValue + step);
    });

    //$(button).closest('.flex-grow-1').find('h6[data-discount]').html(discount.stringDiscount);

    updateItems($(button).attr('data-product_id_plus'), priceTotal, currentValue + step);
    
    updateTotalOrder();
}

function updateTotalOrder() {
    /*
    * OP. Exonerada:
- suma de los precios con taxes = 0 o null
OP. Inafecta
OP. Gravada:
- suma ((precios con taxes * cantidad != 0 o != null menos descuentos) dividir entre el 1+porcentaje)
IGV:
- suma ((precios con taxes * cantidad != 0 o != null menos descuentos))  menos OP. Gravada
Descuentos:
- suma de los productos con descuentos
Importe Total:
- OP. Exonerada + OP. Inafecta + OP. Gravada + IGV
    * */
    console.log($items);
    var total_exonerada = 0;
    var total_gravada = 0;
    var total_igv = 0;
    var total_descuentos = 0;
    var total_importe = 0;
    var total_igv_bruto=0;
    for ( let i = 0; i < $items.length; i++ )
    {
        //var total_exonerada=0;
        if ( $items[i].productTax == 0 )
        {
            total_exonerada = total_exonerada + parseFloat($items[i].productTotal);
        }

        //var total_gravada=0;
        if ( $items[i].productTax != 0 )
        {
            total_gravada = total_gravada + (($items[i].productTotal-$items[i].productDiscount)/(1+($items[i].productTax/100)));
        }
        //var total_igv=0;

        if ( $items[i].productTax != 0 )
        {
            total_igv_bruto = total_igv_bruto + ($items[i].productTotal-$items[i].productDiscount);
        }

        total_igv = total_igv_bruto-total_gravada;

        //var total_descuentos=0;
        if ( $items[i].productDiscount != 0 )
        {
            total_descuentos = total_descuentos + $items[i].productDiscount;
        }

        console.log("Total exonerada "+total_exonerada);
        console.log("Total gravada "+total_gravada);
        console.log("Total igv "+total_igv);
        console.log("Total descuentos "+total_descuentos);


    }

    //console.log(total_importe);
    total_importe=total_importe+total_exonerada+total_gravada+total_igv;
    // Actualizar los datos

    $fin_total_exonerada = total_exonerada;
    $fin_total_igv = total_igv;
    $fin_total_gravada = total_gravada;
    $fin_total_descuentos = total_descuentos;
    $fin_total_importe = total_importe;

    console.log("Total exonerada "+$fin_total_exonerada);
    console.log("Total gravada "+$fin_total_gravada);
    console.log("Total igv "+$fin_total_igv);
    console.log("Total descuentos "+$fin_total_descuentos);
    console.log("Total importe "+$fin_total_importe);

    $("#op_exonerada").html("S/. "+parseFloat($fin_total_exonerada).toFixed(2));
    //$("#op_inafecta").html("S/. "+parseFloat(op_exonerada).toFixed(2));
    $("#op_gravada").html("S/. "+parseFloat($fin_total_gravada).toFixed(2));
    $("#total_igv").html("S/. "+parseFloat($fin_total_igv).toFixed(2));
    $("#total_descuentos").html("S/. "+parseFloat($fin_total_descuentos).toFixed(2));
    $("#total_importe").html("S/. "+parseFloat($fin_total_importe).toFixed(2));


}

function getDiscountMaterial(product_id, quantity) {
    return $.get('/dashboard/get/discount/product/' + product_id, {
        quantity: quantity
    }).then(function(data) {
        console.log(data.data[0].haveDiscount);
        if (data.data[0].haveDiscount == true) {
            console.log(data);
            var existingProduct = $items.find(item => item.productId == product_id);
            existingProduct.productDiscount = data.data[0].valueDiscount;
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

function addProductCart() {
    event.preventDefault(); // Evitar el comportamiento por defecto del enlace

    let productId = $(this).data('product_id');
    let productPrice = $(this).data('product_price');
    let productName = $(this).data('product_name');
    let productUnit = $(this).data('product_unit');
    let productTax = $(this).data('product_tax');

    // Verificar si el producto ya está en el carrito
    let existingProduct = $items.find(item => item.productId == productId);

    if ( $modeEdit == 0 )
    {
        toastr.error("Lo sentimos ya no puede agregar mas productos, anule o imprima el comprobante.", 'Error', {
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

    if (existingProduct) {
        // Si el producto ya está en el carrito, puedes actualizar la cantidad
        toastr.error("El producto "+productName+" ya esta agregado", 'Error',
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
    } else {
        // Si el producto no está en el carrito, agregarlo
        $items.push({
            "productId": productId,
            "productPrice": productPrice,
            "productName": productName,
            "productUnit": productUnit,
            "productTax": productTax,
            "productTotal": productPrice,
            "productTotalTaxes": parseFloat(productPrice*(1+(productTax/100))).toFixed(2),
            "productTaxes": parseFloat(productPrice*(productTax/100)).toFixed(2),
            "productQuantity": 1,
            "productDiscount": 0
        });

        // Renderizar el producto en el carrito
        renderDataCart(productId, productPrice, productName, productUnit);
    }
    updateTotalOrder();
    //renderDataCart(productId, productPrice, productName, productUnit);
}

function renderDataCart(productId, productPrice, productName, productUnit) {
    var quantity = 1;
    var clone = activateTemplate('#item-cart');
    clone.querySelector("[data-delete]").setAttribute("data-delete", productId);
    clone.querySelector("[data-name]").innerHTML = productName;
    clone.querySelector("[data-price]").innerHTML = "<strong>" + quantity + "</strong> "+productUnit+" a " + productPrice + " / Unit";
    clone.querySelector("[data-product_id_minus]").setAttribute("data-product_id_minus", productId);
    clone.querySelector("[data-product_id_plus]").setAttribute("data-product_id_plus", productId);

    var quantityInput = clone.querySelector("[data-quantity]");
    if (quantityInput) {
        quantityInput.value = quantity; // Usa .value en lugar de setAttribute
    }

    var priceTotal;
    priceTotal = quantity * productPrice;

    clone.querySelector("[data-priceTotal]").innerHTML = priceTotal;

    $("#body-cart").append(clone);
}

function renderDataCartQuantity(productId, productPrice, productName, productUnit, productQuantity) {
    var quantity = parseFloat(productQuantity).toFixed(2);
    var clone = activateTemplate('#item-cart');
    clone.querySelector("[data-delete]").setAttribute("data-delete", productId);
    clone.querySelector("[data-name]").innerHTML = productName;
    clone.querySelector("[data-price]").innerHTML = "<strong>" + quantity + "</strong> "+productUnit+" a " + productPrice + " / Unit";
    clone.querySelector("[data-product_id_minus]").setAttribute("data-product_id_minus", productId);
    clone.querySelector("[data-product_id_plus]").setAttribute("data-product_id_plus", productId);
    //clone.querySelector("[data-quantity]").setAttribute("value", quantity);

    // Aquí asegúrate de actualizar el valor del input correctamente
    var quantityInput = clone.querySelector("[data-quantity]");
    if (quantityInput) {
        quantityInput.value = quantity; // Usa .value en lugar de setAttribute
    }

    var priceTotal;
    priceTotal = quantity * productPrice;

    clone.querySelector("[data-priceTotal]").innerHTML = priceTotal;

    $("#body-cart").append(clone);

    updateTotalOrder();

    // Asegúrate de que el input exista antes de disparar el evento
    if (quantityInput) {
        console.log("Vamos a lanzar el evento");
        $(quantityInput).trigger('input');
    }

}

function showData() {
    var numberPage = $(this).attr('data-item');
    console.log(numberPage);
    var type = $("#type_id").val();
    if (type === "f") {
        getDataTableNew(numberPage)
    } else {
        getData(numberPage)
    }
}

function showDataSearch() {
    getData(1)
}

function showDataSearchTable() {
    getDataTableNew(1);
}

function getDataTableNew($numberPage) {
    var category_id = $('#category_id').val();
    var product_search = $("#product_search").val();

    $.get('/dashboard/get/data/products/'+$numberPage, {
        category_id: category_id,
        product_search: product_search
    }, function(data) {
        if (data.data.length == 0) {
            renderDataTableEmptyNew();
        } else {
            renderDataTableNew(data);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
        toastr.error("Error al obtener los productos", "Error", {
            "closeButton": true,
            "progressBar": true
        });
    });
}

function renderDataTableEmptyNew() {
    $("#table-body").html('');
    $("#pagination").html('');
    $("#textPagination").html('No se encontraron productos.');
}

function renderDataTableNew(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;

    // Limpiar contenido anterior
    $("#body-card").html('');
    $("#pagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' productos.');

    var table = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Unidad</th>
                        <th>Impuesto</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Agregar las filas de datos
    for (let j = 0; j < dataAccounting.length; j++) {
        table += `
            <tr>
                <td><img src="${document.location.origin}/images/material/${dataAccounting[j].image}" width="50"></td>
                <td>${dataAccounting[j].full_name}</td>
                <td>${dataAccounting[j].price}</td>
                <td>${dataAccounting[j].unit}</td>
                <td>${dataAccounting[j].tax}</td>
                <td>
                    <button class="btn btn-primary btn-sm add-to-cart" 
                        data-add_cart
                        data-product_id="${dataAccounting[j].id}" 
                        data-product_price="${dataAccounting[j].price}" 
                        data-product_name="${dataAccounting[j].full_name}" 
                        data-product_unit="${dataAccounting[j].unit}" 
                        data-product_tax="${dataAccounting[j].tax}">
                        ADD TO CART
                    </button>
                    <button class="btn btn-success btn-sm add-to-cart" 
                        data-add_cart_special
                        data-product_id="${dataAccounting[j].id}" 
                        data-product_price="${dataAccounting[j].price}" 
                        data-product_name="${dataAccounting[j].full_name}" 
                        data-product_unit="${dataAccounting[j].unit}" 
                        data-product_tax="${dataAccounting[j].tax}"
                        data-product_type="${dataAccounting[j].type}">
                        ADD ESPECIAL
                    </button>
                </td>
            </tr>
        `;
    }

    // Cerrar la tabla y el div
    table += `
                </tbody>
            </table>
        </div>
    `;

    // Insertar la tabla en el contenedor
    $("#body-card").append(table);

    renderPaginationNew(pagination);
}

function renderPaginationNew(pagination) {
    $("#pagination").html('');

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

function getData($numberPage) {
    var category_id = $('#category_id').val();
    var product_search = $("#product_search").val();
    //console.log(nameCategoryEquipment);
    $.get('/dashboard/get/data/products/'+$numberPage, {
        category_id: category_id,
        product_search: product_search
    }, function(data) {
        if ( data.data.length == 0 )
        {
            renderDataEmpty(data);
        } else {
            renderData(data);
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

function renderDataEmpty(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;

    $("#body-card").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' productos.');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    renderDataCardEmpty();
}

function renderData(data) {
    var dataAccounting = data.data;
    var pagination = data.pagination;

    $("#body-card").html('');
    $("#pagination").html('');
    $("#textPagination").html('');
    $("#textPagination").html('Mostrando '+pagination.startRecord+' a '+pagination.endRecord+' de '+pagination.totalFilteredRecords+' productos.');
    $('#numberItems').html('');
    $('#numberItems').html(pagination.totalFilteredRecords);

    for (let j = 0; j < dataAccounting.length ; j++) {
        renderDataCard(dataAccounting[j]);
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

function renderDataCard(data) {
    var clone = activateTemplate('#item-card');
    let url_image = document.location.origin + '/images/material/' + data.image;
    clone.querySelector("[data-image1]").setAttribute("src", url_image);
    /*clone.querySelector("[data-image2]").setAttribute("src", url_image);*/
    clone.querySelector("[data-name]").innerHTML = data.full_name;
    clone.querySelector("[data-price]").innerHTML = data.price;

    clone.querySelector("[data-add_cart]").setAttribute("data-product_id", data.id);
    clone.querySelector("[data-add_cart]").setAttribute("data-product_price", data.price);
    clone.querySelector("[data-add_cart]").setAttribute("data-product_name", data.full_name);
    clone.querySelector("[data-add_cart]").setAttribute("data-product_unit", data.unit);
    clone.querySelector("[data-add_cart]").setAttribute("data-product_tax", data.tax);

    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_id", data.id);
    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_price", data.price);
    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_name", data.full_name);
    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_unit", data.unit);
    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_tax", data.tax);
    clone.querySelector("[data-add_cart_special]").setAttribute("data-product_type", data.type);

    $("#body-card").append(clone);

    $('[data-toggle="tooltip"]').tooltip();
}

function renderDataCardEmpty() {
    var clone = activateTemplate('#item-card-empty');
    $("#body-card").append(clone);
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
