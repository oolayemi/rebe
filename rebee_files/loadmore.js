jQuery(function ($) {
    $('.disable-form').on('submit', function (e){
        e.preventDefault();
    })

    $("#blog-search").keyup(function(event){
        if(event.keyCode == 13){
            event.preventDefault();

            let ajaxUrl = $(this).data('ajax-url');
            let findValue = this.value;

            let data = {
                'action': 'ajax_search_blog_posts',
                'blog_search_value': findValue
            };

            $.ajax({
                url: ajaxUrl,
                data: data,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        $('#blog-articles').html(data);
                        $('#blog-loadmore').remove();
                    }else{
                        $('#blog-articles').html(`<h3 class="h4">Not Found - ${findValue}</h3>`);
                        $('#blog-loadmore').remove();
                    }
                }
            });
        }
    });

    $('#blog-loadmore').click(function () {
        $(this).addClass('is-loading loading-start').attr("disabled", true);
        let ajaxUrl = $(this).data('ajax-url');
        let truePosts = $(this).data('true-posts');
        let currentPage = $(this).data('current-page');
        let maxPages = $(this).data('max-pages');
        let postPerLoad = $(this).data('post-per-page');
        let isRedesign = $(this).data('is-redesign');

        let data = {
            'action': 'loadmore_blog',
            'query': truePosts,
            'page': currentPage,
            'post-per-load': postPerLoad,
            'is-redesign': isRedesign
        };

        currentPage++;

        $.ajax({
            url: ajaxUrl,
            data: data,
            type: 'POST',
            success: function (data) {
                if (data) {
                    $('#blog-loadmore').removeClass('is-loading loading-start').attr("disabled", false);
                    $('#blog-articles').append(data);
                    $('#blog-loadmore').data('current-page', currentPage);

                    if (currentPage === Number(maxPages)) $("#blog-loadmore").remove();
                    setTimeout(function () {
                        $('#blog-articles').find('.card-animation').removeClass('card-animation');
                    }, 1);
                } else {
                    $('#blog-loadmore').remove();
                }
            }
        });
    });
});