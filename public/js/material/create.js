$(document).ready(function () {
    $formCreate = $('#formCreate');
    //$formCreate.on('submit', storeMaterial);
    $('#btn-submit').on('click', storeMaterial);
    
    $('#btn-add').on('click', showTemplateSpecification);

    $(document).on('click', '[data-delete]', deleteSpecification);

    $selectCategory = $('#category');

    $selectSubCategory = $('#subcategory');

    $selectBrand = $('#brand');

    $selectExampler = $('#exampler');

    $selectType = $('#type');

    $selectSubtype = $('#subtype');

    $selectCategory.change(function () {
        $selectSubCategory.empty();
        $('#feature-body').css("display","none");
        $selectType.val('0');
        $selectType.trigger('change');
        $selectSubtype.val('0');
        $selectSubtype.trigger('change');
        $('#warrant').val('0');
        $('#warrant').trigger('change');
        $('#quality').val('0');
        $('#quality').trigger('change');
        var category =  $selectCategory.val();
        $.get( "/dashboard/get/subcategories/"+category, function( data ) {
            $selectSubCategory.append($("<option>", {
                value: '',
                text: 'Ninguna'
            }));
            for ( var i=0; i<data.length; i++ )
            {
                $selectSubCategory.append($("<option>", {
                    value: data[i].id,
                    text: data[i].subcategory
                }));
            }
        });

    });

    $selectBrand.change(function () {
        $selectExampler.empty();
        var brand =  $selectBrand.val();
        $.get( "/dashboard/get/exampler/"+brand, function( data ) {
            $selectExampler.append($("<option>", {
                value: '',
                text: 'Ninguna'
            }));
            for ( var i=0; i<data.length; i++ )
            {
                $selectExampler.append($("<option>", {
                    value: data[i].id,
                    text: data[i].exampler
                }));
            }
        });

    });

    $selectSubCategory.change(function () {
        let subcategory = $selectSubCategory.select2('data');
        let option = $selectSubCategory.find(':selected');

        console.log(option);
        if(subcategory[0].text === 'INOX' || subcategory[0].text === 'FENE') {
            $selectType.empty();
            var subcategoria =  subcategory[0].id;
            $.get( "/dashboard/get/types/"+subcategoria, function( data ) {
                $selectType.append($("<option>", {
                    value: '',
                    text: 'Ninguno'
                }));
                for ( var i=0; i<data.length; i++ )
                {
                    $selectType.append($("<option>", {
                        value: data[i].id,
                        text: data[i].type
                    }));
                }
            });
            $('#feature-body').css("display","");
        } else {
            console.log(subcategory[0].text);
            $('#feature-body').css("display","none");
            $selectType.val('0');
            $selectType.trigger('change');
            $selectSubtype.val('0');
            $selectSubtype.trigger('change');
            $('#warrant').val('0');
            $('#warrant').trigger('change');
            $('#quality').val('0');
            $('#quality').trigger('change');
            $selectSubCategory.select2('close');
        }
        /*switch(subcategory[0].text) {
            case "INOX":
                //alert('Metalico');
                $selectType.empty();
                var subcategoria =  subcategory[0].id;
                $.get( "/dashboard/get/types/"+subcategoria, function( data ) {
                    $selectType.append($("<option>", {
                        value: '',
                        text: 'Ninguno'
                    }));
                    for ( var i=0; i<data.length; i++ )
                    {
                        $selectType.append($("<option>", {
                            value: data[i].id,
                            text: data[i].type
                        }));
                    }
                });
                $('#feature-body').css("display","");

                break;
            default :
                $('#feature-body').css("display","none");
                $selectType.val('0');
                $selectType.trigger('change');
                $selectSubtype.val('0');
                $selectSubtype.trigger('change');
                $('#warrant').val('0');
                $('#warrant').trigger('change');
                $('#quality').val('0');
                $('#quality').trigger('change');
                $selectSubCategory.trigger('change');
                generateNameProduct();
                break;
        }*/
    });

    $selectType.change(function () {
        $selectSubtype.empty();
        var type = $selectType.select2('data');
        console.log(type);
        if( type.length !== 0)
        {
            $.get( "/dashboard/get/subtypes/"+type[0].id, function( data ) {
                $selectSubtype.append($("<option>", {
                    value: '',
                    text: 'Ninguno'
                }));
                for ( var i=0; i<data.length; i++ )
                {
                    $selectSubtype.append($("<option>", {
                        value: data[i].id,
                        text: data[i].subtype
                    }));
                }
            });
        }


    });

    $selectExampler.select2({
        placeholder: "Selecione un modelo",
    });
    
    $('#btn-generate').on('click', generateNameProduct);

});

var $formCreate;
var $select;
var $selectCategory;
var $selectSubCategory;
var $selectBrand;
var $selectExampler;
var $selectType;
var $selectSubtype;

function mayus(e) {
    e.value = e.value.toUpperCase();
}

function generateNameProduct() {
    if( $('#description').val().trim() === '' )
    {
        toastr.error('Debe escribir una descripción', 'Error',
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

    $('#name').val('');
    //alert($('#subcategory option:selected').text());
    let category = ($('#category option:selected').text() === 'Ninguna' || $('#subcategory option:selected').text() === '') ? '': ' '+$('#category option:selected').text();
    let subcategory = ($('#subcategory option:selected').text() === 'Ninguna' || $('#subcategory option:selected').text() === '') ? '': ' '+$('#subcategory option:selected').text()+' ';
    //console.log($('#subcategory option:selected').text());
    let type = ($('#type option:selected').text() === 'Ninguno' || $('#type option:selected').text()==='') ? '': $('#type option:selected').text()+' ';
    //console.log($('#type option:selected').text());
    let subtype = ($('#subtype option:selected').text() === 'Ninguno' || $('#subtype option:selected').text()==='') ? '': $('#subtype option:selected').text()+' ';
    //console.log($('#subtype option:selected').text());
    let warrant = ($('#warrant option:selected').text() === 'Ninguno' || $('#warrant option:selected').text()==='') ? '': $('#warrant option:selected').text()+' ';
    //console.log($('#warrant option:selected').text());
    let quality = ($('#quality option:selected').text() === 'Ninguno' || $('#quality option:selected').text()==='') ? '': $('#quality option:selected').text();
    //console.log($('#quality option:selected').text());
    let measure = $('#measure').val();
    //console.log(measure);
    //console.log(category);
    //console.log(subcategory.trim());

    if (category.trim() === 'CONSUMIBLES' && (subcategory.trim() === 'MIXTO' || subcategory.trim() === 'NORMAL'))
    {
        let name = $('#description').val() + type + subtype + warrant + quality + ' '+measure;
        $('#name').val(name);
    } else {
        let name2 = $('#description').val() + subcategory + type + subtype + warrant + quality + ' '+measure;
        $('#name').val(name2);
    }
}

function showTemplateSpecification() {
    var specification = $('#specification').val();
    var content = $('#content').val();

    $('#specification').val('');
    $('#content').val('');

    renderTemplateItem(specification, content);
}

function deleteSpecification() {
    //console.log($(this).parent().parent().parent());
    $(this).parent().parent().remove();
}

function storeMaterial() {
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
                        "timeOut": "4000",
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

function renderTemplateItem(specification, content) {
    var clone = activateTemplate('#template-specification');
    clone.querySelector("[data-name]").setAttribute('value', specification);
    clone.querySelector("[data-content]").setAttribute('value', content);
    $('#body-specifications').append(clone);
}

function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
}