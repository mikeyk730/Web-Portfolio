<?php
namespace app\assets;
use yii\web\AssetBundle;

class MobileAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'mobile/mobile.css',
       'mobile/styles.css',
    ];
    public $js = [
       'mobile/mobile.js',
    ];
    public $depends = [
    ];
}
