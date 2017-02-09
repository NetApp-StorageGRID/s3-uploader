$(document).ready(function () {
    var marker = '0';
    var all_loaded = false;

    $.get('/load/' + marker, function (data) {
        if (data) {
            $('#files > tbody:last-child').append(data);
            marker = $('#files tr:last td:first').html();
        }
    });

    $.get('/versioning', function (value) {
        if (value) {
            $('#versioning').append(value);
        }
    });

    $('#uploadbutton').click(function () {
        var key = "1234";
        $.get('/generate_upload/' + key, function (url) {
            console.log(url);

            $.ajax({
                url: url,
                type: 'POST',
                data: new FormData($('#uploadform')),
                cache: false,
                contentType: false,
                processData: false,
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function (e) {
                            console.log(e);
                            //if (e.lengthComputable) {
                            //    $('#bar').attr({
                            //        "aria-valuenow": e.loaded,
                            //        "aria-valuemax": e.total
                            //    });
                            //}
                        }, false);
                    }
                    return myXhr;
                },
            });


        });
    });




    $(document).on('click', '.openmodal', function () {
        var key = $(this).attr('key');
        $('#versions').empty();
        $('#versionloader').show();
        $('#versions-modal').modal('show');
        $.ajax({
            url: key + "/versions",
            success: function (data) {
                if (data) {
                    $('#versionloader').fadeOut();
                    $('#versions').append(data);
                }
            }
        });
    });

    $(window).data('ajaxready', true).scroll(function () {
        if (all_loaded || $(window).data('ajaxready') == false)
            return;
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            $(window).data('ajaxready', false);
            marker = $('#files tr:last td:first').html();
            $.ajax({
                url: "load/" + marker,
                success: function (data) {
                    if (data) {
                        $('#files > tbody:last-child').append(data);
                    } else {
                        $('#loader').fadeOut();
                        all_loaded = true;
                    }
                }
            });
            $(window).data('ajaxready', true);
        }

    });
});
