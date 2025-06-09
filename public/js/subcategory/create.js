$(document).ready(function () {
    $(".select2").select2({
        placeholder: "Selecione una categoría",
        allowClear: true
    });

    $formCreate = $('#formCreate');
    $('#btn-submit').on('click', storeSubCategory);
    //$formCreate.on('submit', storeSubCategory);

    let subcategoryIndex = 1;

    $('#add-subcategory').click(function () {
        const newGroup = `
        <div class="form-group row subcategory-group">
            <div class="col-md-5">
                <input type="text" class="form-control" name="subcategories[${subcategoryIndex}][name]" placeholder="Nombre Subcategoría" onkeyup="mayus(this);">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" name="subcategories[${subcategoryIndex}][description]" placeholder="Descripción" onkeyup="mayus(this);">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remove-subcategory">X</button>
            </div>
        </div>
        `;
        $('#subcategory-container').append(newGroup);
        subcategoryIndex++;
    });

    // Remover subcategoría
    $(document).on('click', '.remove-subcategory', function () {
        $(this).closest('.subcategory-group').remove();
    });
});

var $formCreate;

function mayus(e) {
    e.value = e.value.toUpperCase();
}

function storeSubCategory() {
    event.preventDefault();
    $("#btn-submit").attr("disabled", true);
    // Obtener la URL
    var createUrl = $formCreate.data('url');
    var form = new FormData($('#formCreate')[0]);
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
