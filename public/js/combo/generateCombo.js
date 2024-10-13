var $materialsTypeahead = [];
var $permissions;
var $materials = [];
var $total = 0;

$(document).ready(function () {
    $permissions = JSON.parse($('#permissions').val());

    $.ajax({
        url: "/dashboard/get/materials/combo",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i=0; i<json.length; i++)
            {
                $materialsTypeahead.push(json[i].material);
            }

            $materials = json;
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

    $("#btn-submit").on("click", storePack);

    $("#btn-addMaterial").on("click", addMaterial);

    $(document).on('click', '[data-deleteMaterial]', deleteMaterial);
    $("#btn-reset").on("click", resetPage);

    $(document).on('typeahead:select', '.materialTypeahead', function(ev, suggestion) {
        console.log("Material seleccionado:", suggestion); // Verifica que el valor sea correcto
        $(this).attr('data-selectedmaterial', suggestion); // Almacenar el valor seleccionado en el atributo
        $total = 0;
        var select_material = $(this);
        console.log($(this).val());
        // TODO: Tomar el texto no el val()
        var material_search = select_material.val();

        //$material = $materials.find( mat=>mat.full_name.trim().toLowerCase() === material_search.trim().toLowerCase() );

        $material = $materials.find(mat =>
            mat.material.trim().toLowerCase() === material_search.trim().toLowerCase()
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

        updateTotal();


    });

    $(document).on('input', '[data-quantityMaterial]', updateTotal);

    $("#price").on("input", updateTotal);
});

function updateTotal2() {
    console.log("Cambiando el total");
    let materiales = [];

    // Recorrer todos los elementos con data-descriptionMaterial y data-quantityMaterial
    //console.log($('#body-materials .row'));
    $('#body-materials .row').each(function() {
        // Acceder al valor del atributo 'data-selectedmaterial' usando .attr()
        let description = $(this).find('.tt-input').attr('data-selectedmaterial');
        let quantity = $(this).find('[data-quantitymaterial]').val();

        console.log("Material:", description); // Verifica si ahora está obteniendo el material correctamente
        console.log("Cantidad:", quantity); // Verifica si está obteniendo la cantidad correctamente

        if (description && quantity) {
            materiales.push({
                material: description,
                quantity: parseFloat(quantity) // Asegúrate de que la cantidad sea un número
            });
        }
    });

    // Recorrer los materiales seleccionados para sumar los precios
    materiales.forEach(function(selectedMaterial) {
        var material = $materials.find(mat =>
            mat.material.trim().toLowerCase() === selectedMaterial.material.trim().toLowerCase()
        );

        if (material !== undefined) {
            $total += material.price * selectedMaterial.quantity; // Sumar el precio multiplicado por la cantidad
        }
    });

    console.log("Total sin descuento:", $total);

    // Obtener el descuento
    var discount = $("#price").val();

    // Si hay descuento, aplicarlo
    if (discount != "") {
        var precio_total = $total * (1 - (parseFloat(discount) / 100)); // Aplicar el descuento como porcentaje
        console.log("Precio con descuento:", precio_total);
        $("#total").val(parseFloat(precio_total).toFixed(2));
    } else {
        $("#total").val(parseFloat($total).toFixed(2)); // Si no hay descuento, mostrar el total sin modificar
    }

}

function updateTotal() {
    console.log("Cambiando el total");
    $total = 0;
    let materiales = [];

    // Recorrer todos los elementos con data-descriptionMaterial y data-quantityMaterial
    //console.log($('#body-materials .row'));
    $('#body-materials .row').each(function() {
        // Acceder al valor del atributo 'data-selectedmaterial' usando .attr()
        let description = $(this).find('.tt-input').attr('data-selectedmaterial');
        let quantity = $(this).find('[data-quantitymaterial]').val();

        console.log("Material:", description); // Verifica si ahora está obteniendo el material correctamente
        console.log("Cantidad:", quantity); // Verifica si está obteniendo la cantidad correctamente

        if (description && quantity) {
            materiales.push({
                material: description,
                quantity: parseFloat(quantity) // Asegúrate de que la cantidad sea un número
            });
        }
    });

    // Recorrer los materiales seleccionados para sumar los precios
    materiales.forEach(function(selectedMaterial) {
        var material = $materials.find(mat =>
            mat.material.trim().toLowerCase() === selectedMaterial.material.trim().toLowerCase()
        );

        if (material !== undefined) {
            $total += material.price * selectedMaterial.quantity; // Sumar el precio multiplicado por la cantidad
        }
    });

    console.log("Total sin descuento:", $total);

    // Obtener el descuento
    var discount = $("#price").val();

    // Si hay descuento, aplicarlo
    if (discount != "") {
        var precio_total = $total * (1 - (parseFloat(discount) / 100)); // Aplicar el descuento como porcentaje
        console.log("Precio con descuento:", precio_total);
        $("#total").val(parseFloat(precio_total).toFixed(2));
    } else {
        $("#total").val(parseFloat($total).toFixed(2)); // Si no hay descuento, mostrar el total sin modificar
    }


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

function storePack() {
    event.preventDefault();

    let materials = [];

    // Recorrer todos los elementos con data-descriptionMaterial y data-quantityMaterial
    $('#body-materials .row').each(function() {
        let description = $(this).find('.tt-input').attr('data-selectedmaterial');
        let quantity = $(this).find('[data-quantitymaterial]').val();

        if (description && quantity) {
            materials.push({
                material: description,
                quantity: quantity
            });
        }
    });

    // Obtener otros datos del formulario
    let packageName = $('#name').val();
    let discountPrice = $('#price').val();
    let totalPrice = $('#total').val();

    // Armar el objeto con los datos del paquete
    let packageData = {
        name: packageName,
        price: discountPrice,
        total: totalPrice,
        materials: materials
    };

    // Enviar los datos al backend mediante AJAX
    $.ajax({
        url: $("#btn-submit").data('url'),
        method: 'POST',
        data: JSON.stringify(packageData),
        contentType: 'application/json',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            console.log('Paquete enviado con éxito:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error al enviar el paquete:', error);
        }
    });
}

function resetPage() {
    location.reload();
}

function deleteMaterial() {
    $(this).parent().parent().remove();
}

function addMaterial() {
    renderTemplateMaterial();
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

}

function renderTemplateMaterial() {
    var clone = activateTemplate('#template-material');

    $('#body-materials').append(clone);
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}
