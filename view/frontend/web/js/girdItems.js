define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Checkout/js/model/quote',
    'Magento_Customer/js/customer-data',
    'mage/url',
    'mage/translate'
], function ($, getTotalsAction, quote, customerData, url) {
    'use strict';

    /**
     * Show confirmation popup
     *
     * @param {string} message
     * @param {function} callback
     */
    function showPopup (message, callback) {
        $('.custom-popup-message').text(message);
        $('#custom-popup').fadeIn();
        $('.action-close').one('click', function () {
            $('#custom-popup').fadeOut();
        });
        $('.custom-popup-confirm').one('click', function () {
            callback();
            $('#custom-popup').fadeOut();
        });
        $('.custom-popup-cancel').one('click', function () {
            $('#custom-popup').fadeOut();
        });
    }

    /**
     * Show success notification
     *
     */
    function showSuccessNotification () {
        $('#maincontent').append('<div class="custom-success-notification">Deleted successfully</div>');
        setTimeout(function () {
            $('.custom-success-notification').fadeOut(function () {
                $(this).remove();
            });
        }, 2000);
    }

    /**
     * Handle quantity change
     */
    function handleQuantityChange () {
        $(document).on('change', 'input[name$="[qty]"]', function (e) {
            var qtyInput    = $(this),
                oldQtyValue = this.defaultValue,
                currentQty  = parseInt(qtyInput.val());

            if (currentQty === 0) {
                if (!showPopup('Do you want to remove this item?', function () {
                    qtyInput.val(0);
                    if (qtyInput.attr('data-class-id')) {
                        $(qtyInput.attr('data-class-id')).val(0)
                    }
                    updateCart();
                })) {
                    qtyInput.val(oldQtyValue);
                }
            } else if (currentQty > 0) {
                updateCart();
            }else{
                qtyInput.val(oldQtyValue);
            }
        });
    }

    /**
     * Update cart
     * @param {boolean} isRemove - Indicates if the update is a remove operation
     */
    function updateCart (isRemove = false) {
        var form = $('form#form-validate');
        $.ajax({
            url: form.attr('action'),
            data: form.serialize(),
            showLoader: true,
            success: function (res) {
                var parsedResponse = $.parseHTML(res);
                var result         = $(parsedResponse).find("#form-validate");
                var sections       = ['cart'];
                $("#form-validate").replaceWith(result);
                customerData.reload(sections, true);
                if (!result.length) {
                    location.reload();
                }
                var deferred = $.Deferred();
                getTotalsAction([], deferred);
                if (isRemove) {
                    showSuccessNotification();
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                console.log(err.Message);
            }
        });
    }
    /**
     * Handle plus button click
     */
    function handlePlusButtonClick () {
        var  intervalId;
        $(document).on('click', '.qty-button.plus', function () {
            var qtyInput   = $(this).siblings('input[name$="[qty]"]');
            var currentQty = parseInt(qtyInput.val());
            qtyInput.val(currentQty + 1);
            clearInterval(intervalId);
            intervalId = setInterval(function () {
                clearInterval(intervalId);
                if (currentQty >= 1) {
                    if (qtyInput.attr('data-class-id')) {
                        $(qtyInput.attr('data-class-id')).val(currentQty + 1)
                    }
                    updateCart();
                }
            }, 1000);
        });
    }

    /**
     * Handle minus button click
     */
    function handleMinusButtonClick () {
        var intervalId;

        $(document).on('click', '.qty-button.minus', function () {
            var qtyInput = $(this).siblings('input[name$="[qty]"]'),
                currentQty = parseInt(qtyInput.val());

            if (currentQty > 1) {
                qtyInput.val(currentQty - 1);
                if (qtyInput.attr('data-class-id')) {
                    $(qtyInput.attr('data-class-id')).val(currentQty -1 )
                }
            } else {
                if (!showPopup('Do you want to remove this item?', function () {
                    qtyInput.val(0);
                    if (qtyInput.attr('data-class-id')) {
                        $(qtyInput.attr('data-class-id')).val(0)
                    }
                    updateCart(true);
                })) {
                    qtyInput.val(currentQty);
                }
            }

            clearInterval(intervalId);
            intervalId = setInterval(function () {
                clearInterval(intervalId);
                if (currentQty > 1) {
                    if (qtyInput.attr('data-class-id')) {
                        $(qtyInput.attr('data-class-id')).val(currentQty -1)
                    }
                    updateCart();
                }
            }, 1000);
        });

    }

    /**
     * Handle remove item click
     */
    function handleRemoveItemClick () {
        $(document).on('click', '.cart.item .action.action-remove', function (e) {
            var classItemId = '.' + $(this).attr('value');
            $(classItemId + ' input[name$="[qty]"]').val(0);
            updateCart(true);
        });
    }

    /**
     * Initialize the custom grid items widget
     */
    $.widget('Mageplaza.customGirdItems', {
        options: {},
        _create: function () {
            $('form#form-validate').bind("keypress", function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
            });
            $(document).ready(function () {
                handleQuantityChange();
                handlePlusButtonClick();
                handleMinusButtonClick();
                handleRemoveItemClick();
            });
        }
    });

    return $.Mageplaza.customGirdItems;
});
