<?php
namespace Linhnv\AjaxCartUpdate\Plugin\Magento\Checkout\Block\Cart;

use Magento\Checkout\Block\Cart\Grid as GridAlias;

/**
 * Class Renderer
 * @package Linhnv\AjaxCartUpdate\Plugin\Magento\Checkout\Block\Cart\Grid
 */
class Grid
{
    /**
     * @param GridAlias $subject
     *
     * @return void
     */
    public function beforeToHtml(
        GridAlias $subject
    ) {
        $subject->setTemplate('Linhnv_AjaxCartUpdate::cart/form.phtml');
    }
}
