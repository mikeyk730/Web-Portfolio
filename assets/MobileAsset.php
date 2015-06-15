<?php
namespace app\assets;
use yii\web\AssetBundle;

class MobileAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'mobile/styles.css',
       'mobile/mobile.css',
    ];
    public $js = [
       'main/jquery.1.10.1.min.js',
       'mobile/mobile.js',
    ];
    public $depends = [
    ];
}
