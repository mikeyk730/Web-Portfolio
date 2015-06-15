<?php
namespace app\assets;
use yii\web\AssetBundle;

class MobileAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'main/mobile.css',
       'main/mobile-skin.css',
    ];
    public $js = [
       'main/jquery.1.10.1.min.js',
       'main/mobile.js',
    ];
    public $depends = [
    ];
}
