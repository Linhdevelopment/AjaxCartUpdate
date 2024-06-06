<?php
namespace Linhnv\AjaxCartUpdate\Plugin\Magento\Checkout\Block\Cart\Item;

use Magento\Checkout\Block\Cart\Item\Renderer as RendererAlias ;

/**
 * Class Renderer
 * @package Linhnv\AjaxCartUpdate\Plugin\Magento\Checkout\Block\Cart\Item\Renderer
 */
class Renderer
{
    /**
     * @param RendererAlias $subject
     *
     * @return void
     */
    public function beforeToHtml(
        RendererAlias  $subject
    ) {
        $subject->setTemplate('Linhnv_AjaxCartUpdate::cart/item/default.phtml');
    }
}
