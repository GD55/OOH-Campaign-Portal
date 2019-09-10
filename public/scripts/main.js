var currentEditId;
var desig;
var currentUserId;
var vendorId;
var y = [];
var tool = "";

$(document).ready(function () {
    if (window.location.pathname == '/tools/excel' || window.location.pathname == '/tools/ppt') {
        if (window.location.pathname == '/tools/excel') {
            tool = "excel";
            $('input:radio[name="template"]').change(function () {
                if ($("input[name='template']:checked").val() == 'hoardingsMasterSheet') {
                    $("#hoardingsMasterSheet").removeClass('d-none');
                    $("#bqsMasterSheet").addClass('d-none');
                }
                if ($("input[name='template']:checked").val() == 'bqsMasterSheet') {
                    $("#hoardingsMasterSheet").addClass('d-none');
                    $("#bqsMasterSheet").removeClass('d-none');
                }
            });
        }
        else {
            tool = "ppt";
        }
        $('#uploadForm').submit(function (e) {
            $("#status").empty().text("File is uploading...");
            e.preventDefault(); // avoid to execute the actual submit of the form.

            var formData = new FormData(this);
            var url = $(this).attr('action');

            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (files) {
                    $("#status").empty().text("File Uploaded");
                    files.forEach(function (file) {
                        id = file[0];
                        destination = file[1];
                        deleteStr = 'deleteSource("' + destination + '","' + id + '")';
                        $("#sourceFile").append("<div id='file" + id + "' ><a target='_blank' href='/uploads/" + destination + "'>" + destination.substring(14).split('.').slice(0, -1).join('.') + "</a><button class='ml-2 btn btn-xs btn-danger' onclick='" + deleteStr + "'>Delete</button></div>");
                    });
                    console.log(files);
                },
                error: function (e) {
                    console.log("some error", e);
                }
            });
        });
    }
    if (window.location.pathname == '/campaign') {
        adjustColumnSize();
        desig = $("#designation").text();
        currentUserId = $("#userId").text();
        max = $("#max").text();
        $(".firstRow").removeClass('d-none');
        changeHidden(desig);
        var x = $(".scrollT").position();
        $('.scrollL').each(function (index) {
            y[index] = $(this).position();
        })
        $(window).on('scroll', function (e) {
            var top = $(this).scrollTop();
            $('.scrollT').css('top', x.top - top);
        });
        $(window).on('scroll', function (e) {
            //calculate left position
            var left = $(this).scrollLeft();
            $('.scrollL').each(function (index) {
                $(this).css('left', y[index].left - left);
            })
        });
        $(window).bind('resize', function (e) {
            console.log('window resized..');
            this.location.reload(false); /* false to get page from cache */
            /* true to fetch page from server */
        });
    }
});

function adjustColumnSize() {
    var headingWidth = $(".scrollingTableHeadings").width();
    $(".fixedTableHeadings").width(headingWidth);
    var fieldWidth = $(".fields").width();

    $(".fixedFields").width(fieldWidth);
}


function populatebrand(v) {
    if (v) {
        if (v == "new") {
            $("#new_client").prop("disabled", false);
            $("#new_brand").prop("disabled", false);
            clearBrands();
            $("#brands").append('<option value="new">Add new</option>');
            $("#brands").prop("disabled", true);
        } else {
            $("#new_client").prop("disabled", true);
            $("#new_brand").prop("disabled", true);
            $("#brands").prop("disabled", false);
            $.getJSON("/api/brands/" + v)
                .then(addBrands)
        }
    }
    else {
        clearBrands();
        $("#brands").append('<option value="">Select client name first</option>');
        $("#new_client").prop("disabled", true);
        $("#new_brand").prop("disabled", true);
    }
}

function brandSelected(v) {
    if (v == "new") {
        $("#new_brand").prop("disabled", false);
    }
    else {
        $("#new_brand").prop("disabled", true);
    }
}

function addBrands(brands) {
    clearBrands();
    $("#brands").append('<option value="">Select brand</option>');
    $("#brands").append('<option value="new">Add new</option>');
    brands.forEach(function (brand) {
        addBrand(brand);
    });
}

function addBrand(brand) {
    var newbrand = "<option value='" + brand.id + "'>" + brand.brand + "</option>"
    $("#brands").append(newbrand);
    console.log(newbrand);
}

function clearBrands() {
    $("#brands").children().remove();
}

function edit(id, desig) {
    currentEditId = id;
    disableAllInputs();
    if (desig == "admin") {
        $("tr.newVendor").removeClass('d-none').removeClass("border-none");
        replaceWithButton();
    }
    if (desig == "coordinator") {
        if ($("." + id).hasClass(currentUserId)) {
            $("." + id).find("." + desig).children().prop("disabled", false).removeClass("border-none");
        }
    } else {
        $("." + id).find("." + desig).children().prop("disabled", false).removeClass("border-none");
        $("." + id).find('tr.' + desig).removeClass('d-none').children().addClass("border-none");
        $(".selectVendor").prop("disabled", false).removeClass("border-none");
    }
    adjustColumnSize();
}

function replaceWithButton() {
    $(".replace").removeClass("d-none");
    $(".backInitial").addClass("d-none");
}

function disableAllInputs() {
    $('tr.admin').addClass('d-none');
    $("input").prop("disabled", true).addClass("border-none");
    $("select").prop("disabled", true).addClass("border-none");
}

function updateCampaign(v, name) {
    var updateData = { field: name, value: v };
    $.ajax({
        method: 'PUT',
        url: '/api/campaign/' + currentEditId,
        data: updateData
    });
}

function changeEndDate(v, id) {
    $('#endDate' + id).attr('min', v);
}

function changeHidden(t) {
    disableAllInputs();
    if (t == desig) {
        $(".firstRow").removeClass('d-none');
    } else {
        $(".firstRow").addClass('d-none');
    }
    hideAll();
    $("#pageHeading").text(t.charAt(0).toUpperCase() + t.slice(1) + " Page");
    $('#' + t + "Head").addClass('activePage');
    $('td.' + t).removeClass('d-none');
    $('th.' + t).removeClass('d-none');
    adjustColumnSize();
}

function hideAll() {
    $("#coordinatorHead").removeClass('activePage');
    $("#adminHead").removeClass('activePage');
    $("#designerHead").removeClass('activePage');
    $("#accountantHead").removeClass('activePage');
    $('.coordinator').addClass('d-none');
    $('.designer').addClass('d-none');
    $('.accountant').addClass('d-none');
    $('tr.admin').addClass('d-none');
    $("tr.newVendor").addClass('d-none').addClass("border-none");
}

function vendorSearch() {
    var searchText = $('#vendorSearch').val();
    clearvendor();
    $.getJSON("/api/vendor/" + $("input[name='searchBy']:checked").val() + "/" + searchText, function (data) {
        heading = "<tr><th>vendors</th><th>id</th><th>city</th><th>vendor Name</th><th>organization type</th><th>contact Person Name</th></tr>";
        $("#append").append(heading);
        data.forEach(function (vendor) {
            var newVendor = "<tr><td><a class='btn btn-xs btn-info ' href='/venNet/show/" + vendor.id + "'>View More</a></td><td>" + vendor.id + " </td><td> " + vendor.ocity + " </td><td> " + vendor.vendorName + " </td><td> " + vendor.organizationType + " </td><td> " + vendor.contactPersonName + "</td></tr>";
            $("#append").append(newVendor);
        });
    });
}

$('#vendorSearch').on("keyup", function (e) {
    if (e.keyCode == 13) {
        vendorSearch();
    }
});


function clearvendor() {
    $("#append").children().remove();
}

function vendorEdit(id) {
    $("input").prop("disabled", false).removeClass("border-none");
    $(".download").addClass("d-none");
    $(".upload").removeClass("d-none");
    vendorId = id;
}

function updateVendor(v, name) {
    var updateData = { field: name, value: v };
    $.ajax({
        method: 'PUT',
        url: '/api/vendor/' + vendorId,
        data: updateData
    });
}

function repOptions() {
    $(".replace").addClass("d-none");
    $(".backInitial").removeClass("d-none");
}

function assignVendor(camapignId, desig) {
    if (desig == "admin") {
        var vendorId = $("." + camapignId).find(".selectVendor").children("option:selected").val();
        var vendorName = $("." + camapignId).find(".selectVendor").children("option:selected").text().split(",", 1);
        $.getJSON('/api/assign/' + vendorId + "/" + camapignId, function (data) {
            addVendorData(camapignId, vendorName);
        });
    }
}

function addVendorData(camapignId, vendorName) {
    if ($("." + camapignId).find(".emptyVendor").first().html()) {
        $("." + camapignId).find(".emptyVendor").first().html(vendorName).removeClass("emptyVendor");
    } else {
        console.log("no vendor empty")
        max++;
        appendNewVendor();
        $("." + camapignId).find(".emptyVendor").first().html(vendorName).removeClass("emptyVendor");
    }
}

function appendNewVendor() {
    console.log("appending New Vendor");
    var newHeading = '<tr><th class="emptyVendor accountant coordinator admin">vendor' + (max) + '</th></tr>';
    $(".newVendor").before(newHeading);
    var blankVendor = '<tr><td class="emptyVendor emptyVendor accountant coordinator admin"> </td></tr>';
    $(".addNewVendor").before(blankVendor);
}

function updateAssignment(v, name, assignmentId) {
    var updateData = { field: name, value: v };
    console.log("update");
    $.ajax({
        method: 'PUT',
        url: '/api/assignment/' + assignmentId,
        data: updateData
    });
}

function renameFile(path, fileId, vendorId) {
    var text = $('#rename' + fileId + ' span').text();
    var oldName = path.substring(22).split('.').slice(0, -1).join('.');
    // alert(path.substring(22).split('.').slice(0, -1).join('.'));
    if (text == "Rename") {
        $('#' + fileId).html("<input id='input" + fileId + "' type='text' value='" + oldName + "'>");
        // alert($('#'+fileId).text("hello"));
        $('#rename' + fileId + " span").text('Save');
    } else if (text == "Save") {
        var newName = $('#input' + fileId).val();
        $('#rename' + fileId + " span").text('Rename');
        if (newName != oldName) {
            $('#' + fileId).text(newName);
            var extension = path.split('.').pop();
            var updateData = { field: fileId, value: newName + "." + extension }
            $.ajax({
                method: 'PUT',
                url: '/api/renameFile/' + vendorId,
                data: updateData
            });
        } else {
            $('#' + fileId).text(oldName);
        }
    }
}

function copyNewExcel() {
    var destination = $('#NewExcelName').val();
    var radioValue = $("input[name='template']:checked").val();
    if (destination == "") {
        alert("fill the name field")
        return false;
    }
    else if (radioValue) {
        destination = Date.now() + '-' + destination + ".xlsx";
        template = radioValue;
        $.ajax({
            method: 'GET',
            url: '/api/copy/' + template + '.xlsx/' + destination
        });
        return destination;
    }
    else {
        alert("choose the given options");
        return false;
    }
}

function copyNewPpt() {
    var destination = $('#NewPptName').val();
    if (destination == "") {
        alert("fill the name field")
        return false;
    }
    else{
        destination = Date.now() + '-' + destination + ".pptx";
        $.ajax({
            method: 'GET',
            url: '/api/copy/pptTemplate.pptx/' + destination
        });
        return destination;
    }
}

function deleteSource(name, id) {
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        var data = { name: name, type: tool }
        $.ajax({
            method: 'DELETE',
            url: '/api/deleteSource',
            data: data
        });
        $("#file" + id).addClass('d-none');
    }

}

function deleteAll() {
    var result = confirm("Want to delete all uploades sheets?");
    if (result) {
        var data = { type: tool }
        $.ajax({
            method: 'DELETE',
            url: '/api/deleteAll',
            data: data
        });
    }
    $("#sourceFile").addClass('d-none');
}

function cleanTable() {
    var result = confirm("Want to delete all files?");
    if (result) {
        var data = { type: tool }
        $.ajax({
            method: 'DELETE',
            url: '/api/cleanTable',
            data: data
        });
    }
    $("#sourceFile").addClass('d-none');
    $("#createdFile").addClass('d-none');
}

function executePython() {
    if (tool == "excel") {
        var destination = copyNewExcel();
        var data = { destination: destination, template: $("input[name='template']:checked").val(), type: tool }
    }
    else{
        var destination = copyNewPpt();
        var data = { destination: destination, type: tool }
    }
    if (destination) {
        $.ajax({
            method: 'POST',
            url: '/api/pyhton',
            data: data,
            success: function (r) {
                id = r.insertId;
                var d = "/uploads/" + destination;
                $("#downloadMerged").removeClass('d-none').attr("href", d);
                deleteStr = 'deleteSource("' + destination + '","' + id + '")';
                $("#createdFile").append("<div id='file" + id + "' ><a target='_blank' href='/uploads/" + destination + "'>" + destination.substring(14).split('.').slice(0, -1).join('.') + "</a><button class='ml-2 btn btn-xs btn-danger' onclick='" + deleteStr + "'>Delete</button></div>");
            }
        });
    }
}