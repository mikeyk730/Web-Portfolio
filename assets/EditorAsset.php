<?php
namespace app\assets;
use yii\web\AssetBundle;

class EditorAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'main/editor.css'
    ];
    public $js = [
       'main/jquery-ui.js',
       'main/editor.js'
    ];
    public $depends = [
    ];
}
